export interface Book {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  pages?: number;
  status: string;
  cover_color?: string;
  cover?: string;
  created_at?: string;
  updated_at?: string;
  completed_date?: string;
  genre?: string;
} 