import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BookDetailsScreen } from '../BookDetailsScreen';
import booksReducer from '@/store/slices/booksSlice';

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

const mockStore = configureStore({
  reducer: {
    books: booksReducer,
  },
  preloadedState: {
    books: {
      books: [],
      loading: false,
      error: null,
      currentBook: mockBook,
    },
  },
});

describe('BookDetailsScreen', () => {
  const renderComponent = () => {
    return render(
      <Provider store={mockStore}>
        <BookDetailsScreen />
      </Provider>
    );
  };

  it('책 정보를 올바르게 표시한다', () => {
    const { getByText } = renderComponent();
    
    expect(getByText('테스트 책')).toBeTruthy();
    expect(getByText('테스트 작가')).toBeTruthy();
    expect(getByText('테스트 설명')).toBeTruthy();
    expect(getByText('테스트 출판사')).toBeTruthy();
  });

  it('북마크 추가 기능이 정상 동작한다', async () => {
    const { getByText, getByLabelText } = renderComponent();
    
    // 북마크 추가 버튼 클릭
    fireEvent.press(getByText('북마크 추가'));
    
    // 페이지 번호 입력
    const pageInput = getByLabelText('페이지 번호');
    fireEvent.changeText(pageInput, '100');
    
    // 메모 입력
    const noteInput = getByLabelText('메모');
    fireEvent.changeText(noteInput, '테스트 메모');
    
    // 추가 버튼 클릭
    fireEvent.press(getByText('추가'));
    
    // 북마크가 추가되었는지 확인
    await waitFor(() => {
      expect(getByText('100페이지')).toBeTruthy();
      expect(getByText('테스트 메모')).toBeTruthy();
    });
  });

  it('리뷰 작성 기능이 정상 동작한다', async () => {
    const { getByText, getByLabelText } = renderComponent();
    
    // 리뷰 작성 버튼 클릭
    fireEvent.press(getByText('리뷰 작성'));
    
    // 리뷰 내용 입력
    const reviewInput = getByLabelText('리뷰 내용');
    fireEvent.changeText(reviewInput, '테스트 리뷰');
    
    // 작성 버튼 클릭
    fireEvent.press(getByText('작성'));
    
    // 리뷰가 추가되었는지 확인
    await waitFor(() => {
      expect(getByText('테스트 리뷰')).toBeTruthy();
    });
  });

  it('북마크 삭제 기능이 정상 동작한다', async () => {
    const { getByText, getByTestId } = renderComponent();
    
    // 북마크 추가
    fireEvent.press(getByText('북마크 추가'));
    const pageInput = getByTestId('page-input');
    fireEvent.changeText(pageInput, '100');
    fireEvent.press(getByText('추가'));
    
    // 북마크 삭제 버튼 클릭
    const deleteButton = getByTestId('delete-bookmark-1');
    fireEvent.press(deleteButton);
    
    // 삭제 확인
    fireEvent.press(getByText('삭제'));
    
    // 북마크가 삭제되었는지 확인
    await waitFor(() => {
      expect(() => getByText('100페이지')).toThrow();
    });
  });

  it('리뷰 삭제 기능이 정상 동작한다', async () => {
    const { getByText, getByTestId } = renderComponent();
    
    // 리뷰 작성
    fireEvent.press(getByText('리뷰 작성'));
    const reviewInput = getByTestId('review-input');
    fireEvent.changeText(reviewInput, '테스트 리뷰');
    fireEvent.press(getByText('작성'));
    
    // 리뷰 삭제 버튼 클릭
    const deleteButton = getByTestId('delete-review-1');
    fireEvent.press(deleteButton);
    
    // 삭제 확인
    fireEvent.press(getByText('삭제'));
    
    // 리뷰가 삭제되었는지 확인
    await waitFor(() => {
      expect(() => getByText('테스트 리뷰')).toThrow();
    });
  });
}); 