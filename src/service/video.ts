import { Filesystem, Directory } from '@capacitor/filesystem'
import { Capacitor } from '@capacitor/core';
async function getVideoObjectURL(path: string) {
    try {
        if (path.endsWith('mp4')) {
            const fileUri = await Filesystem.getUri({
                path: path,
                directory: Directory.Documents,
            });

            // 使用 Capacitor.convertFileSrc 转换为本地资源路径
            let videoSrc = Capacitor.convertFileSrc(fileUri.uri);
            return videoSrc
        }
        // 读取文件内容为 base64
        const fileData = await Filesystem.readFile({
            path: path,
            directory: Directory.Documents
        })
        // 将 Base64 转换为 Blob
        const blob = base64ToBlob(fileData.data as string, 'application/vnd.apple.mpegurl')

        // 创建 Object URL
        const objectURL = URL.createObjectURL(blob)

        console.log('m3u8 文件 URL:', objectURL)

        return objectURL // 可用于 video.js 播放
    } catch (error) {
        console.error('读取文件失败:', error)
        return ''
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

export {
    getVideoObjectURL
}