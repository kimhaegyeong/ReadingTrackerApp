import { useState, useEffect } from 'react';
import { DatabaseService } from '../DatabaseService';

export interface Stats {
  totalMinutes: number;
  totalPages: number;
  totalBookPages: number;
}

export interface UseStatsResult {
  stats: Stats;
  loading: boolean;
  fetchStats: () => Promise<void>;
}

export const useStats = (): UseStatsResult => {
  const [stats, setStats] = useState<Stats>({ totalMinutes: 0, totalPages: 0, totalBookPages: 0 });
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    const db = await DatabaseService.getInstance();
    const total = await db.getTotalStats();
    const totalBookPages = await db.getTotalBookPages();
    setStats({ ...total, totalBookPages });
    setLoading(false);
  };

  useEffect(() => { fetchStats(); }, []);

  return { stats, loading, fetchStats };
}; 