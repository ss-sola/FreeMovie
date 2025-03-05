import { CapacitorSQLite } from '@capacitor-community/sqlite'
import { Capacitor } from '@capacitor/core'
const createConnection = async function (database: string, version: number) {
  if (Capacitor.getPlatform() === 'web') {
    await CapacitorSQLite.initWebStore()
  }

  await CapacitorSQLite.createConnection({
    database: database,
    version: version,
    encrypted: false
  }).catch((e) => {
    console.log('createConnection', e)
  })
  const isDBOpen = await CapacitorSQLite.isDBOpen({ database: database })
  if (!isDBOpen.result) {
    await CapacitorSQLite.open({
      database: database
    })
  }

  if (Capacitor.getPlatform() === 'web') {
    await CapacitorSQLite.saveToStore({ database: database })
  }
}

const closeConnection = async function (database: string) {
  const isOpen = await CapacitorSQLite.isDBOpen({ database: database })
  if (isOpen && isOpen.result) {
    await CapacitorSQLite.close({ database: database })
  }
  await CapacitorSQLite.closeConnection({
    database: database
  })
}
const doSqlteHook = async (func: Function, ...args: any[]) => {
  try {
    await createConnection(IConfig.Database, IConfig.DatabaseVersion)
    await func(...args)
    await closeConnection(IConfig.Database)
    return
  } catch (error) {
    await func(...args)
    await closeConnection(IConfig.Database)
    return
  }
}
export { createConnection, closeConnection, doSqlteHook }
