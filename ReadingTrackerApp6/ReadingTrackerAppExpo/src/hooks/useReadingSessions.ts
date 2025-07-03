import { useState, useEffect } from 'react';
import { DatabaseService } from '../DatabaseService';
import type { ReadingSession } from '../types/session';

export interface UseReadingSessionsResult {
  sessions: ReadingSession[];
  loading: boolean;
  fetchTodaySessions: () => Promise<void>;
}

export const useReadingSessions = (): UseReadingSessionsResult => {
  const [sessions, setSessions] = useState<ReadingSession[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTodaySessions = async () => {
    setLoading(true);
    const db = await DatabaseService.getInstance();
    const today = await db.getTodaySessions();
    setSessions(today);
    setLoading(false);
  };

  useEffect(() => { fetchTodaySessions(); }, []);

  return { sessions, loading, fetchTodaySessions };
}; 