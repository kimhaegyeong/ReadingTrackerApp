import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { SearchFilter, SearchHistory } from '../contexts/SearchContext';

let db: any = null;

const getDatabase = async () => {
  if (!db) {
    try {
      if (Platform.OS === 'web') {
        console.warn('SQLite is not supported on web platform');
        return null;
      }
      
      db = await SQLite.openDatabaseAsync('readingTracker.db');
      console.log('Database opened successfully');
    } catch (error) {
      console.error('Error opening database:', error);
      throw error;
    }
  }
  return db;
};

// 데이터베이스 초기화 확인
const checkDatabase = async () => {
  try {
    const database = await getDatabase();
    if (!database) {
      throw new Error('Database not available');
    }

    await database.execAsync('SELECT 1');
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
};

export async function initDatabase(): Promise<void> {
  try {
    const database = await getDatabase();
    if (!database) {
      throw new Error('Database not available');
    }

    const isConnected = await checkDatabase();
    if (!isConnected) {
      throw new Error('Database connection failed');
    }

    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS search_filters (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        author TEXT,
        publisher TEXT,
        category TEXT,
        yearFrom INTEGER,
        yearTo INTEGER,
        language TEXT,
        isActive INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS search_history (
        query TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        PRIMARY KEY (query, timestamp)
      );
    `);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error in initDatabase:', error);
    throw error;
  }
}

// 검색 필터 저장
export async function saveFilter(filter: SearchFilter): Promise<void> {
  const database = await getDatabase();
  if (!database) throw new Error('Database not available');

  await database.runAsync(
    `INSERT OR REPLACE INTO search_filters 
    (id, name, author, publisher, category, yearFrom, yearTo, language, isActive)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      filter.id,
      filter.name,
      filter.author || null,
      filter.publisher || null,
      filter.category || null,
      filter.yearFrom || null,
      filter.yearTo || null,
      filter.language || null,
      filter.isActive ? 1 : 0
    ]
  );
}

// 검색 필터 목록 조회
export async function getFilters(): Promise<SearchFilter[]> {
  const database = await getDatabase();
  if (!database) throw new Error('Database not available');

  const rows = await database.getAllAsync('SELECT * FROM search_filters ORDER BY name ASC');
  return rows.map(row => ({
    ...row,
    isActive: Boolean(row.isActive)
  }));
}

// 검색 필터 삭제
export async function deleteFilter(id: string): Promise<void> {
  const database = await getDatabase();
  if (!database) throw new Error('Database not available');

  await database.runAsync('DELETE FROM search_filters WHERE id = ?', [id]);
}

// 검색 기록 저장
export async function saveSearchHistory(query: string): Promise<void> {
  const database = await getDatabase();
  if (!database) throw new Error('Database not available');

  await database.runAsync(
    'INSERT INTO search_history (query, timestamp) VALUES (?, ?)',
    [query, Date.now()]
  );
}

// 검색 기록 조회
export async function getSearchHistory(): Promise<SearchHistory[]> {
  const database = await getDatabase();
  if (!database) throw new Error('Database not available');

  return await database.getAllAsync(
    'SELECT * FROM search_history ORDER BY timestamp DESC LIMIT 50'
  );
}

// 검색 기록 삭제
export async function clearSearchHistory(): Promise<void> {
  const database = await getDatabase();
  if (!database) throw new Error('Database not available');

  await database.runAsync('DELETE FROM search_history');
}

export default getDatabase; 