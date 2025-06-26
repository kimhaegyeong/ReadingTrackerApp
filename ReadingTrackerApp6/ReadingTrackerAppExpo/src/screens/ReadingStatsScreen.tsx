import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Share, SafeAreaView } from 'react-native';
import { Feather, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { BarChart, PieChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

const mockData = {
  yearlyGoal: 24,
  booksRead: 18,
  totalMinutes: 1250,
  totalPages: 3200,
  currentStreak: 15,
  longestStreak: 32,
  sessions: [
    { month: '1월', books: 2, minutes: 120, pages: 280 },
    { month: '2월', books: 1, minutes: 80, pages: 180 },
    { month: '3월', books: 3, minutes: 150, pages: 420 },
    { month: '4월', books: 2, minutes: 110, pages: 350 },
    { month: '5월', books: 2, minutes: 140, pages: 380 },
    { month: '6월', books: 3, minutes: 180, pages: 490 },
    { month: '7월', books: 2, minutes: 120, pages: 290 },
    { month: '8월', books: 1, minutes: 90, pages: 220 },
    { month: '9월', books: 2, minutes: 160, pages: 340 },
  ],
  genres: [
    { name: '소설', value: 8, color: '#8B5CF6' },
    { name: '에세이', value: 4, color: '#06B6D4' },
    { name: '과학', value: 3, color: '#10B981' },
    { name: '자기계발', value: 3, color: '#F59E0B' },
  ],
  recentBooks: [
    { title: '아몬드', author: '손원평', finishedDate: '2024-06-15', rating: 5 },
    { title: '사피엔스', author: '유발 하라리', finishedDate: '2024-06-10', rating: 4 },
    { title: '코스모스', author: '칼 세이건', finishedDate: '2024-06-05', rating: 5 },
  ]
};

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
  return <View style={[styles.card, { backgroundColor: '#fff', padding: 16 }, style]}>{wrappedChildren}</View>;
};

const ReadingStatsScreen = ({ navigation }: any) => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string }>({ visible: false, message: '' });
  const selectedYear = new Date().getFullYear();
  const progressPercentage = (mockData.booksRead / mockData.yearlyGoal) * 100;

  const handleShareStats = async () => {
    const statsText = `📚 ${selectedYear}년 독서 현황\n✅ 읽은 책: ${mockData.booksRead}/${mockData.yearlyGoal}권\n⏰ 총 독서시간: ${Math.floor(mockData.totalMinutes / 60)}시간 ${mockData.totalMinutes % 60}분\n📖 총 페이지: ${mockData.totalPages.toLocaleString()}페이지\n🔥 현재 연속 독서: ${mockData.currentStreak}일\n\n#독서기록 #리브노트`;
    try {
      await Share.share({ message: statsText });
    } catch (e) {
      setSnackbar({ visible: true, message: '공유에 실패했습니다.' });
    }
  };

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
                <Text style={styles.statNumber}>{mockData.booksRead}</Text>
                <Text style={styles.statLabel}>읽은 책</Text>
                <Text style={styles.statSubtext}>목표 {mockData.yearlyGoal}권</Text>
              </View>
              
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <FontAwesome name="clock-o" size={24} color="#8b5cf6" />
                </View>
                <Text style={styles.statNumber}>{Math.floor(mockData.totalMinutes / 60)}</Text>
                <Text style={styles.statLabel}>독서 시간</Text>
                <Text style={styles.statSubtext}>시간</Text>
              </View>
              
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Feather name="trending-up" size={24} color="#10b981" />
                </View>
                <Text style={styles.statNumber}>{mockData.currentStreak}</Text>
                <Text style={styles.statLabel}>연속 기록</Text>
                <Text style={styles.statSubtext}>일</Text>
              </View>
              
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <MaterialIcons name="bar-chart" size={24} color="#f59e0b" />
                </View>
                <Text style={styles.statNumber}>{Math.floor(mockData.totalPages / 1000)}k</Text>
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
                {mockData.booksRead}권 완료 • {mockData.yearlyGoal - mockData.booksRead}권 남음
              </Text>
            </View>

            {/* 최근 읽은 책 */}
            <View style={styles.recentBooksCard}>
              <Text style={styles.sectionTitle}>최근 읽은 책</Text>
              {mockData.recentBooks.map((book, idx) => (
                <View key={idx} style={styles.bookItem}>
                  <View style={styles.bookInfo}>
                    <Text style={styles.bookTitle}>{book.title}</Text>
                    <Text style={styles.bookAuthor}>{book.author}</Text>
                    <Text style={styles.bookDate}>{book.finishedDate}</Text>
                  </View>
                  <View style={styles.ratingContainer}>
                    {[...Array(5)].map((_, i) => (
                      <MaterialIcons
                        key={i}
                        name={i < book.rating ? 'star' : 'star-border'}
                        size={16}
                        color={i < book.rating ? '#fbbf24' : '#d1d5db'}
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
                  labels: mockData.sessions.map(s => s.month),
                  datasets: [{ data: mockData.sessions.map(s => s.books) }]
                }}
                width={width - 48}
                height={200}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                  backgroundColor: "#fff",
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                  style: { borderRadius: 8 },
                  propsForBackgroundLines: { stroke: "#f3f4f6" }
                }}
                style={{ borderRadius: 12, marginVertical: 8 }}
              />
            </View>

            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>장르별 비율</Text>
              <PieChart
                data={mockData.genres.map(g => ({
                  name: g.name,
                  population: g.value,
                  color: g.color,
                  legendFontColor: "#374151",
                  legendFontSize: 12
                }))}
                width={width - 48}
                height={180}
                chartConfig={{
                  color: () => "#374151"
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
              />
            </View>
          </View>
        )}

        {/* 목표 탭 */}
        {selectedTab === 'goals' && (
          <View style={styles.goalsContainer}>
            <View style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <Text style={styles.goalTitle}>올해 목표</Text>
                <Text style={styles.goalNumber}>{mockData.yearlyGoal}권</Text>
              </View>
              <View style={styles.goalProgress}>
                <View style={styles.goalProgressBar}>
                  <View style={[styles.goalProgressFill, { width: `${progressPercentage}%` }]} />
                </View>
                <Text style={styles.goalProgressText}>
                  {mockData.booksRead}권 완료 ({Math.round(progressPercentage)}%)
                </Text>
              </View>
              <Text style={styles.goalDescription}>
                목표 달성까지 {mockData.yearlyGoal - mockData.booksRead}권 남았습니다!
              </Text>
            </View>
          </View>
        )}

        {/* 기록 탭 */}
        {selectedTab === 'history' && (
          <View style={styles.historyContainer}>
            <View style={styles.historyCard}>
              <Text style={styles.sectionTitle}>월별 독서 기록</Text>
              {mockData.sessions.map((session, idx) => (
                <View key={idx} style={styles.historyItem}>
                  <View style={styles.historyMonth}>
                    <Text style={styles.historyMonthText}>{session.month}</Text>
                  </View>
                  <View style={styles.historyStats}>
                    <View style={styles.historyStat}>
                      <Text style={styles.historyStatNumber}>{session.books}</Text>
                      <Text style={styles.historyStatLabel}>권</Text>
                    </View>
                    <View style={styles.historyStat}>
                      <Text style={styles.historyStatNumber}>{session.minutes}</Text>
                      <Text style={styles.historyStatLabel}>분</Text>
                    </View>
                    <View style={styles.historyStat}>
                      <Text style={styles.historyStatNumber}>{session.pages}</Text>
                      <Text style={styles.historyStatLabel}>페이지</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
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
  goalsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  goalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  goalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  goalNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  goalProgress: {
    marginBottom: 16,
  },
  goalProgressBar: {
    height: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 6,
  },
  goalProgressText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  goalDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  historyContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  historyMonth: {
    width: 60,
  },
  historyMonthText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
  },
  historyStats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  historyStat: {
    alignItems: 'center',
  },
  historyStatNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  historyStatLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  snackbar: { position: 'absolute', bottom: 32, left: 24, right: 24, backgroundColor: '#222', borderRadius: 8, padding: 16, alignItems: 'center', zIndex: 100 },
  snackbarText: { color: '#fff', fontSize: 15 },
});

export default ReadingStatsScreen; 