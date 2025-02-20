const Http = require("http");
const proxyImg = require('proxyImg')

const meta = {
    name: '琉璃影院',
    available: true,
    priority: 10,
    from: 'https://www.liuliyy.fun/'
}
const headers = {
    "Host": "www.liuliyy.fun",
    "referer": "https://www.liuliyy.fun/",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.1724.58"
}

const search = async function (title, page) {
    const modelData = []
    title = title.replaceAll(" ", "")
    var url = meta.from + "/vodsearch/" + title + "----------" + page + "---.html"
    var res = await fetch(url, {
        headers: headers
    })

    const parser = new DOMParser();
    const doc = parser.parseFromString(await res.text(), "text/html");
    const uls = doc.querySelectorAll(".myui-vodlist>li")
    for (var i = 0; i < uls.length; i++) {
        var item = uls[i]
        const aTag = item.querySelector('a')
        var code = aTag.getAttribute('href').match(/\d+/g)[0]
        var tag = aTag.querySelector('.pic-text').textContent
        let u = aTag.getAttribute('data-original')
        if (!u.startsWith('http')) {
            u = 'http:' + u
        }
        var img = await proxyImg(u)
        var title = item.querySelector('.title').textContent

        const obj = {
            // platform: meta.from,
            title: title,
            img: img,
            id: code,
            tag: tag
        }
        modelData.push(obj)
    }
    return {
        data: modelData
    }
}


async function getDetailData(item) {
    const url = meta.from + `voddetail/${item.id}.html`
    let res = await fetch(url, { headers: headers })
    if (!res || res.status !== 200) throw new Error(meta.name + '请求失败')

    const parser = new DOMParser()
    const doc = parser.parseFromString(await res.text(), 'text/html')
    const detailData = doc.querySelector('.myui-content__detail')
    const itemList = detailData.querySelectorAll('.desc.clearfix>.data')

    const lineHeader = doc.querySelectorAll('.myui-panel__head>ul>li')
    const lineData = doc.querySelector('.myui-panel_bd').querySelectorAll('ul')

    const region = ""
    const desc = doc.querySelector('.text-fff-5').textContent
    const director = ""
    const actor = ""
    const updateTime = itemList[0].textContent
    const line = {}

    for (let i = 0; i < lineData.length; i++) {
        const itemLine = lineData[i]
        const itemHeader = lineHeader[i]
        const aEls = itemLine.querySelectorAll('a')
        const itemValue = {
            html: itemHeader.textContent,
            value: aEls.length > 0 ? aEls[0].textContent.split('-')[1] : '',
            total: []
        }
        line[itemValue.html] = itemValue
        for (const aEl of aEls) {
            const totalItem = {}
            itemValue.total.push(totalItem)
            totalItem.html = aEl.textContent
            const href = aEl.getAttribute('href')
            totalItem.href = href
        }
    }
    item.region = region
    item.desc = desc
    item.director = director
    item.actor = actor
    item.updateTime = updateTime
    item.line = line
    return item
}

const play = async function (url, option) {

    const res = await fetch(meta.from + url, { headers: headers })
    if (!res || res.status !== 200) throw new Error(meta.name + '请求失败')
    const data = await res.text()

    const cachePattern = /},"url":"(.*?)","url_next"/g


    var resourseUrl = cachePattern.exec(data)[1].replaceAll('\\', '')


    return {
        url: resourseUrl
    }
}

module.exports = {
    author: 'MetaSola',
    name: meta.name,
    from: meta.from,
    version: 1.0,
    getDetailData: getDetailData,
    search: search,
    play: play
}