import { getDBConnection } from './connection';
import { ReadingGoal } from './types';

export type { ReadingGoal };

export interface UpdateReadingGoal extends ReadingGoal {
  id: number;
}

export const saveReadingGoal = async (goal: ReadingGoal): Promise<number> => {
  const db = await getDBConnection();
  const statement = await db.prepareAsync(
    `INSERT INTO reading_goals (
      yearly_books, monthly_books, yearly_pages, monthly_pages,
      startDate, endDate, isPublic, notificationsEnabled, notificationTime,
      target, progress, completed, period
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  try {
    const result = await statement.executeAsync([
      goal.yearly_books || 0,
      goal.monthly_books || 0,
      goal.yearly_pages || 0,
      goal.monthly_pages || 0,
      goal.startDate || new Date().toISOString(),
      goal.endDate || new Date().toISOString(),
      goal.isPublic ? 1 : 0,
      goal.notificationsEnabled ? 1 : 0,
      goal.notificationTime || '',
      goal.target || 0,
      goal.progress || 0,
      goal.completed ? 1 : 0,
      goal.period || 'yearly'
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

export const updateReadingGoal = async (goal: UpdateReadingGoal): Promise<void> => {
  const db = await getDBConnection();
  const statement = await db.prepareAsync(
    `UPDATE reading_goals SET
      yearly_books = ?,
      monthly_books = ?,
      yearly_pages = ?,
      monthly_pages = ?,
      startDate = ?,
      endDate = ?,
      isPublic = ?,
      notificationsEnabled = ?,
      notificationTime = ?,
      target = ?,
      progress = ?,
      completed = ?,
      period = ?
    WHERE id = ?`
  );

  try {
    await statement.executeAsync([
      goal.yearly_books || 0,
      goal.monthly_books || 0,
      goal.yearly_pages || 0,
      goal.monthly_pages || 0,
      goal.startDate || new Date().toISOString(),
      goal.endDate || new Date().toISOString(),
      goal.isPublic ? 1 : 0,
      goal.notificationsEnabled ? 1 : 0,
      goal.notificationTime || '',
      goal.target || 0,
      goal.progress || 0,
      goal.completed ? 1 : 0,
      goal.period || 'yearly',
      goal.id
    ]);
  } finally {
    await statement.finalizeAsync();
  }
}; 