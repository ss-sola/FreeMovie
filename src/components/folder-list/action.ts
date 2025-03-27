import { videos } from "./index"
import { updateVideo } from '@/sqlite/folder'
import type { Video } from '@/types/download'
import { saveState, Downloader } from '@/plugin/downloader'
import { switchVideoSource } from '@/components/player/solaplayer/action'
import { getVideoObjectURL } from '@/service/video'
import GRouter from '@/router/routes'

function pushVideos(video: Video) {
    videos.push(video)
}

function removeVideos(id: number) {
    const index = videos.findIndex((video) => video.id === id)
    if (index > -1) {
        videos.splice(index, 1)
    }
}
// 切换下载状态
const toggleDownload = async (videoId: number) => {
    const video = videos.find((v) => v.id === videoId)
    if (!video) return

    if (video.isCompleted) {
        console.log('已下载完成')
        nativeToPlay(video)
        return
    } else if (video.isDownloading) {
        video.data = (await Downloader.pause({ id: video.id })).downloadState
        video.isDownloading = false
        updateVideo(video)
        Toast("暂停下载")
    } else {
        await Downloader.resume({ downloadState: video.data })
        video.isDownloading = true
        Toast("开始下载")
    }
    saveState(video)
}

async function nativeToPlay(video: Video) {
    const url = await getVideoObjectURL(video.path)
    await GRouter.toPlay()
    switchVideoSource(url, video.type)

}
export {
    pushVideos,
    nativeToPlay,
    removeVideos,
    toggleDownload
}