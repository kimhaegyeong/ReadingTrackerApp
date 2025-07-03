import { useContext } from 'react';
import { BookContext } from '../BookContext';
import type { Book } from '../types/book';

export interface BookContextType {
  books: Book[];
  fetchBooks: () => Promise<void>;
  addBook: (book: Omit<Book, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateBook: (id: number, update: Partial<Omit<Book, 'id'>>) => Promise<void>;
  deleteBook: (id: number) => Promise<void>;
  loading: boolean;
  error: any;
  dbService: any;
}

export const useBooks = (): BookContextType => useContext(BookContext as React.Context<BookContextType>); 