import { ref, reactive, watch, onBeforeUnmount, computed, type Ref } from 'vue'
import type VideoJsPlayer from 'video.js/dist/types/player'
import videojs from 'video.js'
import { showControls, hideControls, switchVideoSource, playProcess, togglePlay } from './action';
import { useMovieStore } from '@/stores/movieStore'
import { doPlay } from '@/service/movie'
import { ScreenBrightness } from '@capacitor-community/screen-brightness';

let player: VideoJsPlayer;

const options = reactive({
    isPlaying: false,
    volume: 1,
    brightness: 1,
    progress: 0,
    showVolume: false,
    showBrightness: false,
    showProgress: false,
    showControls: false,
    isMuted: false,
    isFullScreen: false,
    isLocked: false,
    currentTime: 0,
    duration: 0,
    bufferedEnd: 0,
    showRightDrawer: false,
    controlsTimeout: -1,
    playbackRate: 1.0
})
const store = useMovieStore()
function initPlayer() {
    player = videojs('myVideo', {
        bigPlayButton: true,
        textTrackDisplay: false,
        posterImage: false,
        errorDisplay: false
    })

    initOptions()
    initListeners()
    initWatch()

    return player
}

function initOptions() {
    options.showRightDrawer = false
    options.showControls = false
    options.isPlaying = false
    options.isMuted = false
    options.isFullScreen = false
    options.isLocked = false
    options.currentTime = 0
    options.duration = 0
    options.bufferedEnd = 0
    options.playbackRate = 1.0
    // VolumeControl.getVolume((res => {
    //     options.volume = res
    // }));
}
function initListeners() {
    player.on('play', () => (options.isPlaying = true))
    player.on('pause', () => (options.isPlaying = false))
    player.one('playing', function () {
        store.movieStore.playStatus = IConfig.IPlayStatus.Playing + store.movieStore.title
        playProcess()
    });
    player.on('timeupdate', () => (options.currentTime = player?.currentTime() || 0))
    player.on('durationchange', () => (options.duration = player?.duration() || 0))
    player.on('playbackratechange', () => (options.playbackRate = player?.playbackRate() || 1.0))
    player.on('volumechange', () => {
        options.volume = player?.volume() || 0
        options.isMuted = player?.muted() || false
    })
    // 监听进度事件
    player.on('progress', function () {
        const buffered = player?.buffered()
        if (buffered && buffered.length > 0) {
            options.bufferedEnd = buffered.end(buffered.length - 1)
        }
    })
    // 控制栏显示/隐藏
    player.on('mousemove', showControls)
    player.on('touchstart', showControls)
    player.on('click', showControls)
    player.on('ended', hideControls)
    player.on('error', (e: any) => {
        console.error('播放器错误:', player.error(), e)
    })
    player.on('volumechange', () => {
        const volume = player.volume();
        console.log("volume")
    });

    player.on('brightnesschange', async () => {
        console.log("bright")
    });
    document.querySelector('.video-container')?.addEventListener('dblclick', togglePlay)
    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            options.isFullScreen = true
        } else {
            options.isFullScreen = false
        }
    });
}
function initWatch() {

    const movieStore = store.movieStore

    //线路变化
    watch(
        () => store.movieHashLine,
        (newValue, oldValue) => {

        }
    )
    //总集
    watch(
        () => store.movieHashTotal,
        (newValue, oldValue) => {
        }
    )
    //播放地址
    watch(
        () => store.movieHash,
        () => {
            doPlay().then(async (res) => {
                if (movieStore.url && res.url) {
                    let type = movieStore.type
                    switchVideoSource(movieStore.url, type)
                }
            })
        }
    )
}

export {
    options,
    player,
    initPlayer
}