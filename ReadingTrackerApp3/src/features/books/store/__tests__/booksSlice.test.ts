import { BookStatus as BookStatusType } from '@/features/books/types';
import booksReducer, { 
  addBook, 
  updateBook, 
  removeBook, 
  selectAllBooks, 
  selectBookById,
  type Book,
  BookStatus
} from '../booksSlice';

// Create a complete mock book for testing
const createMockBook = (overrides: Partial<Book> = {}): Book => ({
  id: overrides.id || '1',
  title: overrides.title || 'Test Book',
  author: overrides.author || 'Test Author',
  status: overrides.status || BookStatus.Unread,
  currentPage: overrides.currentPage || 0,
  categories: overrides.categories || [],
  createdAt: overrides.createdAt || '2023-01-01',
  updatedAt: overrides.updatedAt || '2023-01-01',
  ...overrides,
});

// Define the BooksState type since it's not exported from the slice
interface BooksState {
  books: Book[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  loading: boolean;
}

describe('books slice', () => {
  const initialState: BooksState = {
    books: [],
    status: 'idle',
    error: null,
    loading: false,
  };

  it('should handle initial state', () => {
    expect(booksReducer(undefined, { type: 'unknown' })).toEqual({
      books: [],
      status: 'idle',
      error: null,
      loading: false,
    });
  });

  it('should handle addBook', () => {
    const { id, ...bookWithoutId } = createMockBook({
      title: 'Test Book',
      author: 'Test Author',
      status: BookStatus.Unread,
    });
    const book = bookWithoutId;

    const actual = booksReducer(initialState, addBook(book));
    expect(actual.books.length).toEqual(1);
    expect(actual.books[0].title).toEqual('Test Book');
    expect(actual.books[0].id).toBeDefined();
  });

  it('should handle updateBook', () => {
    const initialStateWithBook: BooksState = {
      ...initialState,
      books: [
        createMockBook({
          id: '1',
          title: 'Old Title',
          author: 'Test Author',
        })
      ],
    };

    const updatedBook = {
      id: '1',
      title: 'Updated Title',
      updatedAt: '2023-01-02',
    };

    const actual = booksReducer(initialStateWithBook, updateBook(updatedBook));
    expect(actual.books[0].title).toEqual('Updated Title');
    expect(actual.books[0].updatedAt).not.toEqual('2023-01-01');
  });

  it('should handle removeBook', () => {
    const initialStateWithBook: BooksState = {
      ...initialState,
      books: [
        createMockBook({
          id: '1',
          title: 'Test Book',
          author: 'Test Author',
        })
      ],
    };

    const actual = booksReducer(initialStateWithBook, removeBook('1'));
    expect(actual.books.length).toEqual(0);
  });

  it('should select all books', () => {
    const mockBook = createMockBook({
      id: '1',
      title: 'Test Book',
      author: 'Test Author',
    });
    
    const state = {
      books: {
        books: [mockBook],
        status: 'idle' as const,
        error: null,
        loading: false,
      },
    };

    expect(selectAllBooks(state)).toEqual([mockBook]);
  });

  it('should select book by id', () => {
    const mockBook = createMockBook({
      id: '1',
      title: 'Test Book',
      author: 'Test Author',
    });
    
    const state = {
      books: {
        books: [mockBook],
        status: 'idle' as const,
        error: null,
        loading: false,
      },
    };

    expect(selectBookById(state, '1')).toEqual(mockBook);
  });
});
