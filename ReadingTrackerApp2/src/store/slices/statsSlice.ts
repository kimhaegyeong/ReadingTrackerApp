import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Activity {
  id: string;
  type: 'book_added' | 'book_completed' | 'reading_session' | 'bookmark_added' | 'review_added';
  description: string;
  timestamp: number;
  bookId?: string;
}

export interface ReadingStats {
  totalBooksRead: number;
  totalPagesRead: number;
  totalReadingTime: number; // 분 단위
  currentStreak: number;
  longestStreak: number;
  booksReadThisYear: number;
  booksReadThisMonth: number;
  booksReadThisWeek: number;
  yearlyGoal: number;
  monthlyGoal: number;
  weeklyGoal: number;
  genres: {
    genre: string;
    count: number;
    pagesRead: number;
    averageRating: number;
  }[];
  authors: {
    author: string;
    count: number;
    pagesRead: number;
    averageRating: number;
  }[];
  recentActivities: Activity[];
  readingStreak: number;
  lastReadDate: string | null;
  monthlyStats: {
    [key: string]: {
      booksRead: number;
      pagesRead: number;
      averageRating: number;
    };
  };
  yearlyStats: {
    [key: string]: {
      booksRead: number;
      pagesRead: number;
      averageRating: number;
    };
  };
}

const initialState: ReadingStats = {
  totalBooksRead: 0,
  totalPagesRead: 0,
  totalReadingTime: 0,
  currentStreak: 0,
  longestStreak: 0,
  booksReadThisYear: 0,
  booksReadThisMonth: 0,
  booksReadThisWeek: 0,
  yearlyGoal: 0,
  monthlyGoal: 0,
  weeklyGoal: 0,
  genres: [],
  authors: [],
  recentActivities: [],
  readingStreak: 0,
  lastReadDate: null,
  monthlyStats: {},
  yearlyStats: {},
};

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    updateReadingGoals: (state, action: PayloadAction<{
      yearlyGoal: number;
      monthlyGoal: number;
      weeklyGoal: number;
    }>) => {
      state.yearlyGoal = action.payload.yearlyGoal;
      state.monthlyGoal = action.payload.monthlyGoal;
      state.weeklyGoal = action.payload.weeklyGoal;
    },
    updateReadingStreak: (state, action: PayloadAction<number>) => {
      state.currentStreak = action.payload;
      if (action.payload > state.longestStreak) {
        state.longestStreak = action.payload;
      }
      state.readingStreak = action.payload;
    },
    updateGenreStats: (state, action: PayloadAction<{
      genre: string;
      pagesRead: number;
      rating: number;
    }>) => {
      const { genre, pagesRead, rating } = action.payload;
      const genreIndex = state.genres.findIndex(g => g.genre === genre);
      
      if (genreIndex === -1) {
        state.genres.push({
          genre,
          count: 1,
          pagesRead,
          averageRating: rating,
        });
      } else {
        const genre = state.genres[genreIndex];
        genre.count += 1;
        genre.pagesRead += pagesRead;
        genre.averageRating = (genre.averageRating * (genre.count - 1) + rating) / genre.count;
      }
    },
    updateAuthorStats: (state, action: PayloadAction<{
      author: string;
      pagesRead: number;
      rating: number;
    }>) => {
      const { author, pagesRead, rating } = action.payload;
      const authorIndex = state.authors.findIndex(a => a.author === author);
      
      if (authorIndex === -1) {
        state.authors.push({
          author,
          count: 1,
          pagesRead,
          averageRating: rating,
        });
      } else {
        const author = state.authors[authorIndex];
        author.count += 1;
        author.pagesRead += pagesRead;
        author.averageRating = (author.averageRating * (author.count - 1) + rating) / author.count;
      }
    },
    addActivity: (state, action: PayloadAction<Activity>) => {
      state.recentActivities.unshift(action.payload);
      if (state.recentActivities.length > 50) {
        state.recentActivities.pop();
      }
    },
    incrementBooksRead: (state) => {
      state.totalBooksRead += 1;
      state.booksReadThisYear += 1;
      state.booksReadThisMonth += 1;
      state.booksReadThisWeek += 1;
    },
    addReadingTime: (state, action: PayloadAction<number>) => {
      state.totalReadingTime += action.payload;
    },
    addPagesRead: (state, action: PayloadAction<number>) => {
      state.totalPagesRead += action.payload;
    },
    resetWeeklyStats: (state) => {
      state.booksReadThisWeek = 0;
    },
    resetMonthlyStats: (state) => {
      state.booksReadThisMonth = 0;
    },
    resetYearlyStats: (state) => {
      state.booksReadThisYear = 0;
    },
    updateLastReadDate: (state, action: PayloadAction<string>) => {
      state.lastReadDate = action.payload;
    },
    updateMonthlyStats: (
      state,
      action: PayloadAction<{
        month: string;
        stats: {
          booksRead: number;
          pagesRead: number;
          averageRating: number;
        };
      }>
    ) => {
      state.monthlyStats[action.payload.month] = action.payload.stats;
    },
    updateYearlyStats: (
      state,
      action: PayloadAction<{
        year: string;
        stats: {
          booksRead: number;
          pagesRead: number;
          averageRating: number;
        };
      }>
    ) => {
      state.yearlyStats[action.payload.year] = action.payload.stats;
    },
  },
});

export const {
  updateReadingGoals,
  updateReadingStreak,
  updateGenreStats,
  updateAuthorStats,
  addActivity,
  incrementBooksRead,
  addReadingTime,
  addPagesRead,
  resetWeeklyStats,
  resetMonthlyStats,
  resetYearlyStats,
  updateLastReadDate,
  updateMonthlyStats,
  updateYearlyStats,
} = statsSlice.actions;

export default statsSlice.reducer; 