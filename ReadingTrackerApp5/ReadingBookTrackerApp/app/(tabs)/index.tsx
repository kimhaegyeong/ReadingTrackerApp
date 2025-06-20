import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useBookContext, BookStatus } from '@/contexts/BookContext';
import BookList from '@/components/BookList';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import BookSearchInput from '@/components/BookSearchInput';
import AddBookModal from '@/components/AddBookModal';
import { useRouter } from 'expo-router';

// Re-evaluating file to fix linter errors
const statusList: (BookStatus | '전체')[] = ["전체", "읽고 싶은", "읽는 중", "다 읽은"];
const sortList = ["최신순", "제목순", "저자순"];

export default function HomeScreen() {
  const { books, addBook } = useBookContext();
  const router = useRouter();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState<BookStatus | '전체'>("전체");
  const [sort, setSort] = useState("최신순");
  const [search, setSearch] = useState("");

  const handleAddBook = (book: { title: string; author: string; status: BookStatus }) => {
    addBook(book);
    // Maybe add a toast message later
  };

  const filteredBooks = useMemo(() => {
    let filtered = books;
    if (filter !== "전체") {
      filtered = filtered.filter(b => b.status === filter);
    }
    if (search.trim()) {
      const searchTerm = search.toLowerCase();
      filtered = filtered.filter(b => 
        b.title.toLowerCase().includes(searchTerm) || 
        b.author.toLowerCase().includes(searchTerm)
      );
    }
    
    switch (sort) {
      case "제목순":
        return [...filtered].sort((a, b) => a.title.localeCompare(b.title));
      case "저자순":
        return [...filtered].sort((a, b) => a.author.localeCompare(b.author));
      case "최신순":
      default:
        return [...filtered].sort((a, b) => Number(b.id.split('-')[0]) - Number(a.id.split('-')[0]));
    }
  }, [books, filter, search, sort]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>내 서재</Text>
        <View style={styles.headerButtons}>
            <Button onPress={() => router.push('/explore')} style={styles.searchButton} textStyle={styles.searchButtonText}>책 검색</Button>
        </View>
      </View>

      <View style={styles.filtersContainer}>
        <Text style={styles.filterTitle}>독서 상태</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {statusList.map(s => (
            <TouchableOpacity key={s} onPress={() => setFilter(s)} style={[styles.filterBadge, filter === s && styles.activeFilter]}>
                 <Text style={[styles.filterText, filter === s && styles.activeFilterText]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <View style={styles.controlsContainer}>
        <BookSearchInput
          value={search}
          onChangeText={setSearch}
          placeholder="내 서재에서 검색..."
        />
         <Button onPress={() => setModalOpen(true)} style={{ marginLeft: 8 }}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>+ 추가</Text>
        </Button>
      </View>
      
      <BookList books={filteredBooks} />

      <AddBookModal
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddBook={handleAddBook}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  searchButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: '#6B7280',
      marginBottom: 8,
  },
  filterBadge: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    marginRight: 8,
  },
  activeFilter: {
    backgroundColor: '#4F46E5',
  },
  filterText: {
      color: '#374151',
      fontWeight: '500',
  },
  activeFilterText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
  },
  controlsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
});
