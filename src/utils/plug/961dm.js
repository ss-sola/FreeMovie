//961动漫
const CryptoJS = require('CryptoJS')
const Http = require('http')

const meta = {
  name: '961动漫',
  available: true,
  priority: 10,
  from: 'https://www.706dm.com/'
}
const cacheUrl = 'https://danmu.yhdmjx.com/'
async function initFrom() {
  const res = await fetch('https://www.916dm.fans/')

  const parser = new DOMParser()
  const doc = parser.parseFromString(await res.text(), 'text/html')
  const t = doc.querySelector('.item>p').textContent
  meta.from = 'https://' + t.substring(t.indexOf('：') + 1)
}

const search = async function (title) {
  await initFrom()
  title = title.replaceAll(' ', '')
  const url = meta.from + '/search/-------------.html?wd=' + title
  const modelData = []
  var res = await fetch(url)
  if (!res || res.status !== 200) throw new Error(meta.name + '请求失败')
  const parser = new DOMParser()
  const doc = parser.parseFromString(await res.text(), 'text/html')
  const ul = doc.querySelector('.stui-vodlist__media')
  if (!ul) return
  const aTag = ul.querySelectorAll('.stui-vodlist__thumb')

  for (var i = 0; i < aTag.length; i++) {
    var item = aTag[i]
    var code = item.getAttribute('href').match(/\d+/g)[0]
    var tag = item.querySelector('.pic-text').textContent
    var img = item.getAttribute('data-original')
    var title = item.getAttribute('title')

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
  const url = meta.from + '/video/' + item.id + '.html'
  let res = await fetch(url)
  if (!res || res.status !== 200) throw new Error(meta.name + '请求失败')

  const parser = new DOMParser()
  const doc = parser.parseFromString(await res.text(), 'text/html')
  const detailData = doc.querySelector('.stui-content__detail')
  const itemList = detailData.querySelectorAll('.data')

  const lineHeader = doc.querySelectorAll('.nav-tabs>li')
  const lineData = doc.querySelectorAll('.tab-content>.tab-pane')

  const region = detailData.querySelector('.hidden-xs').nextSibling.textContent
  const desc = getElementTextWithoutChildren(detailData.querySelector('.desc'))
  const director = getElementTextWithoutChildren(itemList[2])
  const actor = getElementTextWithoutChildren(itemList[2])
  const updateTime = getElementTextWithoutChildren(itemList[3])
  const line = {}

  for (let i = 0; i < lineData.length; i++) {
    const itemLine = lineData[i]
    const itemHeader = lineHeader[i]
    const aEls = itemLine.querySelectorAll('a')
    const itemValue = {
      html: itemHeader.textContent,
      value: aEls.length > 0 ? aEls[0].getAttribute('href').split('-')[1] : '',
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

  //获取播放地址

  var pattern = /"url":"(.*?)","url_next"/g
  var parameter = pattern.exec(data)[1]

  var exceUrl = '/m3u8.php?url=' + parameter

  const cacheRes = await Http.get({
    url: cacheUrl + exceUrl
    // headers: {
    //   Referer: exceUrl
    // }
  })
  if (!cacheRes || cacheRes.status !== 200) throw new Error(meta.name + '请求失败')

  const patternKey = /bt_token = "(.*?)"/g
  const patternUrl = /getVideoInfo\("(.*?)"/g

  var iv = patternKey.exec(cacheRes.data)[1]
  var encryptionUrl = patternUrl.exec(cacheRes.data)[1]
  var key = `57A891D97E332A9D`

  key = CryptoJS['enc']['Utf8']['parse'](key)
  iv = CryptoJS['enc']['Utf8']['parse'](iv)
  var dataUrl = aesDecrypt(encryptionUrl, key, iv)

  //代理播放地址

  // var playUrl = new URL(dataUrl)
  // var host = playUrl.protocol + '//' + playUrl.hostname + '/'
  // if (getProxyMap()[host]) {
  //   dataUrl = getProxyMap()[host] + '/' + dataUrl.replace(host, '')
  // }

  return {
    url: dataUrl
    // headers: { Origin: 'https://plays.hddm.cc' },
  }
}

// AES解密函数
function aesDecrypt(ciphertext, key, iv) {
  return CryptoJS['AES']
  ['decrypt'](ciphertext, key, {
    iv: iv
  })
  ['toString'](CryptoJS['enc']['Utf8'])
}

function getElementTextWithoutChildren(element) {
  var child = element.firstChild

  var textContent = ''

  while (child) {
    if (child.nodeType === 3) {
      // Node.TEXT_NODE
      textContent += child.textContent
    }
    child = child.nextSibling
  }

  return textContent
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
