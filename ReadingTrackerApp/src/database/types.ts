export interface Book {
  id?: number;
  title: string;
  author?: string;
  isbn?: string;
  cover_image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ReadingGoal {
  id: number;
  target: number;
  progress: number;
  completed: boolean;
  period: 'yearly' | 'monthly';
  endDate: string;
  startDate: string;
  isPublic: boolean;
  notificationsEnabled: boolean;
  notificationTime?: string;
  yearly_books?: number;
  monthly_books?: number;
  yearly_pages?: number;
  monthly_pages?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ReadingSession {
  id?: number;
  book_id: number;
  start_time: string;
  end_time?: string;
  pages_read?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
} 