package com.freemovie.fileDown;

import android.os.Environment;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class DownloadManager {
    private static final int NUM_THREADS = Runtime.getRuntime().availableProcessors()*2;  //线程数量
    private static ExecutorService executor= Executors.newFixedThreadPool(NUM_THREADS);
    private static Map<Integer,Downloader> map=new ConcurrentHashMap<>();
    private static final String cachePath= Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOCUMENTS).getAbsolutePath()+"/cache/";

    public static Future<?> submit(Runnable task) {
        return executor.submit(task);
    }

    public static void addDownloader(Downloader downloader){
        map.put(downloader.getId(),downloader);
    }
    public static Set<Integer> getMap(){
        return map.keySet();
    }
    public static Downloader getDownloader(Integer id){
        return map.get(id);
    }
    public static void removeDownloader(Integer id){
        map.remove(id);
    }
    public static int getMaxCore(){
        return NUM_THREADS;
    }
    public static String getCachePath(){
        return cachePath;
    }
}
