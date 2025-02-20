
const meta = {
    name: '量子888',
    available: true,
    priority: 100,
    from: 'https://lzi888.com/'
}

const search = async function (title) {
    const modelData = []
    title = title.replaceAll(" ", "")
    var url = meta.from + "/index.php/vod/search/page/1/wd/" + title + ".html"
    var res = await fetch(url)

    const parser = new DOMParser();
    const doc = parser.parseFromString(await res.text(), "text/html");
    const uls = doc.querySelectorAll(".module-card-item")
    for (var i = 0; i < uls.length; i++) {
        var item = uls[i]
        var code = item.querySelector('.module-card-item-poster').getAttribute('href').match(/\d+/g)[0]
        var tag = item.querySelector('.module-item-note').textContent
        var img = item.querySelector('img').getAttribute('data-original')
        var title = item.querySelector('.module-card-item-title').textContent

        if (!img.startsWith('http')) {
            img = meta.from + img
        }
        const obj = {
            platform: meta.from,
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
    const url = meta.from + `index.php/vod/detail/id/${item.id}.html`
    let res = await fetch(url)
    if (!res || res.status !== 200) throw new Error(meta.name + '请求失败')

    const parser = new DOMParser()
    const doc = parser.parseFromString(await res.text(), 'text/html')
    const detailData = doc.querySelector('.module-info-main')
    const itemList = detailData.querySelectorAll('.module-info-item')
    const lineHeader = doc.querySelectorAll('.module-tab-item')
    const lineData = doc.querySelectorAll('.module-list')

    const region = detailData.querySelectorAll('.module-info-tag-link')[1].textContent
    const desc = itemList[0].textContent
    const director = itemList[1].textContent
    const actor = itemList[2].textContent
    const updateTime = itemList[3].textContent
    const line = {}

    for (let i = 0; i < lineData.length; i++) {
        const itemLine = lineData[i]
        const itemHeader = lineHeader[i]
        const aEls = itemLine.querySelectorAll('a')
        const itemValue = {
            html: itemHeader.getAttribute('data-dropdown-value'),
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

    const res = await fetch(meta.from + url)
    if (!res || res.status !== 200) throw new Error(meta.name + '请求失败')
    const data = await res.text()

    const cachePattern = /"url":"(.*?)","url_next"/g


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