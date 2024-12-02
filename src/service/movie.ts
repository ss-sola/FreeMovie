import { usePluginStore } from '@/stores/pluginStroe'
import { useSearchStore } from '@/stores/searchStore'
import { putPluginIdToBase } from '@/service/plugin'
import { useMovieStore } from '@/stores/movieStore'
const titleFilter = ['电影解说']
const tagFilter = ['未播放']
const filter = { title: titleFilter, tag: tagFilter }

const doSearch = async () => {
  const pluginModules = usePluginStore().pluginModules
  const store = useSearchStore()
  const searchContent = store.searchContent
  const searchResult = store.searchResult
  store.clearSearchResult()
  const promises = pluginModules.map(async (module) => {
    return new Promise<void>(async (resolve, reject) => {
      if (module.search && module.enable) {
        let resData = (await module.search(searchContent.content, 1)).data
        putPluginIdToBase(resData, module)

        resData = filterSearchResult(resData)

        if (resData.length > 0) {
          searchResult.push({
            name: module.name,
            pluginId: module.id,
            count: resData.length,
            datas: resData,
            active: false
          })
          searchResult[0].active = true
        }
      }
      resolve()
    }).catch((err) => {
      console.log(err)
    })
  })

  await Promise.allSettled(promises)
  if (searchResult.length == 0) {
    Toast('没有搜索到相关内容')
  }
}
const doPlay = async () => {
  const pluginMap = usePluginStore().pluginModulesMap
  const movieStore = useMovieStore().movieStore
  const options = {} as IMovie.IMovieSource
  Object.assign(options, movieStore)

  const playData = await pluginMap[movieStore.pluginId].play(options)
  // if (playData.m3u8Content) {
  //   //将该内容作为本地链接的文件内容,文件类型设置为m3u8文件
  //   const url = window.URL.createObjectURL(new Blob([playData.m3u8Content]))
  //   movieStore.url = url
  // } else {
  //   movieStore.url = playData.url
  // }
  movieStore.playStatus = IConfig.IPlayStatus.Waiting
  movieStore.url = playData.url
  return playData
}

function filterSearchResult(resData: IMovie.IMovieBase[]) {
  return resData.filter((item) => {
    return (
      filter.title.every((title) => {
        return !item.title.includes(title)
      }) &&
      filter.tag.every((tag) => {
        return !item.tag?.includes(tag)
      })
    )
  })
}
export { doSearch, doPlay }
