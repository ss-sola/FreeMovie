import { createConnection, closeConnection } from '@/sqlite/commen'
import {
  getAllPlugins,
  addPlugin,
  removePlugin,
  doEnablePlugin,
  doUpdatatePlugin
} from '@/sqlite/plugin'
import { usePluginStore } from '@/stores/pluginStroe'
import { safeRunScript, checkPluginMoudle } from '@/utils/static'

const turnPluginToMoudle = async (plugin: IDatabase.plugin) => {
  const env = {}

  let module = {
    exports: {} as IPlugin.IPluginModule
  }
  //await Function('require,module,env', plugin.content)(_require, module, env)
  const fnOption = {
    require: _require,
    module: module,
    env: env
  }
  await safeRunScript(plugin.content, fnOption)
  module.exports.name = plugin.name || module.exports.name
  module.exports.id = plugin.id
  module.exports.enable = plugin.enable
  return module.exports

  function _require(moduleName: keyof typeof IConfig.pluginModules) {
    return IConfig.pluginModules[moduleName]
  }
}

const turnPluginsToMoudles = async (plugins: IDatabase.plugin[]) => {
  const modules: IPlugin.IPluginModule[] = []
  for (const plugin of plugins) {
    const module = await turnPluginToMoudle(plugin)
    modules.push(module)
  }
  return modules
}
const initPluginModules = async () => {
  const store = usePluginStore()
  store.clearPluginModules()
  const pluginModules = store.pluginModules

  const plugins = await getAllPlugins()
  const modules = await turnPluginsToMoudles(plugins)

  pluginModules.push(...modules)
  return modules
}
const registPlugin = async (content: string) => {
  let plugin = {
    content: content
  } as IDatabase.plugin
  const pluginModule = await turnPluginToMoudle(plugin)
  checkPluginMoudle(pluginModule)
  plugin = {
    ...pluginModule,
    ...plugin,
    enable: true
  }
  pluginModule.enable = true
  const pluginModules = usePluginStore().pluginModules
  const res = await addPlugin(plugin)
  if (res) {
    pluginModule.id = res.toString()
  }
  pluginModules.push(pluginModule)

}
const updatePlugin = async (id: string, content: string) => {
  let plugin = {
    id: id,
    content: content
  } as IDatabase.plugin
  const pluginModule = await turnPluginToMoudle(plugin)
  checkPluginMoudle(pluginModule)
  plugin = {
    ...pluginModule,
    ...plugin,
    enable: true
  }
  await doUpdatatePlugin(plugin)
  pluginModule.enable = true
  const pluginModules = usePluginStore().pluginModules
  const index = pluginModules.findIndex((item) => item.id === id)
  if (index > -1) {
    pluginModules.splice(index, 1)
  }
  pluginModules.push(pluginModule)
  Toast('更新成功')

}
const deletePlugin = async (pluginId: string) => {
  const pluginModules = usePluginStore().pluginModules
  const index = pluginModules.findIndex((item) => item.id === pluginId)
  if (index > -1) {
    pluginModules.splice(index, 1)
  }
  await removePlugin(pluginId)
}
const putPluginIdToBase = (dataList: IMovie.IMovieBase[], module: IPlugin.IPluginDefine) => {
  for (const item of dataList) {
    item.pluginId = module.id
  }
}
const enablePlugin = async (
  pluginId: string,
  able: typeof IConfig.Enable | typeof IConfig.Disable
) => {
  usePluginStore().pluginModules.forEach((item) => {
    if (item.id === pluginId) {
      item.enable = able == 1
    }
  })
  await doEnablePlugin(pluginId, able)
}
export { initPluginModules, registPlugin, putPluginIdToBase, deletePlugin, enablePlugin, updatePlugin }
