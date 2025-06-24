import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function ReadingStats({ onBack }) {
  // 예시 데이터
  const stats = {
    totalBooks: 42,
    totalMinutes: 1234,
    monthlyBooks: 5,
    monthlyMinutes: 320,
    streak: 12,
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Feather name="arrow-left" size={22} color="#2563EB" onPress={onBack} style={styles.backBtn} />
        <Text style={styles.headerTitle}>독서 통계</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>총 읽은 책</Text>
          <Text style={styles.cardValue}>{stats.totalBooks}권</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>총 독서 시간</Text>
          <Text style={styles.cardValue}>{stats.totalMinutes}분</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>이번 달 읽은 책</Text>
          <Text style={styles.cardValue}>{stats.monthlyBooks}권</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>이번 달 독서 시간</Text>
          <Text style={styles.cardValue}>{stats.monthlyMinutes}분</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>연속 독서 일수</Text>
          <Text style={styles.cardValue}>{stats.streak}일</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFF', padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  backBtn: { marginRight: 8, padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#2563EB' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 24, marginBottom: 16, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  cardTitle: { fontSize: 15, color: '#888', marginBottom: 8 },
  cardValue: { fontSize: 28, fontWeight: 'bold', color: '#2563EB' },
});
