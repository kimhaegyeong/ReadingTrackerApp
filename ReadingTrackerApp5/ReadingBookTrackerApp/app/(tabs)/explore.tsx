import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useBookContext, Book } from '@/contexts/BookContext';
import { searchAladinBooks, searchGoogleBooks, ExternalBook } from '@/lib/apis';
import BookSearchInput from '@/components/BookSearchInput';
import AddBookModal from '@/components/AddBookModal';
import BookPreviewModal from '@/components/BookPreviewModal';
import { Button } from '@/components/ui/Button';

export default function BookSearchScreen() {
  const { books, addBook } = useBookContext();
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ExternalBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [previewBook, setPreviewBook] = useState<ExternalBook | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    try {
      const [aladin, google] = await Promise.all([
        searchAladinBooks(query),
        searchGoogleBooks(query),
      ]);
      const merged = [...aladin, ...google].filter((b, idx, arr) => 
        arr.findIndex(x => x.id === b.id || (x.title === b.title && x.author === b.author)) === idx
      );
      setSearchResults(merged);
    } catch (e) {
      setError('도서 검색 API 호출에 실패했습니다.');
      console.error(e);
    }
    setLoading(false);
  };

  const handleAddBook = (book: ExternalBook) => {
    if (books.some((b: Book) => b.title === book.title && b.author === book.author)) return;
    addBook({
      title: book.title,
      author: book.author,
      status: '읽고 싶은',
      coverImage: book.thumbnail,
    });
  };

  const renderItem = ({ item }: { item: ExternalBook }) => {
    const isAdded = books.some((b: Book) => b.title === item.title && b.author === item.author);
    return (
      <TouchableOpacity style={styles.resultItem} onPress={() => setPreviewBook(item)}>
        {item.thumbnail && <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />}
        <View style={styles.bookInfo}>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.author}>{item.author}</Text>
          <Text style={styles.publisher}>{item.publisher} {item.publishedDate && `· ${item.publishedDate}`}</Text>
          <Text style={styles.source}>{item.source === 'aladin' ? '알라딘' : 'Google Books'}</Text>
        </View>
        <Button
          onPress={(e) => { e.stopPropagation(); handleAddBook(item); }}
          disabled={isAdded}
          style={isAdded ? styles.addedButton : styles.addButton}
          textStyle={isAdded ? styles.addedButtonText : styles.addButtonText}
        >
          {isAdded ? '등록됨' : '추가'}
        </Button>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>책 검색/등록</Text>
      </View>

      <View style={styles.searchContainer}>
        <BookSearchInput
          value={query}
          onChangeText={setQuery}
          placeholder="책 제목 또는 저자 검색"
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <Button onPress={handleSearch} style={styles.searchButton}>
          검색
        </Button>
        <Button onPress={() => setAddModalOpen(true)} style={styles.manualAddButton} textStyle={styles.manualAddButtonText}>
          직접 등록
        </Button>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#818CF8" />
          <Text style={styles.loadingText}>검색 중...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            query ? (
              <View style={styles.centerContainer}>
                <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
                <Text style={styles.emptySubText}>정확한 제목/저자명으로 다시 시도해보세요.</Text>
              </View>
            ) : <View style={styles.centerContainer}><Text style={styles.emptyText}>책 제목이나 저자명으로 검색해주세요.</Text></View>
          )}
        />
      )}

      <AddBookModal 
        visible={addModalOpen} 
        onClose={() => setAddModalOpen(false)} 
        onAddBook={(book) => {
            addBook(book);
            setAddModalOpen(false);
        }}
      />
      
      <BookPreviewModal
        book={previewBook}
        visible={!!previewBook}
        onClose={() => setPreviewBook(null)}
        onAddBook={(book) => {
            handleAddBook(book);
            setPreviewBook(null);
        }}
        isAdded={!!previewBook && books.some(b => b.title === previewBook.title && b.author === previewBook.author)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F9FAFB' 
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  searchContainer: { 
    padding: 16, 
    backgroundColor: '#fff',
  },
  searchButton: { 
    backgroundColor: '#818CF8', 
    marginTop: 8,
  },
  manualAddButton: { 
    backgroundColor: '#E5E7EB',
    marginTop: 8,
  },
  manualAddButtonText: {
    color: '#374151',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  loadingText: {
    color: '#818CF8',
    fontSize: 16,
    marginTop: 16,
  },
  errorText: { 
    color: '#EF4444', 
    fontSize: 16,
    textAlign: 'center',
  },
  emptyText: { 
    color: '#9CA3AF', 
    fontSize: 16,
    textAlign: 'center',
  },
  emptySubText: {
    color: '#BDBDBD',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
  },
  listContent: { 
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  resultItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    padding: 12, 
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  thumbnail: { 
    width: 48, 
    height: 64, 
    borderRadius: 6, 
    marginRight: 16 
  },
  bookInfo: { 
    flex: 1 
  },
  title: { 
    fontWeight: '600', 
    fontSize: 16, 
    marginBottom: 2,
    color: '#1F2937',
  },
  author: { 
    color: '#6B7280', 
    fontSize: 14,
    marginBottom: 2,
  },
  publisher: { 
    color: '#A3A3A3', 
    fontSize: 13,
    marginBottom: 2,
  },
  source: {
    color: '#818CF8',
    fontSize: 12,
  },
  addButton: { 
    paddingHorizontal: 12, 
    paddingVertical: 8,
    backgroundColor: '#818CF8',
  },
  addButtonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 14 
  },
  addedButton: { 
    backgroundColor: '#E5E7EB', 
    paddingHorizontal: 12, 
    paddingVertical: 8 
  },
  addedButtonText: { 
    color: '#A3A3A3', 
    fontWeight: 'bold', 
    fontSize: 14 
  },
});
