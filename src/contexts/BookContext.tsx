import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Book {
  id: string;
  title: string;
  authors: string[];
  thumbnail?: string;
}

interface BookContextType {
  books: Book[];
  addBook: (book: Book) => void;
}

const BookContext = createContext<BookContextType>({
  books: [],
  addBook: () => {},
});

export const useBookContext = () => useContext(BookContext);

export const BookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    AsyncStorage.getItem('mybooks').then(data => {
      if (data) setBooks(JSON.parse(data));
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('mybooks', JSON.stringify(books));
  }, [books]);

  const addBook = (book: Book) => {
    if (!books.find(b => b.id === book.id)) {
      setBooks([...books, book]);
    }
  };

  return (
    <BookContext.Provider value={{ books, addBook }}>
      {children}
    </BookContext.Provider>
  );
};
