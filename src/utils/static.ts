let isPC = () => {
  var userAgentInfo = navigator.userAgent
  var Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
  var flag = true
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false
      break
    }
  }
  isPC = () => flag
  return flag
}

let emptyElement = () => {
  return document.createElement('div')
}
function sleep(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}

function checkPluginMoudle(pluginMoudle: IPlugin.IPluginModule) {
  const keys: IPlugin.pluginMoudleKey[] = ['name', 'getDetailData', 'play']
  for (let key of keys) {
    if (!pluginMoudle[key]) {
      throw new Error(`${key} is required`)
    }
  }
}

function safeRunContext() {
  const whitelist = {
    Set: true,
    Map: true,
    navigator: true,
    console: true,
    fetch: true,
    XMLHttpRequest: true,
    FormData: true,
    DOMParser: true,
    decodeURI: true,
    decodeURIComponent: true,
    encodeURI: true,
    encodeURIComponent: true,
    URL: true
  }
  const handler: ProxyHandler<Window & typeof globalThis> = {
    get(target: Window & typeof globalThis, prop: PropertyKey): any {
      if (whitelist[prop as keyof typeof whitelist] && prop in target) {
        // 使用类型断言确保 prop 是字符串索引类型
        return target[prop as keyof typeof target]
      }
      return undefined
    }
  }
  return new Proxy(window as Window & typeof globalThis, handler)
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

export { isPC, emptyElement, sleep, safeRunContext, safeRunScript, checkPluginMoudle }
