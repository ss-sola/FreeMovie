import { usePluginStore } from '@/stores/pluginStroe'
import { useMovieStore } from '@/stores/movieStore'
import { Filesystem, Directory } from '@capacitor/filesystem';
import { getVideoMimeType, isValidURL, proxyImg } from '@/utils/static'
import { getUrl } from './movie'
import { addFolder, addVideo } from '@/sqlite/folder'
import { Downloader } from '@/plugin/downloader'
import type { Video } from '@/types/download';
import { pushVideos } from '@/components/folder-list/action';


const typeMap: Record<string, string> = {
    'video/mp4': '.mp4',
    'video/webm': '.webm',
    'application/x-mpegURL': '.m3u8',
    'application/vnd.apple.mpegurl': '.m3u8'
}


async function download(activeLine: string, activeNumber: string) {
    const states = await Filesystem.checkPermissions()
    console.log(states)
    const pluginMap = usePluginStore().pluginModulesMap
    const movieStore = useMovieStore().movieStore
    const plugin = pluginMap[movieStore.pluginId]

    const options = {} as IMovie.IMovieSource
    Object.assign(options, movieStore)
    options.activeLine = activeLine
    options.activeNumber = activeNumber
    formatOptions(options)
    const folderName = options.title

    if (options.img.startsWith("http")) {
        options.img = await proxyImg(options.img)
    }

    const fileName = resolveFileName(options)

    const playData = await resolvePlayData(options, plugin)

    const path = getPath(folderName, options, playData)
    const filePath = resolveFilePath(path)

    const folderId = await addFolder(folderName)
    const videoObj = {
        folderId: folderId,
        title: fileName,
        img: options.img,
        path: path,
        url: playData.url,
        type: playData.type,
        movieHash: getMovieHash(options),
        fromName: options.platform,
        progress: 0,
        isDownloading: true,
        isCompleted: false

    } as Video
    const res = await addVideo(videoObj)
    videoObj.id = res?.lastId as number
    pushVideos(videoObj)

    Downloader.download(
        {
            id: videoObj.id,
            url: decodeURIComponent(playData.url || ""),
            savePath: filePath.replaceAll(" ", ""),
            type: playData.type,
            progress: true
        }
    )
    console.log("开始下载", {
        url: decodeURIComponent(playData.url || ""),
        savePath: filePath.replaceAll(" ", ""),
        type: playData.type,
        progress: true
    })
    Toast("开始下载")
}
function getMovieHash(options: IMovie.IMovieSource) {
    return `${options.platform}_${options.id}_${options.activeLine}_${options.activeNumber}`
}

async function resolvePlayData(options: IMovie.IMovieSource, plugin: IPlugin.IPluginModule) {
    let url = getUrl(options, plugin.from)
    const playData = await plugin.play(url, options)
    if (!playData.url) {
        throw new Error('解析播放地址失败')
    }
    if (!playData.type) {
        playData.type = await getVideoMimeType(playData.url);
    }
    return playData
}

function resolveFileName(options: IMovie.IMovieSource) {
    return `${options.title}_${options.activeNumber}_${options.activeLine}`

}
function formatOptions(options: IMovie.IMovieSource) {
    options.title = options.title.replaceAll(" ", "").replaceAll("\n", "").replaceAll("\t", "")
}

function resolveFilePath(path: string) {
    return `${IConfig.basePath}/${path}`
}


function getPath(folderName: string, options: IMovie.IMovieSource, playData: IPlugin.IMoiveSourceResult) {
    playData.type = playData.type || 'video/mp4'
    folderName = folderName.replaceAll(" ", "")
    console.log(playData)
    return `${folderName}/${resolveFileName(options)}${typeMap[playData.type]}`
}


export {
    download
}