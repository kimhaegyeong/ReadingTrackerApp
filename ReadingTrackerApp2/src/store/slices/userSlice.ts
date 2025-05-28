import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  readingStats: {
    totalBooksRead: number;
    totalPagesRead: number;
    averageRating: number;
  };
  readingGoals: {
    yearly?: number;
    monthly?: number;
    weekly?: number;
  };
}

interface UserState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

const defaultUser: User = {
  id: 'guest',
  email: 'guest@example.com',
  displayName: '게스트',
  readingStats: {
    totalBooksRead: 0,
    totalPagesRead: 0,
    averageRating: 0,
  },
  readingGoals: {
    yearly: 12,
    monthly: 1,
    weekly: 1,
  },
};

const initialState: UserState = {
  currentUser: defaultUser,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload || defaultUser;
      state.loading = false;
      state.error = null;
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },
    updateReadingStats: (state, action: PayloadAction<Partial<User['readingStats']>>) => {
      if (state.currentUser) {
        state.currentUser.readingStats = {
          ...state.currentUser.readingStats,
          ...action.payload,
        };
      }
    },
    updateReadingGoals: (state, action: PayloadAction<Partial<User['readingGoals']>>) => {
      if (state.currentUser) {
        state.currentUser.readingGoals = {
          ...state.currentUser.readingGoals,
          ...action.payload,
        };
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setUser,
  updateUserProfile,
  updateReadingStats,
  updateReadingGoals,
  setLoading,
  setError,
} = userSlice.actions;

export default userSlice.reducer; 