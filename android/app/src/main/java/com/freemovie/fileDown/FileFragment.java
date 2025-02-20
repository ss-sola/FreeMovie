package com.freemovie.fileDown;



class FileFragment {
    String fileURL;
    Long totalByte;
    Long startByte;
    Long endByte;
    //如果片段文件不作为单独文件可不设置
    String saveFilePath;

    public FileFragment(String fileURL, Long startByte, Long endByte) {
        this.fileURL = fileURL;
        this.startByte = startByte;
        this.endByte = endByte;
        if (startByte != null && endByte != null) {
            this.totalByte = endByte - startByte;
        }
    }

    public FileFragment(String fileURL, Long startByte) {
        this.fileURL = fileURL;
        this.startByte = startByte;
    }

    public String getFileURL() {
        return fileURL;
    }

    public void setFileURL(String fileURL) {
        this.fileURL = fileURL;
    }

    public Long getTotalByte() {
        return totalByte;
    }

    public void setTotalByte(Long totalByte) {
        this.totalByte = totalByte;
    }

    public Long getStartByte() {
        return startByte;
    }

    public void setStartByte(Long startByte) {
        this.startByte = startByte;
    }

    public Long getEndByte() {
        return endByte;
    }

    public void setEndByte(Long endByte) {
        this.endByte = endByte;
    }

    public String getSaveFilePath() {
        return saveFilePath;
    }

    public void setSaveFilePath(String saveFilePath) {
        this.saveFilePath = saveFilePath;
    }

    @Override
    public String toString() {
        return "FileFragment{" +
                "fileURL='" + fileURL + '\'' +
                ", totalByte=" + totalByte +
                ", startByte=" + startByte +
                ", endByte=" + endByte +
                ", saveFilePath='" + saveFilePath + '\'' +
                '}';
    }
}