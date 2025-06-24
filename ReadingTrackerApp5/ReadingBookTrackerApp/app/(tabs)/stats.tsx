import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useBookContext, Book } from '../../contexts/BookContext';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Badge from '../../components/ui/Badge';

const StatCard = ({ icon, label, value, unit }: { icon: any, label: string, value: string | number, unit?: string }) => (
  <View style={styles.statCard}>
    <Feather name={icon} size={24} color="#6B7280" />
    <Text style={styles.statLabel}>{label}</Text>
    <View style={styles.statValueContainer}>
      <Text style={styles.statValue}>{value}</Text>
      {unit && <Text style={styles.statUnit}> {unit}</Text>}
    </View>
  </View>
);

export default function ReadingStatsScreen() {
  const { books } = useBookContext();
  const router = useRouter();
  
  const totalBooks = books.length;
  const statusCounts = {
    '읽고 싶은': books.filter((b: Book) => b.status === '읽고 싶은').length,
    '읽는 중': books.filter((b: Book) => b.status === '읽는 중').length,
    '다 읽은': books.filter((b: Book) => b.status === '다 읽은').length,
  };

  const totalReadingTimeInSeconds = books.reduce((total, book) => {
    return total + (book.readingRecords?.reduce((bookTotal, record) => bookTotal + record.readingTimeInSeconds, 0) || 0);
  }, 0);

  const hours = Math.floor(totalReadingTimeInSeconds / 3600);
  const minutes = Math.floor((totalReadingTimeInSeconds % 3600) / 60);

  const allTags = books.flatMap(book => 
    [...book.quotes.flatMap(q => q.tags), ...book.notes.flatMap(n => n.tags)]
  );

  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.header}>나의 독서 기록</Text>
        
        <View style={styles.mainStatsContainer}>
          <StatCard icon="book-open" label="총 등록 도서" value={totalBooks} unit="권" />
          <StatCard icon="clock" label="총 독서 시간" value={`${hours}시간 ${minutes}`} unit="분" />
        </View>

        <Text style={styles.subHeader}>상태별 도서</Text>
        <View style={styles.statusGrid}>
          <StatCard icon="bookmark" label="읽고 싶은" value={statusCounts['읽고 싶은']} unit="권" />
          <StatCard icon="book" label="읽는 중" value={statusCounts['읽는 중']} unit="권" />
          <StatCard icon="check-square" label="다 읽은" value={statusCounts['다 읽은']} unit="권" />
        </View>

        <Text style={styles.subHeader}>태그 클라우드</Text>
        <View style={styles.tagCloudContainer}>
          {sortedTags.map(([tag, count]) => (
            <TouchableOpacity key={tag} onPress={() => router.push(`/tag/${encodeURIComponent(tag)}` as any)}>
              <Badge style={styles.tagBadge}>
                <Text style={styles.tagBadgeText}>{tag} ({count})</Text>
              </Badge>
            </TouchableOpacity>
          ))}
          {sortedTags.length === 0 && <Text style={styles.noTagsText}>기록된 태그가 없습니다.</Text>}
        </View>

        {/* TODO: Add charts for monthly reading and tags */}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F9FAFB' 
  },
  contentContainer: { 
    padding: 24 
  },
  header: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 24, 
    color: '#1F2937' 
  },
  subHeader: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 32,
    marginBottom: 16,
    color: '#374151',
  },
  mainStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 16,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    minWidth: '45%', // Ensure at least two cards per row
    marginBottom: 16,
  },
  statLabel: { 
    fontSize: 14, 
    color: '#6B7280', 
    marginTop: 8, 
    marginBottom: 4 
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  statValue: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    color: '#1F2937' 
  },
  statUnit: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 4,
    marginBottom: 4,
  },
  tagCloudContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tagBadge: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  tagBadgeText: {
    color: '#4338CA',
    fontWeight: '600',
  },
  noTagsText: {
    color: '#9CA3AF',
    fontStyle: 'italic',
  }
}); 