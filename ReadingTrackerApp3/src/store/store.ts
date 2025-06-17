import { configureStore } from '@reduxjs/toolkit';
import { booksReducer } from '@/features/books/store/booksSlice';
import readingLogReducer from '@/features/readingLog/store/readingLogSlice';

export const store = configureStore({
  reducer: {
    books: booksReducer,
    readingLog: readingLogReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for now
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
