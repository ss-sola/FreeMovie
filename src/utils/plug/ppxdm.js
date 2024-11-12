const meta = {
  name: '皮皮虾动漫',
  available: true,
  from: 'https://www.ppxdm.com/'
}
const CryptoJS = require('CryptoJS')
const Http = require('http')

const initWeekData = async () => {
  const url = meta.from + '/label/week.html'
  let res = await fetch(url)
  if (!res || res.status !== 200) throw new Error(meta.name + '请求失败')

  const parser = new DOMParser()
  const doc = parser.parseFromString(await res.text(), 'text/html')
  const weekData = doc.querySelectorAll('div.module-main')
  const resData = []
  for (let i = 0; i < weekData.length; i++) {
    var itemList = weekData[i].querySelectorAll('a.module-poster-item')
    var dataList = getData(itemList)
    resData.push(dataList)
  }
  return resData
}

function getData(attList) {
  var list = []
  for (var i = 0; i < attList.length; i++) {
    var item = attList[i]
    var code = item.getAttribute('href').match(/\d+/g)[0]
    var tag = item.querySelector('.module-item-note').textContent
    var img = item.querySelector('img').getAttribute('data-original')
    var title = item.getAttribute('title')

    const obj = {
      platform: meta.from,
      title: title,
      img: img,
      id: code,
      tag: tag
    }
    list.push(obj)
  }
  return list
}

const initRotationData = async function () {
  const from = meta.from
  const modelData = []

  var res = await fetch(from)
  if (!res || res.status !== 200) throw new Error('请求失败' + meta.name)
  var parser = new DOMParser()
  var doc = parser.parseFromString(await res.text(), 'text/html')

  const container = doc.querySelector('.container-slide').querySelector('.swiper-wrapper')
  const rotationData = container.querySelectorAll('.swiper-slide')
  for (var i = 0; i < rotationData.length; i++) {
    var item = rotationData[i]
    var title = item.querySelector('.v-title').textContent
    var a = item.querySelector('a.banner')
    var img = getBackImg(a)
    var code = a.getAttribute('href').match(/\d+/g)[0]
    var tag = item.querySelector('.v-ins').firstElementChild.textContent
    const obj = {
      platform: from,
      title: title,
      img: img,
      id: code,
      tag: tag
    }
    modelData.push(obj)
  }

  return modelData
  function getBackImg(dom) {
    // 获取背景图片地址
    var backgroundImage = dom.style.backgroundImage
    console.log('1', backgroundImage)
    // 清理背景图片地址字符串（去除引号和空格）
    const urlRegex = /url\((['"]?)(.*?)\1\)/
    const match = backgroundImage.match(urlRegex)

    if (match && match[2]) {
      backgroundImage = match[2] // 输出URL
    }
    if (!backgroundImage.startsWith('http')) {
      backgroundImage = from + backgroundImage
    }
    return backgroundImage
  }
}

async function getDetailData(item) {
  const url = meta.from + '/show/' + item.id + '.html'
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
async function search(query) {
  const url = meta.from + '/search/-------------.html?wd=' + query
  const modelData = []
  var res = await fetch(url)
  if (!res || res.status !== 200) throw new Error(meta.name + '请求失败')
  console.log(res)
  const parser = new DOMParser()
  const doc = parser.parseFromString(await res.text(), 'text/html')
  const aTag = doc.querySelectorAll('a.module-card-item-poster')

  for (var i = 0; i < aTag.length; i++) {
    var item = aTag[i]
    var code = item.getAttribute('href').match(/\d+/g)[0]
    var tag = item.querySelector('.module-item-note').textContent
    var img = item.querySelector('img').getAttribute('data-original')
    var title = item.querySelector('img').getAttribute('title')

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
async function play(option) {
  let url = ''
  const total = option.line[option.activeLine].total
  for (let i = 0; i < total.length; i++) {
    if (total[i].html == option.activeNumber) {
      url = total[i].href
    }
  }

  const res = await fetch(meta.from + url)
  if (!res || res.status !== 200) throw new Error(meta.name + '请求失败')
  const data = await res.text()
  if (option.activeLine == '新一线') {
    return await newPlay(data)
  } else {
    return await defaultPlay(data)
  }
}
async function defaultPlay(data) {
  //获取播放地址
  const pattern = /http.*?\.m3u8/g
  var match
  var urlValue = []
  while ((match = pattern.exec(data))) {
    console.log(match)
    urlValue.push(decodeURIComponent(match[0]))
  }

  urlValue = [...new Set(urlValue)]
  return {
    url: urlValue[0]
  }
}
async function newPlay(data) {
  //获取播放地址
  var docStr = data.replaceAll(/[\s\n]+/g, '')

  var pattern = /"url":"(.*?)","url_next"/g
  var parameter = pattern.exec(data)[1]

  var exceUrl = 'https://plays.ppxdm.co/player/ec.php?code=qw&url=' + parameter

  const cacheRes = await Http.get({
    url: exceUrl,
    headers: {
      Referer: exceUrl
    }
  })
  if (!cacheRes || cacheRes.status !== 200) throw new Error(meta.name + '请求失败')
  docStr = cacheRes.data.replaceAll(/[\s\n]+/g, '')

  pattern = /"url":"(.*?)"/g
  var ddd = pattern.exec(docStr)
  var encryptionUrl = ddd[1]
  encryptionUrl = encryptionUrl.replaceAll('\\', '')
  pattern = /"uid":"(.*?)"/g
  var uid = pattern.exec(docStr)[1]

  var key = '2890' + uid + 'tB959C'
  var iv = '2F131BE91247866E'

  var dataUrl = aesDecrypt(encryptionUrl, key, iv)

  const m3u8Content = await Http.get({
    url: dataUrl,
    headers: {
      headers: { Origin: 'https://plays.hddm.cc' }
    }
  })
  return {
    url: dataUrl,
    headers: { Origin: 'https://plays.hddm.cc' },
    m3u8Content: m3u8Content.data
  }
}
// AES解密函数
function aesDecrypt(ciphertext, key, iv) {
  const keyUtf8 = CryptoJS.enc.Utf8.parse(key)
  const ivUtf8 = CryptoJS.enc.Utf8.parse(iv)
  const decrypted = CryptoJS.AES.decrypt(ciphertext, keyUtf8, {
    iv: ivUtf8,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return decrypted.toString(CryptoJS.enc.Utf8)
}
module.exports = {
  author: 'MetaSola',
  name: meta.name,
  version: 1.0,
  initWeekData: initWeekData,
  initRotationData: initRotationData,
  getDetailData: getDetailData,
  search: search,
  play: play
}
