import { DatabaseService, Book } from '../../DatabaseService';
import { Alert } from 'react-native';

jest.mock('expo-sqlite');

describe('Book CRUD Integration Tests', () => {
  let db: DatabaseService;
  let testBook: Omit<Book, 'id' | 'created_at' | 'updated_at'>;

  beforeAll(async () => {
    db = await DatabaseService.getInstance();
    testBook = {
      title: '테스트 책 제목',
      author: '테스트 저자',
      isbn: '1234567890123',
      pages: 300,
      status: 'want-to-read',
      cover_color: '#3b82f6',
      cover: 'https://example.com/cover.jpg',
    };
  });

  beforeEach(async () => {
    await db.getAllBooks().then(books => {
      books.forEach(async book => {
        await db.deleteBook(book.id);
      });
    });
  });

  afterAll(async () => {
    await db.getAllBooks().then(books => {
      books.forEach(async book => {
        await db.deleteBook(book.id);
      });
    });
  });

  describe('책 등록 플로우', () => {
    test('검색 결과에서 책 추가 → 내 서재 목록에 반영', async () => {
      const bookId = await db.addBook(testBook);
      expect(bookId).toBeGreaterThan(0);
      const allBooks = await db.getAllBooks();
      const addedBook = allBooks.find(book => book.id === bookId);
      expect(addedBook).toBeDefined();
      expect(addedBook?.title).toBe(testBook.title);
      expect(addedBook?.author).toBe(testBook.author);
      expect(addedBook?.isbn).toBe(testBook.isbn);
      expect(addedBook?.status).toBe('want-to-read');
    });

    test('중복 등록 방지', async () => {
      const firstBookId = await db.addBook(testBook);
      expect(firstBookId).toBeGreaterThan(0);
      try {
        await db.addBook(testBook);
        fail('중복 등록이 허용되었습니다.');
      } catch (error) {
        expect(error).toBeDefined();
      }
      const allBooks = await db.getAllBooks();
      const duplicateBooks = allBooks.filter(
        book => book.title === testBook.title && book.author === testBook.author
      );
      expect(duplicateBooks).toHaveLength(1);
    });

    test('필수값 검증', async () => {
      const bookWithoutTitle = { ...testBook, title: '' };
      try {
        await db.addBook(bookWithoutTitle);
        fail('제목 없이 등록이 허용되었습니다.');
      } catch (error) {
        expect(error).toBeDefined();
      }
      const bookWithoutAuthor = { ...testBook, author: '' };
      try {
        await db.addBook(bookWithoutAuthor);
        fail('저자 없이 등록이 허용되었습니다.');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('책 수정 플로우', () => {
    test('책 정보 수정 → DB 반영 확인', async () => {
      const bookId = await db.addBook(testBook);
      const updatedTitle = '수정된 책 제목';
      const updatedAuthor = '수정된 저자';
      await db.updateBook(bookId, {
        title: updatedTitle,
        author: updatedAuthor,
        status: 'reading'
      });
      const updatedBook = await db.getBookById(bookId);
      expect(updatedBook?.title).toBe(updatedTitle);
      expect(updatedBook?.author).toBe(updatedAuthor);
      expect(updatedBook?.status).toBe('reading');
    });

    test('상태 변경 → 내 서재 필터링 확인', async () => {
      const bookId = await db.addBook(testBook);
      await db.updateBook(bookId, { status: 'reading' });
      const allBooks = await db.getAllBooks();
      const readingBooks = allBooks.filter(book => book.status === 'reading');
      const wantToReadBooks = allBooks.filter(book => book.status === 'want-to-read');
      expect(readingBooks).toHaveLength(1);
      expect(wantToReadBooks).toHaveLength(0);
    });
  });

  describe('책 삭제 플로우', () => {
    test('책 삭제 → 내 서재에서 제거 확인', async () => {
      const bookId = await db.addBook(testBook);
      const beforeDelete = await db.getAllBooks();
      expect(beforeDelete).toHaveLength(1);
      await db.deleteBook(bookId);
      const afterDelete = await db.getAllBooks();
      expect(afterDelete).toHaveLength(0);
      const deletedBook = await db.getBookById(bookId);
      expect(deletedBook).toBeNull();
    });
  });

  describe('전체 플로우 시나리오 테스트', () => {
    test('검색 → 추가 → 목록 → 상세 → 수정 → 삭제 전체 플로우', async () => {
      const searchResultBook = {
        title: '검색된 책',
        author: '검색된 저자',
        isbn: '9876543210987',
        status: 'want-to-read' as const,
        cover_color: '#ef4444',
        cover: 'https://example.com/search-cover.jpg'
      };
      const bookId = await db.addBook(searchResultBook);
      expect(bookId).toBeGreaterThan(0);
      const allBooks = await db.getAllBooks();
      const addedBook = allBooks.find(book => book.id === bookId);
      expect(addedBook?.title).toBe('검색된 책');
      await db.updateBook(bookId, {
        title: '수정된 검색된 책',
        status: 'reading'
      });
      const updatedBook = await db.getBookById(bookId);
      expect(updatedBook?.title).toBe('수정된 검색된 책');
      expect(updatedBook?.status).toBe('reading');
      await db.addQuote({
        book_id: bookId,
        content: '이 책에서 인상 깊었던 구절',
        memo: '개인적인 생각',
        tags: '인상깊음,감동'
      });
      await db.addNote({
        book_id: bookId,
        content: '이 책에 대한 개인적인 메모',
        tags: '메모,생각'
      });
      await db.addReadingSession({
        book_id: bookId,
        start_time: '2024-01-01 14:00:00',
        end_time: '2024-01-01 15:30:00',
        duration_minutes: 90,
        pages_read: 45,
        memo: '오후 독서 세션'
      });
      const finalBook = await db.getBookById(bookId);
      const quotes = await db.getQuotesByBook(bookId);
      const notes = await db.getNotesByBook(bookId);
      const sessions = await db.getSessionsByBook(bookId);
      expect(finalBook?.title).toBe('수정된 검색된 책');
      expect(quotes).toHaveLength(1);
      expect(notes).toHaveLength(1);
      expect(sessions).toHaveLength(1);
      await db.deleteBook(bookId);
      const deletedBook = await db.getBookById(bookId);
      const deletedQuotes = await db.getQuotesByBook(bookId);
      const deletedNotes = await db.getNotesByBook(bookId);
      const deletedSessions = await db.getSessionsByBook(bookId);
      expect(deletedBook).toBeNull();
      expect(deletedQuotes).toHaveLength(0);
      expect(deletedNotes).toHaveLength(0);
      expect(deletedSessions).toHaveLength(0);
    });
  });
}); 