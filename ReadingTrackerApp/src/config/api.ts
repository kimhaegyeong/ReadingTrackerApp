// API Configuration and Endpoints for 북로그 (BookLog) App

// Base URL for API
export const API_BASE_URL = 'https://api.booklog.com/v1';

// Authentication Endpoints
export const AUTH_API = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
  GOOGLE_AUTH: `${API_BASE_URL}/auth/google`,
  APPLE_AUTH: `${API_BASE_URL}/auth/apple`,
  VERIFY_TOKEN: `${API_BASE_URL}/auth/verify`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  UPDATE_PROFILE: `${API_BASE_URL}/auth/profile`,
};

// User Endpoints
export const USER_API = {
  GET_PROFILE: `${API_BASE_URL}/users/profile`,
  UPDATE_PROFILE: `${API_BASE_URL}/users/profile`,
  GET_PREFERENCES: `${API_BASE_URL}/users/preferences`,
  UPDATE_PREFERENCES: `${API_BASE_URL}/users/preferences`,
  GET_STATISTICS: `${API_BASE_URL}/users/statistics`,
  UPLOAD_PROFILE_IMAGE: `${API_BASE_URL}/users/profile/image`,
};

// Book Endpoints
export const BOOK_API = {
  SEARCH: `${API_BASE_URL}/books/search`,
  GET_BOOK: (id: string) => `${API_BASE_URL}/books/${id}`,
  GET_RECOMMENDATIONS: `${API_BASE_URL}/books/recommendations`,
  GET_POPULAR: `${API_BASE_URL}/books/popular`,
  SCAN_BARCODE: `${API_BASE_URL}/books/barcode`,
  ADD_BOOK: `${API_BASE_URL}/books`,
  UPDATE_BOOK: (id: string) => `${API_BASE_URL}/books/${id}`,
  DELETE_BOOK: (id: string) => `${API_BASE_URL}/books/${id}`,
};

// Library Endpoints
export const LIBRARY_API = {
  GET_LIBRARY: `${API_BASE_URL}/library`,
  ADD_TO_LIBRARY: `${API_BASE_URL}/library`,
  UPDATE_BOOK_STATUS: (bookId: string) => `${API_BASE_URL}/library/books/${bookId}/status`,
  GET_BOOK_DETAILS: (bookId: string) => `${API_BASE_URL}/library/books/${bookId}`,
  REMOVE_FROM_LIBRARY: (bookId: string) => `${API_BASE_URL}/library/books/${bookId}`,
  GET_CATEGORIES: `${API_BASE_URL}/library/categories`,
  CREATE_CATEGORY: `${API_BASE_URL}/library/categories`,
  UPDATE_CATEGORY: (id: string) => `${API_BASE_URL}/library/categories/${id}`,
  DELETE_CATEGORY: (id: string) => `${API_BASE_URL}/library/categories/${id}`,
  GET_TAGS: `${API_BASE_URL}/library/tags`,
  CREATE_TAG: `${API_BASE_URL}/library/tags`,
  DELETE_TAG: (id: string) => `${API_BASE_URL}/library/tags/${id}`,
};

// Reading Session Endpoints
export const READING_API = {
  GET_SESSIONS: `${API_BASE_URL}/reading/sessions`,
  GET_SESSION: (id: string) => `${API_BASE_URL}/reading/sessions/${id}`,
  CREATE_SESSION: `${API_BASE_URL}/reading/sessions`,
  UPDATE_SESSION: (id: string) => `${API_BASE_URL}/reading/sessions/${id}`,
  DELETE_SESSION: (id: string) => `${API_BASE_URL}/reading/sessions/${id}`,
  GET_DAILY_SUMMARY: (date: string) => `${API_BASE_URL}/reading/summary/daily/${date}`,
  GET_WEEKLY_SUMMARY: (weekStart: string) => `${API_BASE_URL}/reading/summary/weekly/${weekStart}`,
  GET_MONTHLY_SUMMARY: (yearMonth: string) => `${API_BASE_URL}/reading/summary/monthly/${yearMonth}`,
  GET_YEARLY_SUMMARY: (year: string) => `${API_BASE_URL}/reading/summary/yearly/${year}`,
  GET_READING_STREAK: `${API_BASE_URL}/reading/streak`,
};

// Goals Endpoints
export const GOAL_API = {
  GET_GOALS: `${API_BASE_URL}/goals`,
  GET_GOAL: (id: string) => `${API_BASE_URL}/goals/${id}`,
  CREATE_GOAL: `${API_BASE_URL}/goals`,
  UPDATE_GOAL: (id: string) => `${API_BASE_URL}/goals/${id}`,
  DELETE_GOAL: (id: string) => `${API_BASE_URL}/goals/${id}`,
  GET_GOAL_PROGRESS: (id: string) => `${API_BASE_URL}/goals/${id}/progress`,
  UPDATE_GOAL_PROGRESS: (id: string) => `${API_BASE_URL}/goals/${id}/progress`,
};

// Notes and Highlights Endpoints
export const NOTE_API = {
  GET_NOTES: `${API_BASE_URL}/notes`,
  GET_NOTE: (id: string) => `${API_BASE_URL}/notes/${id}`,
  CREATE_NOTE: `${API_BASE_URL}/notes`,
  UPDATE_NOTE: (id: string) => `${API_BASE_URL}/notes/${id}`,
  DELETE_NOTE: (id: string) => `${API_BASE_URL}/notes/${id}`,
  GET_BOOK_NOTES: (bookId: string) => `${API_BASE_URL}/books/${bookId}/notes`,
  GET_HIGHLIGHTS: `${API_BASE_URL}/highlights`,
  GET_HIGHLIGHT: (id: string) => `${API_BASE_URL}/highlights/${id}`,
  CREATE_HIGHLIGHT: `${API_BASE_URL}/highlights`,
  UPDATE_HIGHLIGHT: (id: string) => `${API_BASE_URL}/highlights/${id}`,
  DELETE_HIGHLIGHT: (id: string) => `${API_BASE_URL}/highlights/${id}`,
  GET_BOOK_HIGHLIGHTS: (bookId: string) => `${API_BASE_URL}/books/${bookId}/highlights`,
};

// Statistics Endpoints
export const STATS_API = {
  GET_READING_STATS: `${API_BASE_URL}/stats/reading`,
  GET_BOOK_STATS: `${API_BASE_URL}/stats/books`,
  GET_GENRE_STATS: `${API_BASE_URL}/stats/genres`,
  GET_TIME_DISTRIBUTION: `${API_BASE_URL}/stats/time-distribution`,
  GET_READING_SPEED: `${API_BASE_URL}/stats/reading-speed`,
  GET_GOAL_COMPLETION: `${API_BASE_URL}/stats/goal-completion`,
  GET_READING_PATTERNS: `${API_BASE_URL}/stats/patterns`,
  GET_COMPARISON: `${API_BASE_URL}/stats/comparison`,
};

// Community Endpoints
export const COMMUNITY_API = {
  GET_FEED: `${API_BASE_URL}/community/feed`,
  GET_POST: (id: string) => `${API_BASE_URL}/community/posts/${id}`,
  CREATE_POST: `${API_BASE_URL}/community/posts`,
  UPDATE_POST: (id: string) => `${API_BASE_URL}/community/posts/${id}`,
  DELETE_POST: (id: string) => `${API_BASE_URL}/community/posts/${id}`,
  LIKE_POST: (id: string) => `${API_BASE_URL}/community/posts/${id}/like`,
  UNLIKE_POST: (id: string) => `${API_BASE_URL}/community/posts/${id}/unlike`,
  GET_COMMENTS: (postId: string) => `${API_BASE_URL}/community/posts/${postId}/comments`,
  ADD_COMMENT: (postId: string) => `${API_BASE_URL}/community/posts/${postId}/comments`,
  UPDATE_COMMENT: (postId: string, commentId: string) => 
    `${API_BASE_URL}/community/posts/${postId}/comments/${commentId}`,
  DELETE_COMMENT: (postId: string, commentId: string) => 
    `${API_BASE_URL}/community/posts/${postId}/comments/${commentId}`,
  GET_CHALLENGES: `${API_BASE_URL}/community/challenges`,
  GET_CHALLENGE: (id: string) => `${API_BASE_URL}/community/challenges/${id}`,
  JOIN_CHALLENGE: (id: string) => `${API_BASE_URL}/community/challenges/${id}/join`,
  LEAVE_CHALLENGE: (id: string) => `${API_BASE_URL}/community/challenges/${id}/leave`,
  UPDATE_CHALLENGE_PROGRESS: (id: string) => `${API_BASE_URL}/community/challenges/${id}/progress`,
};

// Search Endpoints
export const SEARCH_API = {
  SEARCH_BOOKS: `${API_BASE_URL}/search/books`,
  SEARCH_NOTES: `${API_BASE_URL}/search/notes`,
  SEARCH_HIGHLIGHTS: `${API_BASE_URL}/search/highlights`,
  GET_SEARCH_SUGGESTIONS: `${API_BASE_URL}/search/suggestions`,
  SAVE_SEARCH_FILTER: `${API_BASE_URL}/search/filters`,
  GET_SEARCH_FILTERS: `${API_BASE_URL}/search/filters`,
  UPDATE_SEARCH_FILTER: (id: string) => `${API_BASE_URL}/search/filters/${id}`,
  DELETE_SEARCH_FILTER: (id: string) => `${API_BASE_URL}/search/filters/${id}`,
};

// External API Integration
export const EXTERNAL_API = {
  GOOGLE_BOOKS: 'https://www.googleapis.com/books/v1/volumes',
};

// Utility function to handle API responses
export const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }
  return response.json();
};

// Default headers for API requests
export const getDefaultHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};
