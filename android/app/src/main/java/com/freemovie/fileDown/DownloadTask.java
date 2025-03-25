package com.freemovie.fileDown;


import java.io.IOException;
import java.io.InputStream;
import java.io.RandomAccessFile;
import java.net.HttpURLConnection;
import java.net.URL;

// 下载任务类

class DownloadTask implements Runnable {
    private FileFragment fileFragment;
    private Downloader fileDownloader;
    private int partNumber;

    public DownloadTask(FileFragment fileFragment, Downloader fileDownloader, int partNumber) {
        this.fileFragment = fileFragment;
        this.fileDownloader = fileDownloader;
        this.partNumber = partNumber;
    }

    @Override
    public void run() {
        fileDownloader.doDownload(fileFragment);
    }

    @Override
    public String toString() {
        return "";
    }

    public FileFragment getFileFragment() {
        return fileFragment;
    }

    public void setFileFragment(FileFragment fileFragment) {
        this.fileFragment = fileFragment;
    }

    public Downloader getFileDownloader() {
        return fileDownloader;
    }

    public void setFileDownloader(Downloader fileDownloader) {
        this.fileDownloader = fileDownloader;
    }

    public int getPartNumber() {
        return partNumber;
    }

    public void setPartNumber(int partNumber) {
        this.partNumber = partNumber;
    }
}