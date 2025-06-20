import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useBookContext, Book, BookStatus, Quote, Note } from '@/contexts/BookContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const statusOptions: BookStatus[] = ['읽고 싶은', '읽는 중', '다 읽은'];

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { books, updateStatus, addQuote, addNote, removeBook, removeQuote, removeNote } = useBookContext();
  
  const book = useMemo(() => books.find((b: Book) => b.id === id), [books, id]);

  const [tab, setTab] = useState<'quotes' | 'notes'>('quotes');
  const [newQuote, setNewQuote] = useState('');
  const [newNote, setNewNote] = useState('');

  if (!book) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>도서를 찾을 수 없습니다.</Text>
      </SafeAreaView>
    );
  }

  const handleDelete = () => {
    Alert.alert('도서 삭제', `'${book.title}'을(를) 정말로 삭제하시겠습니까?`, [
      { text: '취소', style: 'cancel' },
      { text: '삭제', style: 'destructive', onPress: () => {
          removeBook(book.id);
          router.back();
      }},
    ]);
  };

  const handleAddQuote = () => {
    if (!newQuote.trim()) return;
    addQuote(book.id, { text: newQuote, tags: [] });
    setNewQuote('');
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    addNote(book.id, { text: newNote, tags: [] });
    setNewNote('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: book.title }} />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>{book.author}</Text>
        
        <View style={styles.statusContainer}>
          {statusOptions.map(s => (
            <TouchableOpacity key={s} onPress={() => updateStatus(book.id, s)}>
              <Badge style={book.status === s ? styles.activeStatus : styles.status}>
                <Text style={book.status === s ? styles.activeStatusText : styles.statusText}>{s}</Text>
              </Badge>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.buttonRow}>
            <Button onPress={handleDelete} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>삭제</Text>
            </Button>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity onPress={() => setTab('quotes')} style={[styles.tab, tab === 'quotes' && styles.activeTab]}>
            <Text style={[styles.tabText, tab === 'quotes' && styles.activeTabText]}>인용문 ({book.quotes.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTab('notes')} style={[styles.tab, tab === 'notes' && styles.activeTab]}>
            <Text style={[styles.tabText, tab === 'notes' && styles.activeTabText]}>메모 ({book.notes.length})</Text>
          </TouchableOpacity>
        </View>

        {tab === 'quotes' ? (
          <View>
            <View style={styles.inputContainer}>
              <TextInput value={newQuote} onChangeText={setNewQuote} placeholder="인용문 추가..." style={styles.input} multiline />
              <Button onPress={handleAddQuote} style={styles.addContentButton}><Text style={styles.addContentButtonText}>추가</Text></Button>
            </View>
            {book.quotes.map((q: Quote) => (
              <View key={q.id} style={styles.itemCard}>
                <Text style={styles.itemText}>{q.text}</Text>
                <TouchableOpacity onPress={() => removeQuote(book.id, q.id)} style={styles.deleteItemButton}>
                  <Text style={styles.deleteItemButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <View>
            <View style={styles.inputContainer}>
              <TextInput value={newNote} onChangeText={setNewNote} placeholder="메모 추가..." style={styles.input} multiline />
              <Button onPress={handleAddNote} style={styles.addContentButton}><Text style={styles.addContentButtonText}>추가</Text></Button>
            </View>
            {book.notes.map((n: Note) => (
              <View key={n.id} style={styles.itemCard}>
                <Text style={styles.itemText}>{n.text}</Text>
                <TouchableOpacity onPress={() => removeNote(book.id, n.id)} style={styles.deleteItemButton}>
                  <Text style={styles.deleteItemButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  contentContainer: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
  author: { fontSize: 16, color: '#6B7280', marginBottom: 16 },
  statusContainer: { flexDirection: 'row', marginBottom: 16, flexWrap: 'wrap' },
  status: { backgroundColor: '#E5E7EB', marginRight: 8, marginBottom: 8 },
  activeStatus: { backgroundColor: '#4F46E5', marginRight: 8, marginBottom: 8 },
  statusText: { color: '#374151' },
  activeStatusText: { color: '#FFFFFF', fontWeight: 'bold' },
  buttonRow: { flexDirection: 'row', marginBottom: 24 },
  deleteButton: { backgroundColor: '#EF4444' },
  deleteButtonText: { color: '#fff', fontWeight: 'bold' },
  tabContainer: { flexDirection: 'row', marginBottom: 16, borderBottomWidth: 1, borderColor: '#E5E7EB' },
  tab: { paddingVertical: 12, paddingHorizontal: 16 },
  activeTab: { borderBottomWidth: 2, borderColor: '#4F46E5' },
  tabText: { color: '#6B7280', fontWeight: '500' },
  activeTabText: { color: '#4F46E5', fontWeight: 'bold' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  input: { flex: 1, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 10, marginRight: 8, minHeight: 44 },
  addContentButton: { backgroundColor: '#4F46E5' },
  addContentButtonText: { color: '#fff', fontWeight: 'bold' },
  itemCard: { backgroundColor: 'white', borderRadius: 10, padding: 14, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  itemText: { fontSize: 15, color: '#374151' },
  deleteItemButton: { position: 'absolute', top: 8, right: 10, padding: 4 },
  deleteItemButtonText: { fontSize: 18, color: '#EF4444', fontWeight: 'bold' },
}); 