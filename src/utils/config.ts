import { CapacitorHttp } from '@capacitor/core'
import { safeRunContext } from '@/utils/static'
import { analysis } from '@/plugin/webView'
import CryptoJS from 'crypto-js'

export const IConfig = {
  /**app版本地址 */
  InfoUrl: 'https://blog.metasola.cn/freemovie/config.json',
  IVersionName: 'freemovie_version',
  /**库名称 */
  Database: 'FreeMovie',
  DatabaseVersion: 1,
  /**是否启用 */
  Enable: 1,
  Disable: 0,
  /**插件可使用模块 */
  pluginModules: {
    http: CapacitorHttp,
    CryptoJS: CryptoJS,
    analysis: analysis,
    proxyImg: proxyImg
  },
  /**初始化表名称 */
  TableName: {
    Plugin: 'plugin'
  },
  errCatch: (e: any) => {
    console.error(e)
  },
  IPlayStatus: {
    Getting: '获取播放地址中。。。',
    Waiting: '等待播放中。。。',
    Playing: '正在播放:',
    Pause: '暂停中。。。',
    ErrorGet: '获取播放地址失败',
    ErrorPlay: '播放失败'
  },
  safeWindow: safeRunContext()
}


async function proxyImg(url: string) {
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