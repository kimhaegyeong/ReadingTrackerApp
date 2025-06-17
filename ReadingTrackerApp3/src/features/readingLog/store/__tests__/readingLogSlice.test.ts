import readingLogReducer, {
  startReadingSession,
  pauseReadingSession,
  resumeReadingSession,
  endReadingSession,
  addAnnotation,
  updateAnnotation,
  deleteAnnotation,
  updateBookProgress,
  updateBookStatus,
} from '../readingLogSlice';
import { ReadingLogState } from '@/types/readingLog';

describe('readingLogSlice', () => {
  const initialState: ReadingLogState = {
    readingSessions: {},
    annotations: {},
    bookProgress: {},
    status: 'idle',
    error: null,
  };

  it('should handle initial state', () => {
    expect(readingLogReducer(undefined, { type: 'unknown' })).toEqual({
      readingSessions: {},
      annotations: {},
      bookProgress: {},
      status: 'idle',
      error: null,
    });
  });

  describe('reading sessions', () => {
    it('should handle starting a reading session', () => {
      const now = new Date().toISOString();
      const actual = readingLogReducer(
        initialState,
        startReadingSession({
          bookId: 'book-1',
          startTime: now,
          startPage: 1,
          notes: 'Starting the book',
        })
      );

      const sessionId = Object.keys(actual.readingSessions)[0];
      expect(actual.readingSessions[sessionId]).toMatchObject({
        bookId: 'book-1',
        startTime: now,
        startPage: 1,
        endPage: 1,
        duration: 0,
        notes: 'Starting the book',
      });

      expect(actual.bookProgress['book-1']).toMatchObject({
        bookId: 'book-1',
        currentPage: 1,
        isReading: true,
        status: 'reading',
        readingSessions: [sessionId],
      });
    });

    it('should handle pausing a reading session', () => {
      const startTime = new Date('2025-01-01T10:00:00Z').toISOString();
      const pausedAt = new Date('2025-01-01T10:30:00Z').toISOString();
      
      // Start a session
      const stateWithSession = readingLogReducer(
        initialState,
        startReadingSession({
          bookId: 'book-1',
          startTime,
          startPage: 1,
        })
      );
      
      const sessionId = Object.keys(stateWithSession.readingSessions)[0];
      
      // Pause the session after 30 minutes
      const actual = readingLogReducer(
        stateWithSession,
        pauseReadingSession({
          id: sessionId,
          pausedAt,
          totalPausedTime: 0, // No previous pauses
        })
      );

      expect(actual.readingSessions[sessionId]).toMatchObject({
        isPaused: true,
        pausedAt,
        totalPausedTime: 0,
        duration: 0, // No active reading time yet
      });

      expect(actual.bookProgress['book-1']).toMatchObject({
        isReading: false,
      });
    });

    it('should handle resuming a reading session', () => {
      const startTime = new Date('2025-01-01T10:00:00Z').toISOString();
      const pausedAt = new Date('2025-01-01T10:30:00Z').toISOString();
      const resumeTime = new Date('2025-01-01T11:00:00Z').toISOString();
      
      // Start and pause a session
      let state = readingLogReducer(
        initialState,
        startReadingSession({
          bookId: 'book-1',
          startTime,
          startPage: 1,
        })
      );
      
      const sessionId = Object.keys(state.readingSessions)[0];
      
      state = readingLogReducer(
        state,
        pauseReadingSession({
          id: sessionId,
          pausedAt,
          totalPausedTime: 0,
        })
      );
      
      // Resume the session after 30 minutes of being paused
      const actual = readingLogReducer(
        state,
        resumeReadingSession({
          id: sessionId,
          totalPausedTime: 1800000, // 30 minutes in ms
        })
      );

      expect(actual.readingSessions[sessionId]).toMatchObject({
        isPaused: false,
        pausedAt: undefined,
        totalPausedTime: 1800000,
        duration: 0, // No active reading time yet
      });

      expect(actual.bookProgress['book-1']).toMatchObject({
        isReading: true,
      });
    });

    it('should handle ending a reading session with pauses', () => {
      const startTime = new Date('2025-01-01T10:00:00Z').toISOString();
      const pausedAt = new Date('2025-01-01T10:30:00Z').toISOString();
      const resumedAt = new Date('2025-01-01T11:00:00Z').toISOString();
      const endTime = new Date('2025-01-01T11:30:00Z').toISOString();
      
      // Start, pause, and resume a session
      let state = readingLogReducer(
        initialState,
        startReadingSession({
          bookId: 'book-1',
          startTime,
          startPage: 1,
        })
      );
      
      const sessionId = Object.keys(state.readingSessions)[0];
      
      // Pause after 30 minutes
      state = readingLogReducer(
        state,
        pauseReadingSession({
          id: sessionId,
          pausedAt,
          totalPausedTime: 0,
        })
      );
      
      // Resume after 30 minutes of being paused
      state = readingLogReducer(
        state,
        resumeReadingSession({
          id: sessionId,
          totalPausedTime: 1800000, // 30 minutes in ms
        })
      );
      
      // End the session after 30 more minutes of reading
      const actual = readingLogReducer(
        state,
        endReadingSession({
          id: sessionId,
          endTime,
          endPage: 15,
          duration: 1800, // 30 minutes of active reading time (30s + 0s)
          notes: 'Finished with pauses',
        })
      );

      expect(actual.readingSessions[sessionId]).toMatchObject({
        endTime,
        endPage: 15,
        duration: 1800, // 30 minutes of active reading time
        totalPausedTime: 1800000, // 30 minutes of paused time
        isPaused: false,
        notes: 'Finished with pauses',
      });

      expect(actual.bookProgress['book-1']).toMatchObject({
        currentPage: 15,
        isReading: false,
      });
    });
  });

  describe('annotations', () => {
    it('should handle adding an annotation', () => {
      const actual = readingLogReducer(
        initialState,
        addAnnotation({
          bookId: 'book-1',
          pageNumber: 42,
          text: 'Important quote',
          color: '#ffeb3b',
        })
      );

      const annotationId = Object.keys(actual.annotations)[0];
      expect(actual.annotations[annotationId]).toMatchObject({
        bookId: 'book-1',
        pageNumber: 42,
        text: 'Important quote',
        color: '#ffeb3b',
      });

      expect(actual.bookProgress['book-1'].annotations).toContain(annotationId);
    });

    it('should handle updating an annotation', () => {
      const stateWithAnnotation = readingLogReducer(
        initialState,
        addAnnotation({
          bookId: 'book-1',
          pageNumber: 42,
          text: 'Important quote',
        })
      );
      
      const annotationId = Object.keys(stateWithAnnotation.annotations)[0];
      
      const actual = readingLogReducer(
        stateWithAnnotation,
        updateAnnotation({
          id: annotationId,
          text: 'Updated quote',
          color: '#ffeb3b',
        })
      );

      expect(actual.annotations[annotationId]).toMatchObject({
        text: 'Updated quote',
        color: '#ffeb3b',
      });
    });

    it('should handle deleting an annotation', () => {
      const stateWithAnnotation = readingLogReducer(
        initialState,
        addAnnotation({
          bookId: 'book-1',
          pageNumber: 42,
          text: 'Important quote',
        })
      );
      
      const annotationId = Object.keys(stateWithAnnotation.annotations)[0];
      
      const actual = readingLogReducer(
        stateWithAnnotation,
        deleteAnnotation(annotationId)
      );

      expect(actual.annotations[annotationId]).toBeUndefined();
      expect(actual.bookProgress['book-1'].annotations).not.toContain(annotationId);
    });
  });

  describe('book progress', () => {
    it('should handle updating book progress', () => {
      const actual = readingLogReducer(
        initialState,
        updateBookProgress({
          bookId: 'book-1',
          currentPage: 50,
        })
      );

      expect(actual.bookProgress['book-1']).toMatchObject({
        bookId: 'book-1',
        currentPage: 50,
        isReading: false,
        status: 'not_started',
      });
    });

    it('should handle updating book status', () => {
      const stateWithBook = readingLogReducer(
        initialState,
        updateBookProgress({
          bookId: 'book-1',
          currentPage: 1,
        })
      );
      
      const actual = readingLogReducer(
        stateWithBook,
        updateBookStatus({
          bookId: 'book-1',
          status: 'reading',
        })
      );

      expect(actual.bookProgress['book-1']).toMatchObject({
        status: 'reading',
      });
    });
  });
});
