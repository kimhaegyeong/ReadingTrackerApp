import * as SQLite from 'expo-sqlite';
import { Book, BookStatus } from '@/store/slices/booksSlice';

const DATABASE_NAME = 'reading_tracker.db';
let db: SQLite.WebSQLDatabase | null = null;
let isInitialized = false;

const getDatabase = () => {
  if (!db) {
    db = SQLite.openDatabase(DATABASE_NAME);
  }
  return db;
};

const createTables = (database: SQLite.WebSQLDatabase): Promise<void> => {
  return new Promise((resolve, reject) => {
    database.transaction(
      tx => {
        // 책 테이블
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS books (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            authors TEXT NOT NULL,
            description TEXT,
            pageCount INTEGER,
            publishedDate TEXT,
            publisher TEXT,
            thumbnail TEXT,
            createdAt TEXT NOT NULL
          )`
        );

        // 사용자별 책 데이터 테이블
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS user_book_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            bookId TEXT NOT NULL,
            userId TEXT NOT NULL,
            status TEXT NOT NULL,
            currentPage INTEGER DEFAULT 0,
            startDate TEXT,
            endDate TEXT,
            rating INTEGER DEFAULT 0,
            review TEXT,
            FOREIGN KEY (bookId) REFERENCES books (id)
          )`
        );

        // 북마크 테이블
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS bookmarks (
            id TEXT PRIMARY KEY,
            bookId TEXT NOT NULL,
            userId TEXT NOT NULL,
            page INTEGER NOT NULL,
            note TEXT,
            createdAt TEXT NOT NULL,
            FOREIGN KEY (bookId) REFERENCES books (id)
          )`
        );

        // 리뷰 테이블
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS reviews (
            id TEXT PRIMARY KEY,
            bookId TEXT NOT NULL,
            userId TEXT NOT NULL,
            rating INTEGER NOT NULL,
            text TEXT,
            createdAt TEXT NOT NULL,
            FOREIGN KEY (bookId) REFERENCES books (id)
          )`
        );

        // 독서 세션 테이블
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS reading_sessions (
            id TEXT PRIMARY KEY,
            bookId TEXT NOT NULL,
            userId TEXT NOT NULL,
            startTime TEXT NOT NULL,
            endTime TEXT,
            pagesRead INTEGER DEFAULT 0,
            FOREIGN KEY (bookId) REFERENCES books (id)
          )`
        );
      },
      error => {
        console.error('테이블 생성 중 오류:', error);
        reject(error);
      },
      () => {
        console.log('테이블 생성 완료');
        resolve();
      }
    );
  });
};

export const initDatabase = async () => {
  if (isInitialized) {
    console.log('데이터베이스가 이미 초기화되어 있습니다.');
    return;
  }

  try {
    console.log('데이터베이스 초기화 시작');
    const database = getDatabase();
    
    // 데이터베이스 연결 테스트
    await new Promise<void>((resolve, reject) => {
      database.transaction(
        tx => {
          tx.executeSql('SELECT 1', [], () => {
            console.log('데이터베이스 연결 테스트 성공');
          });
        },
        error => {
          console.error('데이터베이스 연결 테스트 실패:', error);
          reject(error);
        },
        () => resolve()
      );
    });

    // 테이블 생성
    await createTables(database);
    
    isInitialized = true;
    console.log('데이터베이스 초기화 완료');
  } catch (error) {
    console.error('데이터베이스 초기화 중 오류:', error);
    throw error;
  }
};

// 책 저장
export const saveBook = async (book: Book & { createdAt: string }) => {
  if (!isInitialized) {
    await initDatabase();
  }

  return new Promise<void>((resolve, reject) => {
    const database = getDatabase();
    if (!database) {
      reject(new Error('데이터베이스 연결이 없습니다'));
      return;
    }

    database.transaction(tx => {
      tx.executeSql(
        `INSERT OR REPLACE INTO books (id, title, authors, description, pageCount, publishedDate, publisher, thumbnail, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          book.id,
          book.title,
          JSON.stringify(book.authors),
          book.description,
          book.pageCount,
          book.publishedDate,
          book.publisher,
          book.thumbnail,
          book.createdAt
        ]
      );
    }, reject, resolve);
  });
};

// 사용자별 책 데이터 저장
export const saveUserBookData = async (bookId: string, userId: string, data: {
  status: BookStatus;
  currentPage: number;
  startDate: string;
  endDate: string | null;
  rating: number;
  review: string;
}) => {
  if (!isInitialized) {
    await initDatabase();
  }

  return new Promise<void>((resolve, reject) => {
    const database = getDatabase();
    if (!database) {
      reject(new Error('데이터베이스 연결이 없습니다'));
      return;
    }

    database.transaction(tx => {
      tx.executeSql(
        `INSERT OR REPLACE INTO user_book_data 
         (bookId, userId, status, currentPage, startDate, endDate, rating, review)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          bookId,
          userId,
          data.status,
          data.currentPage,
          data.startDate,
          data.endDate,
          data.rating,
          data.review
        ]
      );
    }, reject, resolve);
  });
};

// 북마크 저장
export const saveBookmark = async (bookId: string, userId: string, bookmark: {
  id: string;
  page: number;
  note: string;
  createdAt: string;
}) => {
  if (!isInitialized) {
    await initDatabase();
  }

  return new Promise<void>((resolve, reject) => {
    const database = getDatabase();
    if (!database) {
      reject(new Error('데이터베이스 연결이 없습니다'));
      return;
    }

    database.transaction(tx => {
      tx.executeSql(
        `INSERT INTO bookmarks (id, bookId, userId, page, note, createdAt)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          bookmark.id,
          bookId,
          userId,
          bookmark.page,
          bookmark.note,
          bookmark.createdAt
        ]
      );
    }, reject, resolve);
  });
};

// 리뷰 저장
export const saveReview = async (bookId: string, userId: string, review: {
  id: string;
  rating: number;
  text: string;
  createdAt: string;
}) => {
  if (!isInitialized) {
    await initDatabase();
  }

  return new Promise<void>((resolve, reject) => {
    const database = getDatabase();
    if (!database) {
      reject(new Error('데이터베이스 연결이 없습니다'));
      return;
    }

    database.transaction(tx => {
      tx.executeSql(
        `INSERT INTO reviews (id, bookId, userId, rating, text, createdAt)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          review.id,
          bookId,
          userId,
          review.rating,
          review.text,
          review.createdAt
        ]
      );
    }, reject, resolve);
  });
};

// 모든 책 데이터 로드
export const loadAllBooks = async () => {
  if (!isInitialized) {
    await initDatabase();
  }

  return new Promise<Book[]>((resolve, reject) => {
    const database = getDatabase();
    if (!database) {
      reject(new Error('데이터베이스 연결이 없습니다'));
      return;
    }

    database.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM books`,
        [],
        (_, { rows: { _array } }) => {
          const books = _array.map(book => ({
            ...book,
            authors: JSON.parse(book.authors)
          }));
          resolve(books as Book[]);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

// 사용자별 책 데이터 로드
export const loadUserBookData = async (bookId: string, userId: string) => {
  if (!isInitialized) {
    await initDatabase();
  }

  return new Promise<any>((resolve, reject) => {
    const database = getDatabase();
    if (!database) {
      reject(new Error('데이터베이스 연결이 없습니다'));
      return;
    }

    database.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM user_book_data WHERE bookId = ? AND userId = ?`,
        [bookId, userId],
        (_, { rows: { _array } }) => {
          resolve(_array[0] || null);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

// 북마크 로드
export const loadBookmarks = async (bookId: string, userId: string) => {
  if (!isInitialized) {
    await initDatabase();
  }

  return new Promise<any[]>((resolve, reject) => {
    const database = getDatabase();
    if (!database) {
      reject(new Error('데이터베이스 연결이 없습니다'));
      return;
    }

    database.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM bookmarks WHERE bookId = ? AND userId = ? ORDER BY page ASC`,
        [bookId, userId],
        (_, { rows: { _array } }) => {
          resolve(_array);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

// 리뷰 로드
export const loadReviews = async (bookId: string, userId: string) => {
  if (!isInitialized) {
    await initDatabase();
  }

  return new Promise<any[]>((resolve, reject) => {
    const database = getDatabase();
    if (!database) {
      reject(new Error('데이터베이스 연결이 없습니다'));
      return;
    }

    database.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM reviews WHERE bookId = ? AND userId = ? ORDER BY createdAt DESC`,
        [bookId, userId],
        (_, { rows: { _array } }) => {
          resolve(_array);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const loadBook = async (bookId: string): Promise<Book | null> => {
  if (!db) {
    console.error('데이터베이스가 초기화되지 않았습니다.');
    return null;
  }

  try {
    const result = await new Promise<Book | null>((resolve, reject) => {
      (db as SQLite.SQLiteDatabase).transaction(tx => {
        tx.executeSql(
          'SELECT * FROM books WHERE id = ?',
          [bookId],
          (_, { rows }) => {
            if (rows.length > 0) {
              const book = rows.item(0);
              resolve({
                ...book,
                authors: JSON.parse(book.authors || '[]'),
                categories: JSON.parse(book.categories || '[]'),
                bookmarks: JSON.parse(book.bookmarks || '[]'),
                reviews: JSON.parse(book.reviews || '[]'),
                readingSessions: JSON.parse(book.readingSessions || '[]'),
                imageLinks: JSON.parse(book.imageLinks || '{}'),
                userSpecificData: JSON.parse(book.userSpecificData || '{}')
              } as Book);
            } else {
              resolve(null);
            }
          },
          (_, error) => {
            console.error('책 로드 중 오류 발생:', error);
            reject(error);
            return false;
          }
        );
      });
    });
    return result;
  } catch (error) {
    console.error('책 로드 중 오류 발생:', error);
    return null;
  }
}; 