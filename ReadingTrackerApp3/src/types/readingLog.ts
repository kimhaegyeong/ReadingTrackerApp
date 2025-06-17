/**
 * Reading Log Data Model
 * Defines the TypeScript interfaces for the reading log and annotation system
 */

/**
 * Represents a single reading session
 */
export interface ReadingSession {
  id: string;
  bookId: string; // Reference to the book this session is for
  startTime: string; // ISO date string
  endTime?: string; // ISO date string (optional for in-progress sessions)
  pausedAt?: string; // ISO date string when session was paused
  totalPausedTime: number; // Total time paused in milliseconds
  duration: number; // Duration in seconds (active reading time)
  startPage: number;
  endPage: number;
  notes?: string;
  isPaused?: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

/**
 * Represents an annotation or note on a specific part of a book
 */
export interface Annotation {
  id: string;
  bookId: string; // Reference to the book
  pageNumber: number;
  text: string;
  color?: string; // Optional highlight color
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

/**
 * Represents the reading progress for a specific book
 */
export interface BookProgress {
  bookId: string;
  currentPage: number;
  isReading: boolean;
  status: 'not_started' | 'reading' | 'on_hold' | 'completed' | 'dropped';
  rating?: number; // 1-5 stars
  lastReadAt?: string; // ISO date string
  readingSessions: string[]; // Array of ReadingSession IDs
  annotations: string[]; // Array of Annotation IDs
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

/**
 * Payload for creating a new reading session
 */
export interface CreateReadingSessionPayload {
  bookId: string;
  startTime: string;
  startPage: number;
  notes?: string;
  totalPausedTime?: number;
}

/**
 * Payload for updating a reading session
 */
export interface PauseReadingSessionPayload {
  id: string;
  pausedAt: string;
  totalPausedTime: number;
}

export interface ResumeReadingSessionPayload {
  id: string;
  totalPausedTime: number;
}

export interface UpdateReadingSessionPayload {
  id: string;
  endTime?: string;
  endPage: number;
  notes?: string;
  duration?: number;
}

/**
 * Payload for creating a new annotation
 */
export interface CreateAnnotationPayload {
  bookId: string;
  pageNumber: number;
  text: string;
  color?: string;
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

/**
 * Payload for updating an annotation
 */
export interface UpdateAnnotationPayload {
  id: string;
  text?: string;
  color?: string;
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

/**
 * State shape for the reading log slice
 */
export interface ReadingLogState {
  readingSessions: {
    [id: string]: ReadingSession;
  };
  annotations: {
    [id: string]: Annotation;
  };
  bookProgress: {
    [bookId: string]: BookProgress;
  };
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
