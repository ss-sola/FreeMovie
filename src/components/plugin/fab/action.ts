import { registPlugin, updatePlugin } from '@/service/plugin'
import { isValidURL } from '@/utils/static'

function didPresent(e: CustomEvent, option: any) {
  e.detail.data.action(option)
}
async function showNetworkAction(option: any) {
  option.popoverOpen.value = true
}
async function nativeInstallPlugin() {
  const pluginContent = await selectFile()

  if (typeof pluginContent === 'string') {
    try {
      await registPlugin(pluginContent)
    } catch (error) {
      Toast('插件安装失败')
      return
    }

    Toast('插件安装成功')
  }
}
async function updateAllPlugin() { }
async function networkInstallPlugin(url: string) {
  //校验url合法性
  if (!isValidURL(url)) {
    Toast('请输入合法的url')
    return false
  }
  const res = await fetch(url)
  if (!res || !res.ok) {
    Toast('安装失败')
    throw new Error('fetch error')
  }
  const content = await res.text()
  const promisesHandler = []
  if (url.endsWith('.json')) {
    const plugins = JSON.parse(content)
    for (const plugin of plugins) {
      promisesHandler.push(installOne(plugin.url))
    }
  } else {
    promisesHandler.push(registPlugin(content))
  }

  await Promise.allSettled(promisesHandler)
  Toast('插件安装成功')
  return true
  async function installOne(url: string) {
    const res = await fetch(url)
    if (!res || !res.ok) {
      throw new Error('fetch error')
    }
    const content = await res.text()
    await registPlugin(content)
  }
}

async function selectFile(): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    // fileInput.accept = '.js'

    fileInput.addEventListener('change', function () {
      if (!fileInput.files) {
        reject(new Error('No file selected'))
        return
      }
      const file = fileInput.files[0]
      if (!file) {
        reject(new Error('No file selected'))
        return
      }

      const reader = new FileReader()
      reader.onload = function (e) {
        if (e.target) {
          resolve(e.target.result)
        } else {
          reject(new Error('FileReader load error'))
        }
      }
      reader.onerror = function (e) {
        reject(e)
      }
      reader.readAsText(file)
    })

    fileInput.click()

    // Clean up
    fileInput.remove()
  })
}

export { didPresent, showNetworkAction, nativeInstallPlugin, updateAllPlugin, networkInstallPlugin }
