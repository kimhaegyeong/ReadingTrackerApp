import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import { useAppSelector } from '@/store/hooks';

export const StatsScreen = () => {
  const theme = useTheme();
  const books = useAppSelector((state) => state.books.books);

  const totalBooks = books.length;
  const completedBooks = books.filter(book => book.status === 'completed').length;
  const readingBooks = books.filter(book => book.status === 'reading').length;
  const plannedBooks = books.filter(book => book.status === 'planned').length;

  const totalPages = books.reduce((sum, book) => sum + (book.currentPage || 0), 0);

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>독서 통계</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalBooks}</Text>
              <Text style={styles.statLabel}>전체 도서</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{completedBooks}</Text>
              <Text style={styles.statLabel}>완독</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{readingBooks}</Text>
              <Text style={styles.statLabel}>읽는 중</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{plannedBooks}</Text>
              <Text style={styles.statLabel}>읽을 예정</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>페이지 통계</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalPages}</Text>
              <Text style={styles.statLabel}>총 읽은 페이지</Text>
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
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    marginBottom: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
}); 