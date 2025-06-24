import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { useBookContext, Book, BookStatus, Quote, Note } from '../../contexts/BookContext';
import { Button } from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import ReadingTimerWidget from '../../components/ReadingTimerWidget';
import { Feather } from '@expo/vector-icons';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

const statusOptions: BookStatus[] = ['읽고 싶은', '읽는 중', '다 읽은'];

const BookDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { 
    books, updateStatus, addQuote, addNote, removeBook, removeQuote, removeNote, addReadingTime, updateQuoteTags, updateNoteTags 
  } = useBookContext();
  
  const book = books.find((b: Book) => b.id === id);

  const [activeTab, setActiveTab] = useState<'quotes' | 'notes'>('quotes');
  const [modalVisible, setModalVisible] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<{ type: 'quote' | 'note'; id: string } | null>(null);
  const [newQuote, setNewQuote] = useState('');
  const [newNote, setNewNote] = useState('');
  const [isStatusSelectorVisible, setStatusSelectorVisible] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingTags, setEditingTags] = useState<string>('');
  const cardRefs = useRef<Record<string, any>>({});
  const bookInfoRef = useRef<any>(null);

  if (!book) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>도서를 찾을 수 없습니다.</Text>
      </SafeAreaView>
    );
  }

  const handleStatusChange = (newStatus: BookStatus) => {
    if (book) {
      updateStatus(book.id, newStatus);
    }
    setStatusSelectorVisible(false);
  };
  
  const totalReadingTime = book.readingRecords.reduce((total, record) => total + record.readingTimeInSeconds, 0);
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}시간 ${minutes}분`;
  };

  const handleAddItem = () => {
    if (activeTab === 'quotes' && newQuote.trim()) {
      addQuote(book.id, { text: newQuote, tags: [] });
      setNewQuote('');
    } else if (activeTab === 'notes' && newNote.trim()) {
      addNote(book.id, { text: newNote, tags: [] });
      setNewNote('');
    }
  };

  const confirmRemoveItem = () => {
    if(!itemToRemove || !book) return;
    
    const { type, id: itemId } = itemToRemove;
    if (type === 'quote') {
      removeQuote(book.id, itemId);
    } else {
      removeNote(book.id, itemId);
    }
    setModalVisible(false);
    setItemToRemove(null);
  };

  const handleEditTags = (item: {id: string, tags: string[]}) => {
    setEditingItemId(item.id);
    setEditingTags(item.tags.join(', '));
  };

  const handleSaveTags = (itemId: string) => {
    const tags = editingTags.split(',').map(t => t.trim()).filter(Boolean);
    if (activeTab === 'quotes') {
      updateQuoteTags(book!.id, itemId, tags);
    } else {
      updateNoteTags(book!.id, itemId, tags);
    }
    setEditingItemId(null);
    setEditingTags('');
  };

  const handleShare = async (itemId: string) => {
    try {
      const uri = await captureRef(cardRefs.current[itemId], {
        format: 'png',
        quality: 1,
      });
      await Sharing.shareAsync(uri);
    } catch (e) {
      alert('이미지 공유에 실패했습니다.');
    }
  };

  const handleShareBookInfo = async () => {
    try {
      const uri = await captureRef(bookInfoRef.current, {
        format: 'png',
        quality: 1,
      });
      await Sharing.shareAsync(uri);
    } catch (e) {
      alert('이미지 공유에 실패했습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: book.title }} />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View ref={bookInfoRef} collapsable={false} style={styles.bookInfoCard}>
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>{book.author}</Text>
          <View style={styles.statusContainer}>
            {statusOptions.map(s => (
              <TouchableOpacity key={s} onPress={() => handleStatusChange(s)}>
                <Badge style={book.status === s ? styles.activeStatus : styles.status}>
                  <Text style={book.status === s ? styles.activeStatusText : styles.statusText}>{s}</Text>
                </Badge>
              </TouchableOpacity>
            ))}
          </View>
          <Card>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>저자</Text>
              <Text style={styles.detailValue}>{book.author}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>총 독서 시간</Text>
              <Text style={styles.detailValue}>{formatTime(totalReadingTime)}</Text>
            </View>
          </Card>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 16 }}>
          <Button onPress={handleShareBookInfo} style={{ backgroundColor: '#6366F1' }}>
            <Feather name="share-2" size={16} color="#fff" /> <Text style={{ color: '#fff', marginLeft: 4 }}>공유</Text>
          </Button>
        </View>

        <View style={styles.buttonRow}>
            <Button onPress={() => removeBook(book.id)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>삭제</Text>
            </Button>
        </View>

        {book.status === '읽는 중' && (
          <ReadingTimerWidget onSave={(seconds) => addReadingTime(book.id, seconds)} />
        )}

        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'quotes' && styles.activeTab]} 
            onPress={() => setActiveTab('quotes')}
          >
            <Text style={[styles.tabText, activeTab === 'quotes' && styles.activeTabText]}>인용</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'notes' && styles.activeTab]} 
            onPress={() => setActiveTab('notes')}
          >
            <Text style={[styles.tabText, activeTab === 'notes' && styles.activeTabText]}>메모</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contentArea}>
          {(activeTab === 'quotes' ? book.quotes : book.notes).map(item => (
            <View
              key={item.id}
              ref={ref => { if (ref) cardRefs.current[item.id] = ref; }}
              collapsable={false}
            >
              <Card style={styles.itemCard}>
                <Text style={styles.itemText}>{item.text}</Text>
                <View style={styles.tagsContainer}>
                  {item.tags.map((tag, index) => <Badge key={index} style={styles.tagBadge}>{tag}</Badge>)}
                  <TouchableOpacity onPress={() => handleEditTags(item)} style={styles.editTagsButton}>
                    <Feather name="edit-2" size={16} color="#6B7280" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleShare(item.id)} style={styles.shareButton}>
                    <Feather name="share-2" size={16} color="#6366F1" />
                    <Text style={{ color: '#6366F1', marginLeft: 2, fontSize: 13 }}>공유</Text>
                  </TouchableOpacity>
                </View>
                {editingItemId === item.id && (
                  <View style={styles.tagEditContainer}>
                    <TextInput
                      value={editingTags}
                      onChangeText={setEditingTags}
                      placeholder="태그 (쉼표로 구분)"
                      style={styles.tagInput}
                    />
                    <Button onPress={() => handleSaveTags(item.id)} style={styles.saveTagButton}>저장</Button>
                  </View>
                )}
                <TouchableOpacity
                  style={styles.deleteItemButton}
                  onPress={() => {
                    const type = activeTab === 'quotes' ? 'quote' : 'note';
                    setItemToRemove({ type, id: item.id });
                    setModalVisible(true);
                  }}
                >
                  <Text style={styles.deleteItemButtonText}>×</Text>
                </TouchableOpacity>
              </Card>
            </View>
          ))}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={activeTab === 'quotes' ? newQuote : newNote}
              onChangeText={activeTab === 'quotes' ? setNewQuote : setNewNote}
              placeholder={`${activeTab === 'quotes' ? '인용' : '메모'} 추가...`}
            />
            <Button onPress={handleAddItem} style={styles.addButton}>
              추가
            </Button>
          </View>
        </View>
      </ScrollView>

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>정말 삭제하시겠습니까?</Text>
            <View style={styles.modalButtons}>
              <Button style={styles.modalButton} onPress={() => setModalVisible(false)}>취소</Button>
              <Button style={[styles.modalButton, styles.deleteConfirmButton]} onPress={confirmRemoveItem}>삭제</Button>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

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
  itemText: { fontSize: 15, color: '#374151', marginBottom: 12 },
  deleteItemButton: { position: 'absolute', top: 8, right: 10, padding: 4 },
  deleteItemButtonText: { fontSize: 18, color: '#EF4444', fontWeight: 'bold' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  detailLabel: { fontWeight: 'bold' },
  detailValue: { fontWeight: 'normal' },
  contentArea: { padding: 16 },
  textInput: { flex: 1, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, backgroundColor: '#fff' },
  addButton: { backgroundColor: '#818CF8' },
  centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { backgroundColor: 'white', borderRadius: 12, padding: 24, alignItems: 'center', width: '80%' },
  modalText: { marginBottom: 24, textAlign: 'center', fontSize: 18, fontWeight: '600' },
  modalButtons: { flexDirection: 'row', gap: 12 },
  modalButton: { flex: 1 },
  deleteConfirmButton: { backgroundColor: '#EF4444' },
  statusModalBackdrop: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  statusModal: { backgroundColor: 'white', borderRadius: 12, padding: 16, width: '60%' },
  statusOption: { paddingVertical: 12, alignItems: 'center' },
  statusTextModal: { fontSize: 18, color: '#374151' },
  activeStatusTextModal: { fontSize: 18, color: '#818CF8', fontWeight: 'bold' },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginBottom: 8 },
  tagBadge: { backgroundColor: '#DBEAFE', marginRight: 6, marginBottom: 6 },
  editTagsButton: { marginLeft: 8, padding: 4 },
  tagEditContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 },
  tagInput: { flex: 1, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 6, padding: 8 },
  saveTagButton: { backgroundColor: '#10B981', paddingHorizontal: 12 },
  shareButton: { marginLeft: 8, padding: 4 },
  bookInfoCard: { backgroundColor: 'white', borderRadius: 12, padding: 18, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 3 },
});

export default BookDetailScreen; 