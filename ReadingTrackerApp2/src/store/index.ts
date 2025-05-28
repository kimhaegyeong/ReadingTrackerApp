import { configureStore } from '@reduxjs/toolkit';
import booksReducer from './slices/booksSlice';
import userReducer from './slices/userSlice';
import statsReducer from './slices/statsSlice';

export const store = configureStore({
  reducer: {
    books: booksReducer,
    user: userReducer,
    stats: statsReducer,
  },
});

export type RootState = {
  books: ReturnType<typeof booksReducer>;
  user: ReturnType<typeof userReducer>;
  stats: ReturnType<typeof statsReducer>;
};

export type AppDispatch = typeof store.dispatch; 