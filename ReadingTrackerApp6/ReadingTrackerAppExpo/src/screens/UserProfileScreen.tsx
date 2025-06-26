import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Card, Button, Divider } from 'react-native-paper';
import { Feather, MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';

const userStats = {
  totalBooks: 15,
  completedBooks: 8,
  readingBooks: 2,
  wantToReadBooks: 5,
  totalReadingTime: '127시간 32분',
  totalQuotes: 45,
  totalNotes: 28,
  currentStreak: 12,
};

const recentAchievements = [
  { id: 1, title: '첫 번째 완독', icon: '🏆', date: '2023-10-15' },
  { id: 2, title: '10권 돌파', icon: '📚', date: '2023-10-28' },
  { id: 3, title: '꾸준한 독서', icon: '🔥', date: '2023-11-01' },
];

const monthlyGoal = {
  target: 3,
  current: 1,
  percentage: 33,
};

const UserProfileScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
        {/* 프로필 헤더 */}
        <Card style={styles.profileCard}>
          <Card.Content style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.avatarWrap}>
              <MaterialIcons name="menu-book" size={40} color="#fff" />
            </View>
            <View style={{ marginLeft: 16 }}>
              <Text style={styles.profileName}>독서 여정</Text>
              <Text style={styles.profileDesc}>지식과 함께 성장하는 중</Text>
              <View style={styles.streakBadge}>
                <Text style={styles.streakText}>🔥 {userStats.currentStreak}일 연속</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        {/* 이번 달 목표 */}
        <Card style={styles.card}>
          <Card.Title title="이번 달 목표" left={props => <Feather name="target" size={20} color="#1976d2" />} />
          <Card.Content>
            <View style={styles.rowBetween}>
              <Text style={styles.goalValue}>{monthlyGoal.current} / {monthlyGoal.target}권</Text>
              <Text style={styles.goalPercent}>{monthlyGoal.percentage}% 달성</Text>
            </View>
            <View style={styles.progressBarWrap}>
              <View style={[styles.progressBar, { width: `${monthlyGoal.percentage}%` }]} />
            </View>
            <Text style={styles.goalDesc}>목표까지 {monthlyGoal.target - monthlyGoal.current}권 남았어요!</Text>
          </Card.Content>
        </Card>
        {/* 통계 그리드 */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}><Card.Content style={styles.statContent}>
            <MaterialIcons name="menu-book" size={28} color="#1976d2" style={{ marginBottom: 4 }} />
            <Text style={styles.statValue}>{userStats.totalBooks}</Text>
            <Text style={styles.statLabel}>총 책 수</Text>
          </Card.Content></Card>
          <Card style={styles.statCard}><Card.Content style={styles.statContent}>
            <FontAwesome name="clock-o" size={28} color="#43a047" style={{ marginBottom: 4 }} />
            <Text style={styles.statValue}>{userStats.totalReadingTime}</Text>
            <Text style={styles.statLabel}>총 독서 시간</Text>
          </Card.Content></Card>
          <Card style={styles.statCard}><Card.Content style={styles.statContent}>
            <MaterialIcons name="format-quote" size={28} color="#8B5CF6" style={{ marginBottom: 4 }} />
            <Text style={styles.statValue}>{userStats.totalQuotes}</Text>
            <Text style={styles.statLabel}>인용문</Text>
          </Card.Content></Card>
          <Card style={styles.statCard}><Card.Content style={styles.statContent}>
            <MaterialIcons name="sticky-note-2" size={28} color="#F59E0B" style={{ marginBottom: 4 }} />
            <Text style={styles.statValue}>{userStats.totalNotes}</Text>
            <Text style={styles.statLabel}>메모</Text>
          </Card.Content></Card>
        </View>
        {/* 독서 현황 */}
        <Card style={styles.card}>
          <Card.Title title="독서 현황" left={props => <MaterialIcons name="menu-book" size={20} color="#1976d2" />} />
          <Card.Content>
            <View style={styles.rowBetween}><Text style={styles.statusLabel}>완독한 책</Text><Text style={styles.statusValue}>{userStats.completedBooks}권</Text></View>
            <View style={styles.rowBetween}><Text style={styles.statusLabel}>읽는 중</Text><Text style={styles.statusValue}>{userStats.readingBooks}권</Text></View>
            <View style={styles.rowBetween}><Text style={styles.statusLabel}>읽고 싶은</Text><Text style={styles.statusValue}>{userStats.wantToReadBooks}권</Text></View>
          </Card.Content>
        </Card>
        {/* 최근 달성 */}
        <Card style={styles.card}>
          <Card.Title title="최근 달성" left={props => <MaterialIcons name="emoji-events" size={20} color="#F59E0B" />} />
          <Card.Content>
            {recentAchievements.map(a => (
              <View key={a.id} style={styles.achieveRow}>
                <Text style={styles.achieveIcon}>{a.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.achieveTitle}>{a.title}</Text>
                  <Text style={styles.achieveDate}>{a.date}</Text>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: { flex: 1, backgroundColor: '#f8fafc' },
  profileCard: { marginBottom: 18, borderRadius: 12, backgroundColor: 'linear-gradient(90deg, #1976d2 0%, #8B5CF6 100%)' },
  avatarWrap: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#8B5CF6', alignItems: 'center', justifyContent: 'center' },
  profileName: { fontSize: 20, fontWeight: 'bold', color: '#222' },
  profileDesc: { color: '#607d8b', fontSize: 13, marginTop: 2 },
  streakBadge: { backgroundColor: '#FFD600', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'flex-start', marginTop: 8 },
  streakText: { color: '#222', fontWeight: 'bold', fontSize: 13 },
  card: { marginBottom: 18, borderRadius: 12 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 8 },
  goalValue: { fontSize: 18, fontWeight: 'bold', color: '#1976d2' },
  goalPercent: { color: '#607d8b', fontSize: 13 },
  progressBarWrap: { height: 8, backgroundColor: '#e0e0e0', borderRadius: 4, marginTop: 8, overflow: 'hidden' },
  progressBar: { height: 8, backgroundColor: '#1976d2', borderRadius: 4 },
  goalDesc: { color: '#607d8b', fontSize: 13, marginTop: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 12 },
  statCard: { width: '48%', marginBottom: 12, borderRadius: 12 },
  statContent: { alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  statLabel: { color: '#607d8b', fontSize: 13 },
  statusLabel: { color: '#607d8b', fontSize: 15 },
  statusValue: { color: '#1976d2', fontWeight: 'bold', fontSize: 15 },
  achieveRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  achieveIcon: { fontSize: 22, marginRight: 8 },
  achieveTitle: { fontWeight: 'bold', color: '#222' },
  achieveDate: { color: '#607d8b', fontSize: 13 },
});

export default UserProfileScreen; 