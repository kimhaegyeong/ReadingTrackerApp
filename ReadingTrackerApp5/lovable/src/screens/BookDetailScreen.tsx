import React, { useState, useRef, useEffect } from "react";
import { useBookContext } from "@/contexts/BookContext";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

function getBookIdFromPath() {
  const match = window.location.pathname.match(/book\/(\w+)/);
  return match ? match[1] : null;
}

const statusList = ["읽고 싶은", "읽는 중", "다 읽은"];

const BookDetailScreen = () => {
  const { books, updateStatus, addQuote, addNote, removeBook, removeQuote, removeNote, updateQuoteTags, updateNoteTags } = useBookContext();
  const bookId = getBookIdFromPath();
  const book = books.find((b) => b.id === bookId);

  // 샘플 인용문/메모/태그 상태
  const [tab, setTab] = useState<"quotes" | "notes">("quotes");
  const [showAddQuote, setShowAddQuote] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [newQuote, setNewQuote] = useState("");
  const [newNote, setNewNote] = useState("");
  const [quoteTags, setQuoteTags] = useState<string[]>([]);
  const [noteTags, setNoteTags] = useState<string[]>([]);
  const [quoteTagInput, setQuoteTagInput] = useState("");
  const [noteTagInput, setNoteTagInput] = useState("");
  const [quoteError, setQuoteError] = useState("");
  const [noteError, setNoteError] = useState("");

  const quoteInputRef = useRef<HTMLTextAreaElement>(null);
  const noteInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (showAddQuote && quoteInputRef.current) {
      quoteInputRef.current.focus();
    }
  }, [showAddQuote]);

  useEffect(() => {
    if (showAddNote && noteInputRef.current) {
      noteInputRef.current.focus();
    }
  }, [showAddNote]);

  if (!book) return <div>도서를 찾을 수 없습니다.</div>;

  // 태그 추가/삭제 핸들러
  const handleAddQuoteTag = () => {
    const tag = quoteTagInput.trim();
    if (tag && !quoteTags.includes(tag)) {
      setQuoteTags([...quoteTags, tag]);
    }
    setQuoteTagInput("");
  };
  const handleRemoveQuoteTag = (tag: string) => {
    setQuoteTags(quoteTags.filter(t => t !== tag));
  };
  const handleAddNoteTag = () => {
    const tag = noteTagInput.trim();
    if (tag && !noteTags.includes(tag)) {
      setNoteTags([...noteTags, tag]);
    }
    setNoteTagInput("");
  };
  const handleRemoveNoteTag = (tag: string) => {
    setNoteTags(noteTags.filter(t => t !== tag));
  };

  const handleAddQuote = () => {
    if (!newQuote.trim() || newQuote.trim().length < 2) {
      setQuoteError("2글자 이상 입력하세요.");
      return;
    }
    addQuote(book.id, { text: newQuote, tags: [...quoteTags] });
    setNewQuote("");
    setQuoteTags([]);
    setShowAddQuote(false);
    setQuoteError("");
  };
  const handleAddNote = () => {
    if (!newNote.trim() || newNote.trim().length < 2) {
      setNoteError("2글자 이상 입력하세요.");
      return;
    }
    addNote(book.id, { text: newNote, tags: [...noteTags] });
    setNewNote("");
    setNoteTags([]);
    setShowAddNote(false);
    setNoteError("");
  };

  const handleStatusChange = (s: string) => {
    if (book.status !== s) updateStatus(book.id, s);
  };

  // 삭제 핸들러
  const handleDelete = () => {
    if (window.confirm('정말로 이 도서를 삭제하시겠습니까?')) {
      removeBook(book.id);
      window.location.href = '/';
    }
  };

  const onCloseAddQuote = () => {
    setShowAddQuote(false);
    setNewQuote("");
    setQuoteTags([]);
    setQuoteError("");
    setQuoteTagInput("");
  };
  const onCloseAddNote = () => {
    setShowAddNote(false);
    setNewNote("");
    setNoteTags([]);
    setNoteError("");
    setNoteTagInput("");
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700 }}>{book.title}</h2>
      <div style={{ color: "#6B7280", marginBottom: 8 }}>{book.author}</div>
      <div style={{ marginBottom: 16 }}>
        {statusList.map(s => (
          <Badge
            key={s}
            color={book.status === s ? "#818CF8" : "#E5E7EB"}
            style={{ marginRight: 8, fontWeight: book.status === s ? 700 : 400 }}
            onClick={() => handleStatusChange(s)}
          >
            {s}
          </Badge>
        ))}
      </div>
      <div style={{ marginBottom: 24 }}>
        <Button onClick={() => window.location.href = "/"} style={{ background: "#E5E7EB", color: "#374151", marginRight: 8 }}>← 목록으로</Button>
        <Button onClick={handleDelete} style={{ background: "#F87171", color: "#fff" }}>삭제</Button>
      </div>
      {/* 탭 UI */}
      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <Button onClick={() => setTab("quotes")} style={{ background: tab === "quotes" ? "#818CF8" : "#E5E7EB", color: tab === "quotes" ? "#fff" : "#374151" }}>인용문</Button>
        <Button onClick={() => setTab("notes")} style={{ background: tab === "notes" ? "#818CF8" : "#E5E7EB", color: tab === "notes" ? "#fff" : "#374151" }}>메모</Button>
      </div>
      {/* 인용문/메모 리스트 */}
      {tab === "quotes" ? (
        <div>
          <Button onClick={() => setShowAddQuote(true)} style={{ marginBottom: 12 }}>+ 인용문 추가</Button>
          {book.quotes.length === 0 && (
            <div style={{ color: '#9CA3AF', textAlign: 'center', margin: '40px 0', fontSize: 16 }}>
              등록된 인용문이 없습니다.
            </div>
          )}
          {book.quotes.map(q => (
            <div key={q.id} style={{ background: "#F3F4F6", borderRadius: 10, padding: 14, marginBottom: 10, position: 'relative' }}>
              <button
                onClick={() => removeQuote(book.id, q.id)}
                style={{ position: 'absolute', top: 8, right: 10, background: 'none', border: 'none', color: '#EF4444', fontSize: 18, cursor: 'pointer' }}
                title="삭제"
              >×</button>
              <div style={{ fontSize: 15, marginBottom: 6 }}>{q.text}</div>
              <div>
                {q.tags.length === 0 ? (
                  <span style={{ color: "#9CA3AF", fontSize: 13 }}>태그 없음</span>
                ) : q.tags.map(tag => (
                  <Badge key={tag} color="#F472B6" style={{ marginRight: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                    {tag}
                    <span
                      style={{ marginLeft: 4, color: '#EF4444', fontWeight: 700 }}
                      onClick={e => {
                        e.stopPropagation();
                        updateQuoteTags(book.id, q.id, q.tags.filter(t => t !== tag));
                      }}
                      title="태그 삭제"
                    >×</span>
                  </Badge>
                ))}
              </div>
            </div>
          ))}
          {/* 인용문 추가 다이얼로그 */}
          {showAddQuote && (
            <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={onCloseAddQuote}>
              <div style={{ background: "#fff", borderRadius: 16, padding: 24, minWidth: 280 }} onClick={e => e.stopPropagation()}>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>인용문 추가</h3>
                <textarea
                  ref={quoteInputRef}
                  value={newQuote}
                  onChange={e => setNewQuote(e.target.value)}
                  rows={4}
                  style={{ width: "100%", borderRadius: 8, border: "1px solid #D1D5DB", padding: 8, marginBottom: 12 }}
                  placeholder="인상 깊은 구절을 입력하세요"
                  onKeyDown={e => {
                    if (
                      e.key === "Enter" &&
                      !e.shiftKey &&
                      e.target instanceof HTMLTextAreaElement &&
                      document.activeElement === e.target
                    ) {
                      e.preventDefault();
                      handleAddQuote();
                    }
                  }}
                />
                {/* 태그 입력 */}
                <div style={{ marginBottom: 10 }}>
                  <input
                    value={quoteTagInput}
                    onChange={e => setQuoteTagInput(e.target.value)}
                    onKeyDown={e => {
                      if ((e.key === "Enter" || e.key === ",") && !e.shiftKey) {
                        e.preventDefault();
                        handleAddQuoteTag();
                      }
                    }}
                    placeholder="태그 입력 후 Enter 또는 ,"
                    style={{ padding: 6, borderRadius: 6, border: "1px solid #D1D5DB", width: 180, marginRight: 8 }}
                  />
                  {quoteTags.map(tag => (
                    <Badge key={tag} color="#F472B6" style={{ marginRight: 4 }} onClick={() => handleRemoveQuoteTag(tag)}>{tag} ×</Badge>
                  ))}
                </div>
                {quoteError && <div style={{ color: '#EF4444', marginBottom: 8, fontSize: 14 }}>{quoteError}</div>}
                <div style={{ display: "flex", gap: 8 }}>
                  <Button onClick={handleAddQuote} style={{ flex: 1 }}>등록</Button>
                  <Button onClick={onCloseAddQuote} style={{ flex: 1, background: "#E5E7EB", color: "#374151" }}>취소</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <Button onClick={() => setShowAddNote(true)} style={{ marginBottom: 12 }}>+ 메모 추가</Button>
          {book.notes.length === 0 && (
            <div style={{ color: '#9CA3AF', textAlign: 'center', margin: '40px 0', fontSize: 16 }}>
              등록된 메모가 없습니다.
            </div>
          )}
          {book.notes.map(n => (
            <div key={n.id} style={{ background: "#F3F4F6", borderRadius: 10, padding: 14, marginBottom: 10, position: 'relative' }}>
              <button
                onClick={() => removeNote(book.id, n.id)}
                style={{ position: 'absolute', top: 8, right: 10, background: 'none', border: 'none', color: '#EF4444', fontSize: 18, cursor: 'pointer' }}
                title="삭제"
              >×</button>
              <div style={{ fontSize: 15, marginBottom: 6 }}>{n.text}</div>
              <div>
                {n.tags.length === 0 ? (
                  <span style={{ color: "#9CA3AF", fontSize: 13 }}>태그 없음</span>
                ) : n.tags.map(tag => (
                  <Badge key={tag} color="#F472B6" style={{ marginRight: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                    {tag}
                    <span
                      style={{ marginLeft: 4, color: '#EF4444', fontWeight: 700 }}
                      onClick={e => {
                        e.stopPropagation();
                        updateNoteTags(book.id, n.id, n.tags.filter(t => t !== tag));
                      }}
                      title="태그 삭제"
                    >×</span>
                  </Badge>
                ))}
              </div>
            </div>
          ))}
          {/* 메모 추가 다이얼로그 */}
          {showAddNote && (
            <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={onCloseAddNote}>
              <div style={{ background: "#fff", borderRadius: 16, padding: 24, minWidth: 280 }} onClick={e => e.stopPropagation()}>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>메모 추가</h3>
                <textarea
                  ref={noteInputRef}
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  rows={4}
                  style={{ width: "100%", borderRadius: 8, border: "1px solid #D1D5DB", padding: 8, marginBottom: 12 }}
                  placeholder="메모를 입력하세요"
                  onKeyDown={e => {
                    if (
                      e.key === "Enter" &&
                      !e.shiftKey &&
                      e.target instanceof HTMLTextAreaElement &&
                      document.activeElement === e.target
                    ) {
                      e.preventDefault();
                      handleAddNote();
                    }
                  }}
                />
                {/* 태그 입력 */}
                <div style={{ marginBottom: 10 }}>
                  <input
                    value={noteTagInput}
                    onChange={e => setNoteTagInput(e.target.value)}
                    onKeyDown={e => {
                      if ((e.key === "Enter" || e.key === ",") && !e.shiftKey) {
                        e.preventDefault();
                        handleAddNoteTag();
                      }
                    }}
                    placeholder="태그 입력 후 Enter 또는 ,"
                    style={{ padding: 6, borderRadius: 6, border: "1px solid #D1D5DB", width: 180, marginRight: 8 }}
                  />
                  {noteTags.map(tag => (
                    <Badge key={tag} color="#F472B6" style={{ marginRight: 4 }} onClick={() => handleRemoveNoteTag(tag)}>{tag} ×</Badge>
                  ))}
                </div>
                {noteError && <div style={{ color: '#EF4444', marginBottom: 8, fontSize: 14 }}>{noteError}</div>}
                <div style={{ display: "flex", gap: 8 }}>
                  <Button onClick={handleAddNote} style={{ flex: 1 }}>등록</Button>
                  <Button onClick={onCloseAddNote} style={{ flex: 1, background: "#E5E7EB", color: "#374151" }}>취소</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookDetailScreen;
