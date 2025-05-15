// API Service for 북로그 (BookLog) App

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  API_BASE_URL,
  AUTH_API,
  USER_API,
  BOOK_API,
  LIBRARY_API,
  READING_API,
  GOAL_API,
  NOTE_API,
  STATS_API,
  COMMUNITY_API,
  SEARCH_API,
  EXTERNAL_API,
  handleApiResponse,
  getDefaultHeaders
} from './api';
import {
  User,
  AuthResponse,
  UserPreferences,
  Book,
  LibraryBook,
  BookSearchResult,
  ReadingSession,
  ReadingGoal,
  ReadingHighlight,
  ReadingNote,
  ReadingStats,
  TimeDistribution,
  SearchFilter,
  SearchHistory,
  Post,
  Comment,
  Challenge,
  ChallengeParticipation,
  ApiResponse,
  PaginatedResponse
} from './models';

// Token management
const getToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem('auth_token');
};

const setToken = async (token: string): Promise<void> => {
  await AsyncStorage.setItem('auth_token', token);
};

const removeToken = async (): Promise<void> => {
  await AsyncStorage.removeItem('auth_token');
};

// Authentication API
export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(AUTH_API.LOGIN, {
      method: 'POST',
      headers: getDefaultHeaders(),
      body: JSON.stringify({ email, password }),
    });
    
    const data = await handleApiResponse(response);
    await setToken(data.token);
    return data;
  },
  
  register: async (email: string, password: string, name?: string): Promise<AuthResponse> => {
    const response = await fetch(AUTH_API.REGISTER, {
      method: 'POST',
      headers: getDefaultHeaders(),
      body: JSON.stringify({ email, password, name }),
    });
    
    const data = await handleApiResponse(response);
    await setToken(data.token);
    return data;
  },
  
  loginWithGoogle: async (idToken: string): Promise<AuthResponse> => {
    const response = await fetch(AUTH_API.GOOGLE_AUTH, {
      method: 'POST',
      headers: getDefaultHeaders(),
      body: JSON.stringify({ idToken }),
    });
    
    const data = await handleApiResponse(response);
    await setToken(data.token);
    return data;
  },
  
  loginWithApple: async (identityToken: string, fullName?: { firstName?: string, lastName?: string }): Promise<AuthResponse> => {
    const response = await fetch(AUTH_API.APPLE_AUTH, {
      method: 'POST',
      headers: getDefaultHeaders(),
      body: JSON.stringify({ identityToken, fullName }),
    });
    
    const data = await handleApiResponse(response);
    await setToken(data.token);
    return data;
  },
  
  loginAsGuest: async (): Promise<AuthResponse> => {
    const guestId = `guest_${Date.now()}`;
    const response = await fetch(AUTH_API.LOGIN, {
      method: 'POST',
      headers: getDefaultHeaders(),
      body: JSON.stringify({ isGuest: true, guestId }),
    });
    
    const data = await handleApiResponse(response);
    await setToken(data.token);
    return data;
  },
  
  logout: async (): Promise<void> => {
    const token = await getToken();
    
    if (token) {
      try {
        await fetch(AUTH_API.LOGOUT, {
          method: 'POST',
          headers: getDefaultHeaders(token),
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
      
      await removeToken();
    }
  },
  
  verifyToken: async (): Promise<boolean> => {
    const token = await getToken();
    
    if (!token) {
      return false;
    }
    
    try {
      const response = await fetch(AUTH_API.VERIFY_TOKEN, {
        method: 'GET',
        headers: getDefaultHeaders(token),
      });
      
      return response.ok;
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  },
  
  refreshToken: async (): Promise<string | null> => {
    const token = await getToken();
    
    if (!token) {
      return null;
    }
    
    try {
      const response = await fetch(AUTH_API.REFRESH_TOKEN, {
        method: 'POST',
        headers: getDefaultHeaders(token),
      });
      
      const data = await handleApiResponse(response);
      await setToken(data.token);
      return data.token;
    } catch (error) {
      console.error('Token refresh error:', error);
      await removeToken();
      return null;
    }
  },
  
  resetPassword: async (email: string): Promise<boolean> => {
    const response = await fetch(AUTH_API.RESET_PASSWORD, {
      method: 'POST',
      headers: getDefaultHeaders(),
      body: JSON.stringify({ email }),
    });
    
    return response.ok;
  },
};

// User API
export const userApi = {
  getProfile: async (): Promise<User> => {
    const token = await getToken();
    
    const response = await fetch(USER_API.GET_PROFILE, {
      method: 'GET',
      headers: getDefaultHeaders(token || undefined),
    });
    
    return handleApiResponse(response);
  },
  
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const token = await getToken();
    
    const response = await fetch(USER_API.UPDATE_PROFILE, {
      method: 'PUT',
      headers: getDefaultHeaders(token || undefined),
      body: JSON.stringify(userData),
    });
    
    return handleApiResponse(response);
  },
  
  getPreferences: async (): Promise<UserPreferences> => {
    const token = await getToken();
    
    const response = await fetch(USER_API.GET_PREFERENCES, {
      method: 'GET',
      headers: getDefaultHeaders(token || undefined),
    });
    
    return handleApiResponse(response);
  },
  
  updatePreferences: async (preferences: Partial<UserPreferences>): Promise<UserPreferences> => {
    const token = await getToken();
    
    const response = await fetch(USER_API.UPDATE_PREFERENCES, {
      method: 'PUT',
      headers: getDefaultHeaders(token || undefined),
      body: JSON.stringify(preferences),
    });
    
    return handleApiResponse(response);
  },
  
  uploadProfileImage: async (imageUri: string): Promise<{ photoUrl: string }> => {
    const token = await getToken();
    
    // Create form data for image upload
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'profile.jpg',
    } as any);
    
    const response = await fetch(USER_API.UPLOAD_PROFILE_IMAGE, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
    
    return handleApiResponse(response);
  },
};

// Book API
export const bookApi = {
  searchBooks: async (query: string, filters?: Partial<SearchFilter>, page: number = 1, pageSize: number = 20): Promise<BookSearchResult> => {
    const token = await getToken();
    
    const queryParams = new URLSearchParams({
      q: query,
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...filters as any,
    });
    
    const response = await fetch(`${BOOK_API.SEARCH}?${queryParams}`, {
      method: 'GET',
      headers: getDefaultHeaders(token || undefined),
    });
    
    return handleApiResponse(response);
  },
  
  getBookById: async (id: string): Promise<Book> => {
    const token = await getToken();
    
    const response = await fetch(BOOK_API.GET_BOOK(id), {
      method: 'GET',
      headers: getDefaultHeaders(token || undefined),
    });
    
    return handleApiResponse(response);
  },
  
  getRecommendations: async (limit: number = 10): Promise<Book[]> => {
    const token = await getToken();
    
    const response = await fetch(`${BOOK_API.GET_RECOMMENDATIONS}?limit=${limit}`, {
      method: 'GET',
      headers: getDefaultHeaders(token || undefined),
    });
    
    return handleApiResponse(response);
  },
  
  scanBarcode: async (barcodeData: string): Promise<Book | null> => {
    const token = await getToken();
    
    const response = await fetch(`${BOOK_API.SCAN_BARCODE}?code=${barcodeData}`, {
      method: 'GET',
      headers: getDefaultHeaders(token || undefined),
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null; // Book not found
      }
      throw new Error(`Barcode scan failed: ${response.status}`);
    }
    
    return handleApiResponse(response);
  },
  
  addBook: async (bookData: Partial<Book>): Promise<Book> => {
    const token = await getToken();
    
    const response = await fetch(BOOK_API.ADD_BOOK, {
      method: 'POST',
      headers: getDefaultHeaders(token || undefined),
      body: JSON.stringify(bookData),
    });
    
    return handleApiResponse(response);
  },
};

// Library API
export const libraryApi = {
  getLibrary: async (status?: string, sort?: string, page: number = 1, pageSize: number = 20): Promise<PaginatedResponse<LibraryBook>> => {
    const token = await getToken();
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });
    
    if (status) queryParams.append('status', status);
    if (sort) queryParams.append('sort', sort);
    
    const response = await fetch(`${LIBRARY_API.GET_LIBRARY}?${queryParams}`, {
      method: 'GET',
      headers: getDefaultHeaders(token || undefined),
    });
    
    return handleApiResponse(response);
  },
  
  addToLibrary: async (bookId: string, status: 'toRead' | 'reading' | 'finished' | 'abandoned'): Promise<LibraryBook> => {
    const token = await getToken();
    
    const response = await fetch(LIBRARY_API.ADD_TO_LIBRARY, {
      method: 'POST',
      headers: getDefaultHeaders(token || undefined),
      body: JSON.stringify({ bookId, status }),
    });
    
    return handleApiResponse(response);
  },
  
  updateBookStatus: async (bookId: string, status: 'toRead' | 'reading' | 'finished' | 'abandoned', progress?: number): Promise<LibraryBook> => {
    const token = await getToken();
    
    const response = await fetch(LIBRARY_API.UPDATE_BOOK_STATUS(bookId), {
      method: 'PUT',
      headers: getDefaultHeaders(token || undefined),
      body: JSON.stringify({ status, progress }),
    });
    
    return handleApiResponse(response);
  },
  
  getBookDetails: async (bookId: string): Promise<LibraryBook> => {
    const token = await getToken();
    
    const response = await fetch(LIBRARY_API.GET_BOOK_DETAILS(bookId), {
      method: 'GET',
      headers: getDefaultHeaders(token || undefined),
    });
    
    return handleApiResponse(response);
  },
  
  removeFromLibrary: async (bookId: string): Promise<boolean> => {
    const token = await getToken();
    
    const response = await fetch(LIBRARY_API.REMOVE_FROM_LIBRARY(bookId), {
      method: 'DELETE',
      headers: getDefaultHeaders(token || undefined),
    });
    
    return response.ok;
  },
};

// Reading API
export const readingApi = {
  getSessions: async (bookId?: string, startDate?: string, endDate?: string): Promise<ReadingSession[]> => {
    const token = await getToken();
    
    const queryParams = new URLSearchParams();
    if (bookId) queryParams.append('bookId', bookId);
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    
    const response = await fetch(`${READING_API.GET_SESSIONS}?${queryParams}`, {
      method: 'GET',
      headers: getDefaultHeaders(token || undefined),
    });
    
    return handleApiResponse(response);
  },
  
  createSession: async (sessionData: Omit<ReadingSession, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<ReadingSession> => {
    const token = await getToken();
    
    const response = await fetch(READING_API.CREATE_SESSION, {
      method: 'POST',
      headers: getDefaultHeaders(token || undefined),
      body: JSON.stringify(sessionData),
    });
    
    return handleApiResponse(response);
  },
  
  updateSession: async (id: string, sessionData: Partial<ReadingSession>): Promise<ReadingSession> => {
    const token = await getToken();
    
    const response = await fetch(READING_API.UPDATE_SESSION(id), {
      method: 'PUT',
      headers: getDefaultHeaders(token || undefined),
      body: JSON.stringify(sessionData),
    });
    
    return handleApiResponse(response);
  },
  
  deleteSession: async (id: string): Promise<boolean> => {
    const token = await getToken();
    
    const response = await fetch(READING_API.DELETE_SESSION(id), {
      method: 'DELETE',
      headers: getDefaultHeaders(token || undefined),
    });
    
    return response.ok;
  },
  
  getReadingStreak: async (): Promise<{ currentStreak: number, longestStreak: number }> => {
    const token = await getToken();
    
    const response = await fetch(READING_API.GET_READING_STREAK, {
      method: 'GET',
      headers: getDefaultHeaders(token || undefined),
    });
    
    return handleApiResponse(response);
  },
};

// Goals API
export const goalApi = {
  getGoals: async (active?: boolean): Promise<ReadingGoal[]> => {
    const token = await getToken();
    
    const queryParams = new URLSearchParams();
    if (active !== undefined) queryParams.append('active', active.toString());
    
    const response = await fetch(`${GOAL_API.GET_GOALS}?${queryParams}`, {
      method: 'GET',
      headers: getDefaultHeaders(token || undefined),
    });
    
    return handleApiResponse(response);
  },
  
  createGoal: async (goalData: Omit<ReadingGoal, 'id' | 'userId' | 'progress' | 'completed' | 'createdAt' | 'updatedAt'>): Promise<ReadingGoal> => {
    const token = await getToken();
    
    const response = await fetch(GOAL_API.CREATE_GOAL, {
      method: 'POST',
      headers: getDefaultHeaders(token || undefined),
      body: JSON.stringify(goalData),
    });
    
    return handleApiResponse(response);
  },
  
  updateGoal: async (id: string, goalData: Partial<ReadingGoal>): Promise<ReadingGoal> => {
    const token = await getToken();
    
    const response = await fetch(GOAL_API.UPDATE_GOAL(id), {
      method: 'PUT',
      headers: getDefaultHeaders(token || undefined),
      body: JSON.stringify(goalData),
    });
    
    return handleApiResponse(response);
  },
  
  deleteGoal: async (id: string): Promise<boolean> => {
    const token = await getToken();
    
    const response = await fetch(GOAL_API.DELETE_GOAL(id), {
      method: 'DELETE',
      headers: getDefaultHeaders(token || undefined),
    });
    
    return response.ok;
  },
  
  updateGoalProgress: async (id: string, progress: number): Promise<ReadingGoal> => {
    const token = await getToken();
    
    const response = await fetch(GOAL_API.UPDATE_GOAL_PROGRESS(id), {
      method: 'PUT',
      headers: getDefaultHeaders(token || undefined),
      body: JSON.stringify({ progress }),
    });
    
    return handleApiResponse(response);
  },
};

// Notes and Highlights API
export const noteApi = {
  getNotes: async (bookId?: string, page: number = 1, pageSize: number = 20): Promise<PaginatedResponse<ReadingNote>> => {
    const token = await getToken();
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });
    
    if (bookId) queryParams.append('bookId', bookId);
    
    const response = await fetch(`${NOTE_API.GET_NOTES}?${queryParams}`, {
      method: 'GET',
      headers: getDefaultHeaders(token || undefined),
    });
    
    return handleApiResponse(response);
  },
  
  createNote: async (noteData: Omit<ReadingNote, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<ReadingNote> => {
    const token = await getToken();
    
    const response = await fetch(NOTE_API.CREATE_NOTE, {
      method: 'POST',
      headers: getDefaultHeaders(token || undefined),
      body: JSON.stringify(noteData),
    });
    
    return handleApiResponse(response);
  },
  
  updateNote: async (id: string, noteData: Partial<ReadingNote>): Promise<ReadingNote> => {
    const token = await getToken();
    
    const response = await fetch(NOTE_API.UPDATE_NOTE(id), {
      method: 'PUT',
      headers: getDefaultHeaders(token || undefined),
      body: JSON.stringify(noteData),
    });
    
    return handleApiResponse(response);
  },
  
  deleteNote: async (id: string): Promise<boolean> => {
    const token = await getToken();
    
    const response = await fetch(NOTE_API.DELETE_NOTE(id), {
      method: 'DELETE',
      headers: getDefaultHeaders(token || undefined),
    });
    
    return response.ok;
  },
  
  getHighlights: async (bookId?: string, page: number = 1, pageSize: number = 20): Promise<PaginatedResponse<ReadingHighlight>> => {
    const token = await getToken();
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });
    
    if (bookId) queryParams.append('bookId', bookId);
    
    const response = await fetch(`${NOTE_API.GET_HIGHLIGHTS}?${queryParams}`, {
      method: 'GET',
      headers: getDefaultHeaders(token || undefined),
    });
    
    return handleApiResponse(response);
  },
  
  createHighlight: async (highlightData: Omit<ReadingHighlight, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<ReadingHighlight> => {
    const token = await getToken();
    
    const response = await fetch(NOTE_API.CREATE_HIGHLIGHT, {
      method: 'POST',
      headers: getDefaultHeaders(token || undefined),
      body: JSON.stringify(highlightData),
    });
    
    return handleApiResponse(response);
  },
  
  updateHighlight: async (id: string, highlightData: Partial<ReadingHighlight>): Promise<ReadingHighlight> => {
    const token = await getToken();
    
    const response = await fetch(NOTE_API.UPDATE_HIGHLIGHT(id), {
      method: 'PUT',
      headers: getDefaultHeaders(token || undefined),
      body: JSON.stringify(highlightData),
    });
    
    return handleApiResponse(response);
  },
  
  deleteHighlight: async (id: string): Promise<boolean> => {
    const token = await getToken();
    
    const response = await fetch(NOTE_API.DELETE_HIGHLIGHT(id), {
      method: 'DELETE',
      headers: getDefaultHeaders(token || undefined),
    });
    
    return response.ok;
  },
};

// Statistics API
export const statsApi = {
  getReadingStats: async (period?: 'day' | 'week' | 'month' | 'year' | 'all'): Promise<ReadingStats> => {
    const token = await getToken();
    
    const queryParams = new URLSearchParams();
    if (period) queryParams.append('period', period);
    
    const response = await fetch(`${STATS_API.GET_READING_STATS}?${queryParams}`, {
      method: 'GET',
      headers: getDefaultHeaders(token || undefined),
    });
    
    return handleApiResponse(response);
  },
  
  getTimeDistribution: async (): Promise<TimeDistribution> => {
    const token = await getToken();
    
    const response = await fetch(STATS_API.GET_TIME_DISTRIBUTION, {
      method: 'GET',
      headers: getDefaultHeaders(token || undefined),
    });
    
    return handleApiResponse(response);
  },
};

// Search API
export const searchApi = {
  saveSearchFilter: async (filter: Omit<SearchFilter, 'id' | 'userId' | 'isActive' | 'createdAt' | 'updatedAt'>): Promise<SearchFilter> => {
    const token = await getToken();
    
    const response = await fetch(SEARCH_API.SAVE_SEARCH_FILTER, {
      method: 'POST',
      headers: getDefaultHeaders(token || undefined),
      body: JSON.stringify(filter),
    });
    
    return handleApiResponse(response);
  },
  
  getSearchFilters: async (): Promise<SearchFilter[]> => {
    const token = await getToken();
    
    const response = await fetch(SEARCH_API.GET_SEARCH_FILTERS, {
      method: 'GET',
      headers: getDefaultHeaders(token || undefined),
    });
    
    return handleApiResponse(response);
  },
  
  updateSearchFilter: async (id: string, filter: Partial<SearchFilter>): Promise<SearchFilter> => {
    const token = await getToken();
    
    const response = await fetch(SEARCH_API.UPDATE_SEARCH_FILTER(id), {
      method: 'PUT',
      headers: getDefaultHeaders(token || undefined),
      body: JSON.stringify(filter),
    });
    
    return handleApiResponse(response);
  },
  
  deleteSearchFilter: async (id: string): Promise<boolean> => {
    const token = await getToken();
    
    const response = await fetch(SEARCH_API.DELETE_SEARCH_FILTER(id), {
      method: 'DELETE',
      headers: getDefaultHeaders(token || undefined),
    });
    
    return response.ok;
  },
  
  getSearchSuggestions: async (query: string): Promise<string[]> => {
    const token = await getToken();
    
    const response = await fetch(`${SEARCH_API.GET_SEARCH_SUGGESTIONS}?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: getDefaultHeaders(token || undefined),
    });
    
    return handleApiResponse(response);
  },
};

// Community API
export const communityApi = {
  getFeed: async (page: number = 1, pageSize: number = 20): Promise<PaginatedResponse<Post>> => {
    const token = await getToken();
    
    const response = await fetch(`${COMMUNITY_API.GET_FEED}?page=${page}&pageSize=${pageSize}`, {
      method: 'GET',
      headers: getDefaultHeaders(token || undefined),
    });
    
    return handleApiResponse(response);
  },
  
  createPost: async (postData: { content: string, bookId?: string, images?: string[] }): Promise<Post> => {
    const token = await getToken();
    
    const response = await fetch(COMMUNITY_API.CREATE_POST, {
      method: 'POST',
      headers: getDefaultHeaders(token || undefined),
      body: JSON.stringify(postData),
    });
    
    return handleApiResponse(response);
  },
  
  likePost: async (id: string): Promise<{ likes: number }> => {
    const token = await getToken();
    
    const response = await fetch(COMMUNITY_API.LIKE_POST(id), {
      method: 'POST',
      headers: getDefaultHeaders(token || undefined),
    });
    
    return handleApiResponse(response);
  },
  
  unlikePost: async (id: string): Promise<{ likes: number }> => {
    const token = await getToken();
    
    const response = await fetch(COMMUNITY_API.UNLIKE_POST(id), {
      method: 'POST',
      headers: getDefaultHeaders(token || undefined),
    });
    
    return handleApiResponse(response);
  },
  
  getComments: async (postId: string, page: number = 1, pageSize: number = 20): Promise<PaginatedResponse<Comment>> => {
    const token = await getToken();
    
    const response = await fetch(`${COMMUNITY_API.GET_COMMENTS(postId)}?page=${page}&pageSize=${pageSize}`, {
      method: 'GET',
      headers: getDefaultHeaders(token || undefined),
    });
    
    return handleApiResponse(response);
  },
  
  addComment: async (postId: string, content: string): Promise<Comment> => {
    const token = await getToken();
    
    const response = await fetch(COMMUNITY_API.ADD_COMMENT(postId), {
      method: 'POST',
      headers: getDefaultHeaders(token || undefined),
      body: JSON.stringify({ content }),
    });
    
    return handleApiResponse(response);
  },
  
  getChallenges: async (page: number = 1, pageSize: number = 20): Promise<PaginatedResponse<Challenge>> => {
    const token = await getToken();
    
    const response = await fetch(`${COMMUNITY_API.GET_CHALLENGES}?page=${page}&pageSize=${pageSize}`, {
      method: 'GET',
      headers: getDefaultHeaders(token || undefined),
    });
    
    return handleApiResponse(response);
  },
  
  joinChallenge: async (id: string): Promise<ChallengeParticipation> => {
    const token = await getToken();
    
    const response = await fetch(COMMUNITY_API.JOIN_CHALLENGE(id), {
      method: 'POST',
      headers: getDefaultHeaders(token || undefined),
    });
    
    return handleApiResponse(response);
  },
  
  updateChallengeProgress: async (id: string, progress: number): Promise<ChallengeParticipation> => {
    const token = await getToken();
    
    const response = await fetch(COMMUNITY_API.UPDATE_CHALLENGE_PROGRESS(id), {
      method: 'PUT',
      headers: getDefaultHeaders(token || undefined),
      body: JSON.stringify({ progress }),
    });
    
    return handleApiResponse(response);
  },
};

// Export all APIs
export default {
  auth: authApi,
  user: userApi,
  book: bookApi,
  library: libraryApi,
  reading: readingApi,
  goal: goalApi,
  note: noteApi,
  stats: statsApi,
  search: searchApi,
  community: communityApi,
};
