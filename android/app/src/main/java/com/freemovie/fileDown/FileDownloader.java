package com.freemovie.fileDown;

import java.io.*;

public class FileDownloader extends Downloader{

    public FileDownloader(String fileURL, String saveFilePath,String type) {
        super(fileURL,saveFilePath);
        this.type=type;
    }

    @Override
    public void init() throws IOException {
        // 获取文件总大小
        long contentLength = getFileSize(fileURL);
        // 划分每个线程下载的文件块大小
        long partSize = contentLength / NUM_THREADS;
        for (int i = 0; i < NUM_THREADS; i++) {
            long startByte = i * partSize;
            long endByte = (i == NUM_THREADS - 1) ? contentLength : (startByte + partSize - 1);
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
