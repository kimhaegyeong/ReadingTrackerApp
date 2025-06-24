import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { Feather, Ionicons, FontAwesome } from '@expo/vector-icons';

export default function AddBookDialog({ open, onOpenChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [manualBook, setManualBook] = useState({ title: '', author: '', isbn: '', pages: '' });
  const [tab, setTab] = useState('search');

  // Mock search function
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      const mockResults = [
        { id: 1, title: searchQuery, author: '저자명', publisher: '출판사', publishedYear: '2023' },
        { id: 2, title: `${searchQuery} 시리즈`, author: '다른 저자', publisher: '다른 출판사', publishedYear: '2022' },
      ];
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1000);
  };

  const handleAddFromSearch = (book) => {
    // TODO: 알림/추가 로직
    onOpenChange(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleManualAdd = () => {
    if (!manualBook.title || !manualBook.author) {
      // TODO: 알림
      return;
    }
    // TODO: 알림/추가 로직
    onOpenChange(false);
    setManualBook({ title: '', author: '', isbn: '', pages: '' });
  };

  return (
    <Modal visible={open} animationType="slide" transparent>
      <View style={styles.modalBg}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>새 책 추가</Text>
          <View style={styles.tabRow}>
            <TouchableOpacity style={[styles.tabBtn, tab === 'search' && styles.tabBtnActive]} onPress={() => setTab('search')}>
              <Ionicons name="search" size={18} color={tab === 'search' ? '#2563EB' : '#888'} />
              <Text style={[styles.tabBtnText, tab === 'search' && { color: '#2563EB' }]}>검색해서 추가</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabBtn, tab === 'manual' && styles.tabBtnActive]} onPress={() => setTab('manual')}>
              <Feather name="edit-2" size={18} color={tab === 'manual' ? '#2563EB' : '#888'} />
              <Text style={[styles.tabBtnText, tab === 'manual' && { color: '#2563EB' }]}>직접 입력</Text>
            </TouchableOpacity>
          </View>
          {tab === 'search' ? (
            <View style={{ marginTop: 12 }}>
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
              {isSearching && (
                <View style={styles.centered}><ActivityIndicator size="small" color="#2563EB" /><Text style={{ marginTop: 8, color: '#666' }}>검색 중...</Text></View>
              )}
              {searchResults.length > 0 && (
                <ScrollView style={{ maxHeight: 180, marginTop: 8 }}>
                  {searchResults.map((book) => (
                    <TouchableOpacity key={book.id} style={styles.resultCard} onPress={() => handleAddFromSearch(book)}>
                      <View style={styles.resultCover}><FontAwesome name="book" size={20} color="#888" /></View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.resultTitle}>{book.title}</Text>
                        <Text style={styles.resultAuthor}>{book.author}</Text>
                        <Text style={styles.resultMeta}>{book.publisher} · {book.publishedYear}</Text>
                      </View>
                      <Text style={styles.resultAdd}>추가</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          ) : (
            <View style={{ marginTop: 12 }}>
              <Text style={styles.label}>책 제목 *</Text>
              <TextInput style={styles.input} placeholder="책 제목을 입력하세요" value={manualBook.title} onChangeText={v => setManualBook({ ...manualBook, title: v })} />
              <Text style={styles.label}>저자 *</Text>
              <TextInput style={styles.input} placeholder="저자명을 입력하세요" value={manualBook.author} onChangeText={v => setManualBook({ ...manualBook, author: v })} />
              <Text style={styles.label}>ISBN (선택)</Text>
              <TextInput style={styles.input} placeholder="ISBN을 입력하세요" value={manualBook.isbn} onChangeText={v => setManualBook({ ...manualBook, isbn: v })} />
              <Text style={styles.label}>페이지 수 (선택)</Text>
              <TextInput style={styles.input} placeholder="페이지 수를 입력하세요" value={manualBook.pages} onChangeText={v => setManualBook({ ...manualBook, pages: v })} keyboardType="numeric" />
              <TouchableOpacity style={styles.addBtn} onPress={handleManualAdd}>
                <Text style={styles.addBtnText}>서재에 추가</Text>
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity style={styles.closeBtn} onPress={() => onOpenChange(false)}>
            <Text style={styles.closeBtnText}>닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 20, width: 320 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  tabRow: { flexDirection: 'row', marginTop: 8 },
  tabBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabBtnActive: { borderBottomColor: '#2563EB' },
  tabBtnText: { marginLeft: 4, color: '#888', fontWeight: '500' },
  searchRow: { flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 8, marginBottom: 8, backgroundColor: '#F8FAFF' },
  searchBtn: { marginLeft: 8, backgroundColor: '#2563EB', borderRadius: 8, padding: 8 },
  centered: { alignItems: 'center', marginTop: 16 },
  resultCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 8, padding: 10, marginBottom: 8 },
  resultCover: { width: 32, height: 40, backgroundColor: '#E5E7EB', borderRadius: 4, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  resultTitle: { fontWeight: 'bold', fontSize: 15, color: '#222' },
  resultAuthor: { color: '#666', fontSize: 13 },
  resultMeta: { color: '#888', fontSize: 12 },
  resultAdd: { color: '#2563EB', fontWeight: 'bold', marginLeft: 8 },
  label: { fontSize: 13, color: '#444', marginTop: 8, marginBottom: 2 },
  addBtn: { backgroundColor: '#2563EB', borderRadius: 8, padding: 12, marginTop: 12, alignItems: 'center' },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  closeBtn: { alignSelf: 'flex-end', marginTop: 12 },
  closeBtnText: { color: '#2563EB', fontWeight: 'bold' },
});
