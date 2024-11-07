import { usePluginStore } from '@/stores/pluginStroe'
import { useWeekStore } from '@/stores/weekStore'
import { putPluginIdToBase } from '@/service/plugin'

export const initWeekData = async () => {
  const pluginModules = usePluginStore().pluginModules
  const weekData = useWeekStore().weekData
  let finished = false
  const promises = pluginModules.map(async (module) => {
    return new Promise<void>(async (resolve, reject) => {
      if (module.initWeekData) {
        const dataList = await module.initWeekData()

        if (!finished && dataList.length > 0) {
          finished = true
          for (let i = 0; i < weekData.length; i++) {
            weekData[i].dataList = dataList[i]
            putPluginIdToBase(dataList[i], module)
          }
        }
      }
      resolve()
    }).catch((err) => {
      console.log(err)
    })
  })

  Promise.any(promises)
}
