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
    const currentText = activeTab === 'quotes' ? newQuote : newNote;
    
    if (!currentText.trim()) {
      Alert.alert(
        '입력 오류',
        `${activeTab === 'quotes' ? '인용문' : '메모'}을 입력해주세요.`,
        [{ text: '확인', style: 'default' }]
      );
      return;
    }

    if (activeTab === 'quotes') {
      addQuote(book.id, { text: newQuote, tags: [] });
      setNewQuote('');
    } else if (activeTab === 'notes') {
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
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#6366F1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">{book.title}</Text>
      </View>
      <Stack.Screen options={{ title: book.title }} />
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View ref={bookInfoRef} collapsable={false} style={styles.bookInfoCard}>
          <View style={styles.bookInfoTopRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">{book.title}</Text>
              <View style={styles.authorRow}>
                <Feather name="user" size={16} color="#6B7280" style={{ marginRight: 4 }} />
                <Text style={styles.author} numberOfLines={1} ellipsizeMode="tail">{book.author}</Text>
              </View>
            </View>
            <Button onPress={handleShareBookInfo} style={styles.shareBookButton}>
              <Feather name="share-2" size={18} color="#fff" />
            </Button>
          </View>
          <View style={styles.statusTimeRow}>
            <Feather name="book-open" size={16} color="#818CF8" style={{ marginRight: 2 }} />
            {statusOptions.map(s => (
              <TouchableOpacity key={s} onPress={() => handleStatusChange(s)}>
                <Badge style={book.status === s ? styles.activeStatus : styles.status}>
                  <Text style={book.status === s ? styles.activeStatusText : styles.statusText}>{s}</Text>
                </Badge>
              </TouchableOpacity>
            ))}
            <Feather name="clock" size={16} color="#818CF8" style={{ marginLeft: 10, marginRight: 2 }} />
            <Text style={styles.readingTime}>{formatTime(totalReadingTime)}</Text>
          </View>
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
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'quotes' && styles.activeTabText]}>인용</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'notes' && styles.activeTab]}
            onPress={() => setActiveTab('notes')}
            activeOpacity={0.7}
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
                </View>
                
                <View style={styles.ㄱㄱ}>
                  <TouchableOpacity onPress={() => handleEditTags(item)} style={styles.editTagsButton}>
                    <Feather name="edit-2" size={16} color="#6B7280" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleShare(item.id)} style={styles.shareButton}>
                    <Feather name="share-2" size={16} color="#6366F1" />
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
              multiline
              numberOfLines={2}
              maxLength={300}
              textAlignVertical="top"
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
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingTop: 8, marginBottom: 2 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginLeft: 4, flex: 1 },
  backButton: { padding: 8, marginRight: 2 },
  bookInfoCard: { backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 4 },
  bookInfoTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 },
  authorRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2, marginBottom: 6 },
  statusTimeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2, gap: 6, flexWrap: 'wrap' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1F2937', marginBottom: 2 },
  author: { fontSize: 14, color: '#6B7280', fontWeight: '500', flexShrink: 1 },
  statusContainer: { flexDirection: 'row', marginBottom: 0, flexWrap: 'wrap' },
  status: { backgroundColor: '#E5E7EB', marginRight: 6, marginBottom: 6, paddingHorizontal: 8, paddingVertical: 3 },
  activeStatus: { backgroundColor: '#4F46E5', marginRight: 6, marginBottom: 6, paddingHorizontal: 8, paddingVertical: 3 },
  statusText: { color: '#374151', fontSize: 13 },
  activeStatusText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
  shareBookButton: { backgroundColor: '#6366F1', borderRadius: 8, padding: 8, minWidth: 36, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  readingTime: { color: '#374151', fontWeight: '500', fontSize: 14 },
  buttonRow: { flexDirection: 'row', marginBottom: 18, paddingHorizontal: 2 },
  deleteButton: { backgroundColor: '#EF4444', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 },
  deleteButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  tabContainer: { flexDirection: 'row', marginBottom: 10, borderBottomWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 2 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 8 },
  activeTab: { backgroundColor: '#EEF2FF' },
  tabText: { color: '#6B7280', fontWeight: '500', fontSize: 15 },
  activeTabText: { color: '#4F46E5', fontWeight: 'bold', fontSize: 15 },
  contentArea: { padding: 2 },
  itemCard: { 
    backgroundColor: 'white', 
    borderRadius: 10, 
    padding: 14, 
    marginBottom: 10, 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 4, 
    elevation: 2,
    position: 'relative'
  },
  itemText: { 
    fontSize: 15, 
    color: '#374151', 
    marginBottom: 12 
  },
  tagsContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'flex-start',
    alignItems: 'center', 
    marginBottom: 8,
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6'
  },
  tagBadge: { 
    backgroundColor: '#DBEAFE', 
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4
  },
  bottomActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
    marginTop: 8
  },
  editTagsButton: { 
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#F9FAFB'
  },
  shareButton: { 
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#F9FAFB'
  },
  inputContainer: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16, gap: 6 },
  textInput: { flex: 1, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, backgroundColor: '#fff', fontSize: 15, minHeight: 44, maxHeight: 80 },
  addButton: { backgroundColor: '#818CF8', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10, minWidth: 56 },
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
  tagEditContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 },
  tagInput: { flex: 1, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 6, padding: 8 },
  saveTagButton: { backgroundColor: '#10B981', paddingHorizontal: 12 },
  deleteItemButton: { position: 'absolute', top: 8, right: 10, padding: 4 },
  deleteItemButtonText: { fontSize: 18, color: '#EF4444', fontWeight: 'bold' },
});

export default BookDetailScreen; 