import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Badge, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface Book {
  id: number;
  title: string;
  author: string;
  status: 'want-to-read' | 'reading' | 'completed';
  progress: number;
  coverColor: string;
  quotes: number;
  notes: number;
  readingTime: string;
}

const BookLibraryScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('all');
  const [books] = useState<Book[]>([
    { id: 1, title: '사피엔스', author: '유발 하라리', status: 'completed', progress: 100, coverColor: '#3b82f6', quotes: 12, notes: 8, readingTime: '15시간 32분' },
    { id: 2, title: '아몬드', author: '손원평', status: 'reading', progress: 65, coverColor: '#8b5cf6', quotes: 5, notes: 3, readingTime: '8시간 15분' },
    { id: 3, title: '코스모스', author: '칼 세이건', status: 'want-to-read', progress: 0, coverColor: '#6366f1', quotes: 0, notes: 0, readingTime: '0분' },
    { id: 4, title: '1984', author: '조지 오웰', status: 'completed', progress: 100, coverColor: '#ef4444', quotes: 18, notes: 12, readingTime: '12시간 45분' }
  ]);
  const todayReading = { totalMinutes: 45, totalPages: 23, totalNotes: 3, sessions: [ { book: '아몬드', minutes: 25, pages: 15, notes: 2 }, { book: '사피엔스', minutes: 20, pages: 8, notes: 1 } ] };
  const getStatusInfo = (status: Book['status']) => {
    switch (status) {
      case 'want-to-read': return { label: '읽고 싶은', icon: 'heart', color: '#ec4899' };
      case 'reading': return { label: '읽는 중', icon: 'time', color: '#eab308' };
      case 'completed': return { label: '완료', icon: 'checkmark-circle', color: '#22c55e' };
      default: return { label: '알 수 없음', icon: 'book', color: '#6b7280' };
    }
  };
  const filterBooksByStatus = (status: string) => status === 'all' ? books : books.filter(book => book.status === status);
  const BookCard = ({ book }: { book: Book }) => {
    const statusInfo = getStatusInfo(book.status);
    return (
      <TouchableOpacity onPress={() => (navigation as any).navigate('BookDetail', { book })} style={styles.bookCard}>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.bookInfo}>
              <View style={[styles.bookCover, { backgroundColor: book.coverColor }]}> 
                <Ionicons name="book" size={24} color="white" />
              </View>
              <View style={styles.bookDetails}>
                <Title style={styles.bookTitle}>{book.title}</Title>
                <Paragraph style={styles.bookAuthor}>{book.author}</Paragraph>
                <View style={styles.statusContainer}>
                  <View style={[styles.badge, { backgroundColor: statusInfo.color }]}> 
                    <Ionicons name={statusInfo.icon as any} size={12} color="white" />
                    <Text style={styles.badgeText}>{statusInfo.label}</Text>
                  </View>
                  {book.status === 'reading' && (
                    <Text style={styles.progressText}>{book.progress}%</Text>
                  )}
                </View>
                <View style={styles.statsContainer}>
                  <Text style={styles.statsText}>📖 {book.quotes}개 인용문</Text>
                  <Text style={styles.statsText}>📝 {book.notes}개 메모</Text>
                </View>
              </View>
            </View>
            {book.status === 'reading' && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${book.progress}%` }]} />
                </View>
              </View>
            )}
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };
  const TabButton = ({ title, value, isActive }: { title: string; value: string; isActive: boolean }) => (
    <TouchableOpacity style={[styles.tabButton, isActive && styles.activeTabButton]} onPress={() => setActiveTab(value)}>
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>{title}</Text>
    </TouchableOpacity>
  );
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}><Ionicons name="library" size={32} color="#2563eb" /><Text style={styles.headerTitle}>리브노트</Text></View>
        <View style={styles.headerButtons}>
          <Button mode="outlined" onPress={() => (navigation as any).navigate('ReadingStats')} style={styles.headerButton}><Ionicons name="stats-chart" size={16} />통계</Button>
          <Button mode="outlined" onPress={() => (navigation as any).navigate('ReadingTimer')} style={styles.headerButton}><Ionicons name="timer" size={16} />독서 기록</Button>
          <Button mode="contained" onPress={() => (navigation as any).navigate('AddBook')} style={styles.addButton}><Ionicons name="add" size={16} />책 추가</Button>
        </View>
      </View>
      <View style={styles.welcomeSection}><Text style={styles.welcomeTitle}>내 서재</Text><Text style={styles.welcomeSubtitle}>지금까지 {books.length}권의 책과 함께했어요</Text></View>
      <Card style={styles.todayCard}><Card.Content><View style={styles.todayHeader}><Ionicons name="calendar" size={20} color="#2563eb" /><Title style={styles.todayTitle}>오늘의 독서 기록</Title></View><View style={styles.statsGrid}><View style={styles.statItem}><Text style={styles.statNumber}>{todayReading.totalMinutes}</Text><Text style={styles.statLabel}>분</Text></View><View style={styles.statItem}><Text style={styles.statNumber}>{todayReading.totalPages}</Text><Text style={styles.statLabel}>페이지</Text></View><View style={styles.statItem}><Text style={styles.statNumber}>{todayReading.totalNotes}</Text><Text style={styles.statLabel}>노트</Text></View></View><View style={styles.sessionsContainer}><Text style={styles.sessionsTitle}>독서 세션</Text>{todayReading.sessions.map((session, index) => (<View key={index} style={styles.sessionItem}><Text style={styles.sessionBook}>{session.book}</Text><View style={styles.sessionStats}><Text style={styles.sessionText}>{session.minutes}분</Text><Text style={styles.sessionText}>{session.pages}페이지</Text><Text style={styles.sessionText}>{session.notes}노트</Text></View></View>))}</View></Card.Content></Card>
      <View style={styles.tabsContainer}><TabButton title="전체" value="all" isActive={activeTab === 'all'} /><TabButton title="읽는 중" value="reading" isActive={activeTab === 'reading'} /><TabButton title="완료" value="completed" isActive={activeTab === 'completed'} /><TabButton title="읽고 싶은" value="want-to-read" isActive={activeTab === 'want-to-read'} /></View>
      <View style={styles.booksContainer}>{filterBooksByStatus(activeTab).map(book => (<BookCard key={book.id} book={book} />))}</View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { backgroundColor: 'white', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  headerContent: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', marginLeft: 8, color: '#1e293b' },
  headerButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  headerButton: { marginRight: 8 },
  addButton: { backgroundColor: '#2563eb' },
  welcomeSection: { alignItems: 'center', paddingVertical: 32 },
  welcomeTitle: { fontSize: 28, fontWeight: 'bold', color: '#1e293b', marginBottom: 8 },
  welcomeSubtitle: { fontSize: 16, color: '#64748b' },
  todayCard: { margin: 16, backgroundColor: '#eff6ff', borderColor: '#bfdbfe' },
  todayHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  todayTitle: { marginLeft: 8, fontSize: 18 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  statItem: { flex: 1, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.7)', padding: 12, borderRadius: 8, marginHorizontal: 4 },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#2563eb' },
  statLabel: { fontSize: 14, color: '#64748b' },
  sessionsContainer: { marginTop: 16 },
  sessionsTitle: { fontWeight: '600', color: '#374151', marginBottom: 8 },
  sessionItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.5)', padding: 8, borderRadius: 8, marginBottom: 4 },
  sessionBook: { fontWeight: '600', color: '#1f2937' },
  sessionStats: { flexDirection: 'row' },
  sessionText: { fontSize: 12, color: '#6b7280', marginLeft: 16 },
  tabsContainer: { flexDirection: 'row', marginHorizontal: 16, marginTop: 16, backgroundColor: 'white', borderRadius: 8, padding: 4 },
  tabButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 6 },
  activeTabButton: { backgroundColor: '#2563eb' },
  tabText: { fontSize: 14, color: '#64748b' },
  activeTabText: { color: 'white', fontWeight: '600' },
  booksContainer: { padding: 16, paddingBottom: 100 },
  bookCard: { marginBottom: 12 },
  card: { elevation: 2 },
  cardContent: { padding: 16 },
  bookInfo: { flexDirection: 'row' },
  bookCover: { width: 48, height: 64, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  bookDetails: { flex: 1 },
  bookTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  bookAuthor: { fontSize: 14, color: '#6b7280', marginBottom: 8 },
  statusContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4 },
  badgeText: { color: 'white', fontSize: 12, marginLeft: 4 },
  progressText: { fontSize: 12, color: '#6b7280', marginLeft: 8 },
  statsContainer: { flexDirection: 'row' },
  statsText: { fontSize: 12, color: '#6b7280', marginRight: 16 },
  progressContainer: { marginTop: 12 },
  progressBar: { height: 8, backgroundColor: '#e5e7eb', borderRadius: 4 },
  progressFill: { height: '100%', backgroundColor: '#2563eb', borderRadius: 4 },
});

export default BookLibraryScreen; 