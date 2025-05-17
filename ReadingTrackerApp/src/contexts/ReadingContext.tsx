import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import { getCurrentReadingGoal, saveReadingGoal, updateReadingGoal } from '../database/goalOperations';
import type { ReadingGoal } from '../database/types';

export interface ReadingSession {
  id: string;
  bookId: string;
  date: string; // ISO string
  startPage: number;
  endPage: number;
  duration: number; // minutes
  notes?: string;
  emotion?: 'happy' | 'sad' | 'confused' | 'excited' | 'bored';
  rating?: number; // 1-5
}

export interface ReadingGoal {
  id: string;
  target: number;
  progress: number;
  completed: boolean;
  period: 'yearly' | 'monthly';
  endDate: string;
  startDate: string;
  isPublic: boolean;
  notificationsEnabled: boolean;
  notificationTime?: string;
}

export interface ReadingHighlight {
  id: string;
  bookId: string;
  content: string;
  page: number;
  date: string; // ISO string
  color?: string;
  note?: string;
}

interface ReadingContextType {
  readingSessions: ReadingSession[];
  goals: ReadingGoal[];
  highlights: ReadingHighlight[];
  addReadingSession: (session: Omit<ReadingSession, 'id'>) => Promise<ReadingSession>;
  updateReadingSession: (session: ReadingSession) => Promise<void>;
  deleteReadingSession: (id: string) => Promise<void>;
  addGoal: (goal: Omit<ReadingGoal, 'id' | 'progress' | 'completed'>) => Promise<ReadingGoal>;
  updateGoal: (goal: ReadingGoal) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  addHighlight: (highlight: Omit<ReadingHighlight, 'id'>) => Promise<ReadingHighlight>;
  updateHighlight: (highlight: ReadingHighlight) => Promise<void>;
  deleteHighlight: (id: string) => Promise<void>;
  getTodayReadingTime: () => number;
  getReadingStreak: () => number;
  getRecentHighlights: (limit?: number) => ReadingHighlight[];
  refreshGoals: () => Promise<void>;
  getReadingSessionsByDate: (startDate: string, endDate: string) => ReadingSession[];
  getReadingStats: () => {
    dailyMinutes: number;
    weeklyMinutes: number;
    monthlyMinutes: number;
    genreDistribution: {
      genre: string;
      percentage: number;
      color: string;
    }[];
    readingTimeDistribution: {
      hour: number;
      minutes: number;
    }[];
  };
}

const ReadingContext = createContext<ReadingContextType | undefined>(undefined);

export const useReadingContext = () => {
  const context = useContext(ReadingContext);
  if (!context) {
    throw new Error('useReadingContext must be used within a ReadingProvider');
  }
  return context;
};

export const ReadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [readingSessions, setReadingSessions] = useState<ReadingSession[]>([]);
  const [goals, setGoals] = useState<ReadingGoal[]>([]);
  const [highlights, setHighlights] = useState<ReadingHighlight[]>([]);

  // Load data from AsyncStorage when user changes
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        // Clear data when user logs out
        setReadingSessions([]);
        setGoals([]);
        setHighlights([]);
        return;
      }

      try {
        // Load reading sessions
        const sessionsJson = await AsyncStorage.getItem(`reading_sessions_${user.id}`);
        if (sessionsJson) {
          setReadingSessions(JSON.parse(sessionsJson));
        }

        // Load goals
        const goalsJson = await AsyncStorage.getItem(`reading_goals_${user.id}`);
        if (goalsJson) {
          setGoals(JSON.parse(goalsJson));
        }

        // Load highlights
        const highlightsJson = await AsyncStorage.getItem(`reading_highlights_${user.id}`);
        if (highlightsJson) {
          setHighlights(JSON.parse(highlightsJson));
        }
      } catch (error) {
        console.error('Error loading reading data:', error);
      }
    };

    loadData();
  }, [user]);

  // Save reading sessions to AsyncStorage when they change
  useEffect(() => {
    const saveReadingSessions = async () => {
      if (!user) return;
      
      try {
        await AsyncStorage.setItem(
          `reading_sessions_${user.id}`,
          JSON.stringify(readingSessions)
        );
      } catch (error) {
        console.error('Error saving reading sessions:', error);
      }
    };

    saveReadingSessions();
  }, [readingSessions, user]);

  // Save goals to AsyncStorage when they change
  useEffect(() => {
    const saveGoals = async () => {
      if (!user) return;
      
      try {
        await AsyncStorage.setItem(
          `reading_goals_${user.id}`,
          JSON.stringify(goals)
        );
      } catch (error) {
        console.error('Error saving reading goals:', error);
      }
    };

    saveGoals();
  }, [goals, user]);

  // Save highlights to AsyncStorage when they change
  useEffect(() => {
    const saveHighlights = async () => {
      if (!user) return;
      
      try {
        await AsyncStorage.setItem(
          `reading_highlights_${user.id}`,
          JSON.stringify(highlights)
        );
      } catch (error) {
        console.error('Error saving reading highlights:', error);
      }
    };

    saveHighlights();
  }, [highlights, user]);

  // Add a new reading session
  const addReadingSession = async (sessionData: Omit<ReadingSession, 'id'>): Promise<ReadingSession> => {
    const newSession: ReadingSession = {
      ...sessionData,
      id: Date.now().toString(),
    };
    
    setReadingSessions(prev => [...prev, newSession]);
    return newSession;
  };

  // Update an existing reading session
  const updateReadingSession = async (updatedSession: ReadingSession): Promise<void> => {
    setReadingSessions(prev => 
      prev.map(session => 
        session.id === updatedSession.id ? updatedSession : session
      )
    );
  };

  // Delete a reading session
  const deleteReadingSession = async (id: string): Promise<void> => {
    setReadingSessions(prev => prev.filter(session => session.id !== id));
  };

  // Add a new goal
  const addGoal = async (goalData: Omit<ReadingGoal, 'id' | 'progress' | 'completed'>): Promise<ReadingGoal> => {
    const newGoal: ReadingGoal = {
      ...goalData,
      id: Date.now().toString(),
      progress: 0,
      completed: false,
    };
    
    setGoals(prev => [...prev, newGoal]);
    return newGoal;
  };

  // Update an existing goal
  const updateGoal = async (updatedGoal: ReadingGoal): Promise<void> => {
    setGoals(prev => 
      prev.map(goal => 
        goal.id === updatedGoal.id ? updatedGoal : goal
      )
    );
  };

  // Delete a goal
  const deleteGoal = async (id: string): Promise<void> => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
  };

  // Add a new highlight
  const addHighlight = async (highlightData: Omit<ReadingHighlight, 'id'>): Promise<ReadingHighlight> => {
    const newHighlight: ReadingHighlight = {
      ...highlightData,
      id: Date.now().toString(),
    };
    
    setHighlights(prev => [...prev, newHighlight]);
    return newHighlight;
  };

  // Update an existing highlight
  const updateHighlight = async (updatedHighlight: ReadingHighlight): Promise<void> => {
    setHighlights(prev => 
      prev.map(highlight => 
        highlight.id === updatedHighlight.id ? updatedHighlight : highlight
      )
    );
  };

  // Delete a highlight
  const deleteHighlight = async (id: string): Promise<void> => {
    setHighlights(prev => prev.filter(highlight => highlight.id !== id));
  };

  // Get total reading time for today
  const getTodayReadingTime = (): number => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    return readingSessions
      .filter(session => session.date.startsWith(today))
      .reduce((total, session) => total + session.duration, 0);
  };

  // Get current reading streak (consecutive days with reading)
  const getReadingStreak = (): number => {
    if (readingSessions.length === 0) return 0;
    
    // Sort sessions by date (newest first)
    const sortedDates = [...readingSessions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map(session => session.date.split('T')[0]); // YYYY-MM-DD
    
    // Remove duplicates (multiple sessions on same day)
    const uniqueDates = Array.from(new Set(sortedDates));
    
    // Check if there's a session today
    const today = new Date().toISOString().split('T')[0];
    if (uniqueDates[0] !== today) return 0;
    
    let streak = 1;
    let currentDate = new Date(today);
    
    for (let i = 1; i < uniqueDates.length; i++) {
      // Move to previous day
      currentDate.setDate(currentDate.getDate() - 1);
      const expectedDate = currentDate.toISOString().split('T')[0];
      
      if (uniqueDates[i] === expectedDate) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  // Get recent highlights
  const getRecentHighlights = (limit = 5): ReadingHighlight[] => {
    return [...highlights]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  };

  const loadGoals = async () => {
    try {
      const currentGoal = await getCurrentReadingGoal();
      if (currentGoal) {
        setGoals([currentGoal]);
      }
    } catch (error) {
      console.error('목표 로딩 중 오류 발생:', error);
    }
  };

  const refreshGoals = async () => {
    await loadGoals();
  };

  useEffect(() => {
    loadGoals();
  }, []);

  // Get reading sessions between two dates
  const getReadingSessionsByDate = (startDate: string, endDate: string): ReadingSession[] => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return readingSessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= start && sessionDate <= end;
    });
  };

  // Get reading statistics
  const getReadingStats = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const dailyMinutes = getTodayReadingTime();
    
    const weeklySessions = getReadingSessionsByDate(
      startOfWeek.toISOString(),
      today.toISOString()
    );
    const weeklyMinutes = weeklySessions.reduce((sum, session) => sum + session.duration, 0);

    const monthlySessions = getReadingSessionsByDate(
      startOfMonth.toISOString(),
      today.toISOString()
    );
    const monthlyMinutes = monthlySessions.reduce((sum, session) => sum + session.duration, 0);

    // Mock genre distribution (실제로는 데이터베이스에서 가져와야 함)
    const genreDistribution = [
      { genre: '소설', percentage: 40, color: '#FF9500' },
      { genre: '자기계발', percentage: 25, color: '#34C759' },
      { genre: '역사', percentage: 20, color: '#007AFF' },
      { genre: '과학', percentage: 15, color: '#AF52DE' },
    ];

    // Mock reading time distribution (실제로는 데이터베이스에서 가져와야 함)
    const readingTimeDistribution = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      minutes: Math.floor(Math.random() * 60),
    }));

    return {
      dailyMinutes,
      weeklyMinutes,
      monthlyMinutes,
      genreDistribution,
      readingTimeDistribution,
    };
  };

  return (
    <ReadingContext.Provider
      value={{
        readingSessions,
        goals,
        highlights,
        addReadingSession,
        updateReadingSession,
        deleteReadingSession,
        addGoal,
        updateGoal,
        deleteGoal,
        addHighlight,
        updateHighlight,
        deleteHighlight,
        getTodayReadingTime,
        getReadingStreak,
        getRecentHighlights,
        refreshGoals,
        getReadingSessionsByDate,
        getReadingStats,
      }}
    >
      {children}
    </ReadingContext.Provider>
  );
};
