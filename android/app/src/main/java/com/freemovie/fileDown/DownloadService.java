package com.freemovie.fileDown;

import android.content.Context;
import android.util.Log;

import com.getcapacitor.Bridge;

/**
 * @author Lijh
 * @version 1.0
 * @description: TODO
 * @date 2024/9/27 9:42
 */
public class DownloadService {

    private Context context;

    private Bridge bridge;
    public DownloadService(Context context, Bridge bridge) {
        this.context=context;
        this.bridge=bridge;
    }

    public void download(int id,String url, String savePath) {
        Downloader downloader = getDownloader(id,url, savePath, "");
        downloader.download();

    }
    public void download(int id,String url, String savePath, String type) {
        Downloader downloader = getDownloader(id,url, savePath, type);
        downloader.download();

    }
    public void download(int id,String url, String savePath, String type,ProgressEmitter emitter) {
        Downloader downloader = getDownloader(id,url, savePath, type);
        downloader.setEmitter(emitter);
        downloader.download();

    }

    public DownloadState pause(int id) {
        Downloader task = DownloadManager.getDownloader(id);
        if (task == null) throw new RuntimeException("任务不存在");
        return task.pause();
    }

    public void resume(DownloadState downloadState,ProgressEmitter emitter) throws Exception {
        if(downloadState==null||downloadState.getId()==null){
            throw new RuntimeException("任务不存在");
        }
        Downloader downloader = getDownloader(downloadState.getId(),downloadState.getFileURL(), downloadState.getSaveFilePath(), downloadState.getType());
        downloader.setEmitter(emitter);
        downloader.resume(downloadState);
    }
    public DownloadState saveState(int id) {
        Downloader task = DownloadManager.getDownloader(id);
        if (task == null) throw new RuntimeException("任务不存在");
        return task.saveState();
    }

    private Downloader getDownloader(int id,String url, String savePath, String type) {
        Downloader downloader;
        switch (type) {
            case "video/mp4":
                downloader = new FileDownloader(id,url, savePath, type);
                break;
            case "application/x-mpegURL":
            case "application/vnd.apple.mpegurl":
                downloader = new M3U8Downloader(id,url, savePath, type);
                break;
            default:
                downloader = new Downloader(id,url, savePath);
        }
        downloader.setContext(context);
        downloader.setBridge(bridge);
        Log.d("context", context.toString());
        Log.d("bridge", bridge.toString());

        return downloader;
    }


}
