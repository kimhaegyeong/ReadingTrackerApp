import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Text, useTheme } from 'react-native-paper';
import { useAppSelector } from '@/store/hooks';

const StatsScreen = () => {
  const theme = useTheme();
  const stats = useAppSelector((state) => state.stats);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '없음';
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>전체 통계</Title>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>읽은 책</Text>
              <Text style={styles.statValue}>{stats.totalBooksRead}권</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>읽은 페이지</Text>
              <Text style={styles.statValue}>{stats.totalPagesRead}페이지</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>평균 평점</Text>
              <Text style={styles.statValue}>{stats.averageRating.toFixed(1)}점</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>연속 독서</Text>
              <Text style={styles.statValue}>{stats.readingStreak}일</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>이번 달 통계</Title>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>읽은 책</Text>
              <Text style={styles.statValue}>
                {stats.monthlyStats[new Date().toISOString().slice(0, 7)]?.booksRead || 0}권
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>읽은 페이지</Text>
              <Text style={styles.statValue}>
                {stats.monthlyStats[new Date().toISOString().slice(0, 7)]?.pagesRead || 0}페이지
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>올해 통계</Title>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>읽은 책</Text>
              <Text style={styles.statValue}>
                {stats.yearlyStats[new Date().getFullYear().toString()]?.booksRead || 0}권
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>읽은 페이지</Text>
              <Text style={styles.statValue}>
                {stats.yearlyStats[new Date().getFullYear().toString()]?.pagesRead || 0}페이지
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>마지막 독서</Title>
          <Text style={styles.lastReadDate}>
            {formatDate(stats.lastReadDate)}
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  lastReadDate: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default StatsScreen; 