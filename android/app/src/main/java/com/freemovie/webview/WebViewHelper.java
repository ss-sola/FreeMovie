package com.freemovie.webview;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.graphics.Bitmap;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Arrays;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class WebViewHelper {
    private static final String TAG = "WebViewHelper";
    private static String defaultUrl = "about:blank";
    private WebView webView;
    private final Queue<UrlCallback> urlQueue = new LinkedList<>();
    private final Handler mainHandler = new Handler(Looper.getMainLooper());
    private boolean isVideoFound = false;  // 是否已经找到视频
    private String currentPageUrl = null;  // 当前页面 URL
    private Runnable timeoutRunnable;  // 超时任务
    private static final int TIMEOUT = 30000;  // 超时时间 30秒

    Set<String> videoContentTypes = new HashSet<>(Arrays.asList(
            "video/mp4",
            "video/webm",
            "video/ogg",
            "video/x-msvideo", // AVI
            "video/quicktime", // MOV
            "video/mpeg",
            "video/3gpp",
            "video/x-flv", // FLV
            "video/x-matroska", // MKV
            "video/x-ms-wmv", // WMV
            "application/vnd.apple.mpegurl", // HLS (M3U8)
            "video/MP2T", // HLS 分段 (TS)
            "application/dash+xml", // DASH (MPD)
            "text/vtt", // WebVTT 字幕
            "application/x-subrip", // SRT 字幕
            "application/x-mpegURL" // 旧版 HLS 播放列表
    ));
    @SuppressLint("SetJavaScriptEnabled")
    public WebViewHelper(Activity activity) {
        webView = new WebView(activity);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setDomStorageEnabled(true);
        webView.getSettings().setCacheMode(WebSettings.LOAD_NO_CACHE); // 禁用缓存

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                currentPageUrl = url;
                if(defaultUrl.equals(currentPageUrl)) return;
                isVideoFound = false;
                Log.d(TAG, "开始: " + url);
                // 启动超时任务
                if (timeoutRunnable != null) {
                    mainHandler.removeCallbacks(timeoutRunnable);
                }
                timeoutRunnable = new Runnable() {
                    @Override
                    public void run() {
                        Log.d(TAG, "视频未找到，超时跳过此URL: " + url);
                        if(!urlQueue.isEmpty()){
                            UrlCallback urlCallback = urlQueue.poll();
                            urlCallback.callback.onVideoFound(null, currentPageUrl);
                        }
                        loadNextUrl();
                    }
                };
                mainHandler.postDelayed(timeoutRunnable, TIMEOUT);
            }

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                if (isVideoFound) {
                    return super.shouldInterceptRequest(view, request);
                }

                String videoUrl = request.getUrl().toString();
                String pageUrl = currentPageUrl;

//                Log.d(TAG, "请求URL: " + videoUrl + " 来源: " + pageUrl);

                String contentType = getContentType(videoUrl);
                Log.d(TAG, "Content-Type: " + contentType+"  videoUrl:"+videoUrl);

                if (contentType != null && videoContentTypes.contains(contentType)) {
                    isVideoFound = true;  // 标记已找到
                    mainHandler.removeCallbacks(timeoutRunnable);  // 移除超时任务

                    // 触发回调
                    mainHandler.post(() -> {
                        if(!urlQueue.isEmpty()){
                            UrlCallback urlCallback = urlQueue.poll();
                            urlCallback.callback.onVideoFound(videoUrl, pageUrl);
                        }

                        loadNextUrl();  // 加载下一个 URL
                    });


                }

                return super.shouldInterceptRequest(view, request);
            }
        });
    }

    public void addUrlToQueue(String url,VideoCallback cb) {
        mainHandler.post(()->{
            clearUrlCallback();
            urlQueue.add(new UrlCallback(url,cb));
            if (urlQueue.size() == 1) {
                loadNextUrl();  // 开始加载第一个 URL
            }
        });

    }

    private void loadNextUrl() {
        Log.d(TAG, "loadNextUrl");
        mainHandler.post(()->{
            if (!urlQueue.isEmpty()) {
                String nextUrl = urlQueue.peek().url;
                Log.d(TAG, "loadNextUrl:"+nextUrl);
                webView.loadUrl(nextUrl);
            }else if(!defaultUrl.equals(currentPageUrl)){
                //webView.goBack();
                webView.loadUrl(defaultUrl);

            }
        });

    }

    private String getContentType(String url) {
        try {
            HttpURLConnection connection = (HttpURLConnection) new URL(url).openConnection();
            connection.setRequestMethod("HEAD");
            connection.setConnectTimeout(5000);
            connection.setReadTimeout(5000);
            connection.setRequestProperty("User-Agent", "Mozilla/5.0");
            connection.connect();

            Map<String, List<String>> headers = connection.getHeaderFields();
            if (headers.containsKey("Content-Type")) {
                return headers.get("Content-Type").get(0);
            }
        } catch (IOException e) {
            Log.e(TAG, "获取 Content-Type 失败: " + e.getMessage());
        }
        return null;
    }

    public interface VideoCallback {
        void onVideoFound(String videoUrl, String pageUrl);
    }

    class UrlCallback{
        String url;
        VideoCallback callback;

        public UrlCallback(String url, VideoCallback callback) {
            this.url = url;
            this.callback = callback;
        }
    }

    private void clearUrlCallback(){
        while (!urlQueue.isEmpty()){
            UrlCallback urlCallback = urlQueue.poll();
            urlCallback.callback.onVideoFound(null, urlCallback.url);
        }
    }
}
