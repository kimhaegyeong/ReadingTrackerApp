import * as SQLite from 'expo-sqlite';

export type Book = {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  pages?: number;
  status: string;
  cover_color?: string;
  cover?: string;
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

export type UserProfile = {
  id: number;
  name: string;
  bio?: string;
  avatar?: string;
  email?: string;
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
        cover TEXT,
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
      CREATE TABLE IF NOT EXISTS user_profile (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        bio TEXT,
        avatar TEXT,
        email TEXT
      );
      CREATE INDEX IF NOT EXISTS idx_books_status ON books(status);
      CREATE INDEX IF NOT EXISTS idx_quotes_book_id ON quotes(book_id);
      CREATE INDEX IF NOT EXISTS idx_notes_book_id ON notes(book_id);
      CREATE INDEX IF NOT EXISTS idx_reading_sessions_book_id ON reading_sessions(book_id);
      CREATE INDEX IF NOT EXISTS idx_reading_sessions_date ON reading_sessions(start_time);
    `);
    // cover 컬럼이 없으면 추가 (마이그레이션)
    try {
      // @ts-ignore
      const columns = await this.db.getAllAsync<any>(`PRAGMA table_info(books);`);
      const hasCover = columns.some((col: any) => col.name === 'cover');
      if (!hasCover) {
        // @ts-ignore
        await this.db.execAsync(`ALTER TABLE books ADD COLUMN cover TEXT;`);
        console.log('[DatabaseService] books 테이블에 cover 컬럼 추가 완료');
      }
    } catch (e) {
      console.error('[DatabaseService] books 테이블 cover 컬럼 마이그레이션 오류', e);
    }
    // 최초 실행 시 기본 프로필 생성
    // @ts-ignore
    const user = await this.db.getFirstAsync<UserProfile>(`SELECT * FROM user_profile WHERE id = 1`);
    if (!user) {
      // @ts-ignore
      await this.db.runAsync(
        `INSERT INTO user_profile (id, name, bio, avatar, email) VALUES (1, '사용자', '', '', '')`
      );
    }
  }

  // --- BOOKS CRUD ---
  public async addBook(book: Omit<Book, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
    try {
      if (!this.db) throw new Error('DB not initialized');
      console.log('[DatabaseService] addBook 파라미터:', book);
      // @ts-ignore
      const result = await this.db.runAsync(
        `INSERT INTO books (title, author, isbn, pages, status, cover_color, cover) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        book.title,
        book.author,
        book.isbn ?? null,
        book.pages ?? null,
        book.status,
        book.cover_color ?? null,
        book.cover ?? null
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

  // --- QUOTES CRUD ---
  public async addQuote(quote: Omit<Quote, 'id' | 'created_at'>): Promise<number> {
    try {
      if (!this.db) throw new Error('DB not initialized');
      // @ts-ignore
      const result = await this.db.runAsync(
        `INSERT INTO quotes (book_id, content, memo, page, tags) VALUES (?, ?, ?, ?, ?)`,
        quote.book_id,
        quote.content,
        quote.memo ?? null,
        quote.page ?? null,
        quote.tags ?? null
      );
      // @ts-ignore
      return result.lastInsertRowId;
    } catch (e) {
      console.error('addQuote error', e);
      throw e;
    }
  }
  public async getQuotesByBook(book_id: number): Promise<Quote[]> {
    try {
      if (!this.db) throw new Error('DB not initialized');
      // @ts-ignore
      const rows = await this.db.getAllAsync<Quote>(`SELECT * FROM quotes WHERE book_id = ? ORDER BY created_at DESC`, book_id);
      return rows;
    } catch (e) {
      console.error('getQuotesByBook error', e);
      throw e;
    }
  }
  public async updateQuote(id: number, update: Partial<Omit<Quote, 'id'>>): Promise<void> {
    try {
      if (!this.db) throw new Error('DB not initialized');
      const fields = Object.keys(update).map(key => `${key} = ?`).join(', ');
      const values = Object.values(update);
      if (!fields) return;
      // @ts-ignore
      await this.db.runAsync(
        `UPDATE quotes SET ${fields} WHERE id = ?`,
        ...values,
        id
      );
    } catch (e) {
      console.error('updateQuote error', e);
      throw e;
    }
  }
  public async deleteQuote(id: number): Promise<void> {
    try {
      if (!this.db) throw new Error('DB not initialized');
      // @ts-ignore
      await this.db.runAsync(`DELETE FROM quotes WHERE id = ?`, id);
    } catch (e) {
      console.error('deleteQuote error', e);
      throw e;
    }
  }

  // --- NOTES CRUD ---
  public async addNote(note: Omit<Note, 'id' | 'created_at'>): Promise<number> {
      if (!this.db) throw new Error('DB not initialized');
      // @ts-ignore
      const result = await this.db.runAsync(
        `INSERT INTO notes (book_id, content, tags) VALUES (?, ?, ?)`,
        note.book_id,
        note.content,
        note.tags ?? null
      );
      // @ts-ignore
      return result.lastInsertRowId;
  }
  public async getNotesByBook(book_id: number): Promise<Note[]> {
    try {
      if (!this.db) throw new Error('DB not initialized');
      // @ts-ignore
      const rows = await this.db.getAllAsync<Note>(`SELECT * FROM notes WHERE book_id = ? ORDER BY created_at DESC`, book_id);
      return rows;
    } catch (e) {
      console.error('getNotesByBook error', e);
      throw e;
    }
  }
  public async updateNote(id: number, update: Partial<Omit<Note, 'id'>>): Promise<void> {
    try {
      if (!this.db) throw new Error('DB not initialized');
      const fields = Object.keys(update).map(key => `${key} = ?`).join(', ');
      const values = Object.values(update);
      if (!fields) return;
      // @ts-ignore
      await this.db.runAsync(
        `UPDATE notes SET ${fields} WHERE id = ?`,
        ...values,
        id
      );
    } catch (e) {
      console.error('updateNote error', e);
      throw e;
    }
  }
  public async deleteNote(id: number): Promise<void> {
    try {
      if (!this.db) throw new Error('DB not initialized');
      // @ts-ignore
      await this.db.runAsync(`DELETE FROM notes WHERE id = ?`, id);
    } catch (e) {
      console.error('deleteNote error', e);
      throw e;
    }
  }

  // --- READING_SESSIONS CRUD ---
  public async getBookIdByTitle(title: string): Promise<number | null> {
    if (!this.db) throw new Error('DB not initialized');
    // @ts-ignore
    const book = await this.db.getFirstAsync<Book>(`SELECT id FROM books WHERE title = ?`, title);
    return book ? book.id : null;
  }

  public async addReadingSession(session: Omit<ReadingSession, 'id' | 'created_at'>): Promise<number> {
    if (!this.db) throw new Error('DB not initialized');
    // @ts-ignore
    const result = await this.db.runAsync(
      `INSERT INTO reading_sessions (book_id, start_time, end_time, duration_minutes, pages_read, memo) VALUES (?, ?, ?, ?, ?, ?)`,
      session.book_id,
      session.start_time,
      session.end_time ?? null,
      session.duration_minutes ?? null,
      session.pages_read ?? null,
      session.memo ?? null
    );
    // @ts-ignore
    return result.lastInsertRowId;
  }

  public async getSessionsByBook(book_id: number): Promise<ReadingSession[]> {
    try {
      if (!this.db) throw new Error('DB not initialized');
      // @ts-ignore
      const rows = await this.db.getAllAsync<ReadingSession>(`SELECT * FROM reading_sessions WHERE book_id = ? ORDER BY start_time DESC`, book_id);
      return rows;
    } catch (e) {
      console.error('getSessionsByBook error', e);
      throw e;
    }
  }

  public async updateReadingSession(id: number, update: Partial<Omit<ReadingSession, 'id'>>): Promise<void> { throw new Error('not implemented'); }
  public async deleteReadingSession(id: number): Promise<void> { throw new Error('not implemented'); }

  public async getTodaySessions(): Promise<ReadingSession[]> {
    if (!this.db) throw new Error('DB not initialized');
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const start = `${yyyy}-${mm}-${dd} 00:00:00`;
    const end = `${yyyy}-${mm}-${dd} 23:59:59`;
    // @ts-ignore
    const rows = await this.db.getAllAsync<ReadingSession & { book_title: string }>(
      `SELECT rs.*, b.title as book_title FROM reading_sessions rs JOIN books b ON rs.book_id = b.id WHERE rs.start_time BETWEEN ? AND ? ORDER BY rs.start_time DESC`,
      start, end
    );
    return rows;
  }

  public async getTotalStats(): Promise<{ totalMinutes: number, totalPages: number }> {
    if (!this.db) throw new Error('DB not initialized');
    // @ts-ignore
    const row = await this.db.getFirstAsync<{ totalMinutes: number, totalPages: number }>(
      `SELECT SUM(duration_minutes) as totalMinutes, SUM(pages_read) as totalPages FROM reading_sessions`
    );
    return {
      totalMinutes: row?.totalMinutes || 0,
      totalPages: row?.totalPages || 0,
    };
  }

  // --- SETTINGS CRUD (패턴만, 상세 구현은 동일) ---
  public async setSetting(key: string, value: string): Promise<void> { /* ... */ throw new Error('not implemented'); }
  public async getSetting(key: string): Promise<Setting | null> { /* ... */ throw new Error('not implemented'); }

  public async getUserProfile(): Promise<UserProfile> {
    if (!this.db) throw new Error('DB not initialized');
    // @ts-ignore
    const user = await this.db.getFirstAsync<UserProfile>(`SELECT * FROM user_profile WHERE id = 1`);
    return user;
  }

  public async updateUserProfile(update: Partial<Omit<UserProfile, 'id'>>): Promise<void> {
    if (!this.db) throw new Error('DB not initialized');
    const fields = Object.keys(update).map(key => `${key} = ?`).join(', ');
    const values = Object.values(update);
    if (!fields) return;
    // @ts-ignore
    await this.db.runAsync(
      `UPDATE user_profile SET ${fields} WHERE id = 1`,
      ...values
    );
  }

  public async setUserProfile(profile: UserProfile): Promise<void> {
    if (!this.db) throw new Error('DB not initialized');
    // @ts-ignore
    await this.db.runAsync(
      `REPLACE INTO user_profile (id, name, bio, avatar, email) VALUES (?, ?, ?, ?, ?)`,
      profile.id,
      profile.name,
      profile.bio ?? '',
      profile.avatar ?? '',
      profile.email ?? ''
    );
  }

  /**
   * 월별 독서량(책 수, 시간, 페이지) 통계 반환 (올해)
   */
  public async getMonthlyStats(year: number): Promise<Array<{ month: number, books: number, minutes: number, pages: number }>> {
    if (!this.db) throw new Error('DB not initialized');
    // 월별로 책 완료 수, 총 독서 시간, 총 페이지
    // status = 'finished'인 책을 기준으로 집계
    // @ts-ignore
    const rows = await this.db.getAllAsync<{
      month: number,
      books: number,
      minutes: number,
      pages: number
    }>(
      `SELECT strftime('%m', b.updated_at) as month,
              COUNT(DISTINCT b.id) as books,
              COALESCE(SUM(rs.duration_minutes),0) as minutes,
              COALESCE(SUM(rs.pages_read),0) as pages
       FROM books b
       LEFT JOIN reading_sessions rs ON rs.book_id = b.id
       WHERE b.status = 'finished' AND strftime('%Y', b.updated_at) = ?
       GROUP BY month
       ORDER BY month ASC`,
      String(year)
    );
    return rows.map((r: any) => ({
      month: Number(r.month),
      books: r.books,
      minutes: r.minutes,
      pages: r.pages
    }));
  }

  /**
   * 최근 읽은 책(완독 기준, 최신순)
   */
  public async getRecentBooks(limit: number = 5): Promise<Array<{ title: string, author: string, finishedDate: string, rating?: number }>> {
    if (!this.db) throw new Error('DB not initialized');
    // @ts-ignore
    const rows = await this.db.getAllAsync<{
      title: string,
      author: string,
      finishedDate: string,
      rating?: number
    }>(
      `SELECT title, author, updated_at as finishedDate, NULL as rating
       FROM books
       WHERE status = 'finished'
       ORDER BY updated_at DESC
       LIMIT ?`,
      limit
    );
    return rows;
  }

  /**
   * 장르별 통계(책 테이블에 genre 컬럼이 없으므로, 임시로 cover_color로 그룹핑)
   */
  public async getGenreStats(): Promise<Array<{ name: string, value: number, color: string }>> {
    if (!this.db) throw new Error('DB not initialized');
    // genre 컬럼이 없으므로 cover_color로 대체(실제 앱에서는 genre 컬럼 추가 권장)
    // @ts-ignore
    const rows = await this.db.getAllAsync<{
      color: string,
      value: number
    }>(
      `SELECT cover_color as color, COUNT(*) as value
       FROM books
       WHERE status = 'finished'
       GROUP BY cover_color`
    );
    // 색상명을 장르명으로 임시 매핑
    return rows.map((r: any, i: number) => ({
      name: `장르${i+1}`,
      value: r.value,
      color: r.color || '#3b82f6'
    }));
  }

  /**
   * 일별 독서 기록(YYYY-MM-DD별로 독서 세션이 있는 날짜 목록 반환)
   */
  public async getDailyHistory(): Promise<string[]> {
    if (!this.db) throw new Error('DB not initialized');
    // @ts-ignore
    const rows = await this.db.getAllAsync<{ date: string }>(
      `SELECT DISTINCT substr(start_time, 1, 10) as date FROM reading_sessions ORDER BY date ASC`
    );
    return rows.map((r: any) => r.date);
  }

  /**
   * 연속 기록(최대 streak, 현재 streak) 계산
   * return: { currentStreak: number, longestStreak: number }
   */
  public async getStreakStats(): Promise<{ currentStreak: number, longestStreak: number }> {
    if (!this.db) throw new Error('DB not initialized');
    // 1. 모든 독서 기록 날짜를 오름차순으로 가져옴
    // 2. streak 계산
    // @ts-ignore
    const rows = await this.db.getAllAsync<{ date: string }>(
      `SELECT DISTINCT substr(start_time, 1, 10) as date FROM reading_sessions ORDER BY date ASC`
    );
    const dates = (rows as any[]).map((r: any) => r.date).sort();
    if (dates.length === 0) return { currentStreak: 0, longestStreak: 0 };
    let longest = 1, current = 1, max = 1;
    let prev = dates[0];
    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(prev);
      const currDate = new Date(dates[i]);
      const diff = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        current++;
        if (current > max) max = current;
      } else if (diff === 0) {
        // 같은 날 여러 세션은 무시
      } else {
        current = 1;
      }
      prev = dates[i];
    }
    // 오늘도 streak에 포함되는지 체크
    const today = new Date();
    const lastDate = new Date(dates[dates.length - 1]);
    const diffToday = (today.setHours(0,0,0,0) - lastDate.setHours(0,0,0,0)) / (1000 * 60 * 60 * 24);
    const currentStreak = diffToday === 0 ? current : 0;
    return { currentStreak, longestStreak: max };
  }
} 