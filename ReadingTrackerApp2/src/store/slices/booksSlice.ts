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
}

const initialState: BooksState = {
  books: [],
  loading: false,
  error: null,
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
    addReview: (state, action: PayloadAction<{ bookId: string; review: Review }>) => {
      const book = state.books.find(b => b.id === action.payload.bookId);
      if (book) {
        book.reviews.push(action.payload.review);
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
  },
});

export const {
  addBook,
  updateBook,
  deleteBook,
  addBookmark,
  addReview,
  addReadingSession,
} = booksSlice.actions;

export default booksSlice.reducer; 