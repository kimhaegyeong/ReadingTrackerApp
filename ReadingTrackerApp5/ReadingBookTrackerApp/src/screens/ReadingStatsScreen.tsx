import React from "react";
import { useBookContext } from "@/contexts/BookContext";

const sampleMonthly = [
  { month: "1월", count: 2 },
  { month: "2월", count: 3 },
  { month: "3월", count: 1 },
  { month: "4월", count: 4 },
  { month: "5월", count: 2 },
];
const sampleTags = [
  { tag: "철학", count: 3 },
  { tag: "명언", count: 2 },
  { tag: "감상", count: 4 },
];

const ReadingStatsScreen = () => {
  const { books } = useBookContext();
  const total = books.length;
  const statusCounts = {
    "읽고 싶은": books.filter(b => b.status === "읽고 싶은").length,
    "읽는 중": books.filter(b => b.status === "읽는 중").length,
    "다 읽은": books.filter(b => b.status === "다 읽은").length,
  };

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>통계 대시보드</h2>
      <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
        <div style={{ flex: 1, background: '#F3F4F6', borderRadius: 12, padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 15, color: '#6B7280', marginBottom: 6 }}>전체 등록 도서</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{total}</div>
        </div>
        <div style={{ flex: 1, background: '#F3F4F6', borderRadius: 12, padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 15, color: '#6B7280', marginBottom: 6 }}>읽고 싶은</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{statusCounts["읽고 싶은"]}</div>
        </div>
        <div style={{ flex: 1, background: '#F3F4F6', borderRadius: 12, padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 15, color: '#6B7280', marginBottom: 6 }}>읽는 중</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{statusCounts["읽는 중"]}</div>
        </div>
        <div style={{ flex: 1, background: '#F3F4F6', borderRadius: 12, padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 15, color: '#6B7280', marginBottom: 6 }}>다 읽은</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{statusCounts["다 읽은"]}</div>
        </div>
      </div>
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>월별 독서량 (샘플)</h3>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', height: 120 }}>
          {sampleMonthly.map(m => (
            <div key={m.month} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ background: '#818CF8', height: m.count * 20, borderRadius: 6, marginBottom: 6 }}></div>
              <div style={{ fontSize: 14, color: '#6B7280' }}>{m.month}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>태그별 통계 (샘플)</h3>
        <div style={{ display: 'flex', gap: 16 }}>
          {sampleTags.map(t => (
            <div key={t.tag} style={{ flex: 1, background: '#F472B6', color: '#fff', borderRadius: 8, padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 15, marginBottom: 4 }}>{t.tag}</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{t.count}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <button onClick={() => window.location.href = '/'} style={{ background: '#E5E7EB', color: '#374151', border: 'none', borderRadius: 8, padding: '12px 24px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>← 내 서재로</button>
      </div>
    </div>
  );
};

export default ReadingStatsScreen;
