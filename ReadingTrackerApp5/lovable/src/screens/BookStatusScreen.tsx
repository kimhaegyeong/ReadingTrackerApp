import React, { useState } from "react";
import { BOOK_STATUS_LIST, BOOK_STATUS_COLOR, BookStatus } from "@/constants/bookStatus";
import { useBookContext } from "@/contexts/BookContext";
import BookList from "@/components/BookList";
import { Badge } from "@/components/ui/Badge";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

const BookStatusScreen = () => {
  const { books } = useBookContext();
  const [selectedStatus, setSelectedStatus] = useState<BookStatus>("읽고 싶은");

  return (
    <div style={{ padding: 24, background: colors.background, minHeight: "100vh" }}>
      <h1 style={{ ...typography.heading, color: colors.primary, marginBottom: 16 }}>
        독서 상태 관리
      </h1>
      <nav aria-label="독서 상태 선택" style={{ marginBottom: 20, display: 'flex', gap: 12 }}>
        {BOOK_STATUS_LIST.map(status => (
          <Badge
            key={status}
            color={selectedStatus === status ? BOOK_STATUS_COLOR[status] : colors.gray}
            style={{ color: '#fff', fontWeight: selectedStatus === status ? 700 : 400, fontSize: 15, cursor: 'pointer' }}
            onClick={() => setSelectedStatus(status)}
            aria-label={`${status} 책 보기`}
          >
            {status}
          </Badge>
        ))}
      </nav>
      <section aria-label={`${selectedStatus} 책 목록`}>
        <BookList books={books.filter(b => b.status === selectedStatus)} />
      </section>
    </div>
  );
};

export default BookStatusScreen; 