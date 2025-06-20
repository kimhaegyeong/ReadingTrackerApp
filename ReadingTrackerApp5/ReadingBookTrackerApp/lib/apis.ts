// 알라딘, 구글북스 API 키는 환경변수에서 불러옴
export const ALADIN_API_KEY = process.env.EXPO_PUBLIC_ALADIN_API_KEY;
export const GOOGLE_BOOKS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_BOOKS_API_KEY;

// 디버깅용 로그 (개발 완료 후 제거)
console.log('ALADIN_API_KEY:', ALADIN_API_KEY ? '설정됨' : '설정되지 않음');
console.log('GOOGLE_BOOKS_API_KEY:', GOOGLE_BOOKS_API_KEY ? '설정됨' : '설정되지 않음');

export type ExternalBook = {
  id: string;
  title: string;
  author: string;
  publisher?: string;
  publishedDate?: string;
  thumbnail?: string;
  source: 'aladin' | 'google';
  description?: string;
};

// 알라딘 도서 검색
export async function searchAladinBooks(query: string): Promise<ExternalBook[]> {
  if (!ALADIN_API_KEY) return [];
  try {
    const url = `https://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=${ALADIN_API_KEY}&Query=${encodeURIComponent(query)}&QueryType=Keyword&MaxResults=10&start=1&SearchTarget=Book&output=JS&Version=20131101`;
    const res = await fetch(url);
    const data = await res.json();
    console.log('Aladin API response:', JSON.stringify(data, null, 2)); // 응답 데이터를 예쁘게 출력
    if (!data.item) return [];
    return data.item.map((item: any) => ({
      id: item.isbn13 || item.isbn,
      title: item.title,
      author: item.author,
      publisher: item.publisher,
      publishedDate: item.pubDate,
      thumbnail: item.cover,
      source: 'aladin',
      description: item.description,
    }));
  } catch (error) {
    console.error('Aladin API error:', error);
    return [];
  }
}

// 구글북스 도서 검색
export async function searchGoogleBooks(query: string): Promise<ExternalBook[]> {
  if (!GOOGLE_BOOKS_API_KEY) return [];
  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10&key=${GOOGLE_BOOKS_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data.items) return [];
    return data.items.map((item: any) => {
      const info = item.volumeInfo;
      return {
        id: item.id,
        title: info.title,
        author: (info.authors && info.authors.join(", ")) || '',
        publisher: info.publisher,
        publishedDate: info.publishedDate,
        thumbnail: info.imageLinks?.thumbnail,
        source: 'google',
        description: info.description,
      };
    });
  } catch (error) {
    console.error('Google Books API error:', error);
    return [];
  }
} 