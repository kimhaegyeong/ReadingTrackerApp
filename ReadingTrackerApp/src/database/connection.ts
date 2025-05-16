import * as SQLite from 'expo-sqlite';
import { SQLiteTransaction } from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

const DATABASE_NAME = 'reading_tracker.db';
const DATABASE_ASSET = require('../../assets/database/reading_tracker.db');

const getDatabasePath = async () => {
  const dbFolder = `${FileSystem.documentDirectory}SQLite`;
  const dbPath = `${dbFolder}/${DATABASE_NAME}`;

  // SQLite 폴더가 없으면 생성
  const folderInfo = await FileSystem.getInfoAsync(dbFolder);
  if (!folderInfo.exists) {
    await FileSystem.makeDirectoryAsync(dbFolder, { intermediates: true });
  }

  return dbPath;
};

const copyDatabaseFromAssets = async () => {
  const dbPath = await getDatabasePath();
  const dbInfo = await FileSystem.getInfoAsync(dbPath);

  if (!dbInfo.exists) {
    // assets에서 데이터베이스 파일 로드
    const asset = Asset.fromModule(DATABASE_ASSET);
    await asset.downloadAsync();

    if (asset.localUri) {
      // 데이터베이스 파일 복사
      await FileSystem.copyAsync({
        from: asset.localUri,
        to: dbPath
      });
      console.log('Database copied from assets');
    }
  }
};

export const getDBConnection = async () => {
  try {
    await copyDatabaseFromAssets();
  } catch (error) {
    console.log('Failed to copy database from assets, initializing new database');
    await initDatabase();
  }
  
  return SQLite.openDatabaseAsync(DATABASE_NAME);
};

export const initDatabase = async () => {
  const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  
  // books 테이블 생성
  await new Promise<void>((resolve, reject) => {
    db.transaction((tx: SQLiteTransaction) => {
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS books (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          author TEXT,
          isbn TEXT,
          cover_image TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `, [], () => resolve(), (_, error: Error) => {
        reject(error);
        return false;
      });
    });
  });

  // reading_sessions 테이블 생성
  await new Promise<void>((resolve, reject) => {
    db.transaction((tx: SQLiteTransaction) => {
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS reading_sessions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          book_id INTEGER,
          start_time DATETIME NOT NULL,
          end_time DATETIME,
          pages_read INTEGER,
          notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (book_id) REFERENCES books (id)
        );
      `, [], () => resolve(), (_, error: Error) => {
        reject(error);
        return false;
      });
    });
  });

  // reading_goals 테이블 생성
  await new Promise<void>((resolve, reject) => {
    db.transaction((tx: SQLiteTransaction) => {
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS reading_goals (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          yearly_books INTEGER NOT NULL,
          monthly_books INTEGER NOT NULL,
          yearly_pages INTEGER NOT NULL,
          monthly_pages INTEGER NOT NULL,
          start_date DATE NOT NULL,
          end_date DATE NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `, [], () => resolve(), (_, error: Error) => {
        reject(error);
        return false;
      });
    });
  });
}; 