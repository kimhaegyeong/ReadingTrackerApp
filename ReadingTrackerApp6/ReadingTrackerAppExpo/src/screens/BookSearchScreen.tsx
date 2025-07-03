// @ts-ignore: 타입 선언은 src/types/env.d.ts에서 제공
import { ALADIN_API_KEY } from '@env';
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Keyboard, SafeAreaView, Alert, Image } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { DatabaseService } from '../DatabaseService';
import axios from 'axios';
import CustomCard from '../components/common/CustomCard';
import CustomButton from '../components/common/CustomButton';
import CustomBadge from '../components/common/CustomBadge';
import { formatNumber } from '../lib/utils';

const ALADIN_API_URL = 'https://www.aladin.co.kr/ttb/api/ItemSearch.aspx';

const searchBooksAladin = async (query: string) => {
  if (!query || query.trim().length < 2) {
    return { items: [], error: '검색어는 2글자 이상 입력하세요.' };
  }
  const params = {
    ttbkey: ALADIN_API_KEY,
    Query: query,
    QueryType: 'Title',
    MaxResults: 10,
    start: 1,
    SearchTarget: 'Book',
    output: 'js',
    Version: '20131101',
    Cover: 'Big',
  };
  try {
    const url = `${ALADIN_API_URL}?${Object.entries(params).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')}`;
    const res = await axios.get(url);
    if (res.status !== 200) {
      return { items: [], error: '도서 API 서버 오류가 발생했습니다.' };
    }
    const data = res.data;
    let resultObj;
    if (typeof data === 'object') {
      resultObj = data;
    } else {
      try {
        // eslint-disable-next-line no-eval
        resultObj = eval(data.replace(/^_ALADIN_BOOKSEARCH_CALLBACK_/, ''));
      } catch (e) {
        return { items: [], error: '검색 결과 파싱에 실패했습니다.' };
      }
    }
    if (!resultObj || !resultObj.item) {
      return { items: [], error: '검색 결과가 없습니다.' };
    }
    return { items: resultObj.item.map((item: any) => ({
      id: item.itemId,
      title: item.title,
      author: item.author,
      isbn: item.isbn13 || item.isbn,
      publisher: item.publisher,
      publishedYear: item.pubDate ? item.pubDate.split('-')[0] : '',
      cover: item.cover,
    })), error: null };
  } catch (e: any) {
    if (e.response && e.response.status === 429) {
      return { items: [], error: 'API 사용량 제한에 도달했습니다. 잠시 후 다시 시도하세요.' };
    }
    return { items: [], error: '네트워크 오류 또는 알 수 없는 오류가 발생했습니다.' };
  }
};

const BookSearchScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string }>({ visible: false, message: '' });
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchError('검색어는 2글자 이상 입력하세요.');
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    setSearchError(null);
    Keyboard.dismiss();
    const { items, error } = await searchBooksAladin(searchQuery.trim());
    setSearchResults(items);
    setSearchError(error);
    setIsSearching(false);
  };

  const handleAddBook = async (book: any) => {
    try {
      const db = await DatabaseService.getInstance();
      const existing = await db.getBookByUniqueKeys(book.title.trim(), book.author.trim(), book.isbn?.trim() || undefined);
      if (existing) {
        Alert.alert('중복 등록', '이미 등록된 책입니다.');
        return;
      }
      await db.addBook({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        pages: undefined,
        status: 'want-to-read',
        cover_color: undefined,
        cover: book.cover,
      });
      setSnackbar({ visible: true, message: `"${book.title}"이(가) 서재에 추가되었습니다!` });
      navigation.goBack && navigation.goBack();
    } catch (e) {
      Alert.alert('오류', '책 추가에 실패했습니다.');
    }
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
          <TouchableOpacity onPress={handleSearch} style={styles.searchBtn} disabled={isSearching}>
            {isSearching ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Feather name="search" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
        {/* Manual Add */}
        <TouchableOpacity onPress={handleManualAdd} style={styles.manualBtn}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Feather name="plus" size={18} color="#2563eb" />
            <Text style={{ color: '#2563eb', fontWeight: 'bold', marginLeft: 6 }}>직접 입력으로 책 추가하기</Text>
          </View>
        </TouchableOpacity>
        {/* Results */}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.resultsContainer}>
          {isSearching && (
            <View style={styles.centered}><ActivityIndicator size="large" color="#1976d2" /><Text style={styles.loadingText}>검색 중...</Text></View>
          )}
          {searchError && !isSearching && (
            <View style={styles.centered}>
              <MaterialIcons name="error-outline" size={36} color="#ef4444" />
              <Text style={{ color: '#ef4444', fontWeight: 'bold', marginTop: 8 }}>{searchError}</Text>
            </View>
          )}
          {!isSearching && !searchError && searchResults.length > 0 && searchResults.map((book) => (
            <CustomCard key={book.id}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.bookIconWrap}>
                  {book.cover ? (
                    <Image
                      source={{ uri: book.cover }}
                      style={{ width: 48, height: 70, borderRadius: 6, backgroundColor: '#eee' }}
                      resizeMode="cover"
                    />
                  ) : (
                    <MaterialIcons name="menu-book" size={36} color="#90a4ae" />
                  )}
                </View>
                <View style={{ flex: 1, marginLeft: 16 }}>
                  <Text style={styles.bookTitle}>{book.title}</Text>
                  <Text style={styles.bookAuthor}>{book.author}</Text>
                  <Text style={styles.bookMeta}>{book.publisher} · {book.publishedYear}</Text>
                  <TouchableOpacity onPress={() => handleAddBook(book)} style={styles.addBtn}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Feather name="plus" size={16} color="#fff" />
                      <Text style={{ color: '#fff', marginLeft: 6 }}>서재에 추가</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </CustomCard>
          ))}
          {!isSearching && !searchError && searchQuery && searchResults.length === 0 && (
            <View style={styles.centered}>
              <MaterialIcons name="menu-book" size={48} color="#e0e0e0" />
              <Text style={styles.emptyText}>검색 결과가 없습니다</Text>
              <Text style={styles.emptySubText}>다른 키워드로 검색해보세요</Text>
            </View>
          )}
        </ScrollView>
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
  input: {
    flex: 1,
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 8,
  },
  searchBtn: {
    height: 48,
    width: 48,
    borderRadius: 12,
    backgroundColor: '#1976d2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  manualBtn: {
    margin: 16,
    marginBottom: 0,
    borderWidth: 1.5,
    borderColor: '#2563eb',
    borderRadius: 12,
    height: 48,
    paddingVertical: 0,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  resultsContainer: { padding: 16, paddingTop: 8 },
  card: {
    marginBottom: 12,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    padding: 16,
  },
  bookIconWrap: { width: 48, height: 64, backgroundColor: '#eceff1', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  bookTitle: { fontSize: 17, fontWeight: 'bold', color: '#222' },
  bookAuthor: { color: '#607d8b', marginTop: 2 },
  bookMeta: { color: '#90a4ae', fontSize: 13, marginBottom: 8 },
  addBtn: {
    alignSelf: 'flex-start',
    marginTop: 4,
    backgroundColor: '#1976d2',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  centered: { alignItems: 'center', justifyContent: 'center', marginTop: 32 },
  loadingText: { marginTop: 12, color: '#1976d2' },
  emptyText: { marginTop: 12, fontSize: 16, color: '#757575' },
  emptySubText: { color: '#bdbdbd', fontSize: 13, marginTop: 2 },
});

export default BookSearchScreen; 