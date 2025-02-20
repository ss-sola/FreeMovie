import { usePluginStore } from '@/stores/pluginStroe'
import { useSearchStore } from '@/stores/searchStore'
import { putPluginIdToBase } from '@/service/plugin'
import { useMovieStore } from '@/stores/movieStore'
import { analysis } from '@/plugin/webView'
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
  const store = useMovieStore()
  const movieStore = store.movieStore
  movieStore.playStatus = IConfig.IPlayStatus.Getting
  const options = {} as IMovie.IMovieSource
  Object.assign(options, movieStore)
  let playData = {} as IPlugin.IMoiveSourceResult

  let url = getUrl(options)


  try {
    let movieHash = store.movieHash
    const plugin = pluginMap[movieStore.pluginId]
    const promises = [analysisPlatData(plugin.from + url)]
    if (plugin && plugin.play) {
      // @ts-ignore
      promises.push(plugin.play(url, options))
    }
    playData = await Promise.any(promises)

    if (store.movieHash != movieHash) {
      console.log("取消播放", movieHash, store.movieHash)
      return playData
    }
    if (!playData.url) {
      throw new Error('获取播放地址失败')
    }
  } catch (error) {
    console.error(error)
    movieStore.playStatus = IConfig.IPlayStatus.ErrorPlay
    return playData
  }


  console.log('playData', playData)

  movieStore.playStatus = IConfig.IPlayStatus.Waiting
  movieStore.url = playData.url
  return playData

  function getUrl(options: IMovie.IMovieSource) {
    let url = ''
    try {
      const lineItem = options.line as IMovie.ILineItem
      const activeLine = options.activeLine as string
      const total = lineItem[activeLine].total
      for (let i = 0; i < total.length; i++) {
        if (total[i].html == options.activeNumber) {
          url = total[i].href
          break;
        }
      }
    } catch (e) { }
    return url
  }
  async function analysisPlatData(url: string) {
    return new Promise<IPlugin.IMoiveSourceResult>(async (resolve, reject) => {
      const res = await analysis({ url: url })
      if (!res.videoUrl) reject()
      const data = {
        url: res.videoUrl
      } as IPlugin.IMoiveSourceResult
      resolve(data)
    })
  }
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
