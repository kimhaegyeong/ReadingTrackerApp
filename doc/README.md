# 북로그 (BookLog) API Documentation

This document provides an overview of the API endpoints and data structures used in the 북로그 (BookLog) application.

## Table of Contents

1. [API Base URL](#api-base-url)
2. [Authentication](#authentication)
3. [User Management](#user-management)
4. [Book Management](#book-management)
5. [Library Management](#library-management)
6. [Reading Sessions](#reading-sessions)
7. [Goals](#goals)
8. [Notes and Highlights](#notes-and-highlights)
9. [Statistics](#statistics)
10. [Search](#search)
11. [Community](#community)
12. [Data Models](#data-models)

## API Base URL

All API endpoints are prefixed with the base URL:

```
https://api.booklog.com/v1
```

## Authentication

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | User login with email and password |
| POST | `/auth/register` | Register a new user |
| POST | `/auth/logout` | User logout |
| POST | `/auth/refresh-token` | Refresh authentication token |
| POST | `/auth/google` | Login with Google |
| POST | `/auth/apple` | Login with Apple |
| GET | `/auth/verify` | Verify authentication token |
| POST | `/auth/reset-password` | Request password reset |

### Authentication Flow

1. User logs in using email/password or social login
2. Server returns a JWT token and refresh token
3. Client stores the token in AsyncStorage
4. Token is included in the Authorization header for subsequent requests
5. When token expires, client uses refresh token to get a new token
6. On logout, token is removed from AsyncStorage and invalidated on server

## User Management

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/profile` | Get user profile |
| PUT | `/users/profile` | Update user profile |
| GET | `/users/preferences` | Get user preferences |
| PUT | `/users/preferences` | Update user preferences |
| GET | `/users/statistics` | Get user statistics |
| POST | `/users/profile/image` | Upload profile image |

## Book Management

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/books/search` | Search for books |
| GET | `/books/{id}` | Get book details |
| GET | `/books/recommendations` | Get book recommendations |
| GET | `/books/popular` | Get popular books |
| GET | `/books/barcode` | Search book by barcode |
| POST | `/books` | Add a new book |
| PUT | `/books/{id}` | Update book information |
| DELETE | `/books/{id}` | Delete a book |

### Search Parameters

- `q`: Search query (title, author, ISBN)
- `author`: Filter by author
- `publisher`: Filter by publisher
- `category`: Filter by category/genre
- `yearFrom`: Filter by publication year (minimum)
- `yearTo`: Filter by publication year (maximum)
- `language`: Filter by language
- `page`: Page number for pagination
- `pageSize`: Number of results per page

## Library Management

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/library` | Get user's library |
| POST | `/library` | Add book to library |
| PUT | `/library/books/{bookId}/status` | Update book status |
| GET | `/library/books/{bookId}` | Get book details from library |
| DELETE | `/library/books/{bookId}` | Remove book from library |
| GET | `/library/categories` | Get user's categories |
| POST | `/library/categories` | Create a new category |
| PUT | `/library/categories/{id}` | Update a category |
| DELETE | `/library/categories/{id}` | Delete a category |
| GET | `/library/tags` | Get user's tags |
| POST | `/library/tags` | Create a new tag |
| DELETE | `/library/tags/{id}` | Delete a tag |

### Book Status

- `toRead`: Books the user wants to read
- `reading`: Books the user is currently reading
- `finished`: Books the user has finished reading
- `abandoned`: Books the user has abandoned

## Reading Sessions

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reading/sessions` | Get reading sessions |
| GET | `/reading/sessions/{id}` | Get reading session details |
| POST | `/reading/sessions` | Create a new reading session |
| PUT | `/reading/sessions/{id}` | Update a reading session |
| DELETE | `/reading/sessions/{id}` | Delete a reading session |
| GET | `/reading/summary/daily/{date}` | Get daily reading summary |
| GET | `/reading/summary/weekly/{weekStart}` | Get weekly reading summary |
| GET | `/reading/summary/monthly/{yearMonth}` | Get monthly reading summary |
| GET | `/reading/summary/yearly/{year}` | Get yearly reading summary |
| GET | `/reading/streak` | Get reading streak information |

## Goals

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/goals` | Get user's goals |
| GET | `/goals/{id}` | Get goal details |
| POST | `/goals` | Create a new goal |
| PUT | `/goals/{id}` | Update a goal |
| DELETE | `/goals/{id}` | Delete a goal |
| GET | `/goals/{id}/progress` | Get goal progress |
| PUT | `/goals/{id}/progress` | Update goal progress |

### Goal Types

- `books`: Number of books to read
- `pages`: Number of pages to read
- `time`: Amount of time to spend reading (in minutes)

### Goal Periods

- `daily`: Daily goal
- `weekly`: Weekly goal
- `monthly`: Monthly goal
- `yearly`: Yearly goal
- `custom`: Custom date range

## Notes and Highlights

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notes` | Get user's notes |
| GET | `/notes/{id}` | Get note details |
| POST | `/notes` | Create a new note |
| PUT | `/notes/{id}` | Update a note |
| DELETE | `/notes/{id}` | Delete a note |
| GET | `/books/{bookId}/notes` | Get notes for a specific book |
| GET | `/highlights` | Get user's highlights |
| GET | `/highlights/{id}` | Get highlight details |
| POST | `/highlights` | Create a new highlight |
| PUT | `/highlights/{id}` | Update a highlight |
| DELETE | `/highlights/{id}` | Delete a highlight |
| GET | `/books/{bookId}/highlights` | Get highlights for a specific book |

## Statistics

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stats/reading` | Get reading statistics |
| GET | `/stats/books` | Get book statistics |
| GET | `/stats/genres` | Get genre statistics |
| GET | `/stats/time-distribution` | Get reading time distribution |
| GET | `/stats/reading-speed` | Get reading speed statistics |
| GET | `/stats/goal-completion` | Get goal completion statistics |
| GET | `/stats/patterns` | Get reading pattern analysis |
| GET | `/stats/comparison` | Get comparison with other users |

## Search

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/search/books` | Search books |
| GET | `/search/notes` | Search notes |
| GET | `/search/highlights` | Search highlights |
| GET | `/search/suggestions` | Get search suggestions |
| POST | `/search/filters` | Save search filter |
| GET | `/search/filters` | Get saved search filters |
| PUT | `/search/filters/{id}` | Update search filter |
| DELETE | `/search/filters/{id}` | Delete search filter |

## Community

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/community/feed` | Get community feed |
| GET | `/community/posts/{id}` | Get post details |
| POST | `/community/posts` | Create a new post |
| PUT | `/community/posts/{id}` | Update a post |
| DELETE | `/community/posts/{id}` | Delete a post |
| POST | `/community/posts/{id}/like` | Like a post |
| POST | `/community/posts/{id}/unlike` | Unlike a post |
| GET | `/community/posts/{postId}/comments` | Get comments for a post |
| POST | `/community/posts/{postId}/comments` | Add a comment to a post |
| PUT | `/community/posts/{postId}/comments/{commentId}` | Update a comment |
| DELETE | `/community/posts/{postId}/comments/{commentId}` | Delete a comment |
| GET | `/community/challenges` | Get challenges |
| GET | `/community/challenges/{id}` | Get challenge details |
| POST | `/community/challenges/{id}/join` | Join a challenge |
| POST | `/community/challenges/{id}/leave` | Leave a challenge |
| PUT | `/community/challenges/{id}/progress` | Update challenge progress |

## Data Models

### User

```typescript
interface User {
  id: string;
  email: string;
  name?: string;
  photoUrl?: string;
  authProvider?: 'email' | 'google' | 'apple' | 'guest';
  createdAt: string;
  lastLoginAt: string;
}
```

### Book

```typescript
interface Book {
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
```

### LibraryBook

```typescript
interface LibraryBook extends Book {
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
```

### ReadingSession

```typescript
interface ReadingSession {
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
```

### ReadingGoal

```typescript
interface ReadingGoal {
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
```

### ReadingHighlight

```typescript
interface ReadingHighlight {
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
```

### ReadingNote

```typescript
interface ReadingNote {
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
```

### Post

```typescript
interface Post {
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
```

### Challenge

```typescript
interface Challenge {
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
```

For more detailed information about the data models, please refer to the `models.ts` file.
