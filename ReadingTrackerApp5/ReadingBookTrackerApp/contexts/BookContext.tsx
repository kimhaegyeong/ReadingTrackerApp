import React, { createContext, useContext, useState, ReactNode } from "react";
import { Alert } from "react-native";
import { books as dummyBooks } from "@/constants/dummyData";

export type BookStatus = '읽고 싶은' | '읽는 중' | '다 읽은';

export type Quote = { id: string; text: string; tags: string[] };
export type Note = { id: string; text: string; tags: string[] };

export type Book = {
  id: string;
  title: string;
  author: string;
  status: BookStatus;
  quotes: Quote[];
  notes: Note[];
  coverImage?: string; // Add cover image for search results
};

interface BookContextType {
  books: Book[];
  addBook: (book: Omit<Book, 'id' | 'quotes' | 'notes'>) => void;
  removeBook: (id:string) => void;
  updateStatus: (id: string, status: BookStatus) => void;
  addQuote: (bookId: string, quote: Omit<Quote, "id">) => void;
  addNote: (bookId: string, note: Omit<Note, "id">) => void;
  removeQuote: (bookId: string, quoteId: string) => void;
  removeNote: (bookId: string, noteId: string) => void;
  updateQuoteTags: (bookId: string, quoteId: string, tags: string[]) => void;
  updateNoteTags: (bookId: string, noteId: string, tags: string[]) => void;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider = ({ children }: { children: ReactNode }) => {
  const [books, setBooks] = useState<Book[]>(
    dummyBooks.map(b => ({ ...b, quotes: [], notes: [] }))
  );

  const addBook = (book: Omit<Book, 'id' | 'quotes' | 'notes'>) => {
    const newBook: Book = {
      ...book,
      id: `${Date.now()}-${Math.random()}`,
      quotes: [],
      notes: [],
    };
    setBooks((prev) => [...prev, newBook]);
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
          onPress: () => setBooks((prev) => prev.filter((b) => b.id !== id)),
          style: "destructive"
        }
      ]
    );
  };

  const updateStatus = (id: string, status: BookStatus) => setBooks(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  const addQuote = (bookId: string, quote: Omit<Quote, "id">) => setBooks(prev => prev.map(b => b.id === bookId ? { ...b, quotes: [...b.quotes, { ...quote, id: Date.now() + "" }] } : b));
  const addNote = (bookId: string, note: Omit<Note, "id">) => setBooks(prev => prev.map(b => b.id === bookId ? { ...b, notes: [...b.notes, { ...note, id: Date.now() + "" }] } : b));
  const removeQuote = (bookId: string, quoteId: string) => setBooks(prev => prev.map(b => b.id === bookId ? { ...b, quotes: b.quotes.filter(q => q.id !== quoteId) } : b));
  const removeNote = (bookId: string, noteId: string) => setBooks(prev => prev.map(b => b.id === bookId ? { ...b, notes: b.notes.filter(n => n.id !== noteId) } : b));
  const updateQuoteTags = (bookId: string, quoteId: string, tags: string[]) => setBooks(prev => prev.map(b => b.id === bookId ? { ...b, quotes: b.quotes.map(q => q.id === quoteId ? { ...q, tags } : q) } : b));
  const updateNoteTags = (bookId: string, noteId: string, tags: string[]) => setBooks(prev => prev.map(b => b.id === bookId ? { ...b, notes: b.notes.map(n => n.id === noteId ? { ...n, tags } : n) } : b));

  return (
    <BookContext.Provider value={{ books, addBook, removeBook, updateStatus, addQuote, addNote, removeQuote, removeNote, updateQuoteTags, updateNoteTags }}>
      {children}
    </BookContext.Provider>
  );
};

export const useBookContext = () => {
  const ctx = useContext(BookContext);
  if (!ctx) throw new Error("BookContext must be used within BookProvider");
  return ctx;
}; 