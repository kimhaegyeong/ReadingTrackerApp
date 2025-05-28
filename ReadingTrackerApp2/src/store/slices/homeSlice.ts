import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

interface HomeData {
  userProfile: {
    nickname: string;
    profileImage: string;
    readingGoalProgress: number;
  };
  currentReading: {
    book: {
      title: string;
      authors: string[];
      imageLinks: {
        thumbnail: string;
      };
    };
    progress: number;
    lastReadAt: Date;
  };
  readingGoals: {
    daily: {
      target: number;
      current: number;
    };
    weekly: {
      target: number;
      current: number;
    };
    monthly: {
      target: number;
      current: number;
    };
  };
  recentActivities: Array<{
    id: string;
    type: 'reading' | 'bookmark' | 'review';
    bookTitle: string;
    timestamp: string;
    details?: string;
  }>;
  recommendations: Array<{
    id: string;
    title: string;
    authors: string[];
    imageLinks?: {
      thumbnail: string;
    };
    description?: string;
  }>;
}

interface HomeState {
  data: HomeData | null;
  loading: boolean;
  error: string | null;
}

const initialState: HomeState = {
  data: {
    userProfile: {
      nickname: '게스트',
      profileImage: '',
      readingGoalProgress: 0,
    },
    currentReading: {
      book: {
        title: '샘플 책',
        authors: ['홍길동'],
        imageLinks: { thumbnail: '' },
      },
      progress: 0,
      lastReadAt: new Date(),
    },
    readingGoals: {
      daily: { target: 30, current: 0 },
      weekly: { target: 200, current: 0 },
      monthly: { target: 800, current: 0 },
    },
    recentActivities: [],
    recommendations: [],
  },
  loading: false,
  error: null,
};

export const fetchHomeData = createAsyncThunk(
  'home/fetchData',
  async () => {
    const response = await api.get('/home');
    return response.data;
  }
);

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '데이터를 불러오는데 실패했습니다.';
      });
  },
});

export default homeSlice.reducer; 