import React, { useState } from "react";
import { useBookContext } from "@/contexts/BookContext";
import BookList from "@/components/BookList";
import { Button } from "@/components/ui/Button";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import AddBookModal from "@/components/AddBookModal";
import { Toast } from "@/components/ui/Toast";
import { Badge } from "@/components/ui/Badge";
import BookSearchInput from "@/components/BookSearchInput";

const statusList = ["전체", "읽고 싶은", "읽는 중", "다 읽은"];
const tagList = ["전체", "철학", "명언", "감상"];
const sortList = ["최신순", "제목순", "저자순"];

const HomeScreen = () => {
  const { books, addBook } = useBookContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [filter, setFilter] = useState("전체");
  const [tag, setTag] = useState("전체");
  const [sort, setSort] = useState("최신순");
  const [search, setSearch] = useState("");

  const handleAddBook = (book: { title: string; author: string; status: string }) => {
    addBook({ ...book, id: Date.now() + "", quotes: [], notes: [] });
    setToastMsg(`'${book.title}'이(가) 서재에 추가되었습니다!`);
    setToastOpen(true);
  };

  let filteredBooks = books;
  if (filter !== "전체") filteredBooks = filteredBooks.filter(b => b.status === filter);
  if (tag !== "전체") filteredBooks = filteredBooks.filter(b => (b.quotes.some(q => q.tags.includes(tag)) || b.notes.some(n => n.tags.includes(tag))));
  if (search.trim()) filteredBooks = filteredBooks.filter(b => b.title.includes(search) || b.author.includes(search));
  if (sort === "제목순") filteredBooks = [...filteredBooks].sort((a, b) => a.title.localeCompare(b.title));
  if (sort === "저자순") filteredBooks = [...filteredBooks].sort((a, b) => a.author.localeCompare(b.author));
  // 최신순은 id 기준(임시)
  if (sort === "최신순") filteredBooks = [...filteredBooks].sort((a, b) => Number(b.id) - Number(a.id));

  return (
    <div style={{ padding: 24, background: colors.background, minHeight: "100vh" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ ...typography.heading, color: colors.primary }}>내 서재</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            onClick={() => window.location.href = '/search'}
            style={{ background: colors.primary, color: '#fff', fontWeight: 600, fontSize: 15 }}
          >
            책 검색
          </Button>
          <Button
            onClick={() => window.location.href = '/stats'}
            style={{ background: '#FACC15', color: '#374151', fontWeight: 600, fontSize: 15 }}
          >
            통계 대시보드
          </Button>
        </div>
      </div>
      <div style={{ margin: "16px 0 12px 0" }}>
        {statusList.map(s => (
          <Badge
            key={s}
            color={filter === s ? colors.primary : colors.gray}
            style={{ marginRight: 8, color: filter === s ? "#fff" : "#fff", fontWeight: filter === s ? 700 : 400 }}
            onClick={() => setFilter(s)}
          >
            {s}
          </Badge>
        ))}
      </div>
      <div style={{ marginBottom: 12 }}>
        {tagList.map(t => (
          <Badge
            key={t}
            color={tag === t ? "#F472B6" : colors.gray}
            style={{ marginRight: 8, color: tag === t ? "#fff" : "#fff", fontWeight: tag === t ? 700 : 400 }}
            onClick={() => setTag(t)}
          >
            {t}
          </Badge>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <BookSearchInput value={search} onChange={e => setSearch(e.target.value)} placeholder="제목/저자 검색" />
        <select value={sort} onChange={e => setSort(e.target.value)} style={{ borderRadius: 6, padding: 8, fontSize: 15 }}>
          {sortList.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <Button
        onClick={() => setModalOpen(true)}
        style={{ marginTop: 0, marginBottom: 16, background: colors.primary }}
      >
        새 책 추가
      </Button>
      <BookList books={filteredBooks} />
      <AddBookModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddBook={handleAddBook}
      />
      <Toast
        message={toastMsg}
        open={toastOpen}
        onClose={() => setToastOpen(false)}
      />
    </div>
  );
};

export default HomeScreen;
