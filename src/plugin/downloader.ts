import { registerPlugin, type Plugin } from '@capacitor/core';
import type { ProgressStatus } from '@capacitor/filesystem';
type downOption = {
  url: string,
  savePath: string,
  type?: string,
  progress?: boolean
}
export declare type ProgressListener = (progress: Progress) => void;

interface Progress extends ProgressStatus {
  msg: string,
  [key: string]: any
}
export interface PluginListenerHandle {
  remove: () => Promise<void>;
}
export interface EchoPlugin extends Plugin {
  download(options: downOption): Promise<{ value: string }>;
  pause(options: downOption): Promise<{ value: string }>;
  resume(options: any): Promise<{ value: string }>;
  addListener(eventName: 'progress', listenerFunc: ProgressListener): Promise<PluginListenerHandle>;

}

const Downloader = registerPlugin<EchoPlugin>('Downloader');

export default Downloader;

