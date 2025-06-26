import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {
  Card,
  Title,
  TextInput,
  Button,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { BarChart, PieChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string | null;
  coverUrl: string | null;
  publisher: string;
  publishedYear: string;
}

const AddBookScreen = ({ navigation, route }: any) => {
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [manualBook, setManualBook] = useState({
    title: '',
    author: '',
    isbn: '',
    pages: '',
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      const mockResults: Book[] = [
        {
          id: 1,
          title: searchQuery,
          author: '저자명',
          isbn: '9788934942467',
          coverUrl: null,
          publisher: '출판사',
          publishedYear: '2023',
        },
        {
          id: 2,
          title: `${searchQuery} 시리즈`,
          author: '다른 저자',
          isbn: '9788934942468',
          coverUrl: null,
          publisher: '다른 출판사',
          publishedYear: '2022',
        },
      ];
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1000);
  };

  const handleAddFromSearch = (book: Book) => {
    // 실제로는 도서관/DB에 추가하는 로직 필요
    navigation.goBack && navigation.goBack();
  };

  const handleManualAdd = () => {
    if (!manualBook.title || !manualBook.author) {
      // Show error toast
      return;
    }
    const newBook: Book = {
      id: Date.now(),
      title: manualBook.title,
      author: manualBook.author,
      isbn: manualBook.isbn,
      coverUrl: null,
      publisher: '',
      publishedYear: '',
    };
    // 실제로는 도서관/DB에 추가하는 로직 필요
    navigation.goBack && navigation.goBack();
  };

  const TabButton = ({ title, value, isActive }: { title: string; value: string; isActive: boolean }) => (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.activeTabButton]}
      onPress={() => setActiveTab(value)}
    >
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TabButton title="검색해서 추가" value="search" isActive={activeTab === 'search'} />
        <TabButton title="직접 입력" value="manual" isActive={activeTab === 'manual'} />
      </View>
      <ScrollView style={styles.content}>
        {activeTab === 'search' ? (
          <View style={styles.searchContent}>
            {/* Search Input */}
            <View style={styles.searchInputContainer}>
              <TextInput
                placeholder="책 제목이나 저자를 검색하세요"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                style={styles.searchInput}
                right={
                  <TextInput.Icon
                    icon="magnify"
                    onPress={handleSearch}
                    disabled={isSearching}
                  />
                }
              />
            </View>
            {isSearching && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2563eb" />
                <Text style={styles.loadingText}>검색 중...</Text>
              </View>
            )}
            {searchResults.length > 0 && (
              <View style={styles.resultsContainer}>
                {searchResults.map((book) => (
                  <Card key={book.id} style={styles.resultCard}>
                    <Card.Content style={styles.resultContent}>
                      <View style={styles.resultInfo}>
                        <View style={styles.bookCover}>
                          <Ionicons name="book" size={24} color="#9ca3af" />
                        </View>
                        <View style={styles.bookInfo}>
                          <Title style={styles.bookTitle}>{book.title}</Title>
                          <Text style={styles.bookAuthor}>{book.author}</Text>
                          <Text style={styles.bookPublisher}>
                            {book.publisher} · {book.publishedYear}
                          </Text>
                        </View>
                      </View>
                      <Button
                        mode="contained"
                        onPress={() => handleAddFromSearch(book)}
                        style={styles.addButton}
                      >
                        추가
                      </Button>
                    </Card.Content>
                  </Card>
                ))}
              </View>
            )}
          </View>
        ) : (
          <View style={styles.manualContent}>
            <TextInput
              label="책 제목 *"
              placeholder="책 제목을 입력하세요"
              value={manualBook.title}
              onChangeText={(text) => setManualBook({...manualBook, title: text})}
              style={styles.input}
            />
            <TextInput
              label="저자 *"
              placeholder="저자명을 입력하세요"
              value={manualBook.author}
              onChangeText={(text) => setManualBook({...manualBook, author: text})}
              style={styles.input}
            />
            <TextInput
              label="ISBN (선택)"
              placeholder="ISBN을 입력하세요"
              value={manualBook.isbn}
              onChangeText={(text) => setManualBook({...manualBook, isbn: text})}
              style={styles.input}
            />
            <TextInput
              label="페이지 수 (선택)"
              placeholder="페이지 수를 입력하세요"
              value={manualBook.pages}
              onChangeText={(text) => setManualBook({...manualBook, pages: text})}
              keyboardType="numeric"
              style={styles.input}
            />
            <Button
              mode="contained"
              onPress={handleManualAdd}
              style={styles.submitButton}
              contentStyle={styles.submitButtonContent}
            >
              서재에 추가
            </Button>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    marginLeft: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTabButton: {
    backgroundColor: '#2563eb',
  },
  tabText: {
    fontSize: 14,
    color: '#64748b',
  },
  activeTabText: {
    color: 'white',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  searchContent: {
    flex: 1,
  },
  searchInputContainer: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: 'white',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    marginTop: 8,
    color: '#64748b',
  },
  resultsContainer: {
    flex: 1,
  },
  resultCard: {
    marginBottom: 12,
  },
  resultContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  bookCover: {
    width: 48,
    height: 64,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  bookPublisher: {
    fontSize: 12,
    color: '#9ca3af',
  },
  addButton: {
    backgroundColor: '#2563eb',
  },
  manualContent: {
    flex: 1,
  },
  input: {
    backgroundColor: 'white',
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#2563eb',
    marginTop: 16,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
});

export default AddBookScreen; 