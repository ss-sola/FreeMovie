package com.freemovie.fileDown;

import java.io.*;

public class FileDownloader extends Downloader{

    public FileDownloader(int id,String fileURL, String saveFilePath,String type) {
        super(id,fileURL,saveFilePath);
        this.type=type;
    }

    @Override
    public void init() throws IOException {
        File parentFile = new File(saveFilePath).getParentFile();
        if(parentFile!=null&&!parentFile.exists()){
            parentFile.mkdirs();
        }
        // 获取文件总大小
        long contentLength = getFileSize(fileURL);
        // 划分每个线程下载的文件块大小
        long partSize = contentLength / DownloadManager.getMaxCore();
        for (int i = 0; i < DownloadManager.getMaxCore(); i++) {
            long startByte = i * partSize;
            long endByte = (i == DownloadManager.getMaxCore() - 1) ? contentLength : (startByte + partSize - 1);
            FileFragment fileFragment = new FileFragment(fileURL, startByte, endByte);
            childFiles.add(fileFragment);
        }
        System.out.println("init-fileDownloader");
        //创建同等大小的空文件
        RandomAccessFile file = new RandomAccessFile(saveFilePath, "rw");
        // 设置文件的长度
        file.setLength(contentLength);
        this.totalSize = contentLength;
    }

}
