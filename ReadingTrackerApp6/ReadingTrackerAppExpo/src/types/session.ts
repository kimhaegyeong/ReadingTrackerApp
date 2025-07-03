export interface ReadingSession {
  id: number;
  book_id: number;
  start_time: string;
  end_time?: string;
  duration_minutes?: number;
  pages_read?: number;
  memo?: string;
  created_at?: string;
} 