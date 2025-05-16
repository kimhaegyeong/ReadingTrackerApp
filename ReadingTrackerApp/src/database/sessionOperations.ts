import { getDBConnection } from './connection';
import { SQLiteTransaction } from 'expo-sqlite';
import { ReadingSession } from './types';

export const addReadingSession = async (session: ReadingSession): Promise<number> => {
  const db = await getDBConnection();
  const statement = await db.prepareAsync(
    `INSERT INTO reading_sessions (
      book_id, start_time, end_time, pages_read, notes
    ) VALUES (?, ?, ?, ?, ?)`
  );

  try {
    const result = await statement.executeAsync([
      session.book_id,
      session.start_time,
      session.end_time,
      session.pages_read,
      session.notes
    ]);
    return result.lastInsertRowId;
  } finally {
    await statement.finalizeAsync();
  }
};

export const getBookSessions = async (bookId: number): Promise<ReadingSession[]> => {
  const db = await getDBConnection();
  const statement = await db.prepareAsync(
    'SELECT * FROM reading_sessions WHERE book_id = ? ORDER BY start_time DESC'
  );

  try {
    const result = await statement.executeAsync<ReadingSession>([bookId]);
    const allRows = await result.getAllAsync();
    return allRows;
  } finally {
    await statement.finalizeAsync();
  }
};

export const updateReadingSession = async (session: ReadingSession): Promise<void> => {
  const db = await getDBConnection();
  const statement = await db.prepareAsync(
    `UPDATE reading_sessions 
     SET end_time = ?, pages_read = ?, notes = ?,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`
  );

  try {
    await statement.executeAsync([
      session.end_time,
      session.pages_read,
      session.notes,
      session.id
    ]);
  } finally {
    await statement.finalizeAsync();
  }
};

export const deleteReadingSession = async (id: number): Promise<void> => {
  const db = await getDBConnection();
  const statement = await db.prepareAsync(
    'DELETE FROM reading_sessions WHERE id = ?'
  );

  try {
    await statement.executeAsync([id]);
  } finally {
    await statement.finalizeAsync();
  }
}; 