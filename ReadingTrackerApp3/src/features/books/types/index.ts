export enum BookStatus {
  Unread = 'unread',
  Reading = 'reading',
  Finished = 'finished',
  DidNotFinish = 'didNotFinish',
}

export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage?: string;
  description?: string;
  pages?: number;
  currentPage: number;
  isbn?: string;
  publishedDate?: string;
  publisher?: string;
  categories: string[];
  rating?: number;
  notes?: string;
  status: BookStatus;
  startedAt?: string;
  finishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type AddBookData = Omit<Book, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateBookData = Partial<AddBookData>;
