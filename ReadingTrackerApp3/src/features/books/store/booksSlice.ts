import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

export enum BookStatus {
  Unread = 'unread',
  Reading = 'reading',
  Finished = 'finished',
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

interface BooksState {
  books: Book[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  loading: boolean;
}

const initialState: BooksState = {
  books: [],
  status: 'idle',
  error: null,
  loading: false,
};

// Helper to create a new book with default values
const createBook = (bookData: Partial<Book>): Book => ({
  id: Date.now().toString(),
  title: '',
  author: '',
  currentPage: 0,
  categories: [],
  status: BookStatus.Unread,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...bookData,
});

// Async thunks
export const addBookAsync = createAsyncThunk(
  'books/addBook',
  async (bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'currentPage' | 'categories'> & {
    status?: BookStatus;
    currentPage?: number;
    categories?: string;
  }, { rejectWithValue }) => {
    // Process categories - convert to array for storage
    const categories = bookData.categories 
      ? bookData.categories.split(',').map(cat => cat.trim()).filter(Boolean)
      : [];
      
    const processedData = {
      ...bookData,
      categories
    };
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return createBook(processedData);
    } catch (error) {
      return rejectWithValue('Failed to add book');
    }
  }
);

export const updateReadingProgressAsync = createAsyncThunk(
  'books/updateReadingProgress',
  async ({ id, currentPage }: { id: string; currentPage: number }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    return { id, currentPage, updatedAt: new Date().toISOString() };
  }
);

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    addBook: (state: BooksState, action: PayloadAction<Omit<Book, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const newBook: Book = {
        ...action.payload,
        id: Date.now().toString(),
        currentPage: action.payload.currentPage || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.books.unshift(newBook);
    },
    updateBook: (state: BooksState, action: PayloadAction<{id: string} & Partial<Omit<Book, 'createdAt' | 'updatedAt'>>>) => {
      const { id, ...updates } = action.payload;
      const index = state.books.findIndex(book => book.id === id);
      if (index !== -1) {
        state.books[index] = {
          ...state.books[index],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    removeBook: (state: BooksState, action: PayloadAction<string>) => {
      state.books = state.books.filter(book => book.id !== action.payload);
    },
    updateReadingProgress: (state, action: PayloadAction<{id: string; currentPage: number; updatedAt: string}>) => {
      const { id, currentPage, updatedAt } = action.payload;
      const book = state.books.find(book => book.id === id);
      if (book) {
        book.currentPage = currentPage;
        book.updatedAt = updatedAt;
      }
    },
    startReading: (state, action: PayloadAction<string>) => {
      const book = state.books.find(book => book.id === action.payload);
      if (book) {
        book.status = BookStatus.Reading;
        book.startedAt = new Date().toISOString();
        book.updatedAt = new Date().toISOString();
      }
    },
    finishReading: (state, action: PayloadAction<{id: string; rating?: number; updatedAt: string}>) => {
      const { id, rating, updatedAt } = action.payload;
      const book = state.books.find(book => book.id === id);
      if (book) {
        book.status = BookStatus.Finished;
        book.finishedAt = new Date().toISOString();
        book.updatedAt = updatedAt;
        if (rating !== undefined) {
          book.rating = rating;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addBookAsync.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
      })
      .addCase(addBookAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        state.books.unshift(action.payload);
      })
      .addCase(addBookAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload as string || 'Failed to add book';
      });
  },
});

// Export actions
export const { 
  addBook,
  updateBook, 
  removeBook, 
  updateReadingProgress, 
  startReading, 
  finishReading 
} = booksSlice.actions;

// Selectors
export const selectAllBooks = (state: { books: BooksState }) => state.books.books;
export const selectBookById = (state: { books: BooksState }, bookId: string) => 
  state.books.books.find(book => book.id === bookId);

// Export the reducer
export const booksReducer = booksSlice.reducer;

export default booksSlice.reducer;
