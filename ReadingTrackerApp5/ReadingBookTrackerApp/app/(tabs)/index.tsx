import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { useBookContext, BookStatus } from '@/contexts/BookContext';
import BookList from '@/components/BookList';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useRouter } from 'expo-router';

const statusList: BookStatus[] = ['읽고 싶은', '읽는 중', '다 읽은'];
const sortList = ['최신순', '제목순', '저자순'];

export default function HomeScreen() {
  const { books } = useBookContext();
  const router = useRouter();

  const [filter, setFilter] = useState<BookStatus | '전체'>('전체');
  const [sort, setSort] = useState('최신순');

  const filteredBooks = useMemo(() => {
    let filtered = filter === '전체' ? books : books.filter(b => b.status === filter);

    if (sort === '제목순') {
      return [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    }
    if (sort === '저자순') {
      return [...filtered].sort((a, b) => a.author.localeCompare(b.author));
    }
    // '최신순'
    return [...filtered].sort((a, b) => Number(b.id) - Number(a.id));
  }, [books, filter, sort]);

  const renderListHeader = () => (
    <>
      <Text style={styles.headerTitle}>내 서재</Text>
      <View style={styles.actionButtons}>
        <Button onPress={() => router.push('/explore' as any)}>책 검색</Button>
      </View>
      <View style={styles.filterContainer}>
        <TouchableOpacity onPress={() => setFilter('전체')}>
          <Badge style={filter === '전체' ? styles.activeFilter : styles.filter}>
            <Text style={filter === '전체' ? styles.activeFilterText : styles.filterText}>전체</Text>
          </Badge>
        </TouchableOpacity>
        {statusList.map(s => (
          <TouchableOpacity key={s} onPress={() => setFilter(s)}>
            <Badge style={filter === s ? styles.activeFilter : styles.filter}>
              <Text style={filter === s ? styles.activeFilterText : styles.filterText}>{s}</Text>
            </Badge>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.sortContainer}>
        {sortList.map(s => (
          <TouchableOpacity key={s} onPress={() => setSort(s)}>
            <Text style={[styles.sortText, sort === s && styles.activeSortText]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <BookList
        books={filteredBooks}
        ListHeaderComponent={renderListHeader}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingTop: 16,
    color: '#1F2937',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 16,
    flexWrap: 'wrap',
  },
  filter: {
    backgroundColor: '#E5E7EB',
    marginRight: 8,
    marginBottom: 8,
  },
  activeFilter: {
    backgroundColor: '#4F46E5',
    marginRight: 8,
    marginBottom: 8,
  },
  filterText: {
    color: '#374151',
  },
  activeFilterText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  sortContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 12,
  },
  sortText: {
    marginRight: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  activeSortText: {
    color: '#4F46E5',
    fontWeight: 'bold',
  },
});
