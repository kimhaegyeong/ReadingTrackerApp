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
  pages: number;
  currentPage: number;
  status: BookStatus;
  rating?: number;
  notes?: string;
  startedAt?: string;
  finishedAt?: string;
  createdAt: string;
  updatedAt: string;
  isbn?: string;
  description?: string;
  publisher?: string;
  publishedDate?: string;
  categories?: string[];
}
