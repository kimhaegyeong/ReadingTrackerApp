import { Book } from '@/store/slices/booksSlice';
import { API_KEY } from '@/config/api';

const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';
const TIMEOUT_DURATION = 10000; // 10초

export interface SearchResult {
  id: string;
  title: string;
  authors: string[];
  description: string;
  thumbnail: string;
  pageCount: number;
  publishedDate: string;
  publisher: string;
  categories: string[];
}

interface GoogleBooksResponse {
  items: Array<{
    id: string;
    volumeInfo: {
      title: string;
      authors?: string[];
      description?: string;
      imageLinks?: {
        thumbnail?: string;
        smallThumbnail?: string;
      };
      publishedDate?: string;
      pageCount?: number;
      categories?: string[];
      publisher?: string;
      language?: string;
      industryIdentifiers?: Array<{
        type: string;
        identifier: string;
      }>;
    };
  }>;
}

class GoogleBooksAPI {
  private async fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API 응답 오류: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('요청 시간이 초과되었습니다. 다시 시도해주세요.');
        }
        throw new Error(`네트워크 요청 실패: ${error.message}`);
      }
      throw new Error('알 수 없는 오류가 발생했습니다.');
    }
  }

  private transformBookData(bookData: any): Book {
    const volumeInfo = bookData.volumeInfo;
    return {
      id: bookData.id,
      title: volumeInfo.title,
      authors: volumeInfo.authors || ['작자미상'],
      description: volumeInfo.description || '',
      pageCount: volumeInfo.pageCount || 0,
      categories: volumeInfo.categories || [],
      imageLinks: volumeInfo.imageLinks || {},
      language: volumeInfo.language || 'ko',
      publisher: volumeInfo.publisher || '',
      publishedDate: volumeInfo.publishedDate || '',
      isbn: volumeInfo.industryIdentifiers?.find(
        (id: any) => id.type === 'ISBN_13'
      )?.identifier || '',
      userSpecificData: {
        status: 'reading',
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
  }

  async searchBooks(query: string): Promise<SearchResult[]> {
    try {
      console.log('Searching books with query:', query);
      const response = await this.fetchWithTimeout(
        `${BASE_URL}?q=${encodeURIComponent(query)}&key=${API_KEY}`
      );
      
      const data = await response.json();
      console.log('API Response:', data);

      if (!data.items || data.items.length === 0) {
        return [];
      }

      return data.items.map((item: any) => ({
        id: item.id,
        title: item.volumeInfo.title || '제목 없음',
        authors: item.volumeInfo.authors || ['작자 미상'],
        description: item.volumeInfo.description || '설명 없음',
        thumbnail: item.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192?text=No+Image',
        pageCount: item.volumeInfo.pageCount || 0,
        publishedDate: item.volumeInfo.publishedDate || '출판일 없음',
        publisher: item.volumeInfo.publisher || '출판사 없음',
        categories: item.volumeInfo.categories || [],
      }));
    } catch (error) {
      console.error('Search error:', error);
      if (error instanceof Error) {
        throw new Error(`책 검색 중 오류가 발생했습니다: ${error.message}`);
      }
      throw new Error('책 검색 중 알 수 없는 오류가 발생했습니다.');
    }
  }

  async getBookDetails(bookId: string): Promise<Book> {
    try {
      const response = await this.fetchWithTimeout(
        `${BASE_URL}/${bookId}?key=${API_KEY}`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `책 상세 정보를 가져오는데 실패했습니다. (${response.status}): ${errorData.error?.message || response.statusText}`
        );
      }

      const data = await response.json();
      return this.transformBookData(data);
    } catch (error) {
      console.error('Get book details error:', error);
      if (error instanceof Error) {
        throw new Error(`책 상세 정보를 가져오는 중 오류가 발생했습니다: ${error.message}`);
      }
      throw new Error('책 상세 정보를 가져오는 중 알 수 없는 오류가 발생했습니다.');
    }
  }

  async searchBooksByGoogle(query: string): Promise<SearchResult[]> {
    try {
      const response = await this.fetchWithTimeout(
        `${BASE_URL}?q=${encodeURIComponent(query)}&key=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error('책 검색에 실패했습니다.');
      }

      const data: GoogleBooksResponse = await response.json();

      return data.items.map((item) => ({
        id: item.id,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors || ['저자 정보 없음'],
        description: item.volumeInfo.description || '설명 없음',
        thumbnail: item.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192?text=No+Image',
        pageCount: item.volumeInfo.pageCount || 0,
        publishedDate: item.volumeInfo.publishedDate || '출판일 정보 없음',
        publisher: item.volumeInfo.publisher || '출판사 정보 없음',
        categories: item.volumeInfo.categories || [],
      }));
    } catch (error) {
      console.error('Google Books API Error:', error);
      throw error;
    }
  }
}

export const googleBooksAPI = new GoogleBooksAPI();

export const searchBooks = async (query: string): Promise<SearchResult[]> => {
  return googleBooksAPI.searchBooks(query);
}; 