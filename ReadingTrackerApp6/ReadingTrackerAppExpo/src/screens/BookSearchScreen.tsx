import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Keyboard, SafeAreaView } from 'react-native';
import { Card, Button, Snackbar } from 'react-native-paper';
import { Feather, MaterialIcons } from '@expo/vector-icons';

const mockSearch = (query: string) => {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      if (!query) return resolve([]);
      resolve([
        {
          id: 1,
          title: query,
          author: '저자명',
          isbn: '9788934942467',
          publisher: '출판사',
          publishedYear: '2023',
        },
        {
          id: 2,
          title: `${query} 시리즈`,
          author: '다른 저자',
          isbn: '9788934942468',
          publisher: '다른 출판사',
          publishedYear: '2022',
        },
        {
          id: 3,
          title: `완전한 ${query}`,
          author: '또 다른 저자',
          isbn: '9788934942469',
          publisher: '새로운 출판사',
          publishedYear: '2021',
        },
      ]);
    }, 1000);
  });
};

const BookSearchScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string }>({ visible: false, message: '' });

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    Keyboard.dismiss();
    const results = await mockSearch(searchQuery.trim());
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleAddBook = (book: any) => {
    setSnackbar({ visible: true, message: `"${book.title}"이(가) 서재에 추가되었습니다!` });
    navigation.goBack && navigation.goBack();
  };

  const handleManualAdd = () => {
    navigation.navigate && navigation.navigate('AddBook');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack && navigation.goBack()} style={styles.backBtn}>
            <Feather name="arrow-left" size={24} color="#222" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>책 검색</Text>
        </View>
        {/* Search Input */}
        <View style={styles.searchRow}>
          <TextInput
            style={styles.input}
            placeholder="책 제목이나 저자를 검색하세요"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <Button mode="contained" onPress={handleSearch} loading={isSearching} style={styles.searchBtn}>
            <Feather name="search" size={20} color="#fff" />
          </Button>
        </View>
        {/* Manual Add */}
        <Button mode="outlined" onPress={handleManualAdd} style={styles.manualBtn} icon="plus">
          직접 입력으로 책 추가하기
        </Button>
        {/* Results */}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.resultsContainer}>
          {isSearching && (
            <View style={styles.centered}><ActivityIndicator size="large" color="#1976d2" /><Text style={styles.loadingText}>검색 중...</Text></View>
          )}
          {!isSearching && searchResults.length > 0 && searchResults.map((book) => (
            <Card key={book.id} style={styles.card}>
              <Card.Content style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.bookIconWrap}>
                  <MaterialIcons name="menu-book" size={36} color="#90a4ae" />
                </View>
                <View style={{ flex: 1, marginLeft: 16 }}>
                  <Text style={styles.bookTitle}>{book.title}</Text>
                  <Text style={styles.bookAuthor}>{book.author}</Text>
                  <Text style={styles.bookMeta}>{book.publisher} · {book.publishedYear}</Text>
                  <Button mode="contained" onPress={() => handleAddBook(book)} style={styles.addBtn} icon="plus">
                    서재에 추가
                  </Button>
                </View>
              </Card.Content>
            </Card>
          ))}
          {!isSearching && searchQuery && searchResults.length === 0 && (
            <View style={styles.centered}>
              <MaterialIcons name="menu-book" size={48} color="#e0e0e0" />
              <Text style={styles.emptyText}>검색 결과가 없습니다</Text>
              <Text style={styles.emptySubText}>다른 키워드로 검색해보세요</Text>
            </View>
          )}
        </ScrollView>
        <Snackbar
          visible={snackbar.visible}
          onDismiss={() => setSnackbar({ visible: false, message: '' })}
          duration={2000}
        >
          {snackbar.message}
        </Snackbar>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#e0e0e0' },
  backBtn: { marginRight: 12, padding: 4, borderRadius: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#222' },
  searchRow: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingBottom: 0 },
  input: { flex: 1, height: 48, backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 16, fontSize: 16, borderWidth: 1, borderColor: '#e0e0e0', marginRight: 8 },
  searchBtn: { height: 48, justifyContent: 'center' },
  manualBtn: { margin: 16, marginBottom: 0 },
  resultsContainer: { padding: 16, paddingTop: 8 },
  card: { marginBottom: 16, borderRadius: 12, overflow: 'hidden' },
  bookIconWrap: { width: 48, height: 64, backgroundColor: '#eceff1', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  bookTitle: { fontSize: 17, fontWeight: 'bold', color: '#222' },
  bookAuthor: { color: '#607d8b', marginTop: 2 },
  bookMeta: { color: '#90a4ae', fontSize: 13, marginBottom: 8 },
  addBtn: { alignSelf: 'flex-start', marginTop: 4 },
  centered: { alignItems: 'center', justifyContent: 'center', marginTop: 48 },
  loadingText: { marginTop: 12, color: '#1976d2' },
  emptyText: { marginTop: 12, fontSize: 16, color: '#757575' },
  emptySubText: { color: '#bdbdbd', fontSize: 13, marginTop: 2 },
});

export default BookSearchScreen; 