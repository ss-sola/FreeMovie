
import { CapacitorHttp } from '@capacitor/core'

let isPC = () => {
  const userAgentInfo = navigator.userAgent
  const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
  let flag = true
  for (let v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false
      break
    }
  }
  isPC = () => flag
  return flag
}

const emptyElement = () => {
  return document.createElement('div')
}
function sleep(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}

function checkPluginMoudle(pluginMoudle: IPlugin.IPluginModule) {
  const keys: IPlugin.pluginMoudleKey[] = ['name', 'getDetailData']
  for (const key of keys) {
    if (!pluginMoudle[key]) {
      throw new Error(`${key} is required`)
    }
  }
  if (!pluginMoudle['play'] && !pluginMoudle['from']) {
    throw new Error('play or from is required')
  }
}


async function safeRunScript(content: string, fnOption: any) {
  try {
    await Function(`
    with (IConfig.safeWindow) {
        return function(require, module,  env) {
                    ${content}
                }
        }
    `)()(fnOption.require, fnOption.module, fnOption.env)
  } catch (error) {
    console.error(error)
  }
}

function isValidURL(url: string) {
  try {
    new URL(url)
    return true
  } catch (e) {
    return false
  }
}
async function getVideoMimeType(url: string): Promise<string | undefined> {
  if (!isValidURL(url)) {
    throw new Error('Invalid URL')
  }
  if (url.endsWith('.mp4')) return 'video/mp4'
  if (url.endsWith('.m3u8')) return 'application/x-mpegURL'
  try {
    const res = await CapacitorHttp.request({
      url: url,
      method: 'HEAD',
      headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    })
    return res.headers['Content-Type'];
  } catch (error) {
    let r;
    let type
    try {
      r = await fetch(url, { method: 'HEAD' })
      type = r.headers.get('Content-Type');
    } catch (error) { }
    if (type?.includes('m3u8')) {
      return 'application/x-mpegURL'
    }

    if (type != 'vieo/mp4') {
      type = 'application/x-mpegURL'
    }
    return type
  }
}
async function proxyImg(url: string): Promise<string> {
  return new Promise(async (resolve, reject) => {

    const response = await CapacitorHttp.get({
      url: url,
      headers: {
        Referer: url,
      },
      responseType: 'arraybuffer',
      disableRedirects: false // 确保跟随重定向
    })
    // 检查状态码
    if (response.status === 301 || response.status === 302) {
      const newUrl = response.headers['Location'];
      if (newUrl) {
        resolve(await proxyImg(newUrl)); // 递归调用，请求新URL
      }
    }
    const arrayBuffer = response.data;
    resolve(`data:image/jpeg;base64,${arrayBuffer}`)
  })
}
export { isPC, emptyElement, sleep, safeRunScript, checkPluginMoudle, isValidURL, getVideoMimeType, proxyImg }
