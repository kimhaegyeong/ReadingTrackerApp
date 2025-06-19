import React from "react";
import { Book } from "@/contexts/BookContext";
import BookCard from "@/components/BookCard";

type BookListProps = {
  books: Book[];
};

const BookList = ({ books }: BookListProps) => {
  if (books.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: '#9CA3AF', marginTop: 48, fontSize: 16 }}>
        등록된 도서가 없습니다.
      </div>
    );
  }
  return (
    <div style={{ marginTop: 24 }}>
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
};

export default BookList;
