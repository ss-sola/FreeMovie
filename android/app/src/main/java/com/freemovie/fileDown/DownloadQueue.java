package com.freemovie.fileDown;

import java.util.Map;
import java.util.concurrent.*;

/**
 * @author Lijh
 * @version 1.0
 * @description: TODO
 * @date 2024/9/26 11:07
 */
public class DownloadQueue {
    public static   Map<String,Downloader> map=new ConcurrentHashMap<>();
    // 使用 ConcurrentLinkedQueue 作为线程安全的任务队列
    public static final  BlockingQueue<Runnable> taskQueue = new LinkedBlockingQueue<>();
    private  final static int MAX_TASKS = Runtime.getRuntime().availableProcessors()/2;

    // 创建一个固定大小的线程池来执行任务
    private static final  ExecutorService executorService = Executors.newFixedThreadPool(MAX_TASKS);

    public static  void startProcessing() {
        // 启动一个线程来处理队列中的任务
        for(int i=0;i<MAX_TASKS;i++){
            executorService.execute(() -> {
                while (true) {
                    Runnable task = null; // 从队列中取出一个任务
                    try {
                        task = taskQueue.take();
                    } catch (InterruptedException e) {
                        throw new RuntimeException(e);
                    }
                    if (task != null) {
                        task.run(); // 执行任务
                    }
                }
            });
        }

    }
    // 添加任务到队列
    public static void addTask(Downloader task) {
        map.put(task.getFileURL(),task);
        taskQueue.add(task);
    }
    public static void add(Runnable runnable){
        taskQueue.add(runnable);
    }
    public static  Downloader getTask(String url) {
        return map.get(url);
    }

    public static void shutdown() {
        try {
            executorService.shutdown();
            if (!executorService.awaitTermination(60, TimeUnit.SECONDS)) {
                executorService.shutdownNow();
            }
        } catch (InterruptedException e) {
            executorService.shutdownNow();
        }
    }
}
