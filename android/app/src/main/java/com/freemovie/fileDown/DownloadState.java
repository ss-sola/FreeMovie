package com.freemovie.fileDown;


import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;


public class DownloadState {
    Integer id;
    String fileURL;
    String saveFilePath;
    String type;
    private long downloadedSize;
    private long totalSize;
    List<FileFragment> childFiles = new ArrayList<>();

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

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
        return "DownloadState{" +
                "id=" + id +
                ", fileURL='" + fileURL + '\'' +
                ", saveFilePath='" + saveFilePath + '\'' +
                ", type='" + type + '\'' +
                ", downloadedSize=" + downloadedSize +
                ", totalSize=" + totalSize +
                ", childFiles=" + childFiles +
                '}';
    }
}