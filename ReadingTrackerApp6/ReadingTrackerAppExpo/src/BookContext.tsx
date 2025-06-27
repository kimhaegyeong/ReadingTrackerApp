import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { DatabaseService, Book } from './DatabaseService';

interface BookContextType {
  books: Book[];
  fetchBooks: (service?: DatabaseService) => Promise<void>;
  addBook: (book: Omit<Book, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateBook: (id: number, update: Partial<Omit<Book, 'id'>>) => Promise<void>;
  deleteBook: (id: number) => Promise<void>;
  loading: boolean;
  error: any;
  dbService: DatabaseService | null;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider = ({ children }: { children: ReactNode }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [dbService, setDbService] = useState<DatabaseService | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        console.log('[BookContext] DB 인스턴스 초기화 시도');
        const service = await DatabaseService.getInstance();
        setDbService(service);
        await fetchBooks(service);
        console.log('[BookContext] DB 인스턴스 및 books 목록 초기화 완료');
      } catch (e) {
        setError(e);
        console.error('[BookContext] DB 초기화 오류', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fetchBooks = async (service?: DatabaseService) => {
    try {
      setLoading(true);
      const db = service || dbService;
      if (!db) {
        console.warn('[BookContext] fetchBooks: dbService 없음');
        return;
      }
      console.log('[BookContext] fetchBooks 호출');
      const all = await db.getAllBooks();
      setBooks(all);
      console.log('[BookContext] fetchBooks 결과:', all);
    } catch (e) {
      setError(e);
      console.error('[BookContext] fetchBooks 오류', e);
    } finally {
      setLoading(false);
    }
  };

  const addBook = async (book: Omit<Book, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      if (!dbService) {
        console.warn('[BookContext] addBook: dbService 없음');
        return;
      }
      // 중복 검사: 제목+저자 또는 ISBN이 동일한 책이 이미 있는지
      const all = await dbService.getAllBooks();
      const isDuplicate = all.some(
        b =>
          (book.isbn && b.isbn && b.isbn === book.isbn) ||
          (b.title === book.title && b.author === book.author)
      );
      if (isDuplicate) {
        alert('이미 동일한 책이 서재에 있습니다.');
        setLoading(false);
        return;
      }
      console.log('[BookContext] addBook 호출', book);
      await dbService.addBook(book);
      console.log('[BookContext] addBook DB 저장 완료');
      await fetchBooks(dbService);
    } catch (e) {
      setError(e);
      console.error('[BookContext] addBook 오류', e);
    } finally {
      setLoading(false);
    }
  };

  const updateBook = async (id: number, update: Partial<Omit<Book, 'id'>>) => {
    try {
      setLoading(true);
      if (!dbService) return;
      await dbService.updateBook(id, update);
      await fetchBooks();
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (id: number) => {
    try {
      setLoading(true);
      if (!dbService) return;
      await dbService.deleteBook(id);
      await fetchBooks();
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BookContext.Provider value={{ books, fetchBooks, addBook, updateBook, deleteBook, loading, error, dbService }}>
      {children}
    </BookContext.Provider>
  );
};

export const useBookContext = () => {
  const ctx = useContext(BookContext);
  if (!ctx) throw new Error('useBookContext must be used within a BookProvider');
  return ctx;
}; 