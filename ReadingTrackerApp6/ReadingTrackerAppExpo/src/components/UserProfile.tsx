import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather, MaterialCommunityIcons, FontAwesome, Ionicons } from '@expo/vector-icons';

export default function UserProfile() {
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

  return (
    <ScrollView style={styles.container}>
      {/* 프로필 헤더 */}
      <View style={styles.profileCard}>
        <View style={styles.profileRow}>
          <View style={styles.profileIconBg}>
            <Feather name="book-open" size={40} color="#fff" />
          </View>
          <View>
            <Text style={styles.profileTitle}>독서 여정</Text>
            <Text style={styles.profileSubtitle}>지식과 함께 성장하는 중</Text>
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>🔥 {userStats.currentStreak}일 연속</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 이번 달 목표 */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>이번 달 목표</Text>
          <MaterialCommunityIcons name="target" size={20} color="#2563EB" />
        </View>
        <View style={{ marginTop: 8 }}>
          <View style={styles.goalRow}>
            <Text style={styles.goalValue}>{monthlyGoal.current} / {monthlyGoal.target}권</Text>
            <Text style={styles.goalPercent}>{monthlyGoal.percentage}% 달성</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBar, { width: `${monthlyGoal.percentage}%` }]} />
          </View>
          <Text style={styles.goalRemain}>목표까지 {monthlyGoal.target - monthlyGoal.current}권 남았어요!</Text>
        </View>
      </View>

      {/* 통계 그리드 */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Feather name="book-open" size={32} color="#2563EB" style={{ marginBottom: 4 }} />
          <Text style={styles.statValue}>{userStats.totalBooks}</Text>
          <Text style={styles.statLabel}>총 책 수</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="time-outline" size={32} color="#10B981" style={{ marginBottom: 4 }} />
          <Text style={styles.statValue}>{userStats.totalReadingTime}</Text>
          <Text style={styles.statLabel}>총 독서 시간</Text>
        </View>
        <View style={styles.statCard}>
          <FontAwesome name="quote-left" size={32} color="#8B5CF6" style={{ marginBottom: 4 }} />
          <Text style={styles.statValue}>{userStats.totalQuotes}</Text>
          <Text style={styles.statLabel}>인용문</Text>
        </View>
        <View style={styles.statCard}>
          <Feather name="file-text" size={32} color="#F59E42" style={{ marginBottom: 4 }} />
          <Text style={styles.statValue}>{userStats.totalNotes}</Text>
          <Text style={styles.statLabel}>메모</Text>
        </View>
      </View>

      {/* 독서 현황 */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Feather name="book-open" size={18} color="#2563EB" />
          <Text style={styles.cardTitle}>독서 현황</Text>
        </View>
        <View style={{ marginTop: 8 }}>
          <View style={styles.statusRow}><Text style={styles.statusLabel2}>완료한 책</Text><Text style={styles.statusValue}>{userStats.completedBooks}권</Text></View>
          <View style={styles.statusRow}><Text style={styles.statusLabel2}>읽는 중</Text><Text style={styles.statusValue}>{userStats.readingBooks}권</Text></View>
          <View style={styles.statusRow}><Text style={styles.statusLabel2}>읽고 싶은</Text><Text style={styles.statusValue}>{userStats.wantToReadBooks}권</Text></View>
        </View>
      </View>

      {/* 최근 달성 */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <FontAwesome name="trophy" size={18} color="#F59E42" />
          <Text style={styles.cardTitle}>최근 달성</Text>
        </View>
        <View style={{ marginTop: 8 }}>
          {recentAchievements.map((a) => (
            <View key={a.id} style={styles.achieveRow}>
              <Text style={styles.achieveIcon}>{a.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.achieveTitle}>{a.title}</Text>
                <Text style={styles.achieveDate}>{a.date}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 설정 버튼 */}
      <TouchableOpacity style={styles.settingsBtn}>
        <Ionicons name="settings-outline" size={18} color="#2563EB" style={{ marginRight: 6 }} />
        <Text style={styles.settingsBtnText}>설정</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFF' },
  profileCard: { backgroundColor: 'linear-gradient(90deg, #2563EB 0%, #8B5CF6 100%)', borderRadius: 12, padding: 20, margin: 16, marginBottom: 0, backgroundColor: '#2563EB' },
  profileRow: { flexDirection: 'row', alignItems: 'center' },
  profileIconBg: { width: 64, height: 64, backgroundColor: '#fff2', borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  profileTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  profileSubtitle: { color: '#dbeafe', fontSize: 14 },
  streakBadge: { backgroundColor: '#fff2', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, marginTop: 6, alignSelf: 'flex-start' },
  streakText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, margin: 16, marginBottom: 0, elevation: 2 },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  cardTitle: { fontWeight: 'bold', fontSize: 16, marginLeft: 6, color: '#2563EB' },
  goalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  goalValue: { fontSize: 20, fontWeight: 'bold', color: '#2563EB' },
  goalPercent: { color: '#888', fontSize: 13 },
  progressBarBg: { height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, marginTop: 6, overflow: 'hidden' },
  progressBar: { height: 6, backgroundColor: '#2563EB', borderRadius: 3 },
  goalRemain: { color: '#888', fontSize: 13, marginTop: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', margin: 16, marginTop: 12 },
  statCard: { flex: 1, alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12, padding: 16, margin: 4, minWidth: 120 },
  statValue: { fontWeight: 'bold', fontSize: 18, color: '#222' },
  statLabel: { color: '#888', fontSize: 13 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  statusLabel2: { color: '#666', fontSize: 14 },
  statusValue: { color: '#2563EB', fontWeight: 'bold', fontSize: 14 },
  achieveRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  achieveIcon: { fontSize: 22, marginRight: 8 },
  achieveTitle: { fontWeight: 'bold', color: '#222' },
  achieveDate: { color: '#888', fontSize: 12 },
  settingsBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E0E7FF', borderRadius: 20, padding: 12, margin: 24, marginTop: 20, justifyContent: 'center' },
  settingsBtnText: { color: '#2563EB', fontWeight: 'bold', fontSize: 16 },
});
