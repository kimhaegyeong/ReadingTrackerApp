import { getDBConnection } from './connection';
import { SQLiteTransaction } from 'expo-sqlite';
import { Book } from './types';

export const addBook = async (book: Book): Promise<number> => {
  const db = await getDBConnection();
  const statement = await db.prepareAsync(
    'INSERT INTO books (title, author, isbn, cover_image) VALUES (?, ?, ?, ?)'
  );

  try {
    const result = await statement.executeAsync([
      book.title,
      book.author,
      book.isbn,
      book.cover_image
    ]);
    return result.lastInsertRowId;
  } finally {
    await statement.finalizeAsync();
  }
};

export const getBooks = async (): Promise<Book[]> => {
  const db = await getDBConnection();
  const statement = await db.prepareAsync(
    'SELECT * FROM books ORDER BY created_at DESC'
  );

  try {
    const result = await statement.executeAsync<Book>([]);
    const allRows = await result.getAllAsync();
    return allRows;
  } finally {
    await statement.finalizeAsync();
  }
};

export const updateBook = async (book: Book): Promise<void> => {
  const db = await getDBConnection();
  const statement = await db.prepareAsync(
    'UPDATE books SET title = ?, author = ?, isbn = ?, cover_image = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
  );

  try {
    await statement.executeAsync([
      book.title,
      book.author,
      book.isbn,
      book.cover_image,
      book.id
    ]);
  } finally {
    await statement.finalizeAsync();
  }
};

export const deleteBook = async (id: number): Promise<void> => {
  const db = await getDBConnection();
  const statement = await db.prepareAsync(
    'DELETE FROM books WHERE id = ?'
  );

  try {
    await statement.executeAsync([id]);
  } finally {
    await statement.finalizeAsync();
  }
};

export const getBookInfo = async (bookId: string): Promise<Book | null> => {
  try {
    const db = await getDBConnection();
    const [rows] = await db.executeSql('SELECT * FROM books WHERE id = ?', [bookId]);
    return rows.item(0) || null;
  } catch (error) {
    console.error('책 정보 조회 실패:', error);
    throw error;
  }
}; 