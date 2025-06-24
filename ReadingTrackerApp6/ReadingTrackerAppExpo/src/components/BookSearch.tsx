import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { Feather, Ionicons, FontAwesome } from '@expo/vector-icons';

export default function BookSearch({ onBack }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      const mockResults = [
        { id: 1, title: searchQuery, author: '저자명', publisher: '출판사', publishedYear: '2023' },
        { id: 2, title: `${searchQuery} 시리즈`, author: '다른 저자', publisher: '다른 출판사', publishedYear: '2022' },
        { id: 3, title: `완전한 ${searchQuery}`, author: '또 다른 저자', publisher: '새로운 출판사', publishedYear: '2021' },
      ];
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1000);
  };

  const handleAddBook = (book) => {
    // TODO: 알림/추가 로직
    onBack();
  };

  const handleManualAdd = () => {
    // TODO: 알림/추가 로직
    onBack();
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color="#2563EB" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>책 검색</Text>
      </View>
      {/* 검색 입력 */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="책 제목이나 저자를 검색하세요"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch} disabled={isSearching}>
          <Ionicons name="search" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* 직접 입력 추가 버튼 */}
      <TouchableOpacity style={styles.manualBtn} onPress={handleManualAdd}>
        <Feather name="plus" size={18} color="#2563EB" style={{ marginRight: 6 }} />
        <Text style={styles.manualBtnText}>직접 입력으로 책 추가하기</Text>
      </TouchableOpacity>
      {/* 로딩 상태 */}
      {isSearching && (
        <View style={styles.centered}><ActivityIndicator size="small" color="#2563EB" /><Text style={{ marginTop: 8, color: '#666' }}>검색 중...</Text></View>
      )}
      {/* 검색 결과 */}
      {searchResults.length > 0 && !isSearching && (
        <ScrollView style={{ marginTop: 12 }}>
          <Text style={styles.resultTitle}>검색 결과</Text>
          {searchResults.map((book) => (
            <View key={book.id} style={styles.resultCard}>
              <View style={styles.resultCover}><FontAwesome name="book" size={24} color="#888" /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.resultBookTitle}>{book.title}</Text>
                <Text style={styles.resultAuthor}>{book.author}</Text>
                <Text style={styles.resultMeta}>{book.publisher} · {book.publishedYear}</Text>
              </View>
              <TouchableOpacity style={styles.resultAddBtn} onPress={() => handleAddBook(book)}>
                <Text style={styles.resultAddText}>추가</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
      {/* 검색 결과 없음 */}
      {searchQuery && searchResults.length === 0 && !isSearching && (
        <View style={styles.centered}>
          <FontAwesome name="book" size={48} color="#E5E7EB" style={{ marginBottom: 8 }} />
          <Text style={{ color: '#888' }}>검색 결과가 없습니다</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFF', padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backBtn: { marginRight: 8, padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#2563EB' },
  searchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  input: { flex: 1, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 10, backgroundColor: '#fff', fontSize: 16 },
  searchBtn: { marginLeft: 8, backgroundColor: '#2563EB', borderRadius: 8, padding: 10 },
  manualBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E0E7FF', borderRadius: 8, padding: 12, marginBottom: 8 },
  manualBtnText: { color: '#2563EB', fontWeight: 'bold', fontSize: 15 },
  centered: { alignItems: 'center', marginTop: 32 },
  resultTitle: { fontWeight: 'bold', fontSize: 16, color: '#2563EB', marginBottom: 8 },
  resultCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 8, padding: 12, marginBottom: 10 },
  resultCover: { width: 40, height: 52, backgroundColor: '#E5E7EB', borderRadius: 6, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  resultBookTitle: { fontWeight: 'bold', fontSize: 15, color: '#222' },
  resultAuthor: { color: '#666', fontSize: 13 },
  resultMeta: { color: '#888', fontSize: 12 },
  resultAddBtn: { backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12, marginLeft: 8 },
  resultAddText: { color: '#fff', fontWeight: 'bold' },
});
