package com.freemovie;

import android.os.Bundle;

import com.freemovie.fileDown.DownloadPlugin;
import com.freemovie.webview.WebViewPlugin;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(DownloadPlugin.class);
        registerPlugin(WebViewPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
