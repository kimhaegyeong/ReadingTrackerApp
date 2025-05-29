import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type BookStatus = 'reading' | 'completed' | 'planned';

export interface Book {
  id: string;
  title: string;
  authors: string[];
  description: string;
  thumbnail: string;
  publishedDate: string;
  pageCount: number;
  status: BookStatus;
  currentPage: number;
  startDate: string;
  endDate: string | null;
  rating: number;
  review: string;
  bookmarks: Bookmark[];
  reviews: Review[];
  readingSessions: ReadingSession[];
  categories: string[];
  publisher: string;
  language: string;
  imageLinks: {
    thumbnail?: string;
    smallThumbnail?: string;
  };
  isbn: string;
  userSpecificData: {
    status: BookStatus;
    currentPage: number;
    startDate: string;
    endDate: string | null;
    rating: number;
    review: string;
    bookmarks: Bookmark[];
    reviews: Review[];
    readingSessions: ReadingSession[];
  };
}

export interface Bookmark {
  id: string;
  page: number;
  note: string;
  createdAt: string;
}

export interface Review {
  id: string;
  rating: number;
  content: string;
  createdAt: string;
}

export interface ReadingSession {
  id: string;
  startTime: string;
  endTime: string;
  pagesRead: number;
  notes: string;
}

interface BooksState {
  books: Book[];
  loading: boolean;
  error: string | null;
  currentBook: Book | null;
}

const initialState: BooksState = {
  books: [],
  loading: false,
  error: null,
  currentBook: null,
};

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    addBook: (state, action: PayloadAction<Book>) => {
      state.books.push(action.payload);
    },
    updateBook: (state, action: PayloadAction<Book>) => {
      const index = state.books.findIndex(book => book.id === action.payload.id);
      if (index !== -1) {
        state.books[index] = action.payload;
      }
    },
    deleteBook: (state, action: PayloadAction<string>) => {
      state.books = state.books.filter(book => book.id !== action.payload);
    },
    addBookmark: (state, action: PayloadAction<{ bookId: string; bookmark: Bookmark }>) => {
      const book = state.books.find(b => b.id === action.payload.bookId);
      if (book) {
        book.bookmarks.push(action.payload.bookmark);
      }
    },
    updateBookmark: (state, action: PayloadAction<{ bookId: string; bookmark: Bookmark }>) => {
      const book = state.books.find(b => b.id === action.payload.bookId);
      if (book) {
        const idx = book.bookmarks.findIndex(bm => bm.id === action.payload.bookmark.id);
        if (idx !== -1) {
          book.bookmarks[idx] = action.payload.bookmark;
        }
      }
    },
    deleteBookmark: (state, action: PayloadAction<{ bookId: string; bookmarkId: string }>) => {
      const book = state.books.find(b => b.id === action.payload.bookId);
      if (book) {
        book.bookmarks = book.bookmarks.filter(bm => bm.id !== action.payload.bookmarkId);
      }
    },
    addReview: (state, action: PayloadAction<{ bookId: string; review: Review }>) => {
      const book = state.books.find(b => b.id === action.payload.bookId);
      if (book) {
        book.reviews.push(action.payload.review);
      }
    },
    deleteReview: (state, action: PayloadAction<{ bookId: string; reviewId: string }>) => {
      const book = state.books.find(b => b.id === action.payload.bookId);
      if (book) {
        book.reviews = book.reviews.filter(rv => rv.id !== action.payload.reviewId);
      }
    },
    addReadingSession: (state, action: PayloadAction<{ bookId: string; session: ReadingSession }>) => {
      const book = state.books.find(b => b.id === action.payload.bookId);
      if (book) {
        book.readingSessions.push(action.payload.session);
        book.currentPage += action.payload.session.pagesRead;
        if (book.currentPage >= book.pageCount) {
          book.status = 'completed';
          book.endDate = new Date().toISOString();
        }
      }
    },
    setCurrentBook: (state, action: PayloadAction<Book | null>) => {
      state.currentBook = action.payload;
    },
  },
});

export const {
  addBook,
  updateBook,
  deleteBook,
  addBookmark,
  updateBookmark,
  deleteBookmark,
  addReview,
  deleteReview,
  addReadingSession,
  setCurrentBook,
} = booksSlice.actions;

export default booksSlice.reducer; 