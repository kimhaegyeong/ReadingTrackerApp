import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Share } from 'react-native';
import { Card, Button, Snackbar } from 'react-native-paper';
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack && navigation.goBack()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color="#222" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>독서 통계</Text>
          <Text style={styles.headerSub}>{selectedYear}년 독서 현황을 확인하세요</Text>
        </View>
        <Button mode="contained" onPress={handleShareStats} style={styles.shareBtn} icon="share-variant">
          공유하기
        </Button>
      </View>
      {/* Tabs */}
      <View style={styles.tabsRow}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabBtn, selectedTab === tab.key && styles.tabBtnActive]}
            onPress={() => setSelectedTab(tab.key)}
          >
            <Text style={[styles.tabLabel, selectedTab === tab.key && styles.tabLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
        {/* 개요 탭 */}
        {selectedTab === 'overview' && (
          <View>
            <View style={styles.cardsRow}>
              <Card style={styles.card}><Card.Content>
                <Text style={styles.cardLabel}>읽은 책</Text>
                <View style={styles.cardValueRow}>
                  <Text style={styles.cardValue}>{mockData.booksRead}</Text>
                  <Text style={styles.cardValueSub}>/ {mockData.yearlyGoal}권</Text>
                  <MaterialIcons name="menu-book" size={28} color="#3B82F6" style={{ marginLeft: 8 }} />
                </View>
                <View style={styles.progressBarWrap}>
                  <View style={[styles.progressBar, { width: `${progressPercentage}%` }]} />
                </View>
              </Card.Content></Card>
              <Card style={styles.card}><Card.Content>
                <Text style={styles.cardLabel}>독서 시간</Text>
                <View style={styles.cardValueRow}>
                  <Text style={styles.cardValue}>{Math.floor(mockData.totalMinutes / 60)}h {mockData.totalMinutes % 60}m</Text>
                  <FontAwesome name="clock-o" size={28} color="#8B5CF6" style={{ marginLeft: 8 }} />
                </View>
              </Card.Content></Card>
            </View>
            <View style={styles.cardsRow}>
              <Card style={styles.card}><Card.Content>
                <Text style={styles.cardLabel}>연속 기록</Text>
                <View style={styles.cardValueRow}>
                  <Text style={styles.cardValue}>{mockData.currentStreak}일</Text>
                  <Feather name="trending-up" size={28} color="#10B981" style={{ marginLeft: 8 }} />
                </View>
              </Card.Content></Card>
              <Card style={styles.card}><Card.Content>
                <Text style={styles.cardLabel}>총 페이지</Text>
                <View style={styles.cardValueRow}>
                  <Text style={styles.cardValue}>{mockData.totalPages.toLocaleString()}</Text>
                  <MaterialIcons name="bar-chart" size={28} color="#F59E0B" style={{ marginLeft: 8 }} />
                </View>
              </Card.Content></Card>
            </View>
            {/* 최근 읽은 책 */}
            <Card style={styles.recentCard}><Card.Content>
              <Text style={styles.recentTitle}>최근 읽은 책</Text>
              {mockData.recentBooks.map((book, idx) => (
                <View key={idx} style={styles.recentBookRow}>
                  <View>
                    <Text style={styles.recentBookTitle}>{book.title}</Text>
                    <Text style={styles.recentBookAuthor}>{book.author}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {[...Array(5)].map((_, i) => (
                      <MaterialIcons
                        key={i}
                        name={i < book.rating ? 'star' : 'star-border'}
                        size={18}
                        color={i < book.rating ? '#FFD600' : '#E0E0E0'}
                      />
                    ))}
                  </View>
                </View>
              ))}
            </Card.Content></Card>
          </View>
        )}
        {/* 차트 탭 */}
        {selectedTab === 'charts' && (
          <View>
            <Text style={styles.chartTitle}>월별 독서량</Text>
            <BarChart
              data={{
                labels: mockData.sessions.map(s => s.month),
                datasets: [{ data: mockData.sessions.map(s => s.books) }]
              }}
              width={width - 32}
              height={220}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#f8fafc",
                backgroundGradientTo: "#f8fafc",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
                style: { borderRadius: 8 },
                propsForBackgroundLines: { stroke: "#e0e0e0" }
              }}
              style={{ borderRadius: 8 }}
            />
            <Text style={styles.chartTitle}>장르별 비율</Text>
            <PieChart
              data={mockData.genres.map(g => ({
                name: g.name,
                population: g.value,
                color: g.color,
                legendFontColor: "#374151",
                legendFontSize: 13
              }))}
              width={width - 32}
              height={220}
              chartConfig={{
                color: () => "#374151"
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
            />
          </View>
        )}
        {/* 목표 탭 */}
        {selectedTab === 'goals' && (
          <View style={{ marginTop: 16 }}>
            <Card style={styles.goalCard}><Card.Content>
              <Text style={styles.goalTitle}>올해 목표</Text>
              <Text style={styles.goalValue}>{mockData.yearlyGoal}권</Text>
              <Text style={styles.goalDesc}>올해 목표 달성까지 {mockData.yearlyGoal - mockData.booksRead}권 남았습니다!</Text>
            </Card.Content></Card>
          </View>
        )}
        {/* 기록 탭 */}
        {selectedTab === 'history' && (
          <View style={{ marginTop: 16 }}>
            <Card style={styles.historyCard}><Card.Content>
              <Text style={styles.historyTitle}>월별 독서 기록</Text>
              {mockData.sessions.map((s, idx) => (
                <View key={idx} style={styles.historyRow}>
                  <Text style={styles.historyMonth}>{s.month}</Text>
                  <Text style={styles.historyBooks}>{s.books}권</Text>
                  <Text style={styles.historyMinutes}>{s.minutes}분</Text>
                  <Text style={styles.historyPages}>{s.pages}p</Text>
                </View>
              ))}
            </Card.Content></Card>
          </View>
        )}
      </ScrollView>
      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ visible: false, message: '' })}
        duration={2000}
      >
        {snackbar.message}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#e0e0e0', justifyContent: 'space-between' },
  backBtn: { marginRight: 12, padding: 4, borderRadius: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#222' },
  headerSub: { fontSize: 13, color: '#607d8b', marginTop: 2 },
  shareBtn: { marginLeft: 8, height: 40, justifyContent: 'center' },
  tabsRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 4 },
  tabBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 8 },
  tabBtnActive: { backgroundColor: '#fff', borderBottomWidth: 2, borderColor: '#1976d2' },
  tabLabel: { color: '#607d8b', fontSize: 15 },
  tabLabelActive: { color: '#1976d2', fontWeight: 'bold' },
  scrollContent: { padding: 16, paddingBottom: 32 },
  cardsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  card: { flex: 1, marginRight: 8, borderRadius: 12, overflow: 'hidden' },
  recentCard: { marginTop: 12, borderRadius: 12 },
  recentTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  recentBookRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  recentBookTitle: { fontSize: 15, fontWeight: 'bold' },
  recentBookAuthor: { color: '#607d8b', fontSize: 13 },
  chartTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  goalCard: { borderRadius: 12 },
  goalTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  goalValue: { fontSize: 28, fontWeight: 'bold', color: '#1976d2', marginBottom: 4 },
  goalDesc: { color: '#607d8b', fontSize: 14 },
  historyCard: { borderRadius: 12 },
  historyTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  historyMonth: { flex: 1, fontWeight: 'bold', color: '#1976d2' },
  historyBooks: { flex: 1, textAlign: 'center' },
  historyMinutes: { flex: 1, textAlign: 'center' },
  historyPages: { flex: 1, textAlign: 'right' },
  cardLabel: { color: '#607d8b', fontSize: 13 },
  cardValueRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  cardValue: { fontSize: 22, fontWeight: 'bold', color: '#222' },
  cardValueSub: { fontSize: 15, color: '#90a4ae', marginLeft: 4 },
  progressBarWrap: { height: 8, backgroundColor: '#e0e0e0', borderRadius: 4, marginTop: 8, overflow: 'hidden' },
  progressBar: { height: 8, backgroundColor: '#3B82F6', borderRadius: 4 },
});

export default ReadingStatsScreen; 