import { usePluginStore } from '@/stores/pluginStroe'
import { userRotationStore } from '@/stores/rotationStore'
import { putPluginIdToBase } from '@/service/plugin'

export const initRotationData = async () => {
  const pluginModules = usePluginStore().pluginModules
  const rotationData = userRotationStore().rotationData
  if (localStorage.getItem('rotationData')) {
    const arr: IMovie.IMovieItem[] = JSON.parse(localStorage.getItem('rotationData') || '[]')
    rotationDataPush(rotationData, arr)
  }
  if (rotationData.length > 0) {
    const arr: IMovie.IMovieItem[] = []
    const promises = buildPromises(arr)
    Promise.all(promises)
      .then(() => {
        if (arr.length > 0) {
          localStorage.setItem('rotationData', JSON.stringify(arr))
        }
      })
      .catch(IConfig.errCatch)
  } else {
    const promises = buildPromises(rotationData)
    await Promise.allSettled(promises).catch(IConfig.errCatch)
    if (rotationData.length > 0) localStorage.setItem('rotationData', JSON.stringify(rotationData))
  }

  function buildPromises(dataArr: IMovie.IMovieBase[]) {
    const res = pluginModules.map(async (module) => {
      return new Promise<void>(async (resolve, reject) => {
        try {
          if (module.initRotationData) {
            const resData = await module.initRotationData()
            putPluginIdToBase(resData, module)
            rotationDataPush(dataArr, resData)

          }
          resolve()
        } catch (err) {
          resolve()
        }
      })
    })
    return res
  }
  function rotationDataPush(dataArr: IMovie.IMovieItem[], objs: IMovie.IMovieItem[]) {
    objs.forEach((obj) => {
      //去除obj.title的所有空格
      obj.title = obj.title.replaceAll(' ', '')
      let exist = dataArr.find((item) => item.title == obj.title && item.tag == obj.tag)
      if (!exist) {
        dataArr.push(obj)
      }
    })
  }
}
