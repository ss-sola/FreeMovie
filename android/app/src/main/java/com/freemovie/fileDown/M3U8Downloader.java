package com.freemovie.fileDown;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import java.util.regex.*;

public class M3U8Downloader extends Downloader {
    public M3U8Downloader(String m3u8Url, String saveDir,String type) {
        super(m3u8Url, saveDir);
        this.type=type;
    }

    @Override
    public void init() throws IOException {
        List<String> urlList = parseM3U8(fileURL);
        long contentLength = 0;
        for (String url : urlList) {
            long size = getFileSize(url);
            System.out.println(url + " 文件大小为：" + size);
            FileFragment fileFragment;
            if(contentLength==0){
                fileFragment = new FileFragment(url, contentLength);
            }else{
                fileFragment = new FileFragment(url, contentLength+1);
            }
            childFiles.add(fileFragment);
            contentLength += size;
        }
        try (RandomAccessFile file = new RandomAccessFile(saveFilePath, "rw")) {
            // 设置文件的长度
            file.setLength(contentLength);
        }
        this.totalSize=contentLength;
    }



    // 解析 M3U8 文件并获取所有 TS 文件的 URL
    private List<String> parseM3U8(String m3u8Url) throws IOException {
        List<String> tsUrls = new ArrayList<>();
//        URL url = new URL(m3u8Url);
//        BufferedReader reader = new BufferedReader(new InputStreamReader(url.openStream()));
//        String line;
//        while ((line = reader.readLine()) != null) {
//            if (line.endsWith(".ts")) {
//                tsUrls.add(line);
//            }
//        }
//        reader.close();
        tsUrls.add("https://test-streams.mux.dev/x36xhzz/url_0/url_462/193039199_mp4_h264_aac_hd_7.ts");
        tsUrls.add("https://test-streams.mux.dev/x36xhzz/url_0/url_462/193039199_mp4_h264_aac_hd_7.ts");
        return tsUrls;
    }



}
