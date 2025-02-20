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
        try {
            System.out.println("Part " + partNumber + " started from " + fileFragment.getStartByte() + " to " + fileFragment.getEndByte());
            if(fileFragment.getStartByte()!=null&& fileFragment.getEndByte()!=null){
                if(fileFragment.getEndByte()-fileFragment.getStartByte()<=0) {
                    System.out.println("Part " + partNumber + " already downloaded");
                    return;
                }
                System.out.println("---------"+partNumber);
            }
            URL url = new URL(fileFragment.getFileURL());
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();

            // 设置 Range 头来指定下载的文件范围
            if (fileFragment.getStartByte() != null && fileFragment.getEndByte() != null) {
                connection.setRequestProperty("Range", "bytes=" + fileFragment.getStartByte() + "-" + fileFragment.getEndByte());
            }
            String savePath= fileFragment.getSaveFilePath();
            if(savePath==null){
                savePath=fileDownloader.getSaveFilePath();
            }

            try (InputStream inputStream = connection.getInputStream();
                 RandomAccessFile partFile = new RandomAccessFile(savePath, "rw")) {
                partFile.seek(fileFragment.getStartByte());

                byte[] buffer = new byte[1024];
                int bytesRead;
                long downloadedBytes = 0;
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    if (fileDownloader.isPauseFlag()) {
                        System.out.println("Download paused...");
                        break;
                    }
                    partFile.write(buffer, 0, bytesRead);
                    downloadedBytes += bytesRead;
                    fileDownloader.addDownloadSize(bytesRead);
                    //System.out.println("hasDownload"+partNumber+">>"+100*fileDownloader.downloadedSize/fileDownloader.totalSize+"%");
                }
                System.out.println("Part " + partNumber +" "+String.valueOf(fileFragment.getEndByte()-fileFragment.getStartByte()) );
                fileFragment.setStartByte(fileFragment.getStartByte() + downloadedBytes);
                System.out.println("Part " + partNumber + " Alldownloaded: " + downloadedBytes + " bytes");

            }
            connection.disconnect();
        } catch (IOException e) {
            e.printStackTrace();
        }
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