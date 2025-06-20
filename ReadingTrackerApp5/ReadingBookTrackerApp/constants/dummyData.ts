import { Book } from "@/contexts/BookContext";

export const books: Omit<Book, 'coverImage'>[] = [
  { id: "1", title: "모비딕", author: "허먼 멜빌", status: "읽는 중", quotes: [], notes: [] },
  { id: "2", title: "데미안", author: "헤르만 헤세", status: "다 읽은", quotes: [], notes: [] },
  { id: "3", title: "1984", author: "조지 오웰", status: "읽고 싶은", quotes: [], notes: [] },
]; 