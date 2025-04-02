const Http = require('http')
const proxyImg = require('proxyImg')
const analysis = require('analysis')
const meta = {
    name: '嘀哩嘀哩',
    available: true,
    priority: 10,
    from: 'http://dilidili.in'
}

function getDocument(text) {
    const jsdom = require("jsdom");
    const { JSDOM } = jsdom;
    const dom = new JSDOM(text);
    const doc = dom.window.document
    return doc
}

async function search(query, page) {
    //
    const url = meta.from + `/search.php`;
    const modelData = [];
    var res = await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.1724.58"
        },
        body: "searchword=" + query + "&searchtype=" + "title" + "&page=" + page
    });
    if (!res || res.status !== 200) throw new Error(meta.name + "请求失败");
    const text = await res.text()
    const my_search = text.match(/my_search='(.*?)';/)[1]
    const _other_kkk217 = text.match(/_other_kkk217='(.*?)';/)[1]
    const f_dect = text.match(/f_dect='(.*?)';/)[1]
    const u = my_search + `?top=10&q=${query}&other_kkk217=${_other_kkk217}&dect=${f_dect}`

    res = await Http.get({
        url: u,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.1724.58"
        }
    })
    if (!res || res.status !== 200) throw new Error(meta.name + '请求失败')

    const data = JSON.parse(res.data.trim())

    const imgPromises = []
    for (var i = 0; i < data.length; i++) {
        var item = data[i];

        let itemUrl = item.url
        if (!itemUrl.startsWith('http')) {
            itemUrl = meta.from + itemUrl
        }
        const obj = {
            platform: meta.from,
            title: item.title,
            img: item.thumb,
            id: itemUrl,
            url: itemUrl,
            tag: `更新到${item.lianzaijs}集`,
        };
        imgPromises.push(new Promise(async (resolve, reject) => {
            try {
                obj.img = await proxyImg(item.thumb)
                resolve(obj)
            } catch (e) {
                reject(e)
            }

        }))
        modelData.push(obj);
    }
    await Promise.all(imgPromises)
    return {
        data: modelData,
    };
}
async function getOtherLine(doc, from) {
    const sc = doc.querySelectorAll('script')
    const resLine = {}
    let url = ''
    for (const script of sc) {
        const u = script.src
        if (!u.includes('?')) continue
        if (u.split('?')[1].startsWith('17')) {
            url = u
            break
        }
    }
    if (!url) return resLine
    const res = await fetch(url)
    const text = await res.text()

    eval(text)

    var cars_zyw = ['yj', 'zd', 'kb', 'ff', 'lz', 'bd', 'sn', 'wl', 'uk', 'hn', 'wj', 'sd', 'bj', 'tp', 'xk', 'ss', 'tk', 'sl'];

    for (var k = 0; k < cars_zyw.length; k++) {
        if (cars_zyw[k] == '')
            continue;
        const obj = add_other_2(cars_zyw[k])
        Object.assign(resLine, obj)
    }
    for (const key in resLine) {
        for (const item of resLine[key].total) {
            if (!item.href.startsWith('http')) {
                item.href = from + item.href
            }
        }
    }
    return resLine

    function add_other_2(type_name) {
        var urls = add_play_qp(type_name);
        if (urls == 0) return {}

        const title = add_play_qp_title(type_name);

        const obj = {}
        obj[title] = {
            html: title,
            total: []
        }
        for (var i = 0; i < urls.length; i++) {
            var item = urls[i];
            if (item.split(',').length < 3) break;
            obj[title].total.push({
                html: item.split(',')[2].split('.')[0],
                href: item.split(',')[2],
            })
        }
        return obj
    }
    function get_qp_name44(qp_type) {
        if (qp_type == 'zd')
            return '最大';
        if (qp_type == 'yj')
            return '永久';
        if (qp_type == 'hn')
            return '牛牛';
        if (qp_type == 'gs')
            return '光波';
        if (qp_type == 'sn')
            return '新朗';
        if (qp_type == 'wl')
            return '涡轮';
        if (qp_type == 'lz')
            return '良子';
        if (qp_type == 'fs')
            return 'F速';
        if (qp_type == 'ff')
            return '飞飞';
        if (qp_type == 'bd')
            return '百百';
        if (qp_type == 'uk')
            return '酷U';
        if (qp_type == 'wj')
            return '无天';
        if (qp_type == 'bj')
            return '八戒';
        if (qp_type == 'tk')
            return '天空';
        if (qp_type == 'ss')
            return '速速';
        if (qp_type == 'kb')
            return '酷播';
        if (qp_type == 'sd')
            return '闪电';
        if (qp_type == 'xk')
            return '看看';
        if (qp_type == 'tp')
            return '淘淘';
        if (qp_type == 'jy')
            return '精英';

        return qp_type;
    }
    function add_play_qp_title(qp_type) {
        return get_qp_name44(qp_type) + '线';
    }

    function add_play_qp_1(qp_type) {
        var real_playarr = undefined;
        if (qp_type == 'zd') {
            if (typeof (playarr_1) == 'undefined') {
                return undefined;
            }
            real_playarr = playarr_1;
        } else if (qp_type == 'yj') {
            if (typeof (playarr_2) == 'undefined') {
                return undefined;
            }
            real_playarr = playarr_2;
        } else if (qp_type == 'sn') {
            if (typeof (playarr_sn) == 'undefined') {
                return undefined;
            }
            real_playarr = playarr_sn;
        } else if (qp_type == 'gs') {
            if (typeof (playarr_gs) == 'undefined') {
                return undefined;
            }
            real_playarr = playarr_gs;
        } else if (qp_type == 'hn') {
            if (typeof (playarr_hn) == 'undefined') {
                return undefined;
            }
            real_playarr = playarr_hn;
        } else if (qp_type == 'wl') {
            if (typeof (playarr_wl) == 'undefined') {
                return undefined;
            }
            real_playarr = playarr_wl;
        } else if (qp_type == 'lz') {
            if (typeof (playarr_lz) == 'undefined') {
                return undefined;
            }
            real_playarr = playarr_lz;
        } else if (qp_type == 'fs') {
            if (typeof (playarr_fs) == 'undefined') {
                return undefined;
            }
            real_playarr = playarr_fs;
        } else if (qp_type == 'ff') {
            if (typeof (playarr_ff) == 'undefined') {
                return undefined;
            }
            real_playarr = playarr_ff;
        } else if (qp_type == 'uk') {
            if (typeof (playarr_uk) == 'undefined') {
                return undefined;
            }
            real_playarr = playarr_uk;
        } else if (qp_type == 'bd') {
            if (typeof (playarr_bd) == 'undefined') {
                return undefined;
            }
            real_playarr = playarr_bd;
        } else if (qp_type == 'wj') {
            if (typeof (playarr_wj) == 'undefined') {
                return undefined;
            }
            real_playarr = playarr_wj;
        } else if (qp_type == 'bj') {
            if (typeof (playarr_bj) == 'undefined') {
                return undefined;
            }
            real_playarr = playarr_bj;
        } else if (qp_type == 'xk') {
            if (typeof (playarr_xk) == 'undefined') {
                return undefined
            }
            ; real_playarr = playarr_xk;
        } else if (qp_type == 'kb') {
            if (typeof (playarr_kb) == 'undefined') {
                return undefined;
            }
            real_playarr = playarr_kb;
        } else if (qp_type == 'sd') {
            if (typeof (playarr_sd) == 'undefined') {
                return undefined;
            }
            real_playarr = playarr_sd;
        } else if (qp_type == 'tk') {
            if (typeof (playarr_tk) == 'undefined') {
                return undefined;
            }
            real_playarr = playarr_tk;
        } else if (qp_type == 'ss') {
            if (typeof (playarr_ss) == 'undefined') {
                return undefined;
            }
            real_playarr = playarr_ss;
        } else if (qp_type == 'tp') {
            if (typeof (playarr_tp) == 'undefined') {
                return undefined;
            }
            real_playarr = playarr_tp;
        } else if (qp_type == 'jy') {
            if (typeof (playarr_jy) == 'undefined') {
                return undefined;
            }
            real_playarr = playarr_jy;
        }

        return real_playarr;
    }


    function add_play_qp(qp_type, n) {
        var real_playarr = add_play_qp_1(qp_type);
        if (typeof (real_playarr) == 'undefined') {
            return [];
        }

        const urls = []
        for (let i = 1; i < real_playarr.length; i++) {
            var url_2 = real_playarr[i + ''] + '.html?qp=' + qp_type;
            urls.push(url_2)
        }

        return urls;
    }
}
async function getDetailData(item) {
    const url = item.url;
    let res = await fetch(url);
    if (!res || res.status !== 200) throw new Error(meta.name + "请求失败");


    const doc = getDocument(await res.text());
    const detailData = doc.querySelector(".content");
    const itemList = detailData.querySelectorAll("dd");
    const lineHeader = doc.querySelector(".pfrom").querySelectorAll("[id*='tab']");
    const lineData = doc.querySelector(".plist").querySelectorAll("[id*='ul_playlist']");

    const region = itemList[1]?.textContent;
    const desc = detailData.querySelector(".des2")?.textContent;



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
    console.log(line)
    //其他线路
    try {
        const otherLine = await getOtherLine(doc, url)
        console.log(otherLine)
        Object.assign(line, otherLine)
    } catch (error) {
        console.error(error)
    }

    item.region = region;
    item.desc = desc;

    item.line = line;
    return item;
}


function getDocument(text) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");
    return doc
}
const play = async function (url, option) {

    const res = await analysis({ url: new URL(option.url).origin + new URL(url).pathname + new URL(url).search })
    return {
        url: res.videoUrl
    }
}

module.exports = {
    author: 'MetaSola',
    name: meta.name,
    from: meta.from,
    version: 1.0,
    srcUrl: "https://blog.metasola.cn/freemovie/plug/dldl.js",
    getDetailData: getDetailData,
    search: search,
    play: play
};
