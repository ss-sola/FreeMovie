

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
export { isPC, emptyElement, sleep, safeRunScript, checkPluginMoudle, isValidURL }
