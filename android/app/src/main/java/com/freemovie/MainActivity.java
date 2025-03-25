package com.freemovie;

import android.os.Bundle;
import android.webkit.WebView;

import com.freemovie.fileDown.DownloadPlugin;
import com.freemovie.webview.WebViewPlugin;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(DownloadPlugin.class);
        registerPlugin(WebViewPlugin.class);

        super.onCreate(savedInstanceState);
        WebView webView = this.bridge.getWebView();
        webView.getSettings().setAllowFileAccess(true);
        webView.getSettings().setAllowFileAccessFromFileURLs(true);
        webView.getSettings().setAllowUniversalAccessFromFileURLs(true);
    }
}
