export interface Video {
    id: number;
    title: string;
    thumbnail: string;
    folderId: number;
    progress: number;
    isDownloading?: boolean; // 是否正在下载
    isCompleted?: boolean; // 是否下载完成
    data?: string // 下载数据
}

export interface Folder {
    id: number;
    name: string;
    parentId: number | null;
    videos?: Video[];
}
