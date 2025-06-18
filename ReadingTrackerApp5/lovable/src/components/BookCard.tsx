import React, { useState } from "react";
import { Book, useBookContext } from "@/contexts/BookContext";
import { Badge } from "@/components/ui/Badge";

const statusColor = {
  "읽는 중": "#FACC15",
  "다 읽은": "#22C55E",
  "읽고 싶은": "#818CF8",
};

const BookCard = ({ book }: { book: Book }) => {
  const { removeBook } = useBookContext();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleClick = () => {
    window.location.href = `/book/${book.id}`;
  };
  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('정말로 이 도서를 삭제하시겠습니까?')) {
      removeBook(book.id);
    }
    setMenuOpen(false);
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderRadius: 12,
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        marginBottom: 16,
        cursor: "pointer",
        transition: "box-shadow 0.2s, transform 0.1s",
        position: "relative",
      }}
      onClick={handleClick}
      onMouseOver={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.10)")}
      onMouseOut={e => (e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)")}
    >
      <div
        style={{
          width: 48,
          height: 64,
          background: statusColor[book.status] || "#E5E7EB",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: 700,
          fontSize: 18,
          marginRight: 16,
        }}
      >
        {book.title[0]}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 17 }}>{book.title}</div>
        <div style={{ color: "#6B7280", fontSize: 14 }}>{book.author}</div>
        <Badge color={statusColor[book.status]} style={{ fontWeight: 500, fontSize: 13, marginTop: 4 }}>{book.status}</Badge>
      </div>
      {/* ⋮ 메뉴 버튼 */}
      <div
        style={{ marginLeft: 8, cursor: "pointer", fontSize: 22, userSelect: "none" }}
        onClick={handleMenuClick}
      >
        ⋮
        {menuOpen && (
          <div
            style={{
              position: "absolute",
              top: 40,
              right: 16,
              background: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              zIndex: 10,
              minWidth: 80,
            }}
            onClick={e => e.stopPropagation()}
          >
            <div
              style={{ padding: "10px 16px", color: "#EF4444", cursor: "pointer", fontWeight: 500 }}
              onClick={handleDelete}
            >
              삭제
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard; 