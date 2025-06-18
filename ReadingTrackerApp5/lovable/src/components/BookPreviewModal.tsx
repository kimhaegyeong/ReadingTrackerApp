import React from "react";
import { ExternalBook } from "@/lib/apis";
import { Button } from "@/components/ui/Button";

type BookPreviewModalProps = {
  book: ExternalBook | null;
  open: boolean;
  onClose: () => void;
  onAddBook: (book: ExternalBook) => void;
  isAdded: boolean;
};

const BookPreviewModal = ({ book, open, onClose, onAddBook, isAdded }: BookPreviewModalProps) => {
  if (!open || !book) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 32, minWidth: 320, maxWidth: 400, boxShadow: '0 4px 24px rgba(0,0,0,0.10)' }} onClick={e => e.stopPropagation()}>
        {book.thumbnail && <img src={book.thumbnail} alt={book.title} style={{ width: 96, height: 128, objectFit: 'cover', borderRadius: 8, margin: '0 auto 16px', display: 'block' }} />}
        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{book.title}</h3>
        <div style={{ color: '#6B7280', fontSize: 15, marginBottom: 4 }}>{book.author}</div>
        <div style={{ color: '#A3A3A3', fontSize: 13, marginBottom: 8 }}>{book.publisher} {book.publishedDate && `· ${book.publishedDate}`}</div>
        <div style={{ color: '#818CF8', fontSize: 13, marginBottom: 16 }}>{book.source === 'aladin' ? '알라딘' : 'Google Books'}</div>
        {/* book.description 등 추가 정보가 있으면 표시 */}
        {('description' in book) && book.description && (
          <div style={{ color: '#374151', fontSize: 14, marginBottom: 16, whiteSpace: 'pre-line' }}>{(book as any).description}</div>
        )}
        <Button
          onClick={() => onAddBook(book)}
          disabled={isAdded}
          style={{ width: '100%', background: isAdded ? '#E5E7EB' : '#818CF8', color: isAdded ? '#A3A3A3' : '#fff', fontWeight: 600, marginBottom: 8 }}
        >
          {isAdded ? '등록됨' : '서재에 추가'}
        </Button>
        <Button onClick={onClose} style={{ width: '100%', background: '#E5E7EB', color: '#374151' }}>닫기</Button>
      </div>
    </div>
  );
};

export default BookPreviewModal; 