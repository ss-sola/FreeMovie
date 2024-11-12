import { initTables } from '@/sqlit/init'
import { initPluginModules } from '@/service/plugin'
import { createConnection, closeConnection } from '@/sqlit/commen'
import { IConfig } from '@/utils/config'
import { Capacitor } from '@capacitor/core'
import { toastController } from '@ionic/vue'
import type { ToastOptions } from '@ionic/core/dist/types/components/toast/toast-interface'
import { sleep } from '@/utils/static'

async function Toast(msg: string, options?: ToastOptions) {
  options = options || {
    duration: 2000,
    position: 'bottom',
    color: 'dark',
    message: msg
  }
  const toast = await toastController.create(options)
  await toast.present()
}

export const initAll = async () => {
  console.time('initAll')
  window.IConfig = IConfig
  window.Toast = Toast
  if (Capacitor.getPlatform() !== 'web') {
    const cappaFetch = fetch
    window.fetch = async (url, options = {}) => {
      url = decodeURIComponent(url + '')
      url = url.replace(/([^:])\/{2,}/g, '$1/')
      const response = await cappaFetch(
        location.origin + '/_capacitor_http_interceptor_?u=' + url,
        options
      )
      return response
    }
  }
  //初始化连接
  await createConnection(IConfig.Database, IConfig.DatabaseVersion)
  //初始化必要的表
  await initTables()
  //加载插件
  await initPluginModules()
  //关闭连接(或许不必关闭)
  closeConnection(IConfig.Database)

  console.timeEnd('initAll')
}
