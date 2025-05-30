import { Book } from '@/store/slices/booksSlice';
import { API_KEYS, API_CONFIG } from '@/config/api';
import NetInfo from '@react-native-community/netinfo';
import Constants from 'expo-constants';

const TIMEOUT_DURATION = 30000; // 30초로 증가

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

export class GoogleBooksService {
  private static readonly BASE_URL = API_CONFIG.BASE_URL;
  private static readonly TIMEOUT = API_CONFIG.TIMEOUT;

  private static async testInternetConnection(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      try {
        const response = await fetch('https://www.google.com', {
          method: 'HEAD',
          signal: controller.signal,
        });
        return response.ok;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('인터넷 연결 테스트 시간 초과');
          return false;
        }
        throw error;
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (error) {
      console.log('인터넷 연결 테스트 실패:', error);
      return false;
    }
  }

  private static async checkNetworkConnection(): Promise<boolean> {
    try {
      const netInfo = await NetInfo.fetch();
      console.log('NetInfo 상태:', netInfo);
      
      // 인터넷 연결 상태 확인
      if (!netInfo.isConnected) {
        throw new Error('인터넷 연결이 없습니다.');
      }
      
      // 실제 인터넷 연결 테스트
      const isInternetWorking = await this.testInternetConnection();
      if (!isInternetWorking) {
        throw new Error('인터넷 연결이 불안정합니다. 잠시 후 다시 시도해주세요.');
      }
      
      return true;
    } catch (error) {
      console.error('네트워크 연결 확인 중 오류:', error);
      throw error;
    }
  }

  private static async fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
    try {
      await this.checkNetworkConnection();

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);

      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          cache: 'no-cache',
          credentials: 'omit',
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error?.message || response.statusText}`);
        }

        return response;
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            throw new Error('요청 시간이 초과되었습니다.');
          }
          console.error('API 요청 상세 오류:', error);
          throw new Error(`API 요청 실패: ${error.message}`);
        }
        throw error;
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`네트워크 오류: ${error.message}`);
      }
      throw new Error('알 수 없는 네트워크 오류가 발생했습니다.');
    }
  }

  static async searchBooks(query: string, maxResults: number = 20): Promise<any> {
    try {
      const apiKey = API_CONFIG.API_KEY;
      if (!apiKey) {
        throw new Error('Google Books API 키가 설정되지 않았습니다.');
      }

      const encodedQuery = encodeURIComponent(query);
      const url = `${this.BASE_URL}?q=${encodedQuery}&maxResults=${maxResults}&key=${apiKey}`;
      
      console.log('API 요청 URL:', url);
      
      const response = await this.fetchWithTimeout(url);
      const data = await response.json();
      
      if (!data.items) {
        console.log('검색 결과 없음');
        return { items: [] };
      }
      
      console.log('API 응답 데이터:', JSON.stringify(data, null, 2));
      
      return data;
    } catch (error) {
      console.error('책 검색 중 오류 발생:', error);
      throw error;
    }
  }

  static async getBookDetails(bookId: string): Promise<any> {
    try {
      const apiKey = API_CONFIG.API_KEY;
      if (!apiKey) {
        throw new Error('Google Books API 키가 설정되지 않았습니다.');
      }

      const url = `${this.BASE_URL}/${bookId}?key=${apiKey}`;
      
      console.log('책 상세 정보 요청 URL:', url);
      
      const response = await this.fetchWithTimeout(url);
      const data = await response.json();
      
      console.log('책 상세 정보 응답:', JSON.stringify(data, null, 2));
      
      return data;
    } catch (error) {
      console.error('책 상세 정보 조회 중 오류 발생:', error);
      throw error;
    }
  }
}

export const googleBooksAPI = GoogleBooksService;

export const searchBooks = async (query: string): Promise<SearchResult[]> => {
  try {
    const data = await GoogleBooksService.searchBooks(query);
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
    console.error('검색 결과 변환 중 오류:', error);
    throw error;
  }
}; 