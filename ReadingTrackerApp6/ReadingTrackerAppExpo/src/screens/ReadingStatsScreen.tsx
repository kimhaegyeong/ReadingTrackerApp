import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Share, SafeAreaView, ActivityIndicator, Modal, TextInput } from 'react-native';
import { Feather, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { DatabaseService } from '../DatabaseService';
import CustomCard from '../components/common/CustomCard';
import CustomButton from '../components/common/CustomButton';
import CustomBadge from '../components/common/CustomBadge';
import { formatNumber } from '../lib/utils';

const { width } = Dimensions.get('window');

const TABS = [
  { key: 'overview', label: '개요' },
  { key: 'charts', label: '차트' },
  { key: 'goals', label: '목표' },
  { key: 'history', label: '기록' },
];

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
  const [totalBookPages, setTotalBookPages] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [monthlyStats, setMonthlyStats] = useState<any[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [recentBooks, setRecentBooks] = useState<any[]>([]);
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [goalInput, setGoalInput] = useState('');
  const [goalSaving, setGoalSaving] = useState(false);

  // 목표/기록 탭용: 일별 독서 기록
  const [dailyHistory, setDailyHistory] = useState<string[]>([]);
  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  const [sessionsByDate, setSessionsByDate] = useState<{ [date: string]: any[] }>({});
  const [loadingSessions, setLoadingSessions] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const db = await DatabaseService.getInstance();
      // 연간 목표(settings 테이블에서 불러오기)
      let goal = 24;
      try {
        const setting = await db.getSetting('yearly_goal');
        if (setting && setting.value && !isNaN(Number(setting.value))) {
          goal = Number(setting.value);
        }
      } catch (e) {
        // 무시하고 기본값 사용
      }
      setYearlyGoal(goal);
      // 누적 통계
      const total = await db.getTotalStats();
      setTotalMinutes(total.totalMinutes);
      setTotalPages(total.totalPages);
      // status가 completed 또는 reading인 책의 전체 페이지 합계
      const totalBookPages = await db.getTotalBookPages();
      setTotalBookPages(totalBookPages);
      // 월별 통계
      const monthly = await db.getMonthlyStats(selectedYear);
      setMonthlyStats(monthly);
      // 최근 읽은 책
      const recent = await db.getRecentBooks(3);
      setRecentBooks(recent);
      // 장르별 통계
      const genreStats = await db.getGenreStats();
      setGenres(genreStats);
      // 읽은 책 수(상태: finished, 올해)
      const finishedCount = await db.getBooksReadCount(selectedYear);
      setBooksRead(finishedCount);
      // streak 계산 함수 구현
      const streakStats = await db.getStreakStats();
      setCurrentStreak(streakStats.currentStreak);
      setLongestStreak(streakStats.longestStreak);
      setLoading(false);
    };
    fetchStats();
  }, [selectedYear]);

  useEffect(() => {
    if (selectedTab === 'goals' || selectedTab === 'history') {
      (async () => {
        const db = await DatabaseService.getInstance();
        const days = await db.getDailyHistory();
        setDailyHistory(days.reverse()); // 최신순
      })();
    }
  }, [selectedTab]);

  const handleToggleDate = async (date: string) => {
    if (expandedDate === date) {
      setExpandedDate(null);
      return;
    }
    setExpandedDate(date);
    if (!sessionsByDate[date]) {
      setLoadingSessions(true);
      const db = await DatabaseService.getInstance();
      const sessions = await db.getSessionsByDate(date);
      setSessionsByDate(prev => ({ ...prev, [date]: sessions }));
      setLoadingSessions(false);
    }
  };

  const progressPercentage = yearlyGoal ? (booksRead / yearlyGoal) * 100 : 0;

  const handleShareStats = async () => {
    const statsText = `📚 ${selectedYear}년 독서 현황\n✅ 읽은 책: ${booksRead}/${yearlyGoal}권\n⏰ 총 독서시간: ${Math.floor(totalMinutes / 60)}시간 ${totalMinutes % 60}분\n📖 총 페이지: ${totalPages.toLocaleString()}페이지\n🔥 현재 연속 독서: ${currentStreak}일\n\n#독서기록 #리브노트`;
    try {
      await Share.share({ message: statsText });
    } catch (e) {
      setSnackbar({ visible: true, message: '공유에 실패했습니다.' });
    }
  };

  // 연간 목표 저장 핸들러
  const handleSaveGoal = async () => {
    const newGoal = Number(goalInput);
    if (isNaN(newGoal) || newGoal < 1 || newGoal > 999) {
      setSnackbar({ visible: true, message: '1~999 사이의 숫자를 입력하세요.' });
      return;
    }
    setGoalSaving(true);
    try {
      const db = await DatabaseService.getInstance();
      await db.setSetting('yearly_goal', String(newGoal));
      setYearlyGoal(newGoal);
      setGoalModalVisible(false);
      setSnackbar({ visible: true, message: '연간 목표가 저장되었습니다.' });
    } catch (e) {
      setSnackbar({ visible: true, message: '저장에 실패했습니다.' });
    } finally {
      setGoalSaving(false);
    }
  };

  // k 단위 포맷 함수 추가
  const formatPages = (num: number) => {
    if (num >= 1000) {
      return `${Math.floor(num / 1000).toLocaleString()}k`;
    }
    return num.toLocaleString();
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
                <Text style={styles.statNumber}>{booksRead.toLocaleString()}</Text>
                <Text style={styles.statLabel}>읽은 책</Text>
                <Text style={styles.statSubtext}>목표 {yearlyGoal.toLocaleString()}권</Text>
              </View>
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <FontAwesome name="clock-o" size={24} color="#8b5cf6" />
                </View>
                <Text style={styles.statNumber}>{Math.floor(totalMinutes / 60).toLocaleString()}</Text>
                <Text style={styles.statLabel}>독서 시간</Text>
                <Text style={styles.statSubtext}>시간</Text>
              </View>
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Feather name="trending-up" size={24} color="#10b981" />
                </View>
                <Text style={styles.statNumber}>{currentStreak.toLocaleString()}</Text>
                <Text style={styles.statLabel}>연속 기록</Text>
                <Text style={styles.statSubtext}>일</Text>
              </View>
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <MaterialIcons name="bar-chart" size={24} color="#f59e0b" />
                </View>
                <Text style={styles.statNumber}>{formatPages(totalPages)}</Text>
                <Text style={styles.statLabel}>실제 읽은 페이지</Text>
                <Text style={styles.statSubtext}>페이지</Text>
              </View>
            </View>
            {/* 목표 진행률 */}
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>올해 목표 진행률</Text>
                <Text style={styles.progressPercentage}>{Math.round(progressPercentage).toLocaleString()}%</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
                </View>
              </View>
              <Text style={styles.progressText}>
                {booksRead.toLocaleString()}권 완료 • {(yearlyGoal - booksRead).toLocaleString()}권 남음
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

        {/* 목표 탭 */}
        {selectedTab === 'goals' && (
          <View style={styles.overviewContainer}>
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>연간 목표</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.progressPercentage}>{booksRead.toLocaleString()}/{yearlyGoal.toLocaleString()}권</Text>
                  <TouchableOpacity onPress={() => { setGoalInput(String(yearlyGoal)); setGoalModalVisible(true); }} style={{ marginLeft: 8 }}>
                    <Feather name="edit-2" size={18} color="#2563eb" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
                </View>
              </View>
              <Text style={styles.progressText}>
                {booksRead.toLocaleString()}권 완료 • {(yearlyGoal - booksRead).toLocaleString()}권 남음
              </Text>
            </View>
            {/* 연간 목표 변경 모달 */}
            <Modal
              visible={goalModalVisible}
              transparent
              animationType="fade"
              onRequestClose={() => setGoalModalVisible(false)}
            >
              <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, width: 300, alignItems: 'center' }}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>연간 목표 수정</Text>
                  <TextInput
                    value={goalInput}
                    onChangeText={setGoalInput}
                    keyboardType="number-pad"
                    maxLength={3}
                    style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, width: '100%', padding: 12, fontSize: 16, marginBottom: 16, textAlign: 'center' }}
                    placeholder="목표 권수 입력 (1~999)"
                  />
                  <TouchableOpacity
                    onPress={handleSaveGoal}
                    disabled={goalSaving}
                    style={{ backgroundColor: '#2563eb', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 32, width: '100%', alignItems: 'center', opacity: goalSaving ? 0.6 : 1 }}
                  >
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{goalSaving ? '저장 중...' : '저장'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setGoalModalVisible(false)} style={{ marginTop: 12 }}>
                    <Text style={{ color: '#6b7280' }}>취소</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>연속 기록</Text>
                <Text style={styles.progressPercentage}>{currentStreak.toLocaleString()}일</Text>
              </View>
              <Text style={styles.progressText}>최장 연속 기록: {longestStreak.toLocaleString()}일</Text>
            </View>
          </View>
        )}
        {/* 기록 탭 */}
        {selectedTab === 'history' && (
          <View style={styles.overviewContainer}>
            <View style={styles.progressCard}>
              <Text style={styles.progressTitle}>일별 독서 기록</Text>
              {dailyHistory.length === 0 ? (
                <Text style={styles.progressText}>독서 기록이 없습니다.</Text>
              ) : (
                dailyHistory.map(date => (
                  <View key={date} style={{ marginBottom: 12 }}>
                    <TouchableOpacity
                      onPress={() => handleToggleDate(date)}
                      style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }}
                    >
                      <Text style={{ fontSize: 15, color: '#1e293b', fontWeight: '600' }}>{date}</Text>
                      <Feather name={expandedDate === date ? 'chevron-up' : 'chevron-down'} size={20} color="#2563eb" />
                    </TouchableOpacity>
                    {expandedDate === date && (
                      loadingSessions ? (
                        <ActivityIndicator size="small" color="#2563eb" style={{ marginVertical: 8 }} />
                      ) : (
                        (sessionsByDate[date] && sessionsByDate[date].length > 0) ? (
                          sessionsByDate[date].map((item: any) => (
                            <View key={item.id} style={{ backgroundColor: '#f8fafc', borderRadius: 10, padding: 12, marginBottom: 6, marginLeft: 8 }}>
                              <Text style={{ fontWeight: '600', color: '#1e293b', fontSize: 15, marginBottom: 2 }} numberOfLines={2} ellipsizeMode="tail">{item.book_title}</Text>
                              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                                <Text style={{ fontSize: 12, color: '#64748b' }}>{item.start_time?.slice(11,16)} - {item.end_time?.slice(11,16)}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                  <View style={{ borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, backgroundColor: '#e0e7ff', marginLeft: 0 }}><Text style={{ color: '#3730a3', fontSize: 12, fontWeight: '500' }}>{`${item.duration_minutes}분`}</Text></View>
                                  {item.pages_read > 0 && (
                                    <View style={{ borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, backgroundColor: '#e0e7ff', marginLeft: 4 }}><Text style={{ color: '#3730a3', fontSize: 12, fontWeight: '500' }}>{`${item.pages_read}페이지`}</Text></View>
                                  )}
                                </View>
                              </View>
                              {item.memo ? (
                                <Text style={{ fontSize: 14, color: '#334155', marginTop: 2 }}>{item.memo}</Text>
                              ) : null}
                            </View>
                          ))
                        ) : (
                          <Text style={{ color: '#888', marginLeft: 8, marginBottom: 8 }}>기록이 없습니다.</Text>
                        )
                      )
                    )}
                    <View style={{ height: 1, backgroundColor: '#e5e7eb', marginTop: 6 }} />
                  </View>
                ))
              )}
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