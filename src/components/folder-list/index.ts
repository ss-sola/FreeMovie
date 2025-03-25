import { ref, reactive, watch, onBeforeUnmount, computed, type Ref } from 'vue'
import type { Video } from '@/types/download'
import { addVideo, getVideosByFolder, getAllVideos, getAllFolders } from '@/sqlite/folder'
const videos = reactive([] as Video[])

const videoUrlMap = computed<Record<string, Video>>(() => {
    return videos.reduce((prev, cur) => {
        prev[cur.id] = cur
        return prev
    }, {} as Record<string, Video>)
});
async function initVideos(folderId: number) {
    // TODO: 获取文件夹下的视频列表
    const res = await getVideosByFolder(folderId)
    console.log("getVideos", res)
    videos.splice(0, videos.length, ...res)
    console.log("getVideos", videoUrlMap)
}
console.log(videoUrlMap, videoUrlMap.value)
export {
    videos,
    videoUrlMap,
    initVideos
}