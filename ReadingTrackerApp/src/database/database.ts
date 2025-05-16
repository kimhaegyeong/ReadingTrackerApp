import * as SQLite from 'expo-sqlite';
import { SQLiteTransaction } from 'expo-sqlite';

const DATABASE_NAME = 'reading_tracker.db';

export const getDBConnection = async () => {
  return await SQLite.openDatabaseAsync(DATABASE_NAME);
};

export const initDatabase = async () => {
  const db = await getDBConnection();
  
  // books 테이블 생성
  const booksStatement = await db.prepareAsync(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT,
      isbn TEXT,
      cover_image TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  try {
    await booksStatement.executeAsync();
  } finally {
    await booksStatement.finalizeAsync();
  }

  // reading_sessions 테이블 생성
  const sessionsStatement = await db.prepareAsync(`
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
  `);

  try {
    await sessionsStatement.executeAsync();
  } finally {
    await sessionsStatement.finalizeAsync();
  }

  // reading_goals 테이블 생성
  const goalsStatement = await db.prepareAsync(`
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
  `);

  try {
    await goalsStatement.executeAsync();
  } finally {
    await goalsStatement.finalizeAsync();
  }
}; 