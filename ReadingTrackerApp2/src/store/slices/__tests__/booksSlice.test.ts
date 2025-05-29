import booksReducer, {
  addBook,
  updateBook,
  deleteBook,
  addBookmark,
  updateBookmark,
  deleteBookmark,
  addReview,
  deleteReview,
  addReadingSession,
  setCurrentBook,
} from '../booksSlice';

describe('booksSlice', () => {
  const initialState = {
    books: [],
    loading: false,
    error: null,
    currentBook: null,
  };

  const mockBook = {
    id: '1',
    title: '테스트 책',
    authors: ['테스트 작가'],
    description: '테스트 설명',
    thumbnail: 'https://example.com/thumbnail.jpg',
    publishedDate: '2024-01-01',
    pageCount: 300,
    status: 'reading' as const,
    currentPage: 0,
    startDate: new Date().toISOString(),
    endDate: null,
    rating: 0,
    review: '',
    bookmarks: [],
    reviews: [],
    readingSessions: [],
    categories: [],
    publisher: '테스트 출판사',
    language: 'ko',
    imageLinks: {},
    isbn: '1234567890',
    userSpecificData: {
      status: 'reading' as const,
      currentPage: 0,
      startDate: new Date().toISOString(),
      endDate: null,
      rating: 0,
      review: '',
      bookmarks: [],
      reviews: [],
      readingSessions: [],
    },
  };

  it('초기 상태를 반환한다', () => {
    expect(booksReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  it('책을 추가한다', () => {
    const nextState = booksReducer(initialState, addBook(mockBook));
    expect(nextState.books).toHaveLength(1);
    expect(nextState.books[0]).toEqual(mockBook);
  });

  it('책을 업데이트한다', () => {
    const state = {
      ...initialState,
      books: [mockBook],
    };
    const updatedBook = {
      ...mockBook,
      title: '수정된 책 제목',
    };
    const nextState = booksReducer(state, updateBook(updatedBook));
    expect(nextState.books[0].title).toBe('수정된 책 제목');
  });

  it('책을 삭제한다', () => {
    const state = {
      ...initialState,
      books: [mockBook],
    };
    const nextState = booksReducer(state, deleteBook(mockBook.id));
    expect(nextState.books).toHaveLength(0);
  });

  it('북마크를 추가한다', () => {
    const state = {
      ...initialState,
      books: [mockBook],
    };
    const bookmark = {
      id: '1',
      page: 100,
      note: '테스트 북마크',
      createdAt: new Date().toISOString(),
    };
    const nextState = booksReducer(
      state,
      addBookmark({ bookId: mockBook.id, bookmark })
    );
    expect(nextState.books[0].bookmarks).toHaveLength(1);
    expect(nextState.books[0].bookmarks[0]).toEqual(bookmark);
  });

  it('북마크를 업데이트한다', () => {
    const bookmark = {
      id: '1',
      page: 100,
      note: '테스트 북마크',
      createdAt: new Date().toISOString(),
    };
    const state = {
      ...initialState,
      books: [{ ...mockBook, bookmarks: [bookmark] }],
    };
    const updatedBookmark = {
      ...bookmark,
      note: '수정된 북마크',
    };
    const nextState = booksReducer(
      state,
      updateBookmark({ bookId: mockBook.id, bookmark: updatedBookmark })
    );
    expect(nextState.books[0].bookmarks[0].note).toBe('수정된 북마크');
  });

  it('북마크를 삭제한다', () => {
    const bookmark = {
      id: '1',
      page: 100,
      note: '테스트 북마크',
      createdAt: new Date().toISOString(),
    };
    const state = {
      ...initialState,
      books: [{ ...mockBook, bookmarks: [bookmark] }],
    };
    const nextState = booksReducer(
      state,
      deleteBookmark({ bookId: mockBook.id, bookmarkId: bookmark.id })
    );
    expect(nextState.books[0].bookmarks).toHaveLength(0);
  });

  it('리뷰를 추가한다', () => {
    const state = {
      ...initialState,
      books: [mockBook],
    };
    const review = {
      id: '1',
      rating: 5,
      content: '테스트 리뷰',
      createdAt: new Date().toISOString(),
    };
    const nextState = booksReducer(
      state,
      addReview({ bookId: mockBook.id, review })
    );
    expect(nextState.books[0].reviews).toHaveLength(1);
    expect(nextState.books[0].reviews[0]).toEqual(review);
  });

  it('리뷰를 삭제한다', () => {
    const review = {
      id: '1',
      rating: 5,
      content: '테스트 리뷰',
      createdAt: new Date().toISOString(),
    };
    const state = {
      ...initialState,
      books: [{ ...mockBook, reviews: [review] }],
    };
    const nextState = booksReducer(
      state,
      deleteReview({ bookId: mockBook.id, reviewId: review.id })
    );
    expect(nextState.books[0].reviews).toHaveLength(0);
  });

  it('독서 세션을 추가한다', () => {
    const state = {
      ...initialState,
      books: [mockBook],
    };
    const session = {
      id: '1',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      pagesRead: 50,
      notes: '테스트 세션',
    };
    const nextState = booksReducer(
      state,
      addReadingSession({ bookId: mockBook.id, session })
    );
    expect(nextState.books[0].readingSessions).toHaveLength(1);
    expect(nextState.books[0].readingSessions[0]).toEqual(session);
    expect(nextState.books[0].currentPage).toBe(50);
  });

  it('현재 책을 설정한다', () => {
    const nextState = booksReducer(initialState, setCurrentBook(mockBook));
    expect(nextState.currentBook).toEqual(mockBook);
  });
}); 