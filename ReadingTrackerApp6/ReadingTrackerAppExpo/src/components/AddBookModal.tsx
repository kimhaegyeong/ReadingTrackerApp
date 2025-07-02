import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  coverUrl: string | null;
  publisher: string;
  publishedYear: string;
  genre: string;
}

interface AddBookModalProps {
  visible: boolean;
  onDismiss: () => void;
  onAddBook: (book: Book) => void;
}

const AddBookModal = ({ visible, onDismiss, onAddBook }: AddBookModalProps) => {
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const [manualBook, setManualBook] = useState({
    title: '',
    author: '',
    isbn: '',
    pages: '',
    genre: '',
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
          genre: '소설',
        },
        {
          id: 2,
          title: `${searchQuery} 시리즈`,
          author: '다른 저자',
          isbn: '9788934942468',
          coverUrl: null,
          publisher: '다른 출판사',
          publishedYear: '2022',
          genre: '에세이',
        },
      ];
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1000);
  };

  const handleAddFromSearch = (book: Book) => {
    onAddBook(book);
    onDismiss();
    setSearchQuery('');
    setSearchResults([]);
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
      genre: manualBook.genre,
    };
    onAddBook(newBook);
    onDismiss();
    setManualBook({ title: '', author: '', isbn: '', pages: '', genre: '' });
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
    <Modal
      visible={visible}
      onRequestClose={onDismiss}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Ionicons name="add" size={24} color="#2563eb" />
              <Text style={styles.headerTitle}>새 책 추가</Text>
            </View>
            <TouchableOpacity onPress={onDismiss}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

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
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                      placeholder="책 제목이나 저자를 검색하세요"
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      onSubmitEditing={handleSearch}
                      style={[styles.searchInput, { flex: 1 }]}
                      editable={!isSearching}
                      returnKeyType="search"
                    />
                    <TouchableOpacity onPress={handleSearch} disabled={isSearching} style={{ marginLeft: 8 }}>
                      <Ionicons name="search" size={22} color={isSearching ? '#d1d5db' : '#2563eb'} />
                    </TouchableOpacity>
                  </View>
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
                      <View key={book.id} style={styles.resultCard}>
                        <View style={styles.resultContent}>
                          <View style={styles.resultInfo}>
                            <View style={styles.bookCover}>
                              <Ionicons name="book" size={24} color="#9ca3af" />
                            </View>
                            <View style={styles.bookInfo}>
                              <Text style={styles.bookTitle}>{book.title}</Text>
                              <Text style={styles.bookAuthor}>{book.author}</Text>
                              <Text style={styles.bookPublisher}>
                                {book.publisher} · {book.publishedYear}
                              </Text>
                            </View>
                          </View>
                          <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => handleAddFromSearch(book)}
                          >
                            <Text style={styles.addButtonText}>추가</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.manualContent}>
                <TextInput
                  placeholder="책 제목을 입력하세요 *"
                  value={manualBook.title}
                  onChangeText={(text) => setManualBook({ ...manualBook, title: text })}
                  style={styles.input}
                />
                <TextInput
                  placeholder="저자명을 입력하세요 *"
                  value={manualBook.author}
                  onChangeText={(text) => setManualBook({ ...manualBook, author: text })}
                  style={styles.input}
                />
                <TextInput
                  placeholder="ISBN (선택)"
                  value={manualBook.isbn}
                  onChangeText={(text) => setManualBook({ ...manualBook, isbn: text })}
                  style={styles.input}
                />
                <TextInput
                  placeholder="페이지 수 (선택)"
                  value={manualBook.pages}
                  onChangeText={(text) => setManualBook({ ...manualBook, pages: text })}
                  keyboardType="numeric"
                  style={styles.input}
                />
                <TextInput
                  placeholder="장르 (예: 소설, 에세이 등)"
                  value={manualBook.genre}
                  onChangeText={(text) => setManualBook({ ...manualBook, genre: text })}
                  style={styles.input}
                />
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleManualAdd}
                >
                  <Text style={styles.submitButtonText}>서재에 추가</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    maxWidth: '100%',
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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
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
    maxWidth: '100%',
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
    maxWidth: '100%',
  },
  resultInfo: {
    flexDirection: 'row',
    flex: 1,
    minWidth: 0,
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
    minWidth: 0,
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
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  manualContent: {
    flex: 1,
    maxWidth: '100%',
  },
  input: {
    backgroundColor: 'white',
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#2563eb',
    marginTop: 16,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
});

export default AddBookModal; 