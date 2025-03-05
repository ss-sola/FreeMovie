import { ScreenOrientation } from '@capacitor/screen-orientation'
import { player, options } from './index'
import { useMovieStore } from '@/stores/movieStore'
import { useHistoryStore } from '@/stores/historyStore'
import { CapacitorHttp } from '@capacitor/core'
import { isValidURL } from '@/utils/static'
// 通过请求获取视频的 Content-Type
async function getVideoMimeType(url: string): Promise<string | null> {
    if (!isValidURL(url)) {
        const movieStore = useMovieStore().movieStore
        movieStore.playStatus = IConfig.IPlayStatus.ErrorGet
        return null
    }
    if (url.endsWith('.mp4')) return 'video/mp4'
    if (url.endsWith('.m3u8')) return 'application/x-mpegURL'
    try {
        const res = await CapacitorHttp.request({
            url: url,
            method: 'HEAD',
            headers: {
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
        })
        return res.headers['Content-Type'];
    } catch (error) {
        let r;
        let type
        try {
            r = await fetch(url, { method: 'HEAD' })
            type = r.headers.get('Content-Type');
        } catch (error) { }
        if (type?.includes('m3u8')) {
            return 'application/x-mpegURL'
        }

        if (type != 'vieo/mp4') {
            type = 'application/x-mpegURL'
        }
        return type
    }
}


// 定义切换视频源的方法
export async function switchVideoSource(videoUrl: string, type: string | null = null) {
    type = type || await getVideoMimeType(videoUrl);

    if (!type) {
        console.warn('无法确定视频类型，或不支持该类型');
        return;
    }
    console.log(type)
    // 停止当前播放
    player.pause();

    // 设置新的视频源
    player.src({ type: type, src: videoUrl });

    // 重新播放
    player.play();
}
export function togglePlay() {
    options.isPlaying ? player.pause() : player.play()
}
export function isShowControls() {
    return options.showControls && !options.showRightDrawer && !options.isLocked
}

// 控制栏显示/隐藏逻辑
export function showControls() {
    setTimeout(() => {
        options.showControls = true
        clearTimeout(options.controlsTimeout)
        options.controlsTimeout = window.setTimeout(() => {
            options.showControls = false
        }, 3000)
    }, 100)

}

export function hideControls() {
    options.showControls = false
}

export const playProcess = async () => {
    const movieStore = useMovieStore().movieStore
    const history = useHistoryStore()
    movieStore.playStatus = IConfig.IPlayStatus.Playing + movieStore.title
    const objOption = {} as IMovie.IMovieSource
    Object.assign(objOption, movieStore)

    history.playHistory.unshift(objOption)
    //只取15个
    history.sliceHistory()

    localStorage.setItem('solamovie-history', JSON.stringify(history.playHistory))
}
export function pause() {
    player.pause()
}

export function toggleFullScreen() {
    const div = document.querySelector('.video-container')

    if (div) {
        if (!document.fullscreenElement) {
            div.requestFullscreen() // 标准浏览器
            ScreenOrientation.lock({ orientation: 'landscape' })
            hideNavigationBar()
        } else {
            document.exitFullscreen() // 标准浏览器
            ScreenOrientation.lock({ orientation: 'portrait' })
            showNavigationBar()
        }
    }
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
}

export function secondsToTime(seconds: number | undefined) {
    if (!seconds) return '00:00'
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = Math.floor(seconds % 60)

    const paddedHours = hours.toString().padStart(2, '0')
    const paddedMinutes = minutes.toString().padStart(2, '0')
    const paddedSeconds = remainingSeconds.toString().padStart(2, '0')
    if (hours == 0) {
        return `${paddedMinutes}:${paddedSeconds}`
    }
    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`
}