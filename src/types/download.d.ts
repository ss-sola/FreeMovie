export interface Video {
    id: number;
    title: string;
    img: string;             // 视频封面
    folderId: number;        // 视频所在文件夹id
    path: string;            // 视频保存路径
    url: string;              // 视频下载地址
    type: string;            // 视频类型
    movieHash: string;       // 视频hash,用于判断是否已经下载过
    fromName: string;        // 来源名称
    progress: number;        // 下载进度
    isDownloading?: boolean; // 是否正在下载
    isCompleted?: boolean;   // 是否下载完成
    data?: string            // 下载数据
}

export interface Folder {
    id: number;
    name: string;
    parentId: number | null;
    videos?: Video[];
}
