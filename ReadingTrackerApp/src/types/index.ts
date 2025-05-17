export interface Book {
  id: string;
  title: string;
  authors?: string[];
  totalPages: number;
  thumbnail?: string;
  lastReadPage: number;
  created_at?: string;
} 