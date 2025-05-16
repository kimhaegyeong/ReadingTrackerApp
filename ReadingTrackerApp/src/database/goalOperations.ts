import { getDBConnection } from './connection';
import { SQLiteTransaction } from 'expo-sqlite';
import { ReadingGoal } from './types';

export const saveReadingGoal = async (goal: ReadingGoal): Promise<number> => {
  const db = await getDBConnection();
  const statement = await db.prepareAsync(
    `INSERT INTO reading_goals (
      yearly_books, monthly_books, yearly_pages, monthly_pages, 
      start_date, end_date, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
  );

  try {
    const result = await statement.executeAsync([
      goal.yearly_books,
      goal.monthly_books,
      goal.yearly_pages,
      goal.monthly_pages,
      goal.start_date,
      goal.end_date
    ]);
    return result.lastInsertRowId;
  } finally {
    await statement.finalizeAsync();
  }
};

export const getCurrentReadingGoal = async (): Promise<ReadingGoal | null> => {
  const db = await getDBConnection();
  const currentDate = new Date().toISOString().split('T')[0];
  
  const statement = await db.prepareAsync(
    `SELECT * FROM reading_goals 
     WHERE start_date <= ? AND end_date >= ?
     ORDER BY created_at DESC LIMIT 1`
  );

  try {
    const result = await statement.executeAsync<ReadingGoal>([currentDate, currentDate]);
    const firstRow = await result.getFirstAsync();
    return firstRow || null;
  } finally {
    await statement.finalizeAsync();
  }
};

export const updateReadingGoal = async (goal: ReadingGoal): Promise<void> => {
  const db = await getDBConnection();
  const statement = await db.prepareAsync(
    `UPDATE reading_goals 
     SET yearly_books = ?, monthly_books = ?, 
         yearly_pages = ?, monthly_pages = ?,
         start_date = ?, end_date = ?,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`
  );

  try {
    await statement.executeAsync([
      goal.yearly_books,
      goal.monthly_books,
      goal.yearly_pages,
      goal.monthly_pages,
      goal.start_date,
      goal.end_date,
      goal.id
    ]);
  } finally {
    await statement.finalizeAsync();
  }
}; 