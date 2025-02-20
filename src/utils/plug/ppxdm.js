const meta = {
  name: "皮皮虾动漫",
  available: true,
  from: "https://www.ppxdm.com/",
};
const CryptoJS = require("CryptoJS");
const Http = require("http");

const initWeekData = async () => {
  const url = meta.from + "/label/week.html";
  let res = await fetch(url);
  if (!res || res.status !== 200) throw new Error(meta.name + "请求失败");

  const parser = new DOMParser();
  const doc = parser.parseFromString(await res.text(), "text/html");
  const weekData = doc.querySelectorAll("div.module-main");
  const resData = [];
  for (let i = 0; i < weekData.length; i++) {
    var itemList = weekData[i].querySelectorAll("a.module-poster-item");
    var dataList = getData(itemList);
    resData.push(dataList);
  }
  return resData;
};

function getData(attList) {
  var list = [];
  for (var i = 0; i < attList.length; i++) {
    var item = attList[i];
    var code = item.getAttribute("href").match(/\d+/g)[0];
    var tag = item.querySelector(".module-item-note").textContent;
    var img = item.querySelector("img").getAttribute("data-original");
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

const initRotationData = async function () {
  const from = meta.from;
  const modelData = [];

  var res = await fetch(from);
  if (!res || res.status !== 200) throw new Error("请求失败" + meta.name);
  var parser = new DOMParser();
  var doc = parser.parseFromString(await res.text(), "text/html");

  const container = doc
    .querySelector(".container-slide")
    .querySelector(".swiper-wrapper");
  const rotationData = container.querySelectorAll(".swiper-slide");
  for (var i = 0; i < rotationData.length; i++) {
    var item = rotationData[i];
    var title = item.querySelector(".v-title").textContent;
    var a = item.querySelector("a.banner");
    var img = getBackImg(a);
    var code = a.getAttribute("href").match(/\d+/g)[0];
    var tag = item.querySelector(".v-ins").firstElementChild.textContent;
    const obj = {
      platform: from,
      title: title,
      img: img,
      id: code,
      tag: tag,
    };
    modelData.push(obj);
  }

  return modelData;
  function getBackImg(dom) {
    // 获取背景图片地址
    var backgroundImage = dom.style.backgroundImage;

    // 清理背景图片地址字符串（去除引号和空格）
    const urlRegex = /url\((['"]?)(.*?)\1\)/;
    const match = backgroundImage.match(urlRegex);

    if (match && match[2]) {
      backgroundImage = match[2]; // 输出URL
    }
    if (!backgroundImage.startsWith("http")) {
      backgroundImage = from + backgroundImage;
    }
    return backgroundImage;
  }
};

async function getDetailData(item) {
  const url = meta.from + "/show/" + item.id + ".html";
  let res = await fetch(url);
  if (!res || res.status !== 200) throw new Error(meta.name + "请求失败");

  const parser = new DOMParser();
  const doc = parser.parseFromString(await res.text(), "text/html");
  const detailData = doc.querySelector(".module-info-main");
  const itemList = detailData.querySelectorAll(".module-info-item");
  const lineHeader = doc.querySelectorAll(".module-tab-item");
  const lineData = doc.querySelectorAll(".module-list");

  const region = detailData.querySelectorAll(".module-info-tag-link")[1]
    .textContent;
  const desc = itemList[0].textContent;
  const director = itemList[1].textContent;
  const actor = itemList[2].textContent;
  const updateTime = itemList[3].textContent;
  const line = {};

  for (let i = 0; i < lineData.length; i++) {
    const itemLine = lineData[i];
    const itemHeader = lineHeader[i];
    const aEls = itemLine.querySelectorAll("a");
    const itemValue = {
      html: itemHeader.getAttribute("data-dropdown-value"),
      value: aEls.length > 0 ? aEls[0].textContent.split("-")[1] : "",
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
async function search(query) {
  const url = meta.from + "/search/-------------.html?wd=" + query;
  const modelData = [];
  var res = await fetch(url);
  if (!res || res.status !== 200) throw new Error(meta.name + "请求失败");

  const parser = new DOMParser();
  const doc = parser.parseFromString(await res.text(), "text/html");
  const aTag = doc.querySelectorAll("a.module-card-item-poster");

  for (var i = 0; i < aTag.length; i++) {
    var item = aTag[i];
    var code = item.getAttribute("href").match(/\d+/g)[0];
    var tag = item.querySelector(".module-item-note").textContent;
    var img = item.querySelector("img").getAttribute("data-original");
    var title = item.querySelector("img").getAttribute("title");

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
async function play(url, option) {

  const res = await fetch(meta.from + url);
  if (!res || res.status !== 200) throw new Error(meta.name + "请求失败");
  const data = await res.text();

  if (option.activeLine == "新一线") {
    return await newPlay(data);
  } else {
    return await defaultPlay(data);
  }
}
async function defaultPlay(data) {
  var docStr = data

  var pattern = /"url":"(.*?)","url_next"/g;
  var parameter = pattern.exec(docStr)[1];

  parameter = unescape(base64decode(parameter));
  return {
    url: parameter,
  };
}
async function newPlay(data) {
  //获取播放地址

  var pattern = /"url":"(.*?)","url_next"/g;
  var parameter = pattern.exec(data)[1];

  parameter = unescape(base64decode(parameter));
  var exceUrl = "https://plays.ppxdm.co/player/ec.php?code=qw&url=" + parameter;

  const cacheRes = await Http.get({
    url: exceUrl,
    headers: {
      Referer: exceUrl,
    },
  });
  if (!cacheRes || cacheRes.status !== 200)
    throw new Error(meta.name + "请求失败");
  var docStr = cacheRes.data

  pattern = /"url":"(.*?)"/g;
  var ddd = pattern.exec(docStr);
  var encryptionUrl = ddd[1];
  encryptionUrl = encryptionUrl.replaceAll("\\", "");
  pattern = /"uid":"(.*?)"/g;
  var uid = pattern.exec(docStr)[1];

  var key = "2890" + uid + "tB959C";
  var iv = "2F131BE91247866E";

  var dataUrl = aesDecrypt(encryptionUrl, key, iv);

  const m3u8Content = await Http.get({
    url: dataUrl,
    headers: {
      headers: { Origin: "https://plays.hddm.cc" },
    },
  });
  return {
    url: dataUrl,
    headers: { Origin: "https://plays.hddm.cc" },
    m3u8Content: m3u8Content.data,
  };
}
// AES解密函数
function aesDecrypt(ciphertext, key, iv) {
  const keyUtf8 = CryptoJS.enc.Utf8.parse(key);
  const ivUtf8 = CryptoJS.enc.Utf8.parse(iv);
  const decrypted = CryptoJS.AES.decrypt(ciphertext, keyUtf8, {
    iv: ivUtf8,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}
function base64decode(str) {
  var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

  var c1, c2, c3, c4;
  var i, len, out;
  len = str.length;
  i = 0;
  out = "";
  while (i < len) {
    do {
      c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
    } while (i < len && c1 == -1);
    if (c1 == -1)
      break;
    do {
      c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
    } while (i < len && c2 == -1);
    if (c2 == -1)
      break;
    out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
    do {
      c3 = str.charCodeAt(i++) & 0xff;
      if (c3 == 61)
        return out;
      c3 = base64DecodeChars[c3]
    } while (i < len && c3 == -1);
    if (c3 == -1)
      break;
    out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
    do {
      c4 = str.charCodeAt(i++) & 0xff;
      if (c4 == 61)
        return out;
      c4 = base64DecodeChars[c4]
    } while (i < len && c4 == -1);
    if (c4 == -1)
      break;
    out += String.fromCharCode(((c3 & 0x03) << 6) | c4)
  }
  return out
}

module.exports = {
  author: 'MetaSola',
  name: meta.name,
  from: meta.from,
  version: 1.0,
  srcUrl: "https://blog.metasola.cn/freemovie/plug/ppxdm.js",
  initWeekData: initWeekData,
  initRotationData: initRotationData,
  getDetailData: getDetailData,
  search: search,
  play: play,
};
