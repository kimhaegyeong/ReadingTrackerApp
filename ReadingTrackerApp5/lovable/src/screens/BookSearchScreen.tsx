import React, { useState } from "react";
import BookSearchInput from "@/components/BookSearchInput";
import { useBookContext } from "@/contexts/BookContext";
import { Button } from "@/components/ui/Button";
import AddBookModal from "@/components/AddBookModal";
import { searchAladinBooks, searchGoogleBooks, ExternalBook } from "@/lib/apis";
import BookPreviewModal from "@/components/BookPreviewModal";

const BookSearchScreen = () => {
  const { books, addBook } = useBookContext();
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<ExternalBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewBook, setPreviewBook] = useState<ExternalBook | null>(null);

  const handleSearch = async (q?: string) => {
    const searchValue = typeof q === "string" ? q : query;
    setQuery(searchValue);
    if (!searchValue.trim()) {
      setSearchResults([]);
      setLoading(false);
      setError("");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const [aladin, google] = await Promise.all([
        searchAladinBooks(searchValue),
        searchGoogleBooks(searchValue),
      ]);
      // 중복(동일 ISBN/제목+저자) 제거
      const merged = [...aladin, ...google].filter((b, idx, arr) =>
        arr.findIndex(x => x.id === b.id || (x.title === b.title && x.author === b.author)) === idx
      );
      setSearchResults(merged);
    } catch (e) {
      setError("외부 도서 API 호출에 실패했습니다.");
      setSearchResults([]);
    }
    setLoading(false);
  };

  const handleAddBook = (book: any) => {
    // 이미 등록된 책은 중복 등록 방지
    if (books.some(b => b.title === book.title && b.author === book.author)) return;
    addBook({
      id: Date.now() + "",
      title: book.title,
      author: book.author,
      status: "읽고 싶은",
      quotes: [],
      notes: [],
    });
  };

  return (
    <div style={{ padding: 24, maxWidth: 480, margin: "0 auto" }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>책 검색/등록</h2>
      <BookSearchInput
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Enter") handleSearch();
        }}
        placeholder="책 제목 또는 저자 검색"
      />
      <Button
        onClick={() => handleSearch()}
        style={{ width: "100%", background: "#818CF8", color: "#fff", marginBottom: 16 }}
      >
        검색
      </Button>
      <div style={{ margin: "24px 0" }}>
        {loading && (
          <div style={{ color: "#818CF8", textAlign: "center", margin: "40px 0", fontSize: 16 }}>
            검색 중...
          </div>
        )}
        {error && (
          <div style={{ color: "#EF4444", textAlign: "center", margin: "40px 0", fontSize: 16 }}>{error}</div>
        )}
        {!loading && !error && query && searchResults.length === 0 && (
          <div style={{ color: "#9CA3AF", textAlign: "center", margin: "40px 0", fontSize: 16 }}>
            검색 결과가 없습니다.<br />
            <span style={{ fontSize: 13, color: "#BDBDBD" }}>정확한 제목/저자명으로 다시 시도해보세요.</span>
          </div>
        )}
        {searchResults.map(book => {
          const isAdded = books.some(b => b.title === book.title && b.author === book.author);
          return (
            <div
              key={book.id}
              style={{ display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', marginBottom: 16, padding: 12, cursor: 'pointer' }}
              onClick={() => setPreviewBook(book)}
            >
              {book.thumbnail && <img src={book.thumbnail} alt={book.title} style={{ width: 48, height: 64, objectFit: 'cover', borderRadius: 6, marginRight: 16 }} />}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 16 }}>{book.title}</div>
                <div style={{ color: '#6B7280', fontSize: 14 }}>{book.author}</div>
                <div style={{ color: '#A3A3A3', fontSize: 13 }}>{book.publisher} {book.publishedDate && `· ${book.publishedDate}`}</div>
                <div style={{ color: '#818CF8', fontSize: 12, marginTop: 2 }}>{book.source === 'aladin' ? '알라딘' : 'Google Books'}</div>
              </div>
              <Button
                onClick={e => { e.stopPropagation(); handleAddBook(book); }}
                disabled={isAdded}
                style={{ marginLeft: 8, background: isAdded ? '#E5E7EB' : '#818CF8', color: isAdded ? '#A3A3A3' : '#fff', fontWeight: 600 }}
              >
                {isAdded ? '등록됨' : '서재에 추가'}
              </Button>
            </div>
          );
        })}
      </div>
      <Button onClick={() => setModalOpen(true)} style={{ width: "100%", background: "#818CF8", color: "#fff" }}>
        새 책 직접 등록
      </Button>
      <AddBookModal open={modalOpen} onClose={() => setModalOpen(false)} onAddBook={handleAddBook} />
      <BookPreviewModal
        book={previewBook}
        open={!!previewBook}
        onClose={() => setPreviewBook(null)}
        onAddBook={handleAddBook}
        isAdded={!!previewBook && books.some(b => b.title === previewBook.title && b.author === previewBook.author)}
      />
    </div>
  );
};

export default BookSearchScreen; 