import { registerPlugin, type Plugin } from '@capacitor/core';
import type { ProgressStatus } from '@capacitor/filesystem';
import { videoUrlMap } from '@/components/folder-list';
import { updateVideo } from '@/sqlite/folder'
import type { Video } from '@/types/download';

type downOption = {
  id: string | number,
  url: string,
  savePath: string,
  type?: string,
  progress?: boolean
}

export declare type ProgressListener = (progress: Progress) => void;

interface Progress extends ProgressStatus {
  id: string | number,
  msg: string,
  url: string,
  contentLength: number
}
export interface PluginListenerHandle {
  remove: () => Promise<void>;
}
export interface DownloadPlugin extends Plugin {
  download(options: downOption): Promise<void>;
  pause(options: { id: number }): Promise<{ downloadState: string }>;
  resume(options: { downloadState?: string }): Promise<void>;
  saveState(options: { id: number }): Promise<{ downloadState: string }>;
  addListener(eventName: 'progress', listenerFunc: ProgressListener): Promise<PluginListenerHandle>;

}

const Downloader = registerPlugin<DownloadPlugin>('Downloader');

let stateMap: { [key: string]: number } = {}

// 监听下载进度
Downloader.addListener('progress', (data) => {
  const video = videoUrlMap.value[data.id]

  if (!video) return
  stateMap[data.url] = stateMap[data.url] || 0

  const progress = data.bytes / data.contentLength

  if (data.bytes >= data.contentLength) {
    video.progress = 1
    video.isCompleted = true
    video.isDownloading = false
    updateVideo(video)
    delete stateMap[data.url]
    Toast('下载完成')
  } else if (progress - stateMap[data.url] >= 0.02) {
    video.progress = progress
    stateMap[data.url] = progress
  }
  if (progress - stateMap[data.url] >= 0.05) {
    saveState(video)
  }

})

async function saveState(video: Video) {
  const res = await Downloader.saveState({ id: video.id })
  if (!res.downloadState) return
  video.data = res.downloadState
  updateVideo(video)
}


export { Downloader, saveState };

