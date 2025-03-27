package com.freemovie.fileDown;

import android.Manifest;
import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.Logger;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.util.JSONUtils;
import com.google.gson.Gson;

import org.json.JSONObject;

import java.util.Random;


@CapacitorPlugin(
        name = "Downloader",
        permissions = {
                @Permission(
                        strings = { Manifest.permission.READ_EXTERNAL_STORAGE, Manifest.permission.WRITE_EXTERNAL_STORAGE },
                        alias = "publicStorage"
                )
        })
public class DownloadPlugin extends Plugin {
    private static final String TAG = "DownloadPlugin";
    private DownloadService downloadService;



    @Override
    public void load() {
        Logger.debug("executorService startProcessing");
        Log.d(TAG, "DownloadPlugin load");
        downloadService=new DownloadService(getContext(),getBridge());
        System.out.println(getContext().getCacheDir().getAbsolutePath());

    }

    @PluginMethod()
    public void download(PluginCall call) {
        String url = call.getString("url");
        String savePath=call.getString("savePath");
        String type=call.getString("type");
        int id=call.getInt("id", new Random().nextInt());
        boolean progress= Boolean.TRUE.equals(call.getBoolean("progress"));

        if(type==null|| type.isEmpty()){
            type="default";
        }
        if(DownloadManager.getDownloader(id)!=null){
            call.reject("该下载任务已存在");
            return;
        }
        JSObject ret = new JSObject();
        call.resolve(ret);
        ProgressEmitter emitter = (bytes, contentLength,msg) -> {
            JSObject r = new JSObject();
            r.put("id", id);
            r.put("url", url);
            r.put("bytes", bytes);
            r.put("contentLength", contentLength);
            r.put("msg",msg);
            notifyListeners("progress", r);
        };


        System.out.println("progress:"+progress);
        if(progress){
            downloadService.download(id,url,savePath,type,emitter);
        }else{
            downloadService.download(id,url,savePath,type);
        }
    }

    @PluginMethod()
    public void saveState(PluginCall call) {
        String url = call.getString("url");
        int id=call.getInt("id", new Random().nextInt());
        JSObject ret = new JSObject();
        ret.put("keys",DownloadManager.getMap());
        try{
            DownloadState downloadState = downloadService.saveState(id);
            Gson gson = new Gson();
            ret.put("downloadState",gson.toJson(downloadState));

        }catch (Exception e){
            e.printStackTrace();
            call.reject(e.getMessage());
        }



        call.resolve(ret);
    }
    @PluginMethod()
    public void pause(PluginCall call) {
        String url = call.getString("url");
        int id=call.getInt("id", new Random().nextInt());
        JSObject ret = new JSObject();
        try{
            Gson gson = new Gson();
            DownloadState downloadState = downloadService.pause(id);
            ret.put("downloadState",gson.toJson(downloadState));
        }catch (Exception e){
            e.printStackTrace();
            call.reject(e.getMessage());
        }
        call.resolve(ret);
    }
    @PluginMethod()
    public void resume(PluginCall call) throws Exception {
        String jsonStr = call.getString("downloadState");
        JSObject ret = new JSObject();
        try{
            Gson gson = new Gson();
            DownloadState downloadState=gson.fromJson(jsonStr,DownloadState.class);

            downloadService.resume(downloadState,buildEmitter(downloadState));
        }catch (Exception e){
            e.printStackTrace();
            call.reject(e.getMessage());
        }

        call.resolve(ret);
    }

    private ProgressEmitter buildEmitter(DownloadState downloadState){
        return (bytes, contentLength, msg) -> {
            JSObject r = new JSObject();
            r.put("id", downloadState.getId());
            r.put("url", downloadState.getFileURL());
            r.put("bytes", bytes);
            r.put("contentLength", contentLength);
            r.put("msg",msg);
            notifyListeners("progress", r);
        };
    }

}