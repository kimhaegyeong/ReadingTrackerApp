import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome, Feather, Ionicons } from '@expo/vector-icons';

const TABS = [
  { key: 'all', label: '전체' },
  { key: 'reading', label: '읽는 중' },
  { key: 'completed', label: '완료' },
  { key: 'want-to-read', label: '읽고 싶은' },
];

const STATUS_INFO = {
  'want-to-read': { label: '읽고 싶은', icon: 'heart', color: '#F472B6', bg: '#FDF2F8' },
  'reading': { label: '읽는 중', icon: 'clock-o', color: '#FBBF24', bg: '#FFFBEB' },
  'completed': { label: '완료', icon: 'check-circle', color: '#34D399', bg: '#ECFDF5' },
  'unknown': { label: '알 수 없음', icon: 'book', color: '#A1A1AA', bg: '#F3F4F6' },
};

const BookLibrary = ({ onBookSelect }) => {
  const [books] = useState([
    { id: 1, title: '사피엔스', author: '유발 하라리', status: 'completed', progress: 100, coverColor: '#2563EB', quotes: 12, notes: 8, readingTime: '15시간 32분' },
    { id: 2, title: '아몬드', author: '손원평', status: 'reading', progress: 65, coverColor: '#8B5CF6', quotes: 5, notes: 3, readingTime: '8시간 15분' },
    { id: 3, title: '코스모스', author: '칼 세이건', status: 'want-to-read', progress: 0, coverColor: '#6366F1', quotes: 0, notes: 0, readingTime: '0분' },
    { id: 4, title: '1984', author: '조지 오웰', status: 'completed', progress: 100, coverColor: '#EF4444', quotes: 18, notes: 12, readingTime: '12시간 45분' },
  ]);
  const [tab, setTab] = useState('all');

  const todayReading = {
    totalMinutes: 45,
    totalPages: 23,
    totalNotes: 3,
    sessions: [
      { book: '아몬드', minutes: 25, pages: 15, notes: 2 },
      { book: '사피엔스', minutes: 20, pages: 8, notes: 1 },
    ],
  };

  const filterBooks = () => {
    if (tab === 'all') return books;
    return books.filter((b) => b.status === tab);
  };

  const BookCard = ({ book }) => {
    const status = STATUS_INFO[book.status] || STATUS_INFO.unknown;
    return (
      <TouchableOpacity style={styles.card} onPress={() => onBookSelect && onBookSelect(book)}>
        <View style={styles.cardRow}>
          {/* Book Cover */}
          <View style={[styles.cover, { backgroundColor: book.coverColor }] }>
            <Feather name="book" size={28} color="#fff" />
          </View>
          {/* Book Info */}
          <View style={{ flex: 1 }}>
            <Text style={styles.bookTitle} numberOfLines={1}>{book.title}</Text>
            <Text style={styles.bookAuthor}>{book.author}</Text>
            <View style={styles.statusRow}>
              <View style={[styles.statusBadge, { backgroundColor: status.bg }] }>
                <FontAwesome name={status.icon} size={12} color={status.color} style={{ marginRight: 4 }} />
                <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
              </View>
              {book.status === 'reading' && (
                <Text style={styles.progressText}>{book.progress}%</Text>
              )}
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>📖 {book.quotes}개 인용문</Text>
              <Text style={styles.infoText}>📝 {book.notes}개 메모</Text>
            </View>
          </View>
        </View>
        {/* Progress Bar */}
        {book.status === 'reading' && (
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBar, { width: `${book.progress}%` }]} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Welcome Section */}
      <View style={styles.welcomeBox}>
        <Text style={styles.welcomeTitle}>내 서재</Text>
        <Text style={styles.welcomeDesc}>지금까지 {books.length}권의 책과 함께했어요</Text>
      </View>
      {/* 오늘의 독서 기록 */}
      <View style={styles.todayCard}>
        <View style={styles.todayHeader}>
          <Ionicons name="calendar-outline" size={20} color="#2563EB" style={{ marginRight: 6 }} />
          <Text style={styles.todayTitle}>오늘의 독서 기록</Text>
        </View>
        <View style={styles.todayStatsRow}>
          <View style={styles.todayStatBox}>
            <Text style={[styles.todayStatValue, { color: '#2563EB' }]}>{todayReading.totalMinutes}</Text>
            <Text style={styles.todayStatLabel}>분</Text>
          </View>
          <View style={styles.todayStatBox}>
            <Text style={[styles.todayStatValue, { color: '#8B5CF6' }]}>{todayReading.totalPages}</Text>
            <Text style={styles.todayStatLabel}>페이지</Text>
          </View>
          <View style={styles.todayStatBox}>
            <Text style={[styles.todayStatValue, { color: '#22C55E' }]}>{todayReading.totalNotes}</Text>
            <Text style={styles.todayStatLabel}>노트</Text>
          </View>
        </View>
        <View style={{ marginTop: 10 }}>
          <Text style={styles.sessionTitle}>독서 세션</Text>
          {todayReading.sessions.map((session, idx) => (
            <View key={idx} style={styles.sessionRow}>
              <Text style={styles.sessionBook}>{session.book}</Text>
              <View style={styles.sessionInfoRow}>
                <Text style={styles.sessionInfo}>{session.minutes}분</Text>
                <Text style={styles.sessionInfo}>{session.pages}페이지</Text>
                <Text style={styles.sessionInfo}>{session.notes}노트</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
      {/* 탭 */}
      <View style={styles.tabsRow}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tabBtn, tab === t.key && styles.tabBtnActive]}
            onPress={() => setTab(t.key)}
          >
            <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* 책 리스트 */}
      <View style={{ marginTop: 10 }}>
        {filterBooks().map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
        {filterBooks().length === 0 && (
          <Text style={{ color: '#888', textAlign: 'center', marginTop: 32 }}>책이 없습니다</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  welcomeBox: { alignItems: 'center', marginTop: 24, marginBottom: 12 },
  welcomeTitle: { fontSize: 26, fontWeight: 'bold', color: '#222', marginBottom: 4 },
  welcomeDesc: { color: '#666', fontSize: 15 },
  todayCard: { backgroundColor: '#F3F6FF', borderRadius: 14, padding: 18, marginBottom: 18, elevation: 1 },
  todayHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  todayTitle: { fontWeight: 'bold', fontSize: 16, color: '#2563EB' },
  todayStatsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  todayStatBox: { alignItems: 'center', flex: 1 },
  todayStatValue: { fontSize: 22, fontWeight: 'bold' },
  todayStatLabel: { color: '#666', fontSize: 13 },
  sessionTitle: { fontWeight: 'bold', color: '#666', fontSize: 13, marginBottom: 4 },
  sessionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', borderRadius: 8, padding: 8, marginBottom: 6 },
  sessionBook: { fontWeight: '500', color: '#2563EB', fontSize: 14 },
  sessionInfoRow: { flexDirection: 'row', gap: 12 },
  sessionInfo: { color: '#666', fontSize: 12, marginLeft: 8 },
  tabsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 2, backgroundColor: '#E0E7FF', borderRadius: 8, padding: 4 },
  tabBtn: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 6 },
  tabBtnActive: { backgroundColor: '#2563EB' },
  tabText: { color: '#2563EB', fontWeight: 'bold', fontSize: 15 },
  tabTextActive: { color: '#fff' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 14, elevation: 2 },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  cover: { width: 48, height: 64, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  bookTitle: { fontWeight: 'bold', fontSize: 16, color: '#222' },
  bookAuthor: { color: '#666', fontSize: 13, marginBottom: 2 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, marginRight: 8 },
  statusText: { fontWeight: 'bold', fontSize: 12 },
  progressText: { color: '#888', fontSize: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  infoText: { color: '#888', fontSize: 12, marginRight: 12 },
  progressBarBg: { backgroundColor: '#E5E7EB', borderRadius: 8, height: 6, marginTop: 8, width: '100%' },
  progressBar: { backgroundColor: '#2563EB', height: 6, borderRadius: 8 },
});

export default BookLibrary;
