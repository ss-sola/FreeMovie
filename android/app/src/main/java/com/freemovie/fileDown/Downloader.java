package com.freemovie.fileDown;


import com.getcapacitor.plugin.util.HttpRequestHandler;

import java.io.IOException;
import java.io.RandomAccessFile;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

/**
 * @author Lijh
 * @version 1.0
 * @description: TODO
 * @date 2024/9/20 10:20
 */
public class Downloader implements Runnable{
    private String id;
    protected String fileURL;
    protected List<FileFragment> childFiles;
    protected String saveFilePath;
    protected ExecutorService executor;
    protected static  int NUM_THREADS = Runtime.getRuntime().availableProcessors()/2;  // 线程数量
    protected volatile boolean pauseFlag = true; // 用于控制暂停
    protected volatile long totalSize = 0; // 文件总大小
    protected volatile long downloadedSize = 0; // 已下载的大小
    protected String type = "default"; // 类型
    // 设置下载速度，单位为字节/秒

    private List<DownloadTask> tasks;

    ProgressEmitter emitter;

    public synchronized void addDownloadSize(long size) {
        downloadedSize += size;
        if(emitter!=null){
            emitter.emit(downloadedSize, totalSize,"");
        }
    }
    public Downloader(DownloadState downloadState) {
        this.executor = Executors.newFixedThreadPool(NUM_THREADS);  // 创建线程池
        initState(downloadState);
    }
    public Downloader(String fileURL, String saveFilePath) {
        this(fileURL, saveFilePath, NUM_THREADS);
    }
    public Downloader(String fileURL, String saveFilePath,int numThreads) {
        id=fileURL;
        NUM_THREADS=numThreads;
        this.fileURL = fileURL;
        this.saveFilePath = saveFilePath;
        this.executor = Executors.newFixedThreadPool(NUM_THREADS);  // 创建线程池
        tasks = new ArrayList<>();
        childFiles = new ArrayList<>();
    }

    public void init() throws Exception {
        long contentLength = getFileSize(fileURL);
        FileFragment fileFragment = new FileFragment(fileURL, 0L, contentLength);
        childFiles.add(fileFragment);
        RandomAccessFile file = new RandomAccessFile(saveFilePath, "rw");
        // 设置文件的长度
        file.setLength(contentLength);
        this.totalSize = contentLength;
    }

    public final long getFileSize(String u) throws IOException {
        URL url = new URL(u);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        Map<String, List<String>> headerFields = connection.getHeaderFields();
        System.out.println(headerFields);
        // 获取文件总大小
        long contentLength = 0;
        //System.out.println(android.os.Build.VERSION.SDK_INT+"  "+android.os.Build.VERSION_CODES.N);
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.N) {
            contentLength = connection.getContentLengthLong();
        }else {
            throw new RuntimeException("安卓版本低");
        }
        System.out.println(contentLength);
        return contentLength;
    }

    public void download(){
        try{
            pauseFlag = false;
            List<Future<?>> futures = new ArrayList<>();
            if (tasks.size() > 0) {
                for (int i = 0; i < tasks.size(); i++) {
                    futures.add(executor.submit(tasks.get(i)));
                }
            } else {
                init();
                for (int i = 0; i < childFiles.size(); i++) {
                    FileFragment fileFragment = childFiles.get(i);
                    DownloadTask task = new DownloadTask(fileFragment, this, i);
                    tasks.add(task);
                    futures.add(executor.submit(task));
                }
            }
            // 等待所有线程完成任务
            for (Future<?> future : futures) {
                future.get();  // 阻塞直到任务完成
            }
        }catch (Exception e){
            emitter.emit(downloadedSize,totalSize,e.getMessage());
            e.printStackTrace();
        }finally {
            if(totalSize!=0) System.out.println("下载:"+fileURL+100*downloadedSize/totalSize+"%");
            if(!pauseFlag) executor.shutdown();  // 关闭线程池
            DownloadQueue.map.remove(fileURL);
        }


    }

    public DownloadState pause() {
        pauseFlag = true;
        return saveState();
    }

    // 恢复下载
    public void resume(DownloadState downloadState) throws Exception {
        initState(downloadState);
        if(downloadedSize<totalSize) download();
    }
    private DownloadState saveState() {
        DownloadState downloadState = new DownloadState();
        downloadState.setFileURL(fileURL);
        downloadState.setSaveFilePath(saveFilePath);
        downloadState.setDownloadedSize(downloadedSize);
        downloadState.setTotalSize(totalSize);
        downloadState.setType(type);
        List<FileFragment> fragmentList = downloadState.getChildFiles();
        for (int i = 0; i < tasks.size(); i++) {
            FileFragment fragment = tasks.get(i).getFileFragment();
            fragmentList.add(fragment);
        }
        return downloadState;
    }
    private void initState(DownloadState downloadState) {
        this.fileURL = downloadState.getFileURL();
        this.saveFilePath = downloadState.getSaveFilePath();
        this.downloadedSize = downloadState.getDownloadedSize();
        this.totalSize = downloadState.getTotalSize();
        this.type = downloadState.getType();
        tasks=new ArrayList<>();
        List<FileFragment> fragmentList = downloadState.getChildFiles();
        for (int i = 0; i < fragmentList.size(); i++) {
            FileFragment fileFragment = fragmentList.get(i);
            DownloadTask task = new DownloadTask(fileFragment, this, i);
            tasks.add(task);
        }

    }

    @Override
    public void run() {

        download();

    }

    @Override
    public String toString() {
        return "Downloader{}";
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFileURL() {
        return fileURL;
    }

    public void setFileURL(String fileURL) {
        this.fileURL = fileURL;
    }

    public boolean isPauseFlag() {
        return pauseFlag;
    }

    public void setPauseFlag(boolean pauseFlag) {
        this.pauseFlag = pauseFlag;
    }

    public List<FileFragment> getChildFiles() {
        return childFiles;
    }

    public void setChildFiles(List<FileFragment> childFiles) {
        this.childFiles = childFiles;
    }

    public String getSaveFilePath() {
        return saveFilePath;
    }

    public void setSaveFilePath(String saveFilePath) {
        this.saveFilePath = saveFilePath;
    }

    public static int getNumThreads() {
        return NUM_THREADS;
    }

    public static void setNumThreads(int numThreads) {
        NUM_THREADS = numThreads;
    }

    public long getTotalSize() {
        return totalSize;
    }

    public void setTotalSize(long totalSize) {
        this.totalSize = totalSize;
    }

    public long getDownloadedSize() {
        return downloadedSize;
    }

    public void setDownloadedSize(long downloadedSize) {
        this.downloadedSize = downloadedSize;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<DownloadTask> getTasks() {
        return tasks;
    }

    public void setTasks(List<DownloadTask> tasks) {
        this.tasks = tasks;
    }

    public ProgressEmitter getEmitter() {
        return emitter;
    }

    public void setEmitter(ProgressEmitter emitter) {
        this.emitter = emitter;
    }
}
