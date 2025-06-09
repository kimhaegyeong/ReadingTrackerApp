nd# 독서 기록 앱 개발 문서

## 1. 프로젝트 개요

### 프로젝트 설명
독서 기록 앱은 사용자가 읽은 책을 기록하고 관리할 수 있는 모바일 애플리케이션입니다. 사용자들은 읽은 책, 현재 읽고 있는 책, 그리고 읽고 싶은 책들을 관리하고, 독서 진행 상황을 추적하며, 독서 감상과 인상 깊은 구절을 기록할 수 있습니다.

### 기술 스택
- **프레임워크**: React Native (Expo SDK 49)
- **상태 관리**: Redux Toolkit
- **로컬 데이터베이스**: SQLite (expo-sqlite)
- **UI 라이브러리**: React Native Paper
- **네비게이션**: React Navigation v6
- **테스트**: Jest, React Native Testing Library
- **타입스크립트**: TypeScript 5.1.3

### 주요 기능
1. 책 관리 (추가, 수정, 삭제)
2. 독서 진행 상황 추적
3. 독서 메모 및 하이라이트
4. 독서 통계 및 분석
5. 오프라인 지원

## 2. 프로젝트 구조

### 폴더 구조
```
src/
├── assets/          # 이미지, 폰트 등 정적 파일
├── components/      # 재사용 가능한 UI 컴포넌트
├── config/          # 앱 설정 및 환경 변수
├── navigation/      # 네비게이션 설정
├── screens/         # 앱 화면 컴포넌트
├── services/        # API 및 데이터베이스 서비스
├── store/           # Redux 스토어 설정
├── theme/           # 테마 및 스타일 설정
├── types/           # TypeScript 타입 정의
└── utils/           # 유틸리티 함수
```

## 3. 주요 컴포넌트

### 3.1 책 관리 컴포넌트
- **BookList**: 
  - 책 목록을 그리드 또는 리스트 형태로 표시
  - 정렬 및 필터링 기능 (상태별, 날짜별, 제목별)
  - 책 검색 기능
  - 무한 스크롤 구현

- **BookDetail**: 
  - 책의 상세 정보 표시 (제목, 저자, 출판사, ISBN 등)
  - 책 표지 이미지 표시 및 확대 보기
  - 독서 진행률 시각화
  - 관련 메모 및 하이라이트 목록

- **BookForm**: 
  - 새 책 추가 및 기존 책 정보 수정
  - 바코드 스캔을 통한 책 정보 자동 입력
  - 책 표지 이미지 업로드 및 편집
  - 필수 정보 유효성 검사

### 3.2 독서 진행 관리 컴포넌트
- **ReadingProgress**: 
  - 현재 페이지 입력 및 진행률 표시
  - 목표 페이지 설정 및 알림
  - 독서 시간 타이머
  - 일일/주간/월간 독서 목표 설정

- **ReadingSession**: 
  - 독서 세션 시작/종료 시간 기록
  - 페이지 진행 상황 자동 계산
  - 독서 세션 통계 (평균 독서 시간, 페이지 등)
  - 독서 세션 히스토리

- **ReadingGoals**: 
  - 독서 목표 설정 및 관리
  - 목표 달성 현황 대시보드
  - 목표 알림 설정
  - 목표 달성 축하 메시지

### 3.3 메모 및 하이라이트 컴포넌트
- **NoteEditor**: 
  - 리치 텍스트 에디터
  - 이미지 첨부 기능
  - 태그 시스템
  - 메모 템플릿

- **HighlightManager**: 
  - 텍스트 선택 및 하이라이트
  - 하이라이트 색상 커스터마이징
  - 하이라이트 카테고리 분류
  - 하이라이트 공유 기능

- **NoteList**: 
  - 메모 및 하이라이트 목록 표시
  - 검색 및 필터링
  - 메모 정렬 (날짜, 페이지, 태그 등)
  - 메모 내보내기/가져오기

### 3.4 통계 및 분석 컴포넌트
- **ReadingStats**: 
  - 독서 통계 대시보드
  - 독서 시간 추이 그래프
  - 장르별 독서 비율
  - 월간/연간 독서 목표 달성률

- **ReadingAnalytics**: 
  - 독서 패턴 분석
  - 독서 습관 추적
  - 독서 추천 시스템
  - 독서 성과 리포트

- **AchievementSystem**: 
  - 독서 관련 업적 시스템
  - 배지 및 보상
  - 독서 챌린지
  - 친구와의 독서 경쟁

### 3.5 공통 컴포넌트
- **Header**: 
  - 네비게이션 헤더
  - 검색바
  - 알림 아이콘
  - 사용자 프로필

- **BottomTab**: 
  - 메인 네비게이션 탭
  - 빠른 액션 버튼
  - 알림 배지
  - 테마 스위처

- **Loading**: 
  - 로딩 스피너
  - 스켈레톤 UI
  - 진행 상태 표시
  - 오프라인 상태 표시

- **ErrorBoundary**: 
  - 에러 처리
  - 폴백 UI
  - 에러 리포팅
  - 자동 복구 시도

## 4. 데이터 모델

### Book
```typescript
interface Book {
  id: string;
  title: string;
  author: string;
  coverImage?: string;
  totalPages: number;
  currentPage: number;
  status: 'reading' | 'completed' | 'toRead';
  startDate?: Date;
  endDate?: Date;
  rating?: number;
  isbn?: string;
  publisher?: string;
  publishedDate?: Date;
  description?: string;
  genre?: string[];
  tags?: string[];
}
```

### Note
```typescript
interface Note {
  id: string;
  bookId: string;
  content: string;
  page?: number;
  type: 'note' | 'highlight';
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  color?: string;
  images?: string[];
  isPublic: boolean;
}
```

### ReadingSession
```typescript
interface ReadingSession {
  id: string;
  bookId: string;
  startTime: Date;
  endTime?: Date;
  startPage: number;
  endPage?: number;
  duration?: number; // 분 단위
  location?: string;
  mood?: 'good' | 'neutral' | 'bad';
  notes?: string;
}
```

### ReadingGoal
```typescript
interface ReadingGoal {
  id: string;
  userId: string;
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  target: number; // 페이지 또는 책 수
  unit: 'pages' | 'books';
  startDate: Date;
  endDate: Date;
  progress: number;
  status: 'active' | 'completed' | 'failed';
  reminder?: boolean;
}
```

### Achievement
```typescript
interface Achievement {
  id: string;
  title: string;
  description: string;
  type: 'reading_streak' | 'book_count' | 'page_count' | 'genre_explorer' | 'custom';
  criteria: {
    type: string;
    value: number;
  };
  icon: string;
  unlockedAt?: Date;
  progress?: number;
}
```

### User
```typescript
interface User {
  id: string;
  username: string;
  email: string;
  profileImage?: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    notifications: boolean;
    readingGoals: boolean;
    achievementAlerts: boolean;
  };
  statistics: {
    totalBooksRead: number;
    totalPagesRead: number;
    readingStreak: number;
    averageReadingTime: number;
  };
  createdAt: Date;
  lastActive: Date;
}
```

### ReadingStatistics
```typescript
interface ReadingStatistics {
  id: string;
  userId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
  metrics: {
    booksRead: number;
    pagesRead: number;
    readingTime: number;
    averagePagesPerDay: number;
    mostReadGenre: string;
    mostReadTime: string;
    completionRate: number;
  };
  goals: {
    completed: number;
    total: number;
    successRate: number;
  };
}
```

### Bookmark
```typescript
interface Bookmark {
  id: string;
  bookId: string;
  page: number;
  title?: string;
  description?: string;
  createdAt: Date;
  color?: string;
  isPublic: boolean;
}
```

### ReadingChallenge
```typescript
interface ReadingChallenge {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  participants: string[]; // userId 배열
  rules: {
    type: 'book_count' | 'page_count' | 'genre_exploration';
    target: number;
    conditions?: Record<string, any>;
  };
  leaderboard: {
    userId: string;
    progress: number;
    rank: number;
  }[];
  status: 'upcoming' | 'active' | 'completed';
}
```

## 5. 테스트 전략

### 5.1 단위 테스트
- Jest를 사용한 유틸리티 함수 테스트
- 컴포넌트 렌더링 테스트
- Redux 리듀서 테스트

### 5.2 통합 테스트
- 컴포넌트 간 상호작용 테스트
- 네비게이션 플로우 테스트
- 데이터 흐름 테스트

### 5.3 E2E 테스트
- 주요 사용자 시나리오 테스트
- 오프라인 기능 테스트
- 성능 테스트

## 6. 성능 최적화

### 6.1 렌더링 최적화
- React.memo 사용
- 불필요한 리렌더링 방지
- 이미지 최적화

### 6.2 데이터 최적화
- SQLite 인덱싱
- 데이터 캐싱
- 지연 로딩

### 6.3 메모리 관리
- 이미지 메모리 관리
- 대용량 데이터 처리
- 메모리 누수 방지

## 7. 보안

### 7.1 데이터 보안
- 로컬 데이터 암호화
- 민감 정보 보호
- 백업 및 복구

### 7.2 앱 보안
- 입력 데이터 검증
- 에러 처리
- 보안 업데이트

## 8. 접근성

### 8.1 UI 접근성
- 스크린 리더 지원
- 키보드 네비게이션
- 색상 대비

### 8.2 사용성
- 직관적인 UI/UX
- 오프라인 지원
- 다국어 지원

## 9. 배포 및 유지보수

### 9.1 배포 프로세스
- Expo 빌드 및 배포
- 버전 관리
- 업데이트 관리

### 9.2 모니터링
- 에러 추적
- 사용자 피드백
- 성능 모니터링

### 9.3 유지보수
- 코드 리뷰
- 문서화
- 버그 수정

## 21. 데이터베이스 스키마

### 21.1 테이블 구조
```sql
-- 책 테이블
CREATE TABLE books (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  authors TEXT NOT NULL,
  description TEXT,
  pageCount INTEGER,
  publishedDate TEXT,
  publisher TEXT,
  thumbnail TEXT,
  createdAt TEXT NOT NULL
);

-- 사용자별 책 데이터 테이블
CREATE TABLE user_book_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bookId TEXT NOT NULL,
  userId TEXT NOT NULL,
  status TEXT NOT NULL,
  currentPage INTEGER DEFAULT 0,
  startDate TEXT,
  endDate TEXT,
  rating INTEGER DEFAULT 0,
  review TEXT,
  FOREIGN KEY (bookId) REFERENCES books (id)
);

-- 북마크 테이블
CREATE TABLE bookmarks (
  id TEXT PRIMARY KEY,
  bookId TEXT NOT NULL,
  userId TEXT NOT NULL,
  page INTEGER NOT NULL,
  note TEXT,
  createdAt TEXT NOT NULL,
  FOREIGN KEY (bookId) REFERENCES books (id)
);

-- 리뷰 테이블
CREATE TABLE reviews (
  id TEXT PRIMARY KEY,
  bookId TEXT NOT NULL,
  userId TEXT NOT NULL,
  rating INTEGER NOT NULL,
  text TEXT,
  createdAt TEXT NOT NULL,
  FOREIGN KEY (bookId) REFERENCES books (id)
);

-- 독서 세션 테이블
CREATE TABLE reading_sessions (
  id TEXT PRIMARY KEY,
  bookId TEXT NOT NULL,
  userId TEXT NOT NULL,
  startTime TEXT NOT NULL,
  endTime TEXT,
  pagesRead INTEGER DEFAULT 0,
  FOREIGN KEY (bookId) REFERENCES books (id)
);
```

### 21.2 인덱스
```sql
-- 성능 최적화를 위한 인덱스
CREATE INDEX idx_user_book_data_userId ON user_book_data(userId);
CREATE INDEX idx_user_book_data_status ON user_book_data(status);
CREATE INDEX idx_bookmarks_userId ON bookmarks(userId);
CREATE INDEX idx_reviews_userId ON reviews(userId);
CREATE INDEX idx_reading_sessions_userId ON reading_sessions(userId);
```

## 22. API 구조

### 22.1 데이터베이스 서비스
```typescript
interface DatabaseService {
  // 초기화
  initDatabase(): Promise<void>;
  
  // 책 관련
  saveBook(book: Book): Promise<void>;
  loadBook(bookId: string): Promise<Book | null>;
  loadAllBooks(): Promise<Book[]>;
  
  // 사용자 책 데이터
  saveUserBookData(bookId: string, userId: string, data: UserBookData): Promise<void>;
  loadUserBookData(bookId: string, userId: string): Promise<UserBookData | null>;
  
  // 북마크
  saveBookmark(bookId: string, userId: string, bookmark: Bookmark): Promise<void>;
  loadBookmarks(bookId: string, userId: string): Promise<Bookmark[]>;
  
  // 리뷰
  saveReview(bookId: string, userId: string, review: Review): Promise<void>;
  loadReviews(bookId: string, userId: string): Promise<Review[]>;
  
  // 독서 세션
  saveReadingSession(bookId: string, userId: string, session: ReadingSession): Promise<void>;
  loadReadingSessions(bookId: string, userId: string): Promise<ReadingSession[]>;
}
```

### 22.2 Google Books API 통합
```typescript
interface GoogleBooksService {
  searchBooks(query: string): Promise<Book[]>;
  getBookDetails(bookId: string): Promise<Book>;
  getBookCover(isbn: string): Promise<string>;
}
```

## 23. 상태 관리 구조

### 23.1 Redux 스토어 구조
```typescript
interface RootState {
  books: {
    items: Book[];
    selectedBook: Book | null;
    loading: boolean;
    error: string | null;
  };
  user: {
    profile: User | null;
    preferences: UserPreferences;
    loading: boolean;
    error: string | null;
  };
  stats: {
    readingStats: ReadingStats;
    goals: ReadingGoal[];
    loading: boolean;
    error: string | null;
  };
}
```

### 23.2 주요 액션 타입
```typescript
// Books
type BookActionTypes = 
  | 'books/fetchBooks'
  | 'books/fetchBooksSuccess'
  | 'books/fetchBooksFailure'
  | 'books/selectBook'
  | 'books/updateBook'
  | 'books/deleteBook';

// User
type UserActionTypes =
  | 'user/updateProfile'
  | 'user/updatePreferences'
  | 'user/setLoading'
  | 'user/setError';

// Stats
type StatsActionTypes =
  | 'stats/updateReadingStats'
  | 'stats/updateGoals'
  | 'stats/setLoading'
  | 'stats/setError';
```

## 24. 에러 처리 전략

### 24.1 에러 타입
```typescript
interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

type ErrorCode = 
  | 'DATABASE_ERROR'
  | 'NETWORK_ERROR'
  | 'VALIDATION_ERROR'
  | 'AUTHENTICATION_ERROR'
  | 'PERMISSION_ERROR';
```

### 24.2 에러 처리 미들웨어
```typescript
const errorHandler = (error: AppError) => {
  switch (error.code) {
    case 'DATABASE_ERROR':
      return handleDatabaseError(error);
    case 'NETWORK_ERROR':
      return handleNetworkError(error);
    case 'VALIDATION_ERROR':
      return handleValidationError(error);
    default:
      return handleGenericError(error);
  }
};
```

## 25. 성능 최적화 전략

### 25.1 데이터베이스 최적화
- 인덱스 사용
- 쿼리 최적화
- 트랜잭션 사용
- 데이터 캐싱

### 25.2 렌더링 최적화
- React.memo 사용
- useCallback과 useMemo 활용
- 불필요한 리렌더링 방지
- 이미지 최적화

### 25.3 메모리 관리
- 대용량 데이터 청크 처리
- 이미지 메모리 관리
- 가비지 컬렉션 최적화

## 26. 테스트 전략

### 26.1 단위 테스트
```typescript
describe('Database Service', () => {
  test('should save and load book', async () => {
    const book = createMockBook();
    await saveBook(book);
    const loadedBook = await loadBook(book.id);
    expect(loadedBook).toEqual(book);
  });
});
```

### 26.2 통합 테스트
```typescript
describe('Book Management', () => {
  test('should handle book CRUD operations', async () => {
    // 책 생성
    const book = await createBook(mockBookData);
    expect(book).toBeDefined();

    // 책 조회
    const loadedBook = await getBook(book.id);
    expect(loadedBook).toEqual(book);

    // 책 수정
    const updatedBook = await updateBook(book.id, { title: 'Updated Title' });
    expect(updatedBook.title).toBe('Updated Title');

    // 책 삭제
    await deleteBook(book.id);
    const deletedBook = await getBook(book.id);
    expect(deletedBook).toBeNull();
  });
});
```

### 26.3 E2E 테스트
```typescript
describe('Book Reading Flow', () => {
  test('should track reading progress', async () => {
    // 책 추가
    await addBook(mockBook);
    
    // 독서 세션 시작
    const session = await startReadingSession(bookId);
    
    // 페이지 진행
    await updateReadingProgress(bookId, 50);
    
    // 독서 세션 종료
    await endReadingSession(session.id);
    
    // 통계 확인
    const stats = await getReadingStats();
    expect(stats.pagesRead).toBe(50);
  });
});
```

## 27. 배포 및 CI/CD

### 27.1 배포 환경
```typescript
// app.config.ts
export default {
  expo: {
    name: 'ReadingTracker',
    version: '1.0.0',
    ios: {
      bundleIdentifier: 'com.readingtracker.app',
      buildNumber: '1',
    },
    android: {
      package: 'com.readingtracker.app',
      versionCode: 1,
    },
  },
};
```

### 27.2 CI/CD 파이프라인
```yaml
name: CI/CD Pipeline
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
      - name: Build
        run: expo build
```

## 28. 보안 가이드라인

### 28.1 데이터 보안
- SQLite 데이터베이스 암호화
- 민감 정보 암호화 저장
- 안전한 데이터 백업

### 28.2 앱 보안
- 입력 데이터 검증
- 에러 메시지 보안
- 세션 관리
- 권한 관리

## 29. 접근성 가이드라인

### 29.1 UI 접근성
- 스크린 리더 지원
- 키보드 네비게이션
- 색상 대비
- 터치 타겟 크기

### 29.2 접근성 테스트
```typescript
describe('Accessibility', () => {
  test('BookCard should be accessible', () => {
    const { getByLabelText } = render(<BookCard book={mockBook} />);
    expect(getByLabelText(mockBook.title)).toBeInTheDocument();
  });
});
```

## 30. 국제화(i18n)

### 30.1 번역 구조
```typescript
const translations = {
  ko: {
    common: {
      save: '저장',
      cancel: '취소',
      delete: '삭제',
    },
    books: {
      add: '책 추가',
      edit: '책 수정',
      delete: '책 삭제',
    },
  },
  en: {
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
    },
    books: {
      add: 'Add Book',
      edit: 'Edit Book',
      delete: 'Delete Book',
    },
  },
};
```

### 30.2 날짜/시간 포맷
```typescript
const formatDate = (date: Date, locale: string = 'ko') => {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};
``` 