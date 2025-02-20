package com.freemovie.webview;

import android.app.Activity;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "WebViewPlugin")
public class WebViewPlugin extends Plugin {
    WebViewHelper webViewHelper;

    @Override
    public void load() {
        Activity activity = getActivity();
        webViewHelper = new WebViewHelper(activity);
    }

    @PluginMethod()
    public void analysis(PluginCall call) {
        String url = call.getString("url");
        if(url==null) call.reject("无url");
        // 处理 URL 队列
        webViewHelper.addUrlToQueue(url,(videoUrl, pageUrl) -> {
            // 否则返回视频地址
            JSObject ret = new JSObject();
            ret.put("videoUrl", videoUrl);
            ret.put("pageUrl", pageUrl);
            notifyListeners("onVideoFound",ret);
            call.resolve(ret);

        });
    }
}
