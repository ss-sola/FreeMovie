import { CapacitorHttp } from '@capacitor/core'
import { globalProxy } from '@/utils/safeRunContext'
import { analysis } from '@/plugin/webView'
import { proxyImg } from '@/utils/static'
import { Filesystem, Directory } from '@capacitor/filesystem';

import CryptoJS from 'crypto-js'

export async function getIConfig() {
  return {
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
    safeWindow: globalProxy,
    basePath: (await Filesystem.getUri({
      path: "",
      directory: Directory.Documents,
    })).uri.substring(5)
  }
}



