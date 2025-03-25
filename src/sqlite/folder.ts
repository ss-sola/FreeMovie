import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import type { Folder, Video } from '@/types/download';
const platform = Capacitor.getPlatform();


export const initFolder = async () => {
    try {
        // const result = await CapacitorSQLite.run({
        //     database: IConfig.Database,
        //     statement: `DROP TABLE IF EXISTS Video;`,
        //     values: [],
        // });
        // await CapacitorSQLite.run({
        //     database: IConfig.Database,
        //     statement: `DROP TABLE IF EXISTS Folder;`,
        //     values: [],
        // });
        // console.log(result)
        // 创建 Folder 表
        await CapacitorSQLite.run({
            database: IConfig.Database,
            statement: `
            CREATE TABLE IF NOT EXISTS Folder (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                name TEXT NOT NULL,
                parentId INTEGER NOT NULL DEFAULT 0,
                createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (name, parentId) 
                
            );
          `,
            values: [],
        });
        console.log('Folder table created successfully.');

        // 创建 Video 表
        await CapacitorSQLite.run({
            database: IConfig.Database,
            statement: `
           CREATE TABLE IF NOT EXISTS Video (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                folderId INTEGER NOT NULL,
                title TEXT NOT NULL,
                img TEXT,
                path TEXT,
                url TEXT,
                movieHash TEXT,
                fromName TEXT,
                progress INTEGER DEFAULT 0,
                isDownloading BOOLEAN DEFAULT 0,
                isCompleted BOOLEAN DEFAULT 0,
                createdAt TEXT DEFAULT CURRENT_TIMESTAMP
            
            );
          `,
            values: [],
        });
        console.log('Video table created successfully.');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

export const addFolder = async (name: string, parentId?: number) => {
    try {
        parentId = parentId || 0
        await CapacitorSQLite.run({
            database: IConfig.Database,
            statement: `
          INSERT OR IGNORE INTO Folder (name, parentId) 
          VALUES (?, ?);
        `,
            values: [name, parentId],
        });
        const queryResult = await CapacitorSQLite.query({
            database: IConfig.Database,
            statement: `SELECT id FROM Folder WHERE name = ? AND parentId = ?`,
            values: [name, parentId],
        });
        if (!queryResult.values || queryResult.values.length === 0) {
            throw new Error('Folder not found');
        }
        // 获取 `id`
        const folderId = queryResult.values[0].id;

        console.log('Folder ID:', folderId);
        return folderId;
    } catch (error) {
        console.error('Error adding folder:', error);
    }
};
export const addVideo = async (
    video: Video
) => {
    try {
        const res = await CapacitorSQLite.run({
            database: IConfig.Database,
            statement: `
          INSERT INTO Video (folderId, title, img, path, movieHash, fromName,url) 
          VALUES (?, ?, ?, ?, ?, ?,?);
        `,
            values: [video.folderId, video.title, video.img, video.path, video.movieHash, video.fromName, video.url],
        });
        return res.changes
    } catch (error) {
        console.error('Error adding video:', error);
    }
};
export const getAllFolders = async (): Promise<Folder[]> => {
    try {
        const result = await CapacitorSQLite.query({
            database: IConfig.Database,
            statement: `SELECT * FROM Folder ;`,
            values: [],
        });
        return result.values || [];
    } catch (error) {
        console.error('Error fetching subfolders:', error);
        return [];
    }
};
export const getSubFolders = async (parentId: number | null): Promise<Folder[]> => {
    try {
        parentId = parentId || 0
        const result = await CapacitorSQLite.query({
            database: IConfig.Database,
            statement: `SELECT * FROM Folder WHERE parentId = ?;`,
            values: [parentId],
        });
        console.log("getSubFolders", result.values)
        return result.values || [];
    } catch (error) {
        console.error('Error fetching subfolders:', error);
        return [];
    }
};
export const getAllVideos = async (): Promise<Video[]> => {
    try {
        const result = await CapacitorSQLite.query({
            database: IConfig.Database,
            statement: `SELECT * FROM Video;`,
            values: [],
        });
        return result.values || [];
    } catch (error) {
        console.error('Error fetching videos:', error);
        return [];
    }
};
export const getVideosByFolder = async (folderId: number): Promise<Video[]> => {
    try {
        const result = await CapacitorSQLite.query({
            database: IConfig.Database,
            statement: `SELECT * FROM Video WHERE folderId = ?;`,
            values: [folderId],
        });
        return result.values || [];
    } catch (error) {
        console.error('Error fetching videos:', error);
        return [];
    }
};

export const updateVideo = async (video: Video): Promise<number> => {
    try {
        const res = await CapacitorSQLite.run({
            database: IConfig.Database,
            statement: `
            UPDATE Video SET progress=?,isDownloading=?,isCompleted=? WHERE id = ?;
            `,
            values: [video.progress, video.isDownloading, video.isCompleted, video.id],
        });
        return res.changes?.changes || 0;
    }
    catch (error) {
        console.error('Error updating video:', error);
        return 0;
    }
}