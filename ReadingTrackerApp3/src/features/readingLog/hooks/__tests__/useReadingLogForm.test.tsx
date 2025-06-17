import { renderHook, act } from '@testing-library/react-hooks';
import { useReadingLogForm } from '../useReadingLogForm';
import { Book, BookStatus } from '@/features/books/types';

// Mock the Redux hooks
const mockDispatch = jest.fn();
const mockUseSelector = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector: any) => mockUseSelector(selector),
}));

describe('useReadingLogForm', () => {
  // Mock the current date for consistent testing
  const mockDate = new Date('2025-01-01T10:00:00Z');
  const realDate = Date;

  beforeAll(() => {
    // @ts-ignore
    global.Date = class extends realDate {
      constructor() {
        super();
        return mockDate;
      }
    };
  });

  afterAll(() => {
    global.Date = realDate;
    jest.clearAllMocks();
  });

  // Mock book data
  const mockBook: Book = {
    id: 'book-1',
    title: 'Test Book',
    author: 'Test Author',
    pages: 200,
    currentPage: 0,
    status: 'unread' as BookStatus,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    categories: [],
  };

  beforeEach(() => {
    jest.useFakeTimers();
    mockDispatch.mockClear();
    mockUseSelector.mockClear();
    
    // Mock the Redux selector to return an empty state by default
    mockUseSelector.mockImplementation((selector) => {
      const mockState = {
        readingLog: {
          readingSessions: {},
          annotations: {},
          bookProgress: {},
          status: 'idle',
          error: null,
        },
      };
      return selector(mockState);
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useReadingLogForm(mockBook));

    expect(result.current.startPage).toBe('');
    expect(result.current.endPage).toBe('');
    expect(result.current.notes).toBe('');
    expect(result.current.isTracking).toBe(false);
    expect(result.current.isPaused).toBe(false);
    expect(result.current.elapsedTime).toBe(0);
  });

  it('should start a reading session', () => {
    const { result } = renderHook(() => useReadingLogForm(mockBook));

    act(() => {
      result.current.setStartPage('1');
      result.current.handleStartSession();
    });

    // Verify the dispatch was called with the correct action
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'readingLog/startReadingSession',
        payload: expect.objectContaining({
          bookId: 'book-1',
          startPage: 1,
        }),
      })
    );

    // Verify the local state was updated
    expect(result.current.isTracking).toBe(true);
    expect(result.current.isPaused).toBe(false);
  });

  it('should pause and resume a reading session', () => {
    const { result } = renderHook(() => useReadingLogForm(mockBook));

    // Start a session
    act(() => {
      result.current.setStartPage('1');
      result.current.handleStartSession();
      
      // Fast-forward time by 30 seconds
      jest.advanceTimersByTime(30000);
    });

    // Pause the session
    act(() => {
      result.current.handlePauseSession();
    });

    // Verify the pause action was dispatched
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'readingLog/pauseReadingSession',
        payload: expect.objectContaining({
          id: expect.any(String),
        }),
      })
    );

    expect(result.current.isPaused).toBe(true);

    // Fast-forward time while paused (shouldn't affect elapsed time)
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    // Resume the session
    act(() => {
      result.current.handleResumeSession();
      
      // Fast-forward time by another 30 seconds
      jest.advanceTimersByTime(30000);
    });

    // Verify the resume action was dispatched
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'readingLog/resumeReadingSession',
        payload: expect.objectContaining({
          id: expect.any(String),
        }),
      })
    );

    expect(result.current.isPaused).toBe(false);
  });

  it('should end a reading session', () => {
    const { result } = renderHook(() => useReadingLogForm(mockBook));

    // Start a session
    act(() => {
      result.current.setStartPage('1');
      result.current.handleStartSession();
    });

    // End the session
    act(() => {
      result.current.setEndPage('15');
      result.current.setNotes('Test notes');
      result.current.handleEndSession();
    });

    // Verify the end session action was dispatched with the correct values
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'readingLog/endReadingSession',
        payload: expect.objectContaining({
          id: expect.any(String),
          endPage: 15,
          notes: 'Test notes',
        }),
      })
    );

    expect(result.current.isTracking).toBe(false);
  });

  it('should validate page numbers', () => {
    const { result } = renderHook(() => useReadingLogForm(mockBook));

    // Test invalid page numbers
    act(() => {
      result.current.setStartPage('abc');
      result.current.setEndPage('-5');
    });

    // The component should handle invalid inputs by keeping the previous valid value
    // or setting to empty string, depending on implementation
    expect(result.current.startPage).toBe('');
    expect(result.current.endPage).toBe('');

    // Test valid page numbers
    act(() => {
      result.current.setStartPage('10');
      result.current.setEndPage('20');
    });

    expect(result.current.startPage).toBe('10');
    expect(result.current.endPage).toBe('20');
  });

  it('should handle invalid page numbers when starting a session', () => {
    const { result } = renderHook(() => useReadingLogForm(mockBook));

    // Try to start a session with an invalid start page
    act(() => {
      result.current.setStartPage('abc');
      result.current.handleStartSession();
    });

    // Should not dispatch start session action with invalid page
    expect(mockDispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'readingLog/startReadingSession'
      })
    );
  });

  it('should handle invalid page numbers when ending a session', () => {
    const { result } = renderHook(() => useReadingLogForm(mockBook));

    // Start a valid session
    act(() => {
      result.current.setStartPage('1');
      result.current.handleStartSession();
    });

    // Try to end with an invalid end page
    act(() => {
      result.current.setEndPage('abc');
      result.current.handleEndSession();
    });

    // Should not dispatch end session action with invalid page
    expect(mockDispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'readingLog/endReadingSession'
      })
    );
  });

  it('should not allow ending a session that has not started', () => {
    const { result } = renderHook(() => useReadingLogForm(mockBook));

    // Try to end a session that was never started
    act(() => {
      result.current.handleEndSession();
    });

    // Should not dispatch any actions
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should not allow pausing a session that is not active', () => {
    const { result } = renderHook(() => useReadingLogForm(mockBook));

    // Try to pause when no session is active
    act(() => {
      result.current.handlePauseSession();
    });

    // Should not dispatch pause action
    expect(mockDispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'readingLog/pauseReadingSession'
      })
    );
  });

  it('should not allow resuming a session that is not paused', () => {
    const { result } = renderHook(() => useReadingLogForm(mockBook));

    // Start a session
    act(() => {
      result.current.setStartPage('1');
      result.current.handleStartSession();
    });

    // Try to resume when not paused
    act(() => {
      result.current.handleResumeSession();
    });


    // Should not dispatch resume action
    expect(mockDispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'readingLog/resumeReadingSession'
      })
    );
  });

  it('should handle Redux state updates', () => {
    // Mock the selector to return a session in progress
    mockUseSelector.mockImplementation((selector) => {
      const mockState = {
        readingLog: {
          readingSessions: {
            'session-1': {
              id: 'session-1',
              bookId: 'book-1',
              startPage: 1,
              endPage: 1,
              startTime: new Date().toISOString(),
              isPaused: false,
            },
          },
          annotations: {},
          bookProgress: {},
          status: 'idle',
          error: null,
        },
      };
      return selector(mockState);
    });

    const { result } = renderHook(() => useReadingLogForm(mockBook));

    // Should detect the active session from Redux state
    expect(result.current.isTracking).toBe(true);
    expect(result.current.isPaused).toBe(false);
  });
});
