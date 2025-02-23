import { useMovieStore } from '@/stores/movieStore'
import { usePluginStore } from '@/stores/pluginStroe'
import { useArtplayerStore } from '@/stores/artplayerStore'
import { useSearchStore } from '@/stores/searchStore'
import { doSearch } from '@/service/movie'
import GRouter from '@/router/routes'
const play = async function (item: IMovie.IMovieBase) {
  const pluginModulesMap = usePluginStore().pluginModulesMap
  //搜索
  const searchContent = useSearchStore().searchContent
  searchContent.content = item.title
  if (!location.pathname.includes('/play')) {
    doSearch()
  }

  const store = useMovieStore()
  const movieStore = store.movieStore
  store.clearMovieStore()
  //路由跳转
  await GRouter.toPlay()
  const parm = {} as IMovie.IMovieBase
  Object.assign(parm, item)
  let resItem: IMovie.IMovieBase = {} as IMovie.IMovieBase
  //获取线路信息
  try {
    resItem = await pluginModulesMap[item.pluginId].getDetailData(parm)
  } catch (error) {
    Toast('获取线路失败')
  }


  if (resItem.line) {
    Object.assign(movieStore, resItem, item)
    const firstKey = Object.keys(resItem.line)[0]
    movieStore.activeLine = resItem.line[firstKey].html
    movieStore.activeNumber = resItem.line[firstKey].total[0].html
    movieStore.playStatus = IConfig.IPlayStatus.Getting
  } else {
    console.log('没有线路')
  }
  console.log('resItem', resItem)
}

export { play }
