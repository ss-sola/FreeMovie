import { CapacitorSQLite } from '@capacitor-community/sqlite'
import { createConnection, closeConnection } from '@/sqlit/commen'

const getAllEndblePlugins = async () => {
  const allPlugins = await CapacitorSQLite.query({
    database: IConfig.Database,
    statement: `SELECT * FROM ${IConfig.TableName.Plugin} WHERE enable = ${IConfig.Enable}`,
    values: []
  })
  return allPlugins.values as IDatabase.plugin[]
}

const getAllPlugins = async () => {
  const allPlugins = await CapacitorSQLite.query({
    database: IConfig.Database,
    statement: `SELECT * FROM ${IConfig.TableName.Plugin}`,
    values: []
  })
  return allPlugins.values as IDatabase.plugin[]
}

const doEnablePlugin = async (
  pluginId: string,
  able: typeof IConfig.Enable | typeof IConfig.Disable
) => {
  await CapacitorSQLite.run({
    database: IConfig.Database,
    statement: `UPDATE ${IConfig.TableName.Plugin} SET enable = ${able} WHERE id = ?`,
    values: [pluginId]
  })
}

const addPlugin = async (plugin: IDatabase.plugin) => {
  const res = await CapacitorSQLite.run({
    database: IConfig.Database,
    statement: `INSERT INTO ${IConfig.TableName.Plugin} ( name,version,content,url, enable) VALUES (?,?,?,?, ?)`,
    values: [plugin.name, plugin.version, plugin.content, plugin.url, IConfig.Enable]
  })
  console.log(res)
  return res.changes?.lastId
}
const removePlugin = async (pluginId: string) => {
  await CapacitorSQLite.run({
    database: IConfig.Database,
    statement: `DELETE FROM ${IConfig.TableName.Plugin} WHERE id = ?`,
    values: [pluginId]
  })
}
const removeAllPlugins = async () => {
  await CapacitorSQLite.run({
    database: IConfig.Database,
    statement: `DELETE FROM ${IConfig.TableName.Plugin}`,
    values: []
  })
}
const updatatePlugin = async (newPlugin: IDatabase.plugin) => {
  let plugin = await getPlugin(newPlugin.id)
  if (!plugin) return
  plugin = {
    ...plugin,
    ...newPlugin
  }
  await CapacitorSQLite.run({
    database: IConfig.TableName.Plugin,
    statement: `UPDATE ${IConfig.TableName.Plugin} SET name = ?, version = ?, content = ?, url = ?, enable = ? WHERE id = ?`,
    values: [plugin.name, plugin.version, plugin.content, plugin.url, plugin.enable, plugin.id]
  })
}
const getPlugin = async (pluginId: string) => {
  const plugin = await CapacitorSQLite.query({
    database: IConfig.Database,
    statement: `SELECT * FROM ${IConfig.TableName.Plugin} WHERE id = ?`,
    values: [pluginId]
  })
  if (plugin.values && plugin.values.length > 0) {
    return plugin.values[0] as IDatabase.plugin
  }
  return null
}

const doPluginHook = async (func: Function, ...args: any[]) => {
  try {
    return await func(...args)
  } catch (error) {
    await createConnection(IConfig.Database, IConfig.DatabaseVersion)
    return await func(...args)
  }
}

export {
  getAllPlugins,
  getAllEndblePlugins,
  doEnablePlugin,
  addPlugin,
  removePlugin,
  removeAllPlugins,
  updatatePlugin,
  getPlugin,
  doPluginHook
}
