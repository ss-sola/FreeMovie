import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import type { Folder, Video } from '@/types/download';
const platform = Capacitor.getPlatform();

const dbName = IConfig.Database, loadToVersion = 1
let encrypted = false, readOnly = false;


export const initializeDatabase = async () => {
    try {
        // const result = await CapacitorSQLite.run({
        //     database: dbName,
        //     statement: `DROP TABLE IF EXISTS Video;`,
        //     values: [],
        //   });
        //   console.log(result)
        // 创建 Folder 表
        await CapacitorSQLite.run({
            database: dbName,
            statement: `
            CREATE TABLE IF NOT EXISTS Folder (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                name TEXT NOT NULL,
                parentId INTEGER NOT NULL DEFAULT 0,
                createdAt TEXT DEFAULT CURRENT_TIMESTAMP
                
            );
          `,
            values: [],
        });
        console.log('Folder table created successfully.');

        // 创建 Video 表
        await CapacitorSQLite.run({
            database: dbName,
            statement: `
           CREATE TABLE IF NOT EXISTS Video (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                folderId INTEGER NOT NULL,
                title TEXT NOT NULL,
                thumbnail TEXT,
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

export const addFolder = async (name: string, parentId: number | null) => {
    try {
        parentId = parentId || 0
        await CapacitorSQLite.run({
            database: dbName,
            statement: `
          INSERT INTO Folder (name, parentId) 
          VALUES (?, ?);
        `,
            values: [name, parentId],
        });
        console.log(`Folder "${name}" added successfully.`);
    } catch (error) {
        console.error('Error adding folder:', error);
    }
};
export const addVideo = async (
    folderId: number,
    title: string,
    thumbnail: string
) => {
    try {
        await CapacitorSQLite.run({
            database: dbName,
            statement: `
          INSERT INTO Video (folderId, title, thumbnail) 
          VALUES (?, ?, ?);
        `,
            values: [folderId, title, thumbnail],
        });
        console.log(`Video "${title}" added successfully.`);
    } catch (error) {
        console.error('Error adding video:', error);
    }
};
export const getAllFolders = async (): Promise<Folder[]> => {
    try {
        const result = await CapacitorSQLite.query({
            database: dbName,
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
            database: dbName,
            statement: `SELECT * FROM Folder WHERE parentId = ?;`,
            values: [parentId],
        });
        return result.values || [];
    } catch (error) {
        console.error('Error fetching subfolders:', error);
        return [];
    }
};
export const getAllVideos = async (): Promise<Video[]> => {
    try {
        const result = await CapacitorSQLite.query({
            database: dbName,
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
            database: dbName,
            statement: `SELECT * FROM Video WHERE folderId = ?;`,
            values: [folderId],
        });
        return result.values || [];
    } catch (error) {
        console.error('Error fetching videos:', error);
        return [];
    }
};
