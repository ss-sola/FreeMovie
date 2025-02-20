import Artplayer from 'artplayer'
import Hls from 'hls.js'
import { StatusBar, Style } from '@capacitor/status-bar'
import { ScreenOrientation } from '@capacitor/screen-orientation'
import { useMovieStore } from '@/stores/movieStore'
import { useArtplayerStore } from '@/stores/artplayerStore'
import { initWatch, playProcess } from '@/components/player/artplayer/action'
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
      hideNavigationBar()
    } else {
      ScreenOrientation.lock({ orientation: 'portrait' })
      showNavigationBar()
    }
  })

  artplayer.on('error', (error, reconnectTime) => {
    movieStore.playStatus = IConfig.IPlayStatus.ErrorPlay
  })
  // 监听 Artplayer 控制栏显示/隐藏状态
  artplayer.on('control', (isControlsVisible) => {
    //全屏模式下控制栏隐藏时隐藏状态栏
    if (!isControlsVisible && artplayer?.fullscreen) {
      hideNavigationBar()
    }
  })

  initWatch(artplayer)
  return artplayer
}
// 定义隐藏和显示导航栏的函数

function hideNavigationBar() {
  if (window.AndroidFullScreen) {
    window.AndroidFullScreen.immersiveMode()
  }
}

function showNavigationBar() {
  if (window.AndroidFullScreen) {
    window.AndroidFullScreen.showSystemUI()
  }
}
export { init, artplayer }
