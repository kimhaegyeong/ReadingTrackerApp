import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import {
  ReadingSession,
  Annotation,
  BookProgress,
  CreateReadingSessionPayload,
  UpdateReadingSessionPayload,
  PauseReadingSessionPayload,
  ResumeReadingSessionPayload,
  CreateAnnotationPayload,
  UpdateAnnotationPayload,
  ReadingLogState,
} from '@/types/readingLog';

const initialState: ReadingLogState = {
  readingSessions: {},
  annotations: {},
  bookProgress: {},
  status: 'idle',
  error: null,
};

// Async thunks for API calls would go here

export const readingLogSlice = createSlice({
  name: 'readingLog',
  initialState,
  reducers: {
    // Session actions
    startReadingSession: (state, action: PayloadAction<CreateReadingSessionPayload>) => {
      const sessionId = uuidv4();
      const now = new Date().toISOString();
      const newSession: ReadingSession = {
        id: sessionId,
        bookId: action.payload.bookId,
        startTime: action.payload.startTime,
        startPage: action.payload.startPage,
        endPage: action.payload.startPage, // Will be updated when session ends
        duration: 0, // Will track active reading time in seconds
        totalPausedTime: action.payload.totalPausedTime || 0,
        isPaused: false,
        notes: action.payload.notes || '',
        createdAt: now,
        updatedAt: now,
      };

      state.readingSessions[sessionId] = newSession;

      // Update book progress
      if (!state.bookProgress[action.payload.bookId]) {
        state.bookProgress[action.payload.bookId] = {
          bookId: action.payload.bookId,
          currentPage: action.payload.startPage,
          isReading: true,
          status: 'reading',
          lastReadAt: now,
          readingSessions: [sessionId],
          annotations: [],
          createdAt: now,
          updatedAt: now,
        };
      } else {
        const progress = state.bookProgress[action.payload.bookId];
        progress.isReading = true;
        progress.status = 'reading';
        progress.lastReadAt = now;
        progress.readingSessions.push(sessionId);
        progress.updatedAt = now;
      }
    },

    pauseReadingSession: (state, action: PayloadAction<PauseReadingSessionPayload>) => {
      const session = state.readingSessions[action.payload.id];
      if (!session) return;

      session.isPaused = true;
      session.pausedAt = action.payload.pausedAt;
      session.totalPausedTime = action.payload.totalPausedTime;
      session.updatedAt = new Date().toISOString();
      
      // Update book progress
      const progress = state.bookProgress[session.bookId];
      if (progress) {
        progress.isReading = false;
        progress.updatedAt = new Date().toISOString();
      }
    },
    
    resumeReadingSession: (state, action: PayloadAction<ResumeReadingSessionPayload>) => {
      const session = state.readingSessions[action.payload.id];
      if (!session) return;
      
      session.isPaused = false;
      session.pausedAt = undefined;
      session.totalPausedTime = action.payload.totalPausedTime;
      session.updatedAt = new Date().toISOString();
      
      // Update book progress
      const progress = state.bookProgress[session.bookId];
      if (progress) {
        progress.isReading = true;
        progress.updatedAt = new Date().toISOString();
      }
    },

    endReadingSession: (state, action: PayloadAction<UpdateReadingSessionPayload>) => {
      const session = state.readingSessions[action.payload.id];
      if (!session) return;

      const endTime = action.payload.endTime || new Date().toISOString();
      const start = new Date(session.startTime);
      const end = new Date(endTime);
      const totalDuration = Math.round((end.getTime() - start.getTime()) / 1000); // in seconds
      const activeReadingTime = action.payload.duration !== undefined 
        ? action.payload.duration 
        : totalDuration - (session.totalPausedTime / 1000);

      session.endTime = endTime;
      session.endPage = action.payload.endPage;
      session.duration = Math.max(0, Math.round(activeReadingTime));
      session.isPaused = false;
      session.pausedAt = undefined;
      
      if (action.payload.notes !== undefined) {
        session.notes = action.payload.notes;
      }
      
      session.updatedAt = new Date().toISOString();

      // Update book progress
      const progress = state.bookProgress[session.bookId];
      if (progress) {
        progress.currentPage = action.payload.endPage;
        progress.isReading = false;
        progress.updatedAt = new Date().toISOString();
      }
    },

    // Annotation actions
    addAnnotation: (state, action: PayloadAction<CreateAnnotationPayload>) => {
      const annotationId = uuidv4();
      const now = new Date().toISOString();
      const newAnnotation: Annotation = {
        id: annotationId,
        bookId: action.payload.bookId,
        pageNumber: action.payload.pageNumber,
        text: action.payload.text,
        color: action.payload.color,
        position: action.payload.position,
        createdAt: now,
        updatedAt: now,
      };

      state.annotations[annotationId] = newAnnotation;

      // Add to book progress
      if (!state.bookProgress[action.payload.bookId]) {
        state.bookProgress[action.payload.bookId] = {
          bookId: action.payload.bookId,
          currentPage: 0,
          isReading: false,
          status: 'not_started',
          readingSessions: [],
          annotations: [annotationId],
          createdAt: now,
          updatedAt: now,
        };
      } else {
        state.bookProgress[action.payload.bookId].annotations.push(annotationId);
        state.bookProgress[action.payload.bookId].updatedAt = now;
      }
    },

    updateAnnotation: (state, action: PayloadAction<UpdateAnnotationPayload>) => {
      const annotation = state.annotations[action.payload.id];
      if (!annotation) return;

      if (action.payload.text !== undefined) {
        annotation.text = action.payload.text;
      }
      if (action.payload.color !== undefined) {
        annotation.color = action.payload.color;
      }
      if (action.payload.position !== undefined) {
        annotation.position = action.payload.position;
      }
      annotation.updatedAt = new Date().toISOString();
    },

    deleteAnnotation: (state, action: PayloadAction<string>) => {
      const annotation = state.annotations[action.payload];
      if (!annotation) return;

      // Remove from book progress
      const progress = state.bookProgress[annotation.bookId];
      if (progress) {
        progress.annotations = progress.annotations.filter(id => id !== action.payload);
        progress.updatedAt = new Date().toISOString();
      }

      // Delete the annotation
      delete state.annotations[action.payload];
    },

    // Book progress actions
    updateBookProgress: (state, action: PayloadAction<{ bookId: string; currentPage: number }>) => {
      const { bookId, currentPage } = action.payload;
      const now = new Date().toISOString();

      if (!state.bookProgress[bookId]) {
        state.bookProgress[bookId] = {
          bookId,
          currentPage,
          isReading: false,
          status: 'not_started',
          readingSessions: [],
          annotations: [],
          createdAt: now,
          updatedAt: now,
        };
      } else {
        state.bookProgress[bookId].currentPage = currentPage;
        state.bookProgress[bookId].updatedAt = now;
      }
    },

    updateBookStatus: (state, action: PayloadAction<{ bookId: string; status: BookProgress['status'] }>) => {
      const { bookId, status } = action.payload;
      const now = new Date().toISOString();

      if (state.bookProgress[bookId]) {
        state.bookProgress[bookId].status = status;
        state.bookProgress[bookId].updatedAt = now;
      }
    },

    // Reset state
    resetReadingLog: () => initialState,
  },
});

export const {
  startReadingSession,
  pauseReadingSession,
  resumeReadingSession,
  endReadingSession,
  addAnnotation,
  updateAnnotation,
  deleteAnnotation,
  updateBookProgress,
  updateBookStatus,
  resetReadingLog,
} = readingLogSlice.actions;

export default readingLogSlice.reducer;
