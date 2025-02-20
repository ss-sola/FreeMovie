package com.freemovie.fileDown;

public interface ProgressEmitter {
    void emit(long bytes, long contentLength,String msg);
}
