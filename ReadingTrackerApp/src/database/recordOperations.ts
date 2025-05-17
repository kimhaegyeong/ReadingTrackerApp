import { getDBConnection } from './connection';
import { ReadingRecord, UpdateReadingRecord } from '../types';

export type { ReadingRecord, UpdateReadingRecord };

export const initReadingRecordsTable = async () => {
  const db = await getDBConnection();
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS reading_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id TEXT,
      date TEXT,
      start_page INTEGER,
      end_page INTEGER,
      reading_time INTEGER,
      emotion TEXT,
      satisfaction INTEGER,
      memo TEXT,
      created_at TEXT,
      updated_at TEXT
    );`
  );

  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS record_tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      record_id INTEGER,
      tag TEXT,
      FOREIGN KEY (record_id) REFERENCES reading_records(id)
    );`
  );
};

export const saveReadingRecord = async (record: ReadingRecord): Promise<number> => {
  const db = await getDBConnection();
  const statement = await db.prepareAsync(
    `INSERT INTO reading_records (
      book_id, date, start_page, end_page, reading_time,
      emotion, satisfaction, memo, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  try {
    const now = new Date().toISOString();
    const result = await statement.executeAsync([
      record.bookId,
      record.date,
      record.startPage,
      record.endPage,
      record.readingTime,
      record.emotion,
      record.satisfaction,
      record.memo,
      now,
      now
    ]);

    const recordId = result.lastInsertRowId;

    // 태그 저장
    if (record.tags && record.tags.length > 0) {
      const tagStatement = await db.prepareAsync(
        'INSERT INTO record_tags (record_id, tag) VALUES (?, ?)'
      );
      try {
        for (const tag of record.tags) {
          await tagStatement.executeAsync([recordId, tag]);
        }
      } finally {
        await tagStatement.finalizeAsync();
      }
    }

    return recordId;
  } finally {
    await statement.finalizeAsync();
  }
};

export const getReadingRecord = async (id: number): Promise<ReadingRecord | null> => {
  const db = await getDBConnection();
  const statement = await db.prepareAsync(
    'SELECT * FROM reading_records WHERE id = ?'
  );

  try {
    const result = await statement.executeAsync<ReadingRecord>([id]);
    const record = await result.getFirstAsync();
    
    if (!record) {
      return null;
    }

    // 태그 조회
    const tagStatement = await db.prepareAsync(
      'SELECT tag FROM record_tags WHERE record_id = ?'
    );
    try {
      const tagResult = await tagStatement.executeAsync<{ tag: string }>([id]);
      const tags = await tagResult.getAllAsync();

      return {
        ...record,
        tags: tags.map(t => t.tag)
      };
    } finally {
      await tagStatement.finalizeAsync();
    }
  } finally {
    await statement.finalizeAsync();
  }
};

export const updateReadingRecord = async (record: UpdateReadingRecord): Promise<void> => {
  const db = await getDBConnection();
  const statement = await db.prepareAsync(
    `UPDATE reading_records SET
      book_id = ?, date = ?, start_page = ?, end_page = ?,
      reading_time = ?, emotion = ?, satisfaction = ?,
      memo = ?, updated_at = ?
    WHERE id = ?`
  );

  try {
    const now = new Date().toISOString();
    await statement.executeAsync([
      record.bookId,
      record.date,
      record.startPage,
      record.endPage,
      record.readingTime,
      record.emotion,
      record.satisfaction,
      record.memo,
      now,
      record.id
    ]);

    // 태그 업데이트
    const deleteTagStatement = await db.prepareAsync(
      'DELETE FROM record_tags WHERE record_id = ?'
    );
    try {
      await deleteTagStatement.executeAsync([record.id]);
    } finally {
      await deleteTagStatement.finalizeAsync();
    }

    if (record.tags && record.tags.length > 0) {
      const insertTagStatement = await db.prepareAsync(
        'INSERT INTO record_tags (record_id, tag) VALUES (?, ?)'
      );
      try {
        for (const tag of record.tags) {
          await insertTagStatement.executeAsync([record.id, tag]);
        }
      } finally {
        await insertTagStatement.finalizeAsync();
      }
    }
  } finally {
    await statement.finalizeAsync();
  }
};

export const deleteReadingRecord = async (id: number): Promise<void> => {
  const db = await getDBConnection();
  
  // 태그 삭제
  const deleteTagStatement = await db.prepareAsync(
    'DELETE FROM record_tags WHERE record_id = ?'
  );
  try {
    await deleteTagStatement.executeAsync([id]);
  } finally {
    await deleteTagStatement.finalizeAsync();
  }

  // 기록 삭제
  const deleteRecordStatement = await db.prepareAsync(
    'DELETE FROM reading_records WHERE id = ?'
  );
  try {
    await deleteRecordStatement.executeAsync([id]);
  } finally {
    await deleteRecordStatement.finalizeAsync();
  }
}; 