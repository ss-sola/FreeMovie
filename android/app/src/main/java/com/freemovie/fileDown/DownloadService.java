package com.freemovie.fileDown;

import com.getcapacitor.plugin.util.HttpRequestHandler;

/**
 * @author Lijh
 * @version 1.0
 * @description: TODO
 * @date 2024/9/27 9:42
 */
public class DownloadService {



    public void download(String url, String savePath) {
        Downloader downloader = getDownloader(url, savePath, "");
        DownloadQueue.addTask(downloader);

    }
    public void download(String url, String savePath, String type) {
        Downloader downloader = getDownloader(url, savePath, type);
        DownloadQueue.addTask(downloader);

    }
    public void download(String url, String savePath, String type,ProgressEmitter emitter) {
        Downloader downloader = getDownloader(url, savePath, type);
        downloader.setEmitter(emitter);
        DownloadQueue.addTask(downloader);

    }

    public DownloadState pause(String url) {
        Downloader task = DownloadQueue.getTask(url);
        if (task == null) throw new RuntimeException("任务不存在");
        return task.pause();
    }

    public void resume(DownloadState downloadState) throws Exception {
        Downloader downloader = getDownloader(downloadState.getFileURL(), downloadState.getSaveFilePath(), downloadState.getType());
        downloader.resume(downloadState);
    }

    private Downloader getDownloader(String url, String savePath, String type) {
        Downloader downloader;
        switch (type) {
            case "file":
                downloader = new FileDownloader(url, savePath, type);
                break;
            case "m3u8":
                downloader = new M3U8Downloader(url, savePath, type);
                break;
            default:
                downloader = new Downloader(url, savePath);
        }

        return downloader;
    }

    public void addTask(Runnable runnable){
        DownloadQueue.add(runnable);
    }
}
