import React, { useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Searchbar, Card, Text, Button, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SearchStackParamList } from '@/navigation/SearchStack';
import { useAppDispatch } from '@/store/hooks';
import { addBook } from '@/store/slices/booksSlice';
import { searchBooks } from '@/services/googleBooks';
import { SearchResult } from '@/services/googleBooks';
import NetInfo from '@react-native-community/netinfo';

type SearchBooksScreenNavigationProp = NativeStackNavigationProp<SearchStackParamList, 'SearchBooks'>;

export const SearchBooksScreen = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigation = useNavigation<SearchBooksScreenNavigationProp>();
  const dispatch = useAppDispatch();

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // 네트워크 연결 상태 확인
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        throw new Error('인터넷 연결을 확인해주세요.');
      }

      const searchResults = await searchBooks(query);
      if (searchResults.length === 0) {
        setError('검색 결과가 없습니다.');
        setResults([]);
      } else {
        setResults(searchResults);
      }
    } catch (err) {
      console.error('Search error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('책 검색 중 오류가 발생했습니다.');
      }
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = (book: SearchResult) => {
    dispatch(addBook({
      id: book.id,
      title: book.title,
      authors: book.authors,
      description: book.description,
      thumbnail: book.thumbnail,
      publishedDate: book.publishedDate,
      pageCount: book.pageCount,
      status: 'reading',
      currentPage: 0,
      startDate: new Date().toISOString(),
      endDate: null,
      rating: 0,
      review: '',
      bookmarks: [],
      reviews: [],
      readingSessions: [],
    }));
  };

  const handleManualEntry = () => {
    navigation.navigate('ManualBookEntry');
  };

  const renderBookItem = ({ item }: { item: SearchResult }) => (
    <Card style={styles.card}>
      <Card.Cover source={{ uri: item.thumbnail }} />
      <Card.Title title={item.title} subtitle={item.authors?.join(', ')} />
      <Card.Content>
        <Text numberOfLines={3}>{item.description}</Text>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => handleAddBook(item)}>내 서재에 추가</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="책 제목, 저자, ISBN으로 검색"
        onChangeText={setQuery}
        value={query}
        onSubmitEditing={handleSearch}
        style={styles.searchBar}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>검색 중...</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          renderItem={renderBookItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            !loading && !error ? (
              <Text style={styles.emptyText}>검색어를 입력해주세요.</Text>
            ) : null
          }
        />
      )}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleManualEntry}
        label="수동 등록"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  error: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
}); 