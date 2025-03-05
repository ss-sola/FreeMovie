import { CapacitorSQLite } from '@capacitor-community/sqlite'

export const initTables = async () => {
  //创建插件表
  const isTableExists = (
    await CapacitorSQLite.isTableExists({
      database: IConfig.Database,
      table: IConfig.TableName.Plugin
    })
  ).result
  if (isTableExists) {
    return
  }
  await CapacitorSQLite.run({
    database: IConfig.Database,
    statement: `CREATE TABLE IF NOT EXISTS ${IConfig.TableName.Plugin} (id INTEGER PRIMARY KEY AUTOINCREMENT,version TEXT, name TEXT, content TEXT,url TEXT,enable BOOLEAN DEFAULT 1)`,
    values: []
  })
}
