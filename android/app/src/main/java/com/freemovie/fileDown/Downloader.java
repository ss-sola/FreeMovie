package com.freemovie.fileDown;


import android.content.Context;
import android.os.Build;

import com.getcapacitor.Bridge;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.RandomAccessFile;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

/**
 * @author Lijh
 * @version 1.0
 * @description: TODO
 * @date 2024/9/20 10:20
 */
public class Downloader{
    private int id;
    protected String fileURL;
    protected List<FileFragment> childFiles;
    protected String saveFilePath;

    protected volatile boolean pauseFlag = true; // 用于控制暂停
    protected volatile long totalSize = 1; // 文件总大小
    protected volatile long downloadedSize = 0; // 已下载的大小
    protected String type = "default"; // 类型

    private List<DownloadTask> tasks;

    ProgressEmitter emitter;

    Context context;
    Bridge bridge;

    private int errorNum=0;

    public synchronized void addDownloadSize(long size) {
        downloadedSize += size;
        if(emitter!=null){
            emitter.emit(downloadedSize, totalSize,"");
        }
        System.out.println(downloadedSize+"   "+totalSize);
    }
    public Downloader(DownloadState downloadState) {
        initState(downloadState);
    }
    public Downloader(int id,String fileURL, String saveFilePath) {
        this.id=id;
        this.fileURL = fileURL;
        this.saveFilePath = saveFilePath;
        tasks = new ArrayList<>();
        childFiles = new ArrayList<>();
        DownloadManager.addDownloader(this);
    }

    public void init() throws Exception {
        File parentFile = new File(saveFilePath).getParentFile();
        if(parentFile!=null&&!parentFile.exists()){
            parentFile.mkdirs();
        }
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
        // 获取文件总大小
        long contentLength = 0;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            contentLength = connection.getContentLengthLong();
        }

        connection.disconnect();
        return contentLength;
    }

    public void download(){
        try{
            pauseFlag = false;
            List<CompletableFuture<Void>> futures = new ArrayList<>();
            if (!tasks.isEmpty()) {
                for (DownloadTask task : tasks) {
                    futures.add(CompletableFuture.runAsync(() -> {
                        try {
                            DownloadManager.submit(task).get();
                        } catch (Exception e) {
                            throw new RuntimeException(e);
                        }
                    }));
                }
            } else {
                init();
                for (int i = 0; i < childFiles.size(); i++) {
                    FileFragment fileFragment = childFiles.get(i);
                    DownloadTask task = new DownloadTask(fileFragment, this, i);
                    tasks.add(task);
                    futures.add(CompletableFuture.runAsync(() -> {
                        try {
                            DownloadManager.submit(task).get();
                        } catch (Exception e) {
                            throw new RuntimeException(e);
                        }
                    }));
                }
            }
            // 等待所有线程完成任务
            // 所有任务完成后执行回调
            CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]))
                    .thenRunAsync(() -> {
                        if(pauseFlag) return;
                        if(downloadedSize<totalSize&&errorNum==0){
                            errorNum++;
                            download();
                        }else{
                            DownloadManager.removeDownloader(id);
                            this.afterDownload();
                        }
                    });


        }catch (Exception e){
            emitter.emit(downloadedSize,totalSize,e.getMessage());
            e.printStackTrace();
        }finally {
            if(totalSize!=0){
                System.out.println("下载:"+downloadedSize*100/totalSize+"%");
            }
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
    public DownloadState saveState() {
        DownloadState downloadState = new DownloadState();
        downloadState.setId(id);
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
        this.id=downloadState.getId();
        this.fileURL = downloadState.getFileURL();
        this.saveFilePath = downloadState.getSaveFilePath();
        this.downloadedSize = downloadState.getDownloadedSize();
        this.totalSize = downloadState.getTotalSize();
        this.type = downloadState.getType();
        tasks=new ArrayList<>();
        List<FileFragment> fragmentList = downloadState.getChildFiles();
        for (int i = 0; i < fragmentList.size(); i++) {
            FileFragment fileFragment = fragmentList.get(i);
            if(fileFragment.isComplete()) continue;
            DownloadTask task = new DownloadTask(fileFragment, this, i);
            tasks.add(task);
        }

    }

    public void doDownload(FileFragment fileFragment){
        try {
            if(fileFragment.getStartByte()!=null&& fileFragment.getEndByte()!=null){
                if(fileFragment.getEndByte()-fileFragment.getStartByte()<=0) {
                    return;
                }
            }
            URL url = new URL(fileFragment.getFileURL());
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();

            // 设置 Range 头来指定下载的文件范围
            if (fileFragment.getStartByte() != null && fileFragment.getEndByte() != null&&!type.equals("default")) {
                connection.setRequestProperty("Range", "bytes=" + fileFragment.getStartByte() + "-" + fileFragment.getEndByte());
            }
            String savePath= fileFragment.getSaveFilePath();
            if(savePath==null){
                savePath=saveFilePath;
            }

            try (InputStream inputStream = connection.getInputStream();
                 RandomAccessFile partFile = new RandomAccessFile(savePath, "rw")) {
                partFile.seek(fileFragment.getStartByte());

                byte[] buffer = new byte[1024];
                int bytesRead;
                long downloadedBytes = 0;
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    if (isPauseFlag()) {
                        System.out.println("Download paused...");
                        break;
                    }
                    partFile.write(buffer, 0, bytesRead);
                    downloadedBytes += bytesRead;
                    addDownloadSize(bytesRead);
                    //System.out.println("hasDownload"+partNumber+">>"+100*fileDownloader.downloadedSize/fileDownloader.totalSize+"%");
                }
                //System.out.println("Part " + partNumber +" "+String.valueOf(fileFragment.getEndByte()-fileFragment.getStartByte()) );
                fileFragment.setStartByte(fileFragment.getStartByte() + downloadedBytes);
                //System.out.println("Part " + partNumber + " Alldownloaded: " + downloadedBytes + " bytes");

            }
            connection.disconnect();
            fileFragment.setComplete(true);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void afterDownload() {

    }

    @Override
    public String toString() {
        return "Downloader{" +
                "id=" + id +
                ", fileURL='" + fileURL + '\'' +
                ", childFiles=" + childFiles +
                ", saveFilePath='" + saveFilePath + '\'' +
                ", pauseFlag=" + pauseFlag +
                ", totalSize=" + totalSize +
                ", downloadedSize=" + downloadedSize +
                ", type='" + type + '\'' +
                ", tasks=" + tasks +
                ", errorNum=" + errorNum +
                '}';
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getErrorNum() {
        return errorNum;
    }

    public void setErrorNum(int errorNum) {
        this.errorNum = errorNum;
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

    public Context getContext() {
        return context;
    }

    public void setContext(Context context) {
        this.context = context;
    }

    public Bridge getBridge() {
        return bridge;
    }

    public void setBridge(Bridge bridge) {
        this.bridge = bridge;
    }
}
