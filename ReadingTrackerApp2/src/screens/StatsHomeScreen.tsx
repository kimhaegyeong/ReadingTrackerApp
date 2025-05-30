import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { useAppSelector } from '@/store/hooks';
import { colors, spacing } from '@/theme';

export const StatsHomeScreen: React.FC = () => {
  const stats = useAppSelector((state) => state.stats);

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>이번 달 독서 현황</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.booksReadThisMonth}</Text>
              <Text style={styles.statLabel}>읽은 책</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.pagesReadThisMonth}</Text>
              <Text style={styles.statLabel}>읽은 페이지</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.readingTimeThisMonth}분</Text>
              <Text style={styles.statLabel}>독서 시간</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>올해 독서 현황</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.booksReadThisYear}</Text>
              <Text style={styles.statLabel}>읽은 책</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.pagesReadThisYear}</Text>
              <Text style={styles.statLabel}>읽은 페이지</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.readingTimeThisYear}분</Text>
              <Text style={styles.statLabel}>독서 시간</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>전체 독서 현황</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalBooksRead}</Text>
              <Text style={styles.statLabel}>읽은 책</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalPagesRead}</Text>
              <Text style={styles.statLabel}>읽은 페이지</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalReadingTime}분</Text>
              <Text style={styles.statLabel}>독서 시간</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    margin: spacing.medium,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.medium,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.xsmall,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
}); 