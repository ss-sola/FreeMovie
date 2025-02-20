package com.freemovie.fileDown;


import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;


public class DownloadState {
    String fileURL;
    String saveFilePath;
    String type;
    private long downloadedSize;
    private long totalSize;
    List<FileFragment> childFiles = new ArrayList<>();

    public String getFileURL() {
        return fileURL;
    }

    public void setFileURL(String fileURL) {
        this.fileURL = fileURL;
    }

    public String getSaveFilePath() {
        return saveFilePath;
    }

    public void setSaveFilePath(String saveFilePath) {
        this.saveFilePath = saveFilePath;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public long getDownloadedSize() {
        return downloadedSize;
    }

    public void setDownloadedSize(long downloadedSize) {
        this.downloadedSize = downloadedSize;
    }

    public long getTotalSize() {
        return totalSize;
    }

    public void setTotalSize(long totalSize) {
        this.totalSize = totalSize;
    }

    public List<FileFragment> getChildFiles() {
        return childFiles;
    }

    public void setChildFiles(List<FileFragment> childFiles) {
        this.childFiles = childFiles;
    }

    @Override
    public String toString() {

        return "";
    }
}