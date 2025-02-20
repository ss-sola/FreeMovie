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
  initVolumeControl()
  initFetch()
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

function initFetch() {
  if (Capacitor.getPlatform() === 'web') return
  const cappaFetch = fetch
  window.fetch = async (url, options = {}, timeout = 15000) => {
    url = decodeURIComponent(url + '')
    url = url.replace(/([^:])\/{2,}/g, '$1/')
    const response = await fetchWithTimeout(url, options, timeout)

    return response
  }
  function fetchWithTimeout(url: string, options = {}, timeout = 15000): Promise<Response> {
    return new Promise((resolve, reject) => {
      const controller = new AbortController();
      const signal = controller.signal;

      // 设置超时
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      cappaFetch(location.origin + '/_capacitor_http_interceptor_?u=' + url, { ...options, signal })
        .then((response) => {
          clearTimeout(timeoutId); // 请求成功，清除超时
          resolve(response);
        })
        .catch((error) => {
          Toast('请求超时')
          clearTimeout(timeoutId); // 请求失败，清除超时
          reject(error)
        });
    })


  }
}

function initVolumeControl() {
  if (Capacitor.getPlatform() === 'web') {
    window.VolumeControl = {
      getVolume: async () => {
        return 0
      },
      setVolume: async () => {

      }
    }
  }
  window.VolumeControl = cordova.plugins.VolumeControl
  const getVolumeCopy = VolumeControl.getVolume as (callback: (res: number) => void) => void

  VolumeControl.getVolume = () => {
    return new Promise<number>((resolve, reject) => {
      getVolumeCopy((res) => {
        resolve(res)
      }
      )
    })
  }
}
