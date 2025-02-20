package com.freemovie.fileDown;

import com.getcapacitor.JSObject;
import com.getcapacitor.Logger;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;


@CapacitorPlugin(name = "Downloader")
public class DownloadPlugin extends Plugin {

    private DownloadService downloadService;
    @Override
    public void load() {
        Logger.debug("executorService startProcessing");
        downloadService=new DownloadService();
        DownloadQueue.startProcessing();
        Logger.debug(getConfig().toString());

    }

    @PluginMethod()
    public void download(PluginCall call) {
        String url = call.getString("url");
        String savePath=call.getString("savePath");
        String type=call.getString("type");
        boolean progress= Boolean.TRUE.equals(call.getBoolean("progress"));

        if(DownloadQueue.getTask(url)!=null){
            call.reject("该下载任务已存在");
            return;
        }

        ProgressEmitter emitter = (bytes, contentLength,msg) -> {
            JSObject r = new JSObject();
            r.put("url", url);
            r.put("bytes", bytes);
            r.put("contentLength", contentLength);
            r.put("msg",msg);

            notifyListeners("progress", r);
        };

        if(progress){
            downloadService.download(url,savePath,type,emitter);
        }else{
            downloadService.download(url,savePath,type);
        }

        JSObject ret = new JSObject();

        call.resolve(ret);
    }

    @PluginMethod()
    public void pause(PluginCall call) {
        String url = call.getString("url");


        DownloadState downloadState = downloadService.pause(url);

        JSObject ret = new JSObject();
        ret.put("downloadState",downloadState);
        call.resolve(ret);
    }
    @PluginMethod()
    public void resume(PluginCall call) {
        JSObject jsObject = call.getObject("downloadState");
        System.out.println("jsobj>>"+jsObject);

        //DownloadState downloadState = downloadService.resume(url);

        JSObject ret = new JSObject();
        //ret.put("downloadState",downloadState);
        call.resolve(ret);
    }
}