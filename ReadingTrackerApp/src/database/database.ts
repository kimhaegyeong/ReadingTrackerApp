import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('reading_tracker.db');

export const initDatabase = async () => {
  try {
    // 기존 테이블 삭제
    await db.execAsync(`
      DROP TABLE IF EXISTS reading_goals;
      DROP TABLE IF EXISTS reading_sessions;
      DROP TABLE IF EXISTS books;
    `);

    // 독서 목표 테이블 생성
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS reading_goals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        yearly_books INTEGER NOT NULL,
        monthly_books INTEGER NOT NULL,
        yearly_pages INTEGER NOT NULL,
        monthly_pages INTEGER NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        progress INTEGER DEFAULT 0,
        completed BOOLEAN DEFAULT 0,
        is_public BOOLEAN DEFAULT 0,
        notifications_enabled BOOLEAN DEFAULT 0,
        notification_time TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 독서 세션 테이블 생성
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS reading_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        book_id INTEGER NOT NULL,
        start_page INTEGER NOT NULL,
        end_page INTEGER NOT NULL,
        duration INTEGER NOT NULL,
        date TEXT NOT NULL,
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (book_id) REFERENCES books (id)
      )
    `);

    // 책 테이블 생성
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT,
        isbn TEXT,
        total_pages INTEGER,
        current_page INTEGER DEFAULT 0,
        status TEXT DEFAULT 'reading',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export default db; 