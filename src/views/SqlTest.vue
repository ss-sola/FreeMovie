<template>
  <IonPage class="contioner">
    <div @click="createConnection(IConfig.Database, IConfig.DatabaseVersion)">连接</div>
    <div @click="removePlugin('3')">删除</div>
    <div @click="insertData">插入</div>
    <div @click="getAllEndblePlugins">查询</div>
    <div @click="closeConnection(IConfig.Database)">断开</div>
    <div @click="test">测试</div>

  </IonPage>
</template>

<script setup lang="ts">
import { IonPage } from '@ionic/vue';
import { CapacitorSQLite } from '@capacitor-community/sqlite';
import { registPlugin } from '@/service/plugin'
import { getAllEndblePlugins, removePlugin, removeAllPlugins } from '@/sqlit/plugin'
import { createConnection, closeConnection } from '@/sqlit/commen'
import { IConfig } from '@/utils/config';

async function connection() {
  console.log("连接中")
  await CapacitorSQLite.createConnection({
    database: 'test',
    version: 1,
    encrypted: false,
  })
  await CapacitorSQLite.open({ database: 'test' })
  console.log("连接成功")
}
async function createTable() {
  console.log("创建中")
  await CapacitorSQLite.run({
    database: 'test',
    statement: 'CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, age INTEGER)',
    values: []
  })
  console.log("创建成功")
}
async function insertData() {
  console.log("插入中")
  await removeAllPlugins()
  // await CapacitorSQLite.run({
  //   database: 'test',
  //   statement: 'INSERT INTO user (name, age) VALUES (?, ?)',
  //   values: ['张三', 18]
  // })
  const str = `const meta = {
  name: '皮皮虾动漫',
  available: true,
  priority: 30,
  from: 'https://www.ppxdm.com/'
}

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
    var code = item.getAttribute('href').match(/\\d+/g)[0]
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
    var code = a.getAttribute('href').match(/\\d+/g)[0]
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
    // 清理背景图片地址字符串（去除引号和空格）
    backgroundImage = backgroundImage.replace(/url\\(['"]?([^'"]+)['"]?\\)/i, '$1')
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
}

module.exports = {
  name: meta.name,
  version: 1.0,
  initWeekData: initWeekData,
  initRotationData: initRotationData,
  getDetailData: getDetailData
}



`
  await registPlugin(str);
  console.log("插入成功")
}
async function queryData() {
  console.log("查询中")
  const res = await CapacitorSQLite.query({
    database: 'test',
    statement: 'SELECT * FROM user',
    values: []
  })
  console.log("查询成功", res.values)
}

async function desConnection() {
  console.log("断开中")
  if ((await CapacitorSQLite.isDBOpen({ database: 'test' })).result) {
    await CapacitorSQLite.close({ database: 'test' })
  }

  await CapacitorSQLite.closeConnection({ database: 'test' })
  console.log("断开成功")
}

async function test() {
  console.log(await CapacitorSQLite.isDBExists({ database: 'test' }))
}

</script>

<style scoped>
.contioner div {
  margin-top: 20px;
}
</style>
