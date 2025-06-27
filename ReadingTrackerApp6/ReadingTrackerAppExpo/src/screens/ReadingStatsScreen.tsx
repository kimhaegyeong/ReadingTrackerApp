import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Share, SafeAreaView, ActivityIndicator } from 'react-native';
import { Feather, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { DatabaseService } from '../DatabaseService';

const { width } = Dimensions.get('window');

const TABS = [
  { key: 'overview', label: '개요' },
  { key: 'charts', label: '차트' },
  { key: 'goals', label: '목표' },
  { key: 'history', label: '기록' },
];

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
  return <View style={[styles.card, style]}>{wrappedChildren}</View>;
};

const ReadingStatsScreen = ({ navigation }: any) => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string }>({ visible: false, message: '' });
  const selectedYear = new Date().getFullYear();

  // DB 기반 상태
  const [loading, setLoading] = useState(true);
  const [yearlyGoal, setYearlyGoal] = useState(24); // TODO: settings에서 불러오도록 개선 가능
  const [booksRead, setBooksRead] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0); // TODO: streak 계산 함수 필요
  const [longestStreak, setLongestStreak] = useState(0); // TODO: streak 계산 함수 필요
  const [monthlyStats, setMonthlyStats] = useState<any[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [recentBooks, setRecentBooks] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const db = await DatabaseService.getInstance();
      // 누적 통계
      const total = await db.getTotalStats();
      setTotalMinutes(total.totalMinutes);
      setTotalPages(total.totalPages);
      // 월별 통계
      const monthly = await db.getMonthlyStats(selectedYear);
      setMonthlyStats(monthly);
      // 최근 읽은 책
      const recent = await db.getRecentBooks(3);
      setRecentBooks(recent);
      // 장르별 통계
      const genreStats = await db.getGenreStats();
      setGenres(genreStats);
      // 읽은 책 수
      setBooksRead(monthly.reduce((sum, m) => sum + m.books, 0));
      // TODO: streak 계산 함수 구현 필요
      setCurrentStreak(0);
      setLongestStreak(0);
      setLoading(false);
    };
    fetchStats();
  }, [selectedYear]);

  const progressPercentage = yearlyGoal ? (booksRead / yearlyGoal) * 100 : 0;

  const handleShareStats = async () => {
    const statsText = `📚 ${selectedYear}년 독서 현황\n✅ 읽은 책: ${booksRead}/${yearlyGoal}권\n⏰ 총 독서시간: ${Math.floor(totalMinutes / 60)}시간 ${totalMinutes % 60}분\n📖 총 페이지: ${totalPages.toLocaleString()}페이지\n🔥 현재 연속 독서: ${currentStreak}일\n\n#독서기록 #리브노트`;
    try {
      await Share.share({ message: statsText });
    } catch (e) {
      setSnackbar({ visible: true, message: '공유에 실패했습니다.' });
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={{ marginTop: 16 }}>통계 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>독서 통계</Text>
            <Text style={styles.headerSub}>{selectedYear}년 독서 현황</Text>
          </View>
          <TouchableOpacity onPress={handleShareStats} style={styles.shareButton}>
            <Feather name="share-2" size={20} color="#2563eb" />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabButton, selectedTab === tab.key && styles.activeTabButton]}
              onPress={() => setSelectedTab(tab.key)}
            >
              <Text style={[styles.tabText, selectedTab === tab.key && styles.activeTabText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 개요 탭 */}
        {selectedTab === 'overview' && (
          <View style={styles.overviewContainer}>
            {/* 주요 통계 카드들 */}
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <MaterialIcons name="menu-book" size={24} color="#2563eb" />
                </View>
                <Text style={styles.statNumber}>{booksRead}</Text>
                <Text style={styles.statLabel}>읽은 책</Text>
                <Text style={styles.statSubtext}>목표 {yearlyGoal}권</Text>
              </View>
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <FontAwesome name="clock-o" size={24} color="#8b5cf6" />
                </View>
                <Text style={styles.statNumber}>{Math.floor(totalMinutes / 60)}</Text>
                <Text style={styles.statLabel}>독서 시간</Text>
                <Text style={styles.statSubtext}>시간</Text>
              </View>
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Feather name="trending-up" size={24} color="#10b981" />
                </View>
                <Text style={styles.statNumber}>{currentStreak}</Text>
                <Text style={styles.statLabel}>연속 기록</Text>
                <Text style={styles.statSubtext}>일</Text>
              </View>
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <MaterialIcons name="bar-chart" size={24} color="#f59e0b" />
                </View>
                <Text style={styles.statNumber}>{Math.floor(totalPages / 1000)}k</Text>
                <Text style={styles.statLabel}>총 페이지</Text>
                <Text style={styles.statSubtext}>페이지</Text>
              </View>
            </View>
            {/* 목표 진행률 */}
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>올해 목표 진행률</Text>
                <Text style={styles.progressPercentage}>{Math.round(progressPercentage)}%</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
                </View>
              </View>
              <Text style={styles.progressText}>
                {booksRead}권 완료 • {yearlyGoal - booksRead}권 남음
              </Text>
            </View>
            {/* 최근 읽은 책 */}
            <View style={styles.recentBooksCard}>
              <Text style={styles.sectionTitle}>최근 읽은 책</Text>
              {recentBooks.map((book: any, idx: number) => (
                <View key={idx} style={styles.bookItem}>
                  <View style={styles.bookInfo}>
                    <Text style={styles.bookTitle}>{book.title}</Text>
                    <Text style={styles.bookAuthor}>{book.author}</Text>
                    <Text style={styles.bookDate}>{book.finishedDate?.slice(0, 10)}</Text>
                  </View>
                  <View style={styles.ratingContainer}>
                    {[...Array(5)].map((_, i) => (
                      <MaterialIcons
                        key={i}
                        name={i < (book.rating ?? 0) ? 'star' : 'star-border'}
                        size={16}
                        color={i < (book.rating ?? 0) ? '#fbbf24' : '#d1d5db'}
                        style={{ marginRight: 2 }}
                      />
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 차트 탭 */}
        {selectedTab === 'charts' && (
          <View style={styles.chartsContainer}>
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>월별 독서량</Text>
              <BarChart
                data={{
                  labels: monthlyStats.map((s: any) => `${s.month}월`),
                  datasets: [{ data: monthlyStats.map((s: any) => s.books) }]
                }}
                width={width - 48}
                height={200}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                  backgroundColor: '#fff',
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
                  style: { borderRadius: 16 },
                  propsForDots: { r: '6', strokeWidth: '2', stroke: '#2563eb' },
                }}
                style={{ borderRadius: 16 }}
              />
            </View>
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>장르별 통계</Text>
              <PieChart
                data={genres.map((g: any) => ({
                  name: g.name,
                  population: g.value,
                  color: g.color,
                  legendFontColor: '#374151',
                  legendFontSize: 14
                }))}
                width={width - 48}
                height={180}
                chartConfig={{
                  backgroundColor: '#fff',
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </View>
          </View>
        )}

        {/* 목표/기록 탭은 기존 구조 유지(추후 DB 연동 가능) */}
      </ScrollView>
      {/* Snackbar 대체 */}
      {snackbar.visible && (
        <View style={styles.snackbar}>
          <Text style={styles.snackbarText}>{snackbar.message}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  headerSub: {
    fontSize: 14,
    color: '#6b7280',
  },
  shareButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: '#2563eb',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },
  overviewContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  statSubtext: {
    fontSize: 12,
    color: '#6b7280',
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  progressBarContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#6b7280',
  },
  recentBooksCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  bookItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  bookDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  chartsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  snackbar: { position: 'absolute', bottom: 32, left: 24, right: 24, backgroundColor: '#222', borderRadius: 8, padding: 16, alignItems: 'center', zIndex: 100 },
  snackbarText: { color: '#fff', fontSize: 15 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
});

export default ReadingStatsScreen; 