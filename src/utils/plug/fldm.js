

const meta = {
    name: '风铃动漫',
    available: true,
    priority: 10,
    from: 'https://www.aafun.cc'
}


async function search(query, page) {
    //
    const url = meta.from + `/feng-s/page/${page}/wd/${query}.html`;
    const modelData = [];
    var res = await fetch(url);
    if (!res || res.status !== 200) throw new Error(meta.name + "请求失败");


    const doc = getDocument(await res.text())
    const aTag = doc.querySelectorAll("li.hl-list-item");

    for (var i = 0; i < aTag.length; i++) {
        var item = aTag[i];
        var code = item.querySelector('a.hl-item-thumb').getAttribute("href").match(/\/([^\/]+)\.html$/)[1];
        var tag = item.querySelector(".hl-pic-text").textContent;
        var img = item.querySelector("a.hl-item-thumb").getAttribute("data-original");
        var title = item.querySelector(".hl-item-title").textContent;

        const obj = {
            platform: meta.from,
            title: title,
            img: img,
            id: code,
            tag: tag,
        };
        modelData.push(obj);
    }
    return {
        data: modelData,
    };
}
async function getDetailData(item) {
    const url = meta.from + `/feng-n/${item.id}.html`;
    let res = await fetch(url);
    if (!res || res.status !== 200) throw new Error(meta.name + "请求失败");


    const doc = getDocument(await res.text());
    const detailData = doc.querySelector(".hl-detail-content");
    const itemList = detailData.querySelectorAll(".hl-col-xs-12");
    const lineHeader = doc.querySelectorAll(".hl-tabs-btn");
    const lineData = doc.querySelectorAll(".hl-plays-list");

    const region = itemList[5].textContent;
    const desc = itemList[11].textContent;
    const director = itemList[2].textContent;
    const actor = itemList[3].textContent;
    const updateTime = itemList[10].textContent;
    const line = {};

    for (let i = 0; i < lineData.length; i++) {
        const itemLine = lineData[i];
        const itemHeader = lineHeader[i];
        const aEls = itemLine.querySelectorAll("a");
        const itemValue = {
            html: itemHeader.textContent,
            total: [],
        };
        line[itemValue.html] = itemValue;
        for (const aEl of aEls) {
            const totalItem = {};
            itemValue.total.push(totalItem);
            totalItem.html = aEl.textContent;
            const href = aEl.getAttribute("href");
            totalItem.href = href;
        }
    }
    item.region = region;
    item.desc = desc;
    item.director = director;
    item.actor = actor;
    item.updateTime = updateTime;
    item.line = line;
    return item;
}
async function initWeekData() {
    const url = meta.from;
    let res = await fetch(url);
    if (!res || res.status !== 200) throw new Error(meta.name + "请求失败");

    const doc = getDocument(await res.text());
    const weekData = doc.querySelectorAll("ul.hl-vod-list");
    const resData = [];
    for (let i = 0; i < weekData.length; i++) {
        var itemList = weekData[i].querySelectorAll("a.hl-item-thumb");
        var dataList = getData(itemList);
        resData.push(dataList);
    }
    console.log("initWeekData", resData)
    return resData;

    function getData(attList) {
        var list = [];
        for (var i = 0; i < attList.length; i++) {
            var item = attList[i];
            var code = item.getAttribute("href").match(/\/([^\/]+)\.html$/)[1];
            var tag = item.querySelector(".hl-pic-tag")?.textContent;
            var img = item.getAttribute("data-original");
            var title = item.getAttribute("title");

            const obj = {
                platform: meta.from,
                title: title,
                img: img,
                id: code,
                tag: tag,
            };
            list.push(obj);
        }
        return list;
    }
};
async function initRotationData() {
    const from = meta.from;
    const modelData = [];

    var res = await fetch(from);
    if (!res || res.status !== 200) throw new Error("请求失败" + meta.name);
    var doc = getDocument(await res.text());

    const container = doc.querySelector("ul.hl-br-list");
    const rotationData = container.querySelectorAll("a.hl-br-thumb");
    for (var i = 0; i < rotationData.length; i++) {
        var item = rotationData[i];
        var title = item.getAttribute("title").split(" ")[0];
        var img = item.getAttribute("data-original");
        var code = item.getAttribute("href").match(/\/([^\/]+)\.html$/)[1];
        var tag = item.getAttribute("title").split(" ")[1]
        const obj = {
            platform: from,
            title: title,
            img: img,
            id: code,
            tag: tag,
        };
        modelData.push(obj);
    }
    console.log("modelData", modelData)
    return modelData;
}

function getBackImg(dom, from) {
    // 获取背景图片地址
    var backgroundImage = dom.style.backgroundImage;

    // 清理背景图片地址字符串（去除引号和空格）
    const urlRegex = /url\((['"]?)(.*?)\1\)/;
    const match = backgroundImage.match(urlRegex);

    if (match && match[2]) {
        backgroundImage = match[2]; // 输出URL
    }
    if (!backgroundImage.startsWith("http") && from) {
        backgroundImage = from + backgroundImage;
    }
    return backgroundImage;
}

function getDocument(text) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");
    return doc
}


module.exports = {
    author: 'MetaSola',
    name: meta.name,
    from: meta.from,
    version: 1.0,
    srcUrl: "https://blog.metasola.cn/freemovie/plug/fldm.js",
    initWeekData: initWeekData,
    initRotationData: initRotationData,
    getDetailData: getDetailData,
    search: search,
};