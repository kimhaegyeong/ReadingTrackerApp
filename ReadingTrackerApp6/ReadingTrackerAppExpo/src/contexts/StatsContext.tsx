import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DatabaseService } from '../DatabaseService';

interface Stats {
  totalMinutes: number;
  totalPages: number;
  totalBookPages: number;
}

interface StatsContextType {
  stats: Stats;
  loading: boolean;
  fetchStats: () => Promise<void>;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export const StatsProvider = ({ children }: { children: ReactNode }) => {
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

  return (
    <StatsContext.Provider value={{ stats, loading, fetchStats }}>
      {children}
    </StatsContext.Provider>
  );
};

export const useStatsContext = () => {
  const ctx = useContext(StatsContext);
  if (!ctx) throw new Error('useStatsContext must be used within a StatsProvider');
  return ctx;
}; 