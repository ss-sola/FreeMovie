import Artplayer from 'artplayer'
import Hls from 'hls.js'
import { StatusBar, Style } from '@capacitor/status-bar'
import { ScreenOrientation } from '@capacitor/screen-orientation'
import { useMovieStore } from '@/stores/movieStore'
import { useArtplayerStore } from '@/stores/artplayerStore'
import { initWatch, playProcess } from '@/components/player/action'
import { watch } from 'vue'

let artplayer: Artplayer | undefined

const store = useMovieStore()
const movieStore = store.movieStore
const artplayerStore = useArtplayerStore()
const init = function (container: HTMLDivElement) {
  if (Artplayer.instances.length > 0) {
    Artplayer.instances[0].destroy()
  }
  artplayer = new Artplayer({
    //poster:'/poster/2.png',
    url: movieStore.url || '',
    container: container,
    setting: true,
    autoplay: true,
    //muted :true,
    //autoMini: true,
    playbackRate: true,
    aspectRatio: true,
    fullscreen: true, //全屏
    //fullscreenWeb: true,//网页全屏
    fastForward: true, //长按快进
    autoOrientation: true,
    //type: 'm3u8',
    customType: {
      m3u8: function (video, url, art) {
        console.log('m3u8>>' + url)
        if (Hls.isSupported()) {
          if (art.hls) art.hls.destroy()
          const hls = new Hls()
          hls.loadSource(url)
          hls.attachMedia(video)
          art.hls = hls
          art.on('destroy', () => hls.destroy())
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = url
        } else {
          art.notice.show = 'Unsupported playback format: m3u8'
        }
      }
    },
    controls: [
      {
        //选集按钮
        name: 'aggregate',
        position: 'right',
        index: 25,
        style: {
          color: '#ffffff'
        },
        html: '选集',
        selector: artplayerStore.totalSelector,
        onSelect: function (item: IMovie.ITotalItem, $dom) {
          movieStore.activeNumber = item.html
          if (artplayerStore.lastCheckedDom) {
            artplayerStore.lastCheckedDom.classList.remove('checked')
            $dom.classList.add('checked')
            $dom.scrollIntoView({ behavior: 'smooth', block: 'end' })
            artplayerStore.lastCheckedDom = $dom
          }
          return item.html
        }
      },
      {
        name: 'subtitle',
        position: 'right',
        html: '线路',
        selector: artplayerStore.lineSelector,
        onSelect: function (item: IMovie.ILineItemValue, $dom) {
          movieStore.activeLine = item.html
          if (artplayerStore.lastCheckedLineDom) {
            artplayerStore.lastCheckedLineDom.classList.remove('checked')
            $dom.classList.add('checked')
            $dom.scrollIntoView({ behavior: 'smooth', block: 'end' })
            artplayerStore.lastCheckedLineDom = $dom
          }
          return item.html
        }
      }
    ]
  })
  artplayer.on('ready', playProcess)
  artplayer.on('restart', playProcess)
  artplayer.on('fullscreen', (state) => {
    if (state) {
      ScreenOrientation.lock({ orientation: 'landscape' })
      StatusBar.hide()
    } else {
      ScreenOrientation.lock({ orientation: 'portrait' })
    }
  })

  artplayer.on('error', (error, reconnectTime) => {
    movieStore.playStatus = IConfig.IPlayStatus.ErrorPlay
  })

  initWatch(artplayer)
  return artplayer
}

export { init, artplayer }