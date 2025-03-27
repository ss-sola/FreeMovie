package com.freemovie.fileDown;

import static com.getcapacitor.Bridge.CAPACITOR_FILE_START;

import android.os.Build;
import android.util.Log;


//import com.arthenica.mobileffmpeg.Config;
//import com.arthenica.mobileffmpeg.FFmpeg;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.ArrayList;
import java.util.List;


public class M3U8Downloader extends Downloader {
    private String savePath;
    public M3U8Downloader(int id,String m3u8Url, String saveDir,String type) {
        super(id,m3u8Url, saveDir);
        this.type=type;
        savePath=new File(saveFilePath).getParent();
    }
    @Override
    public void init() throws IOException {
        List<String> urlList = parseM3U8(fileURL);
        String fileName=getFileName(saveFilePath);
        String tsSavePath=savePath+"/"+fileName+"/";
        File directory = new File(tsSavePath);
        if(!directory.exists()) directory.mkdirs();
        for (int i = 0; i < urlList.size(); i++) {
            String url=urlList.get(i);
            FileFragment fileFragment = new FileFragment(url, tsSavePath+getFullFileName(url));
            childFiles.add(fileFragment);
        }
        totalSize=urlList.size();
    }

    private String getFileName(String path){
        return path.substring(path.lastIndexOf("/")+1,path.lastIndexOf("."));
    }
    private String getFullFileName(String path){
        int end=path.length();
        if(path.contains("?")){
            end=path.indexOf("?");
        }
        return path.substring(path.lastIndexOf("/")+1,end);
    }
    @Override
    public void doDownload(FileFragment fileFragment) {
        if(isPauseFlag()) return;
        String savePath = fileFragment.getSaveFilePath();
        new File(savePath).delete();
        String u = fileFragment.getFileURL();
        HttpURLConnection httpConn = null;
        try {
            URL url = new URL(u);
            httpConn = (HttpURLConnection) url.openConnection();
            httpConn.setRequestMethod("GET");

            int responseCode = httpConn.getResponseCode();
            if (responseCode != HttpURLConnection.HTTP_OK) {
                System.out.println("No file to download. Server returned HTTP response code: " + responseCode);
                System.out.println("url: " + u);
                return;
            }
            try(
                    InputStream inputStream = httpConn.getInputStream();
                    FileOutputStream outputStream = new FileOutputStream(savePath);
                ){
                byte[] buffer = new byte[4096];
                int bytesRead;
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    outputStream.write(buffer, 0, bytesRead);
                }
                addDownloadSize(1);
            }
            fileFragment.setComplete(true);

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            assert httpConn != null;
            httpConn.disconnect();
        }

    }

    @Override
    public void afterDownload() {
        try{
//            List<String> collect = childFiles.stream().map(FileFragment::getSaveFilePath).collect(Collectors.toList());
//            mergeTsFiles(collect,saveFilePath);
            System.out.println(saveFilePath);

        }catch (Exception ignored){
            emitter.emit(downloadedSize,totalSize,"文件合并失败");
        }

    }

//    private void mergeTsFiles(List<String> tsFilePaths, String outputFilePath) {
//        try {
//            File file = new File(outputFilePath);
//            file.delete();
//
//            // 1. 创建合并列表文件
//            File listFile = new File(outputFilePath + "_list.txt");
//            try (FileWriter writer = new FileWriter(listFile)) {
//                for (String tsPath : tsFilePaths) {
//                    writer.write("file '" + tsPath + "'\n");
//                }
//                writer.flush();
//            }
//
//            // 2. 执行 FFmpeg 合并 TS
////            String command = "-f concat -safe 0 -i " + listFile.getAbsolutePath() + " -c copy " + outputFilePath;
////            System.out.println("执行的命令: " + command);
////
////            FFmpegSession session = FFmpegKit.executeAsync(command,call -> {
////                if (ReturnCode.isSuccess(call.getReturnCode())) {
////                    System.out.println("合并成功: " + outputFilePath);
////                } else {
////                    System.err.println("合并失败: " + call.getFailStackTrace());
////                }
////                listFile.delete();
////                try {
////                    deleteFolder(cachePath);
////                } catch (IOException e) {
////                    e.printStackTrace();
////                }
////            },log->{
////                System.out.println("FFmpeg 日志: " + log.getMessage());
////            },e->{});
//
//            // 2. 构建 FFmpeg 合并命令
//            String command = "-f concat -safe 0 -i " + listFile.getAbsolutePath() + " -c copy " + saveFilePath;
//            Log.d("TsMerger", "执行命令: " + command);
//
//            // 3. 执行 FFmpeg 命令
//            int rc = FFmpeg.execute(command);
//
//            if (rc == Config.RETURN_CODE_SUCCESS) {
//                Log.d("TsMerger", "TS 文件合并成功: " + saveFilePath);
//                listFile.delete();
//                try {
//                    deleteFolder(cachePath);
//                } catch (IOException e) {
//                    e.printStackTrace();
//                }
//            } else {
//                Log.e("TsMerger", "TS 文件合并失败: " + rc);
//                String output = Config.getLastCommandOutput();
//                Log.e("TsMerger", "FFmpeg 输出: " + output);
//            }
//
//
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//    }

    // 解析 M3U8 文件并获取所有 TS 文件的 URL
    public  List<String> parseM3U8(String m3u8Url) throws IOException {
        List<String> tsUrls = new ArrayList<>();
        URL url = new URL(m3u8Url);

        BufferedReader reader = new BufferedReader(new InputStreamReader(url.openStream()));
        File file = new File(saveFilePath);
        if(!file.getParentFile().exists()) file.getParentFile().mkdirs();
        if(!file.exists()){
            file.createNewFile();
        }
        String fileName=getFileName(saveFilePath);
        BufferedWriter writer = new BufferedWriter(new FileWriter(saveFilePath));
        String line;
        List<String> m3u8List=new ArrayList<>();
        while ((line = reader.readLine()) != null) {

            if(line.startsWith("#")){
                writer.write(line);
                writer.newLine(); // 保持原始换行符
                continue;
            }
            line=resolveUrl(m3u8Url,line);
            if(line.endsWith("m3u8")){
                m3u8List.add(line);
            }else{
                tsUrls.add(line);
            }
            writer.write(bridge.getAppUrl()+CAPACITOR_FILE_START+savePath+"/"+fileName+"/"+getFullFileName(line));
            writer.newLine(); // 保持原始换行符
        }
        reader.close();
        writer.close();
        if(!m3u8List.isEmpty()){
            return parseM3U8(m3u8List.get(m3u8List.size()-1));
        }
        return tsUrls;
    }

    public static String resolveUrl(String baseUrl, String tsPath) {
        try {
            // 如果是完整的 URL，直接返回
            if (tsPath.startsWith("http")) {
                return tsPath;
            }

            URL base = new URL(baseUrl);

            // 处理绝对路径（以 / 开头）
            if (tsPath.startsWith("/")) {
                return base.getProtocol() + "://" + base.getHost() + tsPath;
            }

            // 处理相对路径（../ 和 ./）
            return new URL(base, tsPath).toString();
        } catch (MalformedURLException e) {
            e.printStackTrace();
            return "";
        }
    }

}
