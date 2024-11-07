import { showNetworkAction, nativeInstallPlugin, updateAllPlugin } from './action'
export const actionSheetButtons = [
  {
    text: '从网络安装插件',
    data: {
      action: showNetworkAction
    }
  },
  {
    text: '从本地安装插件',
    data: {
      action: nativeInstallPlugin
    }
  },
  {
    text: '更新全部插件',
    data: {
      action: updateAllPlugin
    }
  }
]
