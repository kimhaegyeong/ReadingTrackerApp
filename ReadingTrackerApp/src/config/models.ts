// Data Models for 북로그 (BookLog) App

// Authentication & User Models
export interface User {
  id: string;
  email: string;
  name?: string;
  photoUrl?: string;
  authProvider?: 'email' | 'google' | 'apple' | 'guest';
  createdAt: string;
  lastLoginAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface UserPreferences {
  id: string;
  userId: string;
  theme: 'light' | 'dark' | 'system';
  fontScale: number;
  notificationSettings: NotificationSettings;
  privacySettings: PrivacySettings;
  viewPreferences: ViewPreferences;
  accessibilitySettings: AccessibilitySettings;
}

export interface NotificationSettings {
  readingReminders: boolean;
  goalReminders: boolean;
  communityNotifications: boolean;
  emailNotifications: boolean;
  reminderTime?: string; // HH:MM format
  doNotDisturbStart?: string; // HH:MM format
  doNotDisturbEnd?: string; // HH:MM format
  customSounds: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  readingActivityVisibility: 'public' | 'friends' | 'private';
  libraryVisibility: 'public' | 'friends' | 'private';
  statsVisibility: 'public' | 'friends' | 'private';
  allowDataCollection: boolean;
}

export interface ViewPreferences {
  homeWidgetOrder: string[]; // IDs of widgets in order
  homeWidgetsVisible: string[]; // IDs of visible widgets
  libraryDefaultView: 'grid' | 'list' | 'stack' | 'coverFlow';
  searchDefaultView: 'grid' | 'list';
  defaultSortOrder: 'title' | 'author' | 'recent' | 'rating';
}

export interface AccessibilitySettings {
  highContrast: boolean;
  reduceAnimations: boolean;
  screenReader: boolean;
  largeText: boolean;
  colorFilters: 'none' | 'grayscale' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}

// Book Models
export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  authors: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  pageCount?: number;
  categories?: string[];
  thumbnail?: string;
  language?: string;
  isbn10?: string;
  isbn13?: string;
  averageRating?: number;
  ratingsCount?: number;
  previewLink?: string;
  infoLink?: string;
}

export interface LibraryBook extends Book {
  status: 'toRead' | 'reading' | 'finished' | 'abandoned';
  addedDate: string;
  startDate?: string;
  finishDate?: string;
  userRating?: number;
  userReview?: string;
  progress: number; // 0-100
  lastReadDate?: string;
  tags: string[];
  favorite: boolean;
  notes: number; // Count of notes
  highlights: number; // Count of highlights
  readingSessions: number; // Count of reading sessions
}

export interface BookSearchResult {
  books: Book[];
  totalItems: number;
  nextPageToken?: string;
}

// Reading Models
export interface ReadingSession {
  id: string;
  userId: string;
  bookId: string;
  date: string; // ISO string
  startPage: number;
  endPage: number;
  duration: number; // minutes
  notes?: string;
  emotion?: 'happy' | 'sad' | 'confused' | 'excited' | 'bored';
  rating?: number; // 1-5
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReadingGoal {
  id: string;
  userId: string;
  type: 'books' | 'pages' | 'time';
  target: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  startDate: string; // ISO string
  endDate?: string; // ISO string
  progress: number;
  completed: boolean;
  name?: string;
  description?: string;
  reminderEnabled: boolean;
  reminderTime?: string; // HH:MM format
  createdAt: string;
  updatedAt: string;
}

export interface ReadingHighlight {
  id: string;
  userId: string;
  bookId: string;
  content: string;
  page: number;
  location?: string; // For e-books
  date: string; // ISO string
  color?: string;
  note?: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReadingNote {
  id: string;
  userId: string;
  bookId: string;
  content: string;
  page?: number;
  chapter?: string;
  date: string; // ISO string
  tags: string[];
  images?: string[]; // URLs to images
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

// Statistics Models
export interface ReadingStats {
  totalBooks: number;
  totalPages: number;
  totalReadingTime: number; // minutes
  averageReadingSpeed: number; // pages per hour
  longestStreak: number; // days
  currentStreak: number; // days
  booksThisYear: number;
  booksLastYear: number;
  readingTimeByMonth: { [month: string]: number }; // minutes per month
  readingTimeByDay: { [day: string]: number }; // minutes per day of week
  readingTimeByHour: { [hour: string]: number }; // minutes per hour of day
  mostReadGenres: { genre: string; count: number }[];
  mostReadAuthors: { author: string; count: number }[];
}

export interface TimeDistribution {
  hourly: { [hour: string]: number }; // 0-23
  daily: { [day: string]: number }; // 0-6 (Sunday-Saturday)
  monthly: { [month: string]: number }; // 0-11 (January-December)
}

// Search Models
export interface SearchFilter {
  id: string;
  userId: string;
  name: string;
  author?: string;
  publisher?: string;
  category?: string;
  yearFrom?: number;
  yearTo?: number;
  language?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SearchHistory {
  id: string;
  userId: string;
  query: string;
  timestamp: number;
  resultCount: number;
}

// Community Models
export interface Post {
  id: string;
  userId: string;
  userName: string;
  userPhotoUrl?: string;
  content: string;
  images?: string[];
  bookId?: string;
  bookTitle?: string;
  bookThumbnail?: string;
  likes: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userPhotoUrl?: string;
  content: string;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'books' | 'pages' | 'time';
  target: number;
  startDate: string;
  endDate: string;
  participants: number;
  creatorId: string;
  creatorName: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChallengeParticipation {
  id: string;
  challengeId: string;
  userId: string;
  progress: number;
  completed: boolean;
  joinedAt: string;
  updatedAt: string;
}

// API Response Models
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}
