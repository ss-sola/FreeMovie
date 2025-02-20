import { useMovieStore } from '@/stores/movieStore'
import { useArtplayerStore } from '@/stores/artplayerStore'
import { useHistoryStore } from '@/stores/historyStore'
import { doPlay } from '@/service/movie'
import Artplayer from 'artplayer'
import { watch } from 'vue'
import { CapacitorHttp } from '@capacitor/core'

const playProcess = async () => {
  console.log('playProcess')
  const movieStore = useMovieStore().movieStore
  const history = useHistoryStore()
  movieStore.playStatus = IConfig.IPlayStatus.Playing + movieStore.title
  const objOption = {} as IMovie.IMovieSource
  Object.assign(objOption, movieStore)

  history.playHistory.unshift(objOption)
  console.log('history.playHistory', history.playHistory)
  //只取15个
  history.sliceHistory()

  localStorage.setItem('solamovie-history', JSON.stringify(history.playHistory))
}

const mp4Types = ['vieo/mp4']
const m3u8Types = ['application/octet-stream', 'text/html']
const getVideoType = async (url: string) => {
  try {
    const res = await CapacitorHttp.request({
      url: url,
      method: 'HEAD'
    })
    const contentType = res.headers['Content-Type']
    console.log(contentType)
    if (!contentType) return ''
    for (const type of mp4Types) {
      if (contentType.includes(type)) return 'mp4'
    }
    for (const type of m3u8Types) {
      if (contentType.includes(type)) return 'm3u8'
    }
  } catch (error) { }

  return ''
}
const initWatch = (artplayer: Artplayer) => {
  const store = useMovieStore()
  const movieStore = store.movieStore
  const artplayerStore = useArtplayerStore()
  watch(
    () => store.movieHashLine,
    (newValue, oldValue) => {
      if (newValue && artplayer) {
        artplayer.controls.update({
          name: 'subtitle',
          html: movieStore.activeLine || '线路',
          selector: artplayerStore.lineSelector
        })
        const lineDoms = artplayer.controls.subtitle.children[1].children

        for (let i = 0; i < lineDoms.length; i++) {
          const dom = lineDoms[i]
          if (dom.textContent == movieStore.activeLine) {
            dom.classList.add('checked')
            dom.scrollIntoView({ behavior: 'smooth', block: 'end' })
            artplayerStore.lastCheckedLineDom = dom
          }
        }
      }
    }
  )
  watch(
    () => store.movieHashTotal,
    (newValue, oldValue) => {
      if (newValue && artplayer) {
        artplayer.controls.update({
          name: 'aggregate',
          html: movieStore.activeNumber || '选集',
          selector: artplayerStore.totalSelector
        })

        const totalDoms = artplayer.controls.aggregate.children[1].children

        for (let i = 0; i < totalDoms.length; i++) {
          const dom = totalDoms[i]
          if (dom.textContent == movieStore.activeNumber) {
            dom.classList.add('checked')
            dom.scrollIntoView({ behavior: 'smooth', block: 'end' })
            artplayerStore.lastCheckedDom = dom
          }
        }
      }
    }
  )
  watch(
    () => store.movieHash,
    (newValue, oldValue) => {
      if (newValue && artplayer) {
        doPlay().then(async (res) => {
          if (movieStore.url) {
            let type = movieStore.type
            if (!type) {
              type = await getVideoType(movieStore.url)
            }
            artplayer.type = type
            artplayer.switchUrl(movieStore.url)
          }
        })
      }
    }
  )
}
export { playProcess, initWatch }
