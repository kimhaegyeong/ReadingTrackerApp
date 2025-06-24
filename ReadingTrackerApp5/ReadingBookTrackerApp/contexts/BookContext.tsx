import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { databaseService } from '@/lib/database';
import { books as dummyBooks } from "@/constants/dummyData";

export type BookStatus = '읽고 싶은' | '읽는 중' | '다 읽은';

export type Quote = { id: string; text: string; tags: string[] };
export type Note = { id: string; text: string; tags: string[] };
export type ReadingRecord = { date: string; readingTimeInSeconds: number };

export type Book = {
  id: string;
  title: string;
  author: string;
  status: BookStatus;
  quotes: Quote[];
  notes: Note[];
  readingRecords: ReadingRecord[];
  coverImage?: string; // Add cover image for search results
};

interface BookContextType {
  books: Book[];
  addBook: (book: Omit<Book, 'id' | 'quotes' | 'notes' | 'readingRecords'>) => void;
  removeBook: (id:string) => void;
  updateStatus: (id: string, status: BookStatus) => void;
  addQuote: (bookId: string, quote: Omit<Quote, "id">) => void;
  addNote: (bookId: string, note: Omit<Note, "id">) => void;
  removeQuote: (bookId: string, quoteId: string) => void;
  removeNote: (bookId: string, noteId: string) => void;
  updateQuoteTags: (bookId: string, quoteId: string, tags: string[]) => void;
  updateNoteTags: (bookId: string, noteId: string, tags: string[]) => void;
  addReadingTime: (bookId: string, readingTimeInSeconds: number) => void;
}

const STORAGE_KEY = 'books_data';
const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider = ({ children }: { children: ReactNode }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      // SQLite에서 데이터 우선 로드
      const sqliteBooks = await databaseService.loadBooks();
      if (sqliteBooks.length > 0) {
        setBooks(sqliteBooks);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sqliteBooks));
      } else {
        // SQLite에 데이터가 없으면 AsyncStorage에서 로드
        const savedBooks = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedBooks) {
          const parsedBooks = JSON.parse(savedBooks);
          setBooks(parsedBooks);
          await databaseService.saveBooks(parsedBooks);
        } else {
          // 첫 실행 시 더미 데이터로 초기화
          const initialBooks = dummyBooks.map(b => ({ ...b, quotes: [], notes: [], readingRecords: [] }));
          setBooks(initialBooks);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initialBooks));
          await databaseService.saveBooks(initialBooks);
        }
      }
    } catch (error) {
      console.error('데이터 로드 실패:', error);
      const initialBooks = dummyBooks.map(b => ({ ...b, quotes: [], notes: [], readingRecords: [] }));
      setBooks(initialBooks);
    } finally {
      setLoading(false);
    }
  };

  const saveBooks = async (newBooks: Book[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newBooks));
      await databaseService.saveBooks(newBooks);
    } catch (error) {
      console.error('데이터 저장 실패:', error);
    }
  };

  const addBook = (book: Omit<Book, 'id' | 'quotes' | 'notes' | 'readingRecords'>) => {
    const newBook: Book = {
      ...book,
      id: `${Date.now()}-${Math.random()}`,
      quotes: [],
      notes: [],
      readingRecords: [],
    };
    setBooks((prev) => {
      const updated = [...prev, newBook];
      saveBooks(updated);
      return updated;
    });
  };
  
  const removeBook = (id: string) => {
    Alert.alert(
      "책 삭제",
      "정말로 이 책을 삭제하시겠습니까?",
      [
        {
          text: "취소",
          style: "cancel"
        },
        { 
          text: "삭제", 
          onPress: () => {
            setBooks((prev) => {
              const updated = prev.filter((b) => b.id !== id);
              saveBooks(updated);
              return updated;
            });
          },
          style: "destructive"
        }
      ]
    );
  };

  const updateStatus = (id: string, status: BookStatus) => {
    setBooks(prev => {
      const updated = prev.map(b => b.id === id ? { ...b, status } : b);
      saveBooks(updated);
      return updated;
    });
  };

  const addQuote = (bookId: string, quote: Omit<Quote, "id">) => {
    setBooks(prev => {
      const updated = prev.map(b => b.id === bookId ? { ...b, quotes: [...b.quotes, { ...quote, id: Date.now() + "" }] } : b);
      saveBooks(updated);
      return updated;
    });
  };

  const addNote = (bookId: string, note: Omit<Note, "id">) => {
    setBooks(prev => {
      const updated = prev.map(b => b.id === bookId ? { ...b, notes: [...b.notes, { ...note, id: Date.now() + "" }] } : b);
      saveBooks(updated);
      return updated;
    });
  };

  const removeQuote = (bookId: string, quoteId: string) => {
    setBooks(prev => {
      const updated = prev.map(b => b.id === bookId ? { ...b, quotes: b.quotes.filter(q => q.id !== quoteId) } : b);
      saveBooks(updated);
      return updated;
    });
  };

  const removeNote = (bookId: string, noteId: string) => {
    setBooks(prev => {
      const updated = prev.map(b => b.id === bookId ? { ...b, notes: b.notes.filter(n => n.id !== noteId) } : b);
      saveBooks(updated);
      return updated;
    });
  };

  const updateQuoteTags = (bookId: string, quoteId: string, tags: string[]) => {
    setBooks(prev => {
      const updated = prev.map(b => b.id === bookId ? { ...b, quotes: b.quotes.map(q => q.id === quoteId ? { ...q, tags } : q) } : b);
      saveBooks(updated);
      return updated;
    });
  };

  const updateNoteTags = (bookId: string, noteId: string, tags: string[]) => {
    setBooks(prev => {
      const updated = prev.map(b => b.id === bookId ? { ...b, notes: b.notes.map(n => n.id === noteId ? { ...n, tags } : n) } : b);
      saveBooks(updated);
      return updated;
    });
  };

  const addReadingTime = (bookId: string, readingTimeInSeconds: number) => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    setBooks(prev => {
      const updated = prev.map(b => {
        if (b.id !== bookId) return b;
        
        const newRecords = [...b.readingRecords];
        const todayRecordIndex = newRecords.findIndex(r => r.date === today);

        if (todayRecordIndex > -1) {
          newRecords[todayRecordIndex] = {
            ...newRecords[todayRecordIndex],
            readingTimeInSeconds: newRecords[todayRecordIndex].readingTimeInSeconds + readingTimeInSeconds
          };
        } else {
          newRecords.push({ date: today, readingTimeInSeconds });
        }
        
        return { ...b, readingRecords: newRecords };
      });
      saveBooks(updated);
      return updated;
    });
  };

  if (loading) return null;

  return (
    <BookContext.Provider value={{ books, addBook, removeBook, updateStatus, addQuote, addNote, removeQuote, removeNote, updateQuoteTags, updateNoteTags, addReadingTime }}>
      {children}
    </BookContext.Provider>
  );
};

export const useBookContext = () => {
  const ctx = useContext(BookContext);
  if (!ctx) throw new Error("BookContext must be used within BookProvider");
  return ctx;
}; 