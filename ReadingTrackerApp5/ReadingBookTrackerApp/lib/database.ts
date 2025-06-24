import * as SQLite from 'expo-sqlite';
import { Book, Quote, Note, ReadingRecord } from '@/contexts/BookContext';

const DB_NAME = 'reading_tracker.db';

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async init() {
    if (!this.db) {
      this.db = await SQLite.openDatabaseAsync(DB_NAME);
      await this.createTables();
    }
    return this.db;
  }

  private async createTables() {
    if (!this.db) return;

    // 책 테이블
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS books (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        status TEXT NOT NULL,
        coverImage TEXT
      );
    `);

    // 인용문 테이블
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS quotes (
        id TEXT PRIMARY KEY,
        bookId TEXT NOT NULL,
        text TEXT NOT NULL,
        tags TEXT,
        FOREIGN KEY (bookId) REFERENCES books (id) ON DELETE CASCADE
      );
    `);

    // 메모 테이블
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS notes (
        id TEXT PRIMARY KEY,
        bookId TEXT NOT NULL,
        text TEXT NOT NULL,
        tags TEXT,
        FOREIGN KEY (bookId) REFERENCES books (id) ON DELETE CASCADE
      );
    `);

    // 독서 기록 테이블
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS reading_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bookId TEXT NOT NULL,
        date TEXT NOT NULL,
        readingTimeInSeconds INTEGER NOT NULL,
        FOREIGN KEY (bookId) REFERENCES books (id) ON DELETE CASCADE
      );
    `);
  }

  // 책 관련 메서드들
  async saveBooks(books: Book[]) {
    if (!this.db) await this.init();

    await this.db!.execAsync('BEGIN TRANSACTION;');
    try {
      // 기존 데이터 삭제
      await this.db!.execAsync('DELETE FROM reading_records;');
      await this.db!.execAsync('DELETE FROM quotes;');
      await this.db!.execAsync('DELETE FROM notes;');
      await this.db!.execAsync('DELETE FROM books;');

      // 새 데이터 삽입
      for (const book of books) {
        await this.db!.runAsync(
          'INSERT INTO books (id, title, author, status, coverImage) VALUES (?, ?, ?, ?, ?)',
          book.id, book.title, book.author, book.status, book.coverImage || null
        );

        // 인용문 저장
        for (const quote of book.quotes) {
          await this.db!.runAsync(
            'INSERT INTO quotes (id, bookId, text, tags) VALUES (?, ?, ?, ?)',
            quote.id, book.id, quote.text, JSON.stringify(quote.tags)
          );
        }

        // 메모 저장
        for (const note of book.notes) {
          await this.db!.runAsync(
            'INSERT INTO notes (id, bookId, text, tags) VALUES (?, ?, ?, ?)',
            note.id, book.id, note.text, JSON.stringify(note.tags)
          );
        }

        // 독서 기록 저장
        for (const record of book.readingRecords) {
          await this.db!.runAsync(
            'INSERT INTO reading_records (bookId, date, readingTimeInSeconds) VALUES (?, ?, ?)',
            book.id, record.date, record.readingTimeInSeconds
          );
        }
      }

      await this.db!.execAsync('COMMIT;');
    } catch (error) {
      await this.db!.execAsync('ROLLBACK;');
      throw error;
    }
  }

  async loadBooks(): Promise<Book[]> {
    if (!this.db) await this.init();

    const books = await this.db!.getAllAsync('SELECT * FROM books ORDER BY id') as any[];
    const result: Book[] = [];
    for (const book of books) {
      const quotes = await this.db!.getAllAsync('SELECT * FROM quotes WHERE bookId = ?', book.id) as any[];
      const notes = await this.db!.getAllAsync('SELECT * FROM notes WHERE bookId = ?', book.id) as any[];
      const readingRecords = await this.db!.getAllAsync('SELECT * FROM reading_records WHERE bookId = ?', book.id) as any[];
      result.push({
        id: book.id,
        title: book.title,
        author: book.author,
        status: book.status as any,
        coverImage: book.coverImage,
        quotes: quotes.map((q: any) => ({
          id: q.id,
          text: q.text,
          tags: q.tags ? JSON.parse(q.tags) : []
        })),
        notes: notes.map((n: any) => ({
          id: n.id,
          text: n.text,
          tags: n.tags ? JSON.parse(n.tags) : []
        })),
        readingRecords: readingRecords.map((r: any) => ({
          date: r.date,
          readingTimeInSeconds: r.readingTimeInSeconds
        }))
      });
    }
    return result;
  }
}

export const databaseService = new DatabaseService(); 