import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { DatabaseService, Book as DBBook } from '../DatabaseService';
import { useBookContext } from '../BookContext';

// 커스텀 카드
const CustomCard = ({ children, style }: any) => {
  const wrappedChildren = React.Children.map(children, (child) => {
    if (typeof child === 'string' && child.trim() !== '') {
      return <Text>{child}</Text>;
    }
    if (typeof child === 'string') {
      // 공백/줄바꿈은 무시
      return null;
    }
    return child;
  });
  return <View style={[styles.card, { backgroundColor: '#fff', padding: 16 }, style]}>{wrappedChildren}</View>;
};

// 커스텀 버튼
const CustomButton = ({ onPress, icon, title, type, buttonStyle }: any) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      type === 'solid' ? styles.addButton : styles.headerButton,
      buttonStyle,
      type === 'outline' && { backgroundColor: '#fff', borderWidth: 1, borderColor: '#2563eb' },
    ]}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      {icon}
      <Text style={{ color: type === 'solid' ? '#fff' : '#2563eb', fontWeight: 'bold', marginLeft: 6 }}>{title}</Text>
    </View>
  </TouchableOpacity>
);

const BookLibraryScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('all');
  const { books, fetchBooks, loading, dbService } = useBookContext();
  const [todaySessions, setTodaySessions] = useState<any[]>([]);
  const [todayStats, setTodayStats] = useState({ totalMinutes: 0, totalPages: 0, totalNotes: 0 });
  const [statsLoading, setStatsLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      if (dbService) fetchBooks(dbService);
    }, [dbService])
  );

  useEffect(() => {
    const fetchToday = async () => {
      if (!dbService) return;
      setStatsLoading(true);
      try {
        const sessions = await dbService.getTodaySessions();
        setTodaySessions(sessions);
        // 통계 계산
        let totalMinutes = 0, totalPages = 0, totalNotes = 0;
        for (const s of sessions) {
          totalMinutes += s.duration_minutes || 0;
          totalPages += s.pages_read || 0;
          // 각 세션별 메모 개수 합산 (book_id 기준)
          const notes = await dbService.getNotesByBook(s.book_id);
          totalNotes += notes.length;
        }
        setTodayStats({ totalMinutes, totalPages, totalNotes });
      } catch (e) {
        // 무시
      } finally {
        setStatsLoading(false);
      }
    };
    fetchToday();
  }, [dbService]);

  const getStatusInfo = (status: DBBook['status']) => {
    switch (status) {
      case 'want-to-read': return { label: '읽고 싶은', icon: 'heart', color: '#ec4899' };
      case 'reading': return { label: '읽는 중', icon: 'time', color: '#eab308' };
      case 'completed': return { label: '완료', icon: 'checkmark-circle', color: '#22c55e' };
      default: return { label: '알 수 없음', icon: 'book', color: '#6b7280' };
    }
  };
  const filterBooksByStatus = (status: string) => status === 'all' ? books : books.filter(book => book.status === status);
  const filteredBooks = books.filter(book => book.status !== 'deleted');
  const BookCard = ({ book }: { book: DBBook }) => {
    const statusInfo = getStatusInfo(book.status);
    const [quoteCount, setQuoteCount] = useState<number>(0);
    const [noteCount, setNoteCount] = useState<number>(0);
    const [totalMinutes, setTotalMinutes] = useState<number>(0);
    useEffect(() => {
      let mounted = true;
      (async () => {
        if (!dbService) return;
        try {
          const quotes = await dbService.getQuotesByBook(book.id);
          const notes = await dbService.getNotesByBook(book.id);
          const sessions = await dbService.getSessionsByBook(book.id);
          if (mounted) {
            setQuoteCount(quotes.length);
            setNoteCount(notes.length);
            setTotalMinutes(sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0));
          }
        } catch (e) {
          // 무시
        }
      })();
      return () => { mounted = false; };
    }, [dbService, book.id]);
    return (
      <TouchableOpacity onPress={() => (navigation as any).navigate('BookDetail', { book })} style={styles.bookCard}>
        <CustomCard>
          <View style={styles.cardContent}>
            <View style={styles.bookInfo}>
              <View style={[styles.bookCover, { backgroundColor: book.cover_color || '#3b82f6' }]}> 
                {book.cover ? (
                  <Image
                    source={{ uri: book.cover }}
                    style={{ width: 40, height: 56, borderRadius: 6, backgroundColor: '#eee' }}
                    resizeMode="cover"
                  />
                ) : (
                  <Ionicons name="book" size={24} color="white" />
                )}
              </View>
              <View style={styles.bookDetails}>
                <Text style={styles.bookTitle}>{book.title}</Text>
                <Text style={styles.bookAuthor}>{book.author}</Text>
                <View style={styles.statusContainer}>
                  <View style={[styles.badge, { backgroundColor: statusInfo.color }]}> 
                    <Ionicons name={statusInfo.icon as any} size={12} color="white" />
                    <Text style={styles.badgeText}>{statusInfo.label}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 6 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12 }}>
                    <Ionicons name="chatbox-ellipses-outline" size={14} color="#64748b" />
                    <Text style={{ fontSize: 13, color: '#64748b', marginLeft: 2 }}>{quoteCount} 인용문</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12 }}>
                    <Ionicons name="document-text-outline" size={14} color="#64748b" />
                    <Text style={{ fontSize: 13, color: '#64748b', marginLeft: 2 }}>{noteCount} 메모</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="timer-outline" size={14} color="#64748b" />
                    <Text style={{ fontSize: 13, color: '#64748b', marginLeft: 2 }}>{totalMinutes}분</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </CustomCard>
      </TouchableOpacity>
    );
  };
  const TabButton = ({ title, value, isActive }: { title: string; value: string; isActive: boolean }) => (
    <TouchableOpacity style={[styles.tabButton, isActive && styles.activeTabButton]} onPress={() => setActiveTab(value)}>
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>{title}</Text>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Ionicons name="library" size={32} color="#2563eb" />
              <Text style={styles.headerTitle}>리브노트</Text>
            </View>
          </View>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>내 서재</Text>
            <Text style={styles.welcomeSubtitle}>지금까지 {filteredBooks.length}권의 책과 함께했어요</Text>
          </View>
          <CustomCard style={styles.todayCard}>
            <View style={styles.todayHeader}>
              <Ionicons name="calendar" size={20} color="#2563eb" />
              <Text style={styles.todayTitle}>오늘의 독서 기록</Text>
            </View>
            {statsLoading ? (
              <View style={{ alignItems: 'center', padding: 16 }}>
                <ActivityIndicator size="small" color="#2563eb" />
                <Text style={{ marginTop: 8, color: '#2563eb' }}>불러오는 중...</Text>
              </View>
            ) : (
              <>
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{todayStats.totalMinutes}</Text>
                    <Text style={styles.statLabel}>분</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{todayStats.totalPages}</Text>
                    <Text style={styles.statLabel}>페이지</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{todayStats.totalNotes}</Text>
                    <Text style={styles.statLabel}>노트</Text>
                  </View>
                </View>
                <View style={styles.sessionsContainer}>
                  <Text style={styles.sessionsTitle}>독서 세션</Text>
                  {todaySessions.length === 0 ? (
                    <Text style={{ color: '#64748b', marginTop: 8 }}>오늘의 독서 세션이 없습니다.</Text>
                  ) : (
                    todaySessions.map((session, index) => (
                      <View key={index} style={styles.sessionItem}>
                        <Text style={styles.sessionBook}>{session.book_title || '책'}</Text>
                        <View style={styles.sessionStats}>
                          <Text style={styles.sessionText}>{session.duration_minutes || 0}분</Text>
                          <Text style={styles.sessionText}>{session.pages_read || 0}페이지</Text>
                          <Text style={styles.sessionText}>{session.memo ? '메모 있음' : ''}</Text>
                        </View>
                      </View>
                    ))
                  )}
                </View>
              </>
            )}
          </CustomCard>
          <View style={styles.tabsContainer}>
            <TabButton title="전체" value="all" isActive={activeTab === 'all'} />
            <TabButton title="읽는 중" value="reading" isActive={activeTab === 'reading'} />
            <TabButton title="완료" value="completed" isActive={activeTab === 'completed'} />
            <TabButton title="읽고 싶은" value="want-to-read" isActive={activeTab === 'want-to-read'} />
          </View>
          <View style={styles.booksContainer}>
            {filteredBooks
              .filter(book => activeTab === 'all' ? true : book.status === activeTab)
              .map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </View>
        </ScrollView>
        
        {/* 플로팅 액션 버튼 - ScrollView 밖에 배치 */}
        <TouchableOpacity
          onPress={() => (navigation as any).navigate('Search')}
          style={styles.floatingActionButton}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: { 
    flex: 1, 
    backgroundColor: '#f8fafc', 
    maxWidth: '100%',
    position: 'relative', // 플로팅 버튼의 기준점
  },
  scrollView: {
    flex: 1,
  },
  header: { 
    backgroundColor: 'white', 
    paddingHorizontal: 16, 
    paddingTop: 0, 
    paddingBottom: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#e2e8f0' 
  },
  headerContent: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 0 
  },
  headerTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginLeft: 8, 
    color: '#1e293b' 
  },
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
  booksContainer: { padding: 16, paddingBottom: 100, maxWidth: '100%' },
  bookCard: { marginBottom: 12 },
  card: { elevation: 2, maxWidth: '100%' },
  cardContent: { padding: 16 },
  bookInfo: { flexDirection: 'row' },
  bookCover: { width: 48, height: 64, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  bookDetails: { flex: 1, minWidth: 0 },
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
  floatingActionButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    zIndex: 1000, // 다른 요소들 위에 표시
  },
  addButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  headerButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2563eb',
    marginVertical: 8,
  },
});

export default BookLibraryScreen; 