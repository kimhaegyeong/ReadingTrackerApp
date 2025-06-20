import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useBookContext, Book } from '@/contexts/BookContext';

const sampleMonthly = [
  { month: '1월', count: 2 }, { month: '2월', count: 3 }, { month: '3월', count: 1 },
  { month: '4월', count: 4 }, { month: '5월', count: 2 }, { month: '6월', count: 5 },
];
const sampleTags = [
  { tag: '철학', count: 3 }, { tag: '명언', count: 2 }, { tag: '감상', count: 4 },
];

export default function ReadingStatsScreen() {
  const { books } = useBookContext();
  const total = books.length;
  const statusCounts = {
    '읽고 싶은': books.filter((b: Book) => b.status === '읽고 싶은').length,
    '읽는 중': books.filter((b: Book) => b.status === '읽는 중').length,
    '다 읽은': books.filter((b: Book) => b.status === '다 읽은').length,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.header}>통계 대시보드</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>전체 등록 도서</Text>
            <Text style={styles.summaryValue}>{total}</Text>
          </View>
        </View>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>읽고 싶은</Text>
            <Text style={styles.summaryValue}>{statusCounts['읽고 싶은']}</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>읽는 중</Text>
            <Text style={styles.summaryValue}>{statusCounts['읽는 중']}</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>다 읽은</Text>
            <Text style={styles.summaryValue}>{statusCounts['다 읽은']}</Text>
          </View>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>월별 독서량 (샘플)</Text>
          <View style={styles.barChart}>
            {sampleMonthly.map(m => (
              <View key={m.month} style={styles.barWrapper}>
                <View style={[styles.bar, { height: m.count * 20 }]} />
                <Text style={styles.barLabel}>{m.month}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>태그별 통계 (샘플)</Text>
          <View style={styles.tagGrid}>
            {sampleTags.map(t => (
              <View key={t.tag} style={styles.tagBox}>
                <Text style={styles.tagText}>{t.tag}</Text>
                <Text style={styles.tagCount}>{t.count}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  contentContainer: { padding: 16 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, color: '#1F2937' },
  summaryGrid: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  summaryBox: { flex: 1, backgroundColor: '#F3F4F6', borderRadius: 12, padding: 16, alignItems: 'center', marginHorizontal: 4 },
  summaryLabel: { fontSize: 14, color: '#6B7280', marginBottom: 6 },
  summaryValue: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
  chartContainer: { marginBottom: 32 },
  chartTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12, color: '#1F2937' },
  barChart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 150, borderBottomWidth: 1, borderColor: '#E5E7EB', paddingBottom: 8 },
  barWrapper: { flex: 1, alignItems: 'center' },
  bar: { width: '50%', backgroundColor: '#818CF8', borderRadius: 4 },
  barLabel: { fontSize: 12, color: '#6B7280', marginTop: 6 },
  tagGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' },
  tagBox: { backgroundColor: '#F472B6', borderRadius: 8, padding: 16, marginRight: 12, marginBottom: 12, alignItems: 'center' },
  tagText: { color: 'white', fontSize: 15 },
  tagCount: { color: 'white', fontSize: 20, fontWeight: 'bold', marginTop: 4 },
}); 