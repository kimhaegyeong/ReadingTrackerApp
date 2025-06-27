import * as SQLite from 'expo-sqlite';

export type Book = {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  pages?: number;
  status: string;
  cover_color?: string;
  created_at?: string;
  updated_at?: string;
};

export type Quote = {
  id: number;
  book_id: number;
  content: string;
  memo?: string;
  page?: number;
  tags?: string;
  created_at?: string;
};

export type Note = {
  id: number;
  book_id: number;
  content: string;
  tags?: string;
  created_at?: string;
};

export type ReadingSession = {
  id: number;
  book_id: number;
  start_time: string;
  end_time?: string;
  duration_minutes?: number;
  pages_read?: number;
  memo?: string;
  created_at?: string;
};

export type Setting = {
  key: string;
  value: string;
  updated_at?: string;
};

export class DatabaseService {
  private static instance: DatabaseService;
  private db: any = null; // 타입 오류 방지용 any

  private constructor() {}

  public static async getInstance(): Promise<DatabaseService> {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
      await DatabaseService.instance.initDatabase();
    }
    return DatabaseService.instance;
  }

  private async initDatabase() {
    // @ts-ignore
    this.db = await SQLite.openDatabaseAsync('reading_tracker.db');
    // @ts-ignore
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        isbn TEXT,
        pages INTEGER,
        status TEXT NOT NULL DEFAULT 'want-to-read',
        cover_color TEXT DEFAULT '#3b82f6',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS quotes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        book_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        memo TEXT,
        page INTEGER,
        tags TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
      );
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        book_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        tags TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
      );
      CREATE TABLE IF NOT EXISTS reading_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        book_id INTEGER NOT NULL,
        start_time DATETIME NOT NULL,
        end_time DATETIME,
        duration_minutes INTEGER,
        pages_read INTEGER,
        memo TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
      );
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_books_status ON books(status);
      CREATE INDEX IF NOT EXISTS idx_quotes_book_id ON quotes(book_id);
      CREATE INDEX IF NOT EXISTS idx_notes_book_id ON notes(book_id);
      CREATE INDEX IF NOT EXISTS idx_reading_sessions_book_id ON reading_sessions(book_id);
      CREATE INDEX IF NOT EXISTS idx_reading_sessions_date ON reading_sessions(start_time);
    `);
  }

  // --- BOOKS CRUD ---
  public async addBook(book: Omit<Book, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
    try {
      if (!this.db) throw new Error('DB not initialized');
      console.log('[DatabaseService] addBook 파라미터:', book);
      // @ts-ignore
      const result = await this.db.runAsync(
        `INSERT INTO books (title, author, isbn, pages, status, cover_color) VALUES (?, ?, ?, ?, ?, ?)`,
        book.title,
        book.author,
        book.isbn ?? null,
        book.pages ?? null,
        book.status,
        book.cover_color ?? null
      );
      console.log('[DatabaseService] addBook 결과:', result);
      // @ts-ignore
      return result.lastInsertRowId;
    } catch (e) {
      console.error('addBook error', e);
      throw e;
    }
  }

  public async getAllBooks(): Promise<Book[]> {
    try {
      if (!this.db) throw new Error('DB not initialized');
      console.log('[DatabaseService] getAllBooks 호출');
      // @ts-ignore
      const rows = await this.db.getAllAsync<Book>(`SELECT * FROM books ORDER BY created_at DESC`);
      console.log('[DatabaseService] getAllBooks 결과:', rows);
      return rows;
    } catch (e) {
      console.error('getAllBooks error', e);
      throw e;
    }
  }

  public async getBookById(id: number): Promise<Book | null> {
    try {
      if (!this.db) throw new Error('DB not initialized');
      // @ts-ignore
      const book = await this.db.getFirstAsync<Book>(`SELECT * FROM books WHERE id = ?`, id);
      return book ?? null;
    } catch (e) {
      console.error('getBookById error', e);
      throw e;
    }
  }

  public async updateBook(id: number, update: Partial<Omit<Book, 'id'>>): Promise<void> {
    try {
      if (!this.db) throw new Error('DB not initialized');
      const fields = Object.keys(update).map(key => `${key} = ?`).join(', ');
      const values = Object.values(update);
      if (!fields) return;
      // @ts-ignore
      await this.db.runAsync(
        `UPDATE books SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        ...values,
        id
      );
    } catch (e) {
      console.error('updateBook error', e);
      throw e;
    }
  }

  public async deleteBook(id: number): Promise<void> {
    try {
      if (!this.db) throw new Error('DB not initialized');
      // @ts-ignore
      await this.db.runAsync(`DELETE FROM books WHERE id = ?`, id);
    } catch (e) {
      console.error('deleteBook error', e);
      throw e;
    }
  }

  // --- QUOTES CRUD (패턴만, 상세 구현은 동일) ---
  public async addQuote(quote: Omit<Quote, 'id' | 'created_at'>): Promise<number> { /* ... */ throw new Error('not implemented'); }
  public async getQuotesByBook(book_id: number): Promise<Quote[]> { /* ... */ throw new Error('not implemented'); }
  public async updateQuote(id: number, update: Partial<Omit<Quote, 'id'>>): Promise<void> { /* ... */ throw new Error('not implemented'); }
  public async deleteQuote(id: number): Promise<void> { /* ... */ throw new Error('not implemented'); }

  // --- NOTES CRUD (패턴만, 상세 구현은 동일) ---
  public async addNote(note: Omit<Note, 'id' | 'created_at'>): Promise<number> { /* ... */ throw new Error('not implemented'); }
  public async getNotesByBook(book_id: number): Promise<Note[]> { /* ... */ throw new Error('not implemented'); }
  public async updateNote(id: number, update: Partial<Omit<Note, 'id'>>): Promise<void> { /* ... */ throw new Error('not implemented'); }
  public async deleteNote(id: number): Promise<void> { /* ... */ throw new Error('not implemented'); }

  // --- READING_SESSIONS CRUD (패턴만, 상세 구현은 동일) ---
  public async addReadingSession(session: Omit<ReadingSession, 'id' | 'created_at'>): Promise<number> { /* ... */ throw new Error('not implemented'); }
  public async getSessionsByBook(book_id: number): Promise<ReadingSession[]> { /* ... */ throw new Error('not implemented'); }
  public async updateReadingSession(id: number, update: Partial<Omit<ReadingSession, 'id'>>): Promise<void> { /* ... */ throw new Error('not implemented'); }
  public async deleteReadingSession(id: number): Promise<void> { /* ... */ throw new Error('not implemented'); }

  // --- SETTINGS CRUD (패턴만, 상세 구현은 동일) ---
  public async setSetting(key: string, value: string): Promise<void> { /* ... */ throw new Error('not implemented'); }
  public async getSetting(key: string): Promise<Setting | null> { /* ... */ throw new Error('not implemented'); }
} 