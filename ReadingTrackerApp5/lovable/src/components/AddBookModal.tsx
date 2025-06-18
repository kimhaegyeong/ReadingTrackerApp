import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Book } from "@/contexts/BookContext";

interface AddBookModalProps {
  open: boolean;
  onClose: () => void;
  onAddBook: (book: Book) => void;
}

const statusList = ["읽고 싶은", "읽는 중", "다 읽은"];

const AddBookModal = ({ open, onClose, onAddBook }: AddBookModalProps) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState(statusList[0]);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = () => {
    if (!title.trim() || !author.trim()) {
      setError("제목과 저자를 모두 입력하세요.");
      return;
    }
    if (title.length < 2) {
      setError("제목은 2글자 이상이어야 합니다.");
      return;
    }
    setError("");
    onAddBook({ title, author, status, id: Date.now() + "", quotes: [], notes: [] });
    setTitle("");
    setAuthor("");
    setStatus(statusList[0]);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 32,
          minWidth: 320,
          boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>새 책 추가</h2>
        <div style={{ marginBottom: 12 }}>
          <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="제목" />
        </div>
        <div style={{ marginBottom: 12 }}>
          <Input value={author} onChange={e => setAuthor(e.target.value)} placeholder="저자" />
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 6, fontSize: 14 }}>상태</div>
          {statusList.map(s => (
            <Badge
              key={s}
              color={status === s ? "#818CF8" : "#E5E7EB"}
              style={{ marginRight: 8, cursor: "pointer" }}
              onClick={() => setStatus(s)}
            >
              {s}
            </Badge>
          ))}
        </div>
        {error && <div style={{ color: "#EF4444", marginBottom: 12, fontSize: 14 }}>{error}</div>}
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <Button onClick={handleSubmit} style={{ flex: 1 }}>등록</Button>
          <Button onClick={onClose} style={{ flex: 1, background: "#E5E7EB", color: "#374151" }}>취소</Button>
        </div>
      </div>
    </div>
  );
};

export default AddBookModal;
