export interface ReadingRecord {
  id?: number;
  bookId: string;
  date: string;
  startPage: number;
  endPage: number;
  readingTime: number;
  emotion: string;
  satisfaction: number;
  memo: string;
  tags: string[];
}

export interface UpdateReadingRecord {
  id: number;
  bookId: string;
  date: string;
  startPage: number;
  endPage: number;
  readingTime: number;
  emotion: string;
  satisfaction: number;
  memo: string;
  tags: string[];
} 