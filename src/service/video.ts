import { Filesystem, Directory } from '@capacitor/filesystem'
import { Capacitor } from '@capacitor/core';
import type { Folder, Video } from '@/types/download';
import { deleteBatchVideos, deleteBatchFolders } from '@/sqlite/folder'
async function getVideoObjectURL(path: string) {
    try {
        if (path.endsWith('mp4')) {
            const fileUri = await Filesystem.getUri({
                path: path,
                directory: IConfig.baseDirectory,
            });

            // 使用 Capacitor.convertFileSrc 转换为本地资源路径
            let videoSrc = Capacitor.convertFileSrc(fileUri.uri);
            return videoSrc
        }
        // 读取文件内容为 base64
        const fileData = await Filesystem.readFile({
            path: path,
            directory: IConfig.baseDirectory
        })
        // 将 Base64 转换为 Blob
        const blob = base64ToBlob(fileData.data as string, 'application/vnd.apple.mpegurl')

        // 创建 Object URL
        const objectURL = URL.createObjectURL(blob)


        return objectURL // 可用于 video.js 播放
    } catch (error) {
        console.error('读取文件失败:', error)
        throw new Error('读取文件失败')
    }
    // Base64 转 Blob 函数
    function base64ToBlob(base64: string, mimeType: string): Blob {
        const byteCharacters = atob(base64)
        const byteArrays = []

        for (let i = 0; i < byteCharacters.length; i += 512) {
            const slice = byteCharacters.slice(i, i + 512)
            const byteNumbers = new Array(slice.length)

            for (let j = 0; j < slice.length; j++) {
                byteNumbers[j] = slice.charCodeAt(j)
            }

            byteArrays.push(new Uint8Array(byteNumbers))
        }

        return new Blob(byteArrays, { type: mimeType })
    }
}

async function deleteVideos(videos: Video[]) {
    for (const video of videos) {
        //检查文件是否存在
        try {
            await Filesystem.deleteFile({
                path: video.path,
                directory: IConfig.baseDirectory
            })
        } catch (error) {
            console.log(error)
        }
        try {
            await Filesystem.rmdir({
                path: video.path + `/${getFileName(video.path)}`,
                directory: IConfig.baseDirectory,
                recursive: true, // 递归删除
            });
        } catch (error) {
            console.log(error)
        }

    }
    const ids = videos.map(item => item.id)
    await deleteBatchVideos(ids)
}

async function deleteFolders(folders: Folder[]) {
    for (const folder of folders) {
        try {
            await Filesystem.rmdir({
                path: folder.name,
                directory: IConfig.baseDirectory,
                recursive: true, // 递归删除
            });
        } catch (error) {

        }
    }
    const ids = folders.map(item => item.id)
    await deleteBatchFolders(ids)

}
function getFileName(path: string) {
    return path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'))
}
export {
    getVideoObjectURL,
    deleteVideos,
    deleteFolders
}