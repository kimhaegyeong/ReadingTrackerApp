import { useState, useEffect, useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  startReadingSession, 
  pauseReadingSession, 
  resumeReadingSession,
  endReadingSession 
} from '../store/readingLogSlice';
import { Book } from '@/features/books/types';

interface SessionState {
  isTracking: boolean;
  isPaused: boolean;
  sessionId: string | null;
  startTime: Date;
  pausedAt: Date | null;
  totalPausedTime: number; // in milliseconds
  elapsedTime: number; // in seconds
}

export const useReadingLogForm = (book: Book) => {
  const dispatch = useAppDispatch();
  const { readingSessions } = useAppSelector((state) => state.readingLog);
  
  // Form state
  const [startPage, setStartPage] = useState<string>('');
  const [endPage, setEndPage] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  
  // Session state
  const [sessionState, setSessionState] = useState<SessionState>({
    isTracking: false,
    isPaused: false,
    sessionId: null,
    startTime: new Date(),
    pausedAt: null,
    totalPausedTime: 0,
    elapsedTime: 0,
  });
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check for active reading session on mount and when book changes
  useEffect(() => {
    const activeSession = Object.values(readingSessions).find(
      (session) => session.bookId === book.id && !session.endTime
    );
    
    if (activeSession) {
      const isPaused = activeSession.pausedAt !== undefined;
      const startTime = new Date(activeSession.startTime);
      const pausedAt = isPaused && activeSession.pausedAt ? new Date(activeSession.pausedAt) : null;
      
      setSessionState(prev => ({
        ...prev,
        isTracking: true,
        isPaused,
        sessionId: activeSession.id,
        startTime,
        pausedAt,
        totalPausedTime: activeSession.totalPausedTime || 0,
        elapsedTime: isPaused && pausedAt 
          ? Math.floor((pausedAt.getTime() - startTime.getTime() - (activeSession.totalPausedTime || 0)) / 1000)
          : 0
      }));
      
      setStartPage(activeSession.startPage.toString());
      setNotes(activeSession.notes || '');
      
      if (!isPaused) {
        startTimer();
      }
    } else {
      resetForm();
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [book.id, readingSessions]);
  
  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setSessionState(prev => ({
        ...prev,
        elapsedTime: Math.floor((Date.now() - prev.startTime.getTime() - prev.totalPausedTime) / 1000)
      }));
    }, 1000);
  }, []);
  
  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const resetForm = () => {
    setStartPage('');
    setEndPage('');
    setNotes('');
    pauseTimer();
    
    setSessionState({
      isTracking: false,
      isPaused: false,
      sessionId: null,
      startTime: new Date(),
      pausedAt: null,
      totalPausedTime: 0,
      elapsedTime: 0,
    });
  };

  const handleStartSession = () => {
    const page = parseInt(startPage, 10) || 0;
    if (isNaN(page) || page < 0) {
      console.error('Invalid start page');
      return;
    }
    
    const now = new Date();
    const startTimeISO = now.toISOString();
    
    dispatch(
      startReadingSession({
        bookId: book.id,
        startTime: startTimeISO,
        startPage: page,
        notes,
        totalPausedTime: 0,
      })
    );
    
    setSessionState(prev => ({
      ...prev,
      isTracking: true,
      startTime: now,
      elapsedTime: 0,
      totalPausedTime: 0,
    }));
    
    startTimer();
  };
  
  const handlePauseSession = () => {
    if (!sessionState.sessionId || sessionState.isPaused) return;
    
    const now = new Date();
    const pausedAtISO = now.toISOString();
    
    dispatch(
      pauseReadingSession({
        id: sessionState.sessionId,
        pausedAt: pausedAtISO,
        totalPausedTime: sessionState.totalPausedTime,
      })
    );
    
    pauseTimer();
    
    setSessionState(prev => ({
      ...prev,
      isPaused: true,
      pausedAt: now,
    }));
  };
  
  const handleResumeSession = () => {
    if (!sessionState.sessionId || !sessionState.isPaused || !sessionState.pausedAt) return;
    
    const now = new Date();
    const pauseDuration = now.getTime() - sessionState.pausedAt.getTime();
    const newTotalPausedTime = sessionState.totalPausedTime + pauseDuration;
    
    dispatch(
      resumeReadingSession({
        id: sessionState.sessionId,
        totalPausedTime: newTotalPausedTime,
      })
    );
    
    setSessionState(prev => ({
      ...prev,
      isPaused: false,
      pausedAt: null,
      totalPausedTime: newTotalPausedTime,
    }));
    
    startTimer();
  };

  const handleEndSession = () => {
    if (!sessionState.sessionId) return;
    
    const endPageNum = parseInt(endPage, 10) || parseInt(startPage, 10) || 0;
    if (isNaN(endPageNum) || endPageNum < 0) {
      console.error('Invalid end page');
      return;
    }
    
    pauseTimer();
    
    const now = new Date().toISOString();
    const duration = Math.floor(sessionState.elapsedTime);
    
    dispatch(
      endReadingSession({
        id: sessionState.sessionId,
        endTime: now,
        endPage: endPageNum,
        notes,
        duration,
      })
    );
    
    resetForm();
  };

  const updateStartTime = (date: Date) => {
    if (!sessionState.isTracking) {
      setSessionState(prev => ({ ...prev, startTime: date }));
    }
  };

  const updateEndTime = (date: Date) => {
    // This function is kept for backward compatibility but doesn't do anything
    // as we now track the end time automatically when ending a session
  };

  // Format time in HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hrs.toString().padStart(2, '0'),
      mins.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };

  return {
    // Form state
    startPage,
    endPage,
    notes,
    startTime: sessionState.startTime,
    endTime: new Date(),
    isTracking: sessionState.isTracking,
    isPaused: sessionState.isPaused,
    sessionId: sessionState.sessionId,
    elapsedTime: sessionState.elapsedTime,
    formattedElapsedTime: formatTime(sessionState.elapsedTime),
    
    // Handlers
    setStartPage,
    setEndPage,
    setNotes,
    updateStartTime,
    updateEndTime,
    handleStartSession,
    handlePauseSession,
    handleResumeSession,
    handleEndSession,
    resetForm,
  };
};
