import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  SafeAreaView,
  Alert,
  Platform,
  ActionSheetIOS,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { DatabaseService, Book as DBBook } from '../DatabaseService';
import { useBookContext } from '../BookContext';
import { Picker } from '@react-native-picker/picker';

interface Quote {
  id: number;
  text: string;
  memo: string;
  page: number;
  createdAt: string;
  tags: string[];
}

interface Note {
  id: number;
  content: string;
  createdAt: string;
  tags: string[];
}

interface Book {
  id: number;
  title: string;
  author: string;
  status: 'want-to-read' | 'reading' | 'completed';
  progress: number;
  coverColor: string;
  quotes: number;
  notes: number;
  readingTime: string;
}

type RootStackParamList = {
  BookDetail: { book: DBBook };
};

interface BookDetailScreenProps {
  route: RouteProp<RootStackParamList, 'BookDetail'>;
}

// 커스텀 카드
const CustomCard = ({ children, style }: any) => {
  // children이 문자열인 경우 <Text>로 감싸기
  if (typeof children === 'string') {
    return (
      <View style={[styles.card, { backgroundColor: '#fff', padding: 16 }, style]}>
        <Text>{children}</Text>
      </View>
    );
  }
  
  // children이 배열인 경우 문자열들을 <Text>로 감싸기
  if (Array.isArray(children)) {
    const processedChildren = children.map((child, index) => {
      if (typeof child === 'string' && child.trim() !== '') {
        return <Text key={index}>{child}</Text>;
      }
      return child;
    });
    return <View style={[styles.card, { backgroundColor: '#fff', padding: 16 }, style]}>{processedChildren}</View>;
  }
  
  // 그 외의 경우는 그대로 렌더링
  return <View style={[styles.card, { backgroundColor: '#fff', padding: 16 }, style]}>{children}</View>;
};

// 커스텀 칩
const CustomChip = ({ title, onPress, style, textStyle }: any) => (
  <TouchableOpacity onPress={onPress} style={[styles.tagChip, style]}>
    <Text style={[styles.tagText, textStyle]}>{title}</Text>
  </TouchableOpacity>
);

const BookDetailScreen = ({ route }: BookDetailScreenProps) => {
  const navigation = useNavigation();
  const { book } = route.params;
  const { updateBook, deleteBook, dbService } = useBookContext();
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [activeTab, setActiveTab] = useState('quotes');
  
  const [newQuote, setNewQuote] = useState('');
  const [newQuoteMemo, setNewQuoteMemo] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newQuoteTags, setNewQuoteTags] = useState<string[]>([]);
  const [newNoteTags, setNewNoteTags] = useState<string[]>([]);
  const [currentQuoteTag, setCurrentQuoteTag] = useState('');
  const [currentNoteTag, setCurrentNoteTag] = useState('');
  const [isQuoteModalVisible, setIsQuoteModalVisible] = useState(false);
  const [isNoteModalVisible, setIsNoteModalVisible] = useState(false);

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  const statusOptions = [
    { value: 'want-to-read', label: '읽고 싶은' },
    { value: 'reading', label: '읽는 중' },
    { value: 'completed', label: '완료' },
  ];

  const [statusMenuVisible, setStatusMenuVisible] = useState(false);
  const [actionMenuVisible, setActionMenuVisible] = useState(false);

  // 상태별 정보
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'want-to-read': return { label: '읽고 싶은', color: '#ec4899', icon: 'heart' };
      case 'reading': return { label: '읽는 중', color: '#eab308', icon: 'time' };
      case 'completed': return { label: '완료', color: '#22c55e', icon: 'checkmark-circle' };
      default: return { label: '알 수 없음', color: '#6b7280', icon: 'book' };
    }
  };
  const statusInfo = getStatusInfo(book.status);

  // DB에서 인용문/메모 불러오기
  useEffect(() => {
    if (!dbService) return;
    (async () => {
      const q = await dbService.getQuotesByBook(book.id);
      setQuotes(q.map(q => ({
        id: q.id,
        text: q.content,
        memo: q.memo || '',
        page: q.page || 0,
        createdAt: q.created_at || '',
        tags: q.tags ? q.tags.split(',') : [],
      })));
      const n = await dbService.getNotesByBook(book.id);
      setNotes(n.map(n => ({
        id: n.id,
        content: n.content,
        createdAt: n.created_at || '',
        tags: n.tags ? n.tags.split(',') : [],
      })));
    })();
  }, [dbService, book.id]);

  const handleAddQuoteTag = () => {
    if (currentQuoteTag.trim() && !newQuoteTags.includes(currentQuoteTag.trim())) {
      setNewQuoteTags([...newQuoteTags, currentQuoteTag.trim()]);
      setCurrentQuoteTag('');
    }
  };

  const handleAddNoteTag = () => {
    if (currentNoteTag.trim() && !newNoteTags.includes(currentNoteTag.trim())) {
      setNewNoteTags([...newNoteTags, currentNoteTag.trim()]);
      setCurrentNoteTag('');
    }
  };

  const removeQuoteTag = (tagToRemove: string) => {
    setNewQuoteTags(newQuoteTags.filter(tag => tag !== tagToRemove));
  };

  const removeNoteTag = (tagToRemove: string) => {
    setNewNoteTags(newNoteTags.filter(tag => tag !== tagToRemove));
  };

  const handleAddQuote = async () => {
    if (!newQuote.trim() || !dbService) return;
    await dbService.addQuote({
      book_id: book.id,
      content: newQuote,
      memo: newQuoteMemo,
      page: undefined,
      tags: newQuoteTags.join(',')
    });
    setNewQuote('');
    setNewQuoteMemo('');
    setNewQuoteTags([]);
    setIsQuoteModalVisible(false);
    // 목록 갱신
    const q = await dbService.getQuotesByBook(book.id);
    setQuotes(q.map(q => ({
      id: q.id,
      text: q.content,
      memo: q.memo || '',
      page: q.page || 0,
      createdAt: q.created_at || '',
      tags: q.tags ? q.tags.split(',') : [],
    })));
    setActiveTab('quotes'); // 인용문 추가 후 인용문 탭으로 전환
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !dbService) return;
    await dbService.addNote({
      book_id: book.id,
      content: newNote,
      tags: newNoteTags.join(',')
    });
    setNewNote('');
    setNewNoteTags([]);
    setIsNoteModalVisible(false);
    // 목록 갱신
    const n = await dbService.getNotesByBook(book.id);
    setNotes(n.map(n => ({
      id: n.id,
      content: n.content,
      createdAt: n.created_at || '',
      tags: n.tags ? n.tags.split(',') : [],
    })));
    setActiveTab('notes'); // 메모 추가 후 메모 탭으로 전환
  };

  const handleOCR = () => {
    setNewQuote("OCR로 인식된 텍스트가 여기에 나타납니다.");
    setIsQuoteModalVisible(true);
  };

  const getStatusBadge = (status: string) => {
    let color = '#6b7280';
    let label = '알 수 없음';
    switch (status) {
      case 'want-to-read':
        color = '#ec4899';
        label = '읽고 싶은';
        break;
      case 'reading':
        color = '#eab308';
        label = '읽는 중';
        break;
      case 'completed':
        color = '#22c55e';
        label = '완료';
        break;
    }
    return (
      <View style={[styles.badge, { backgroundColor: color }]}>
        <Text style={styles.badgeText}>{label}</Text>
      </View>
    );
  };

  const TabButton = ({ title, value, isActive }: { title: string; value: string; isActive: boolean }) => (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.activeTabButton]}
      onPress={() => setActiveTab(value)}
    >
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>{title}</Text>
    </TouchableOpacity>
  );

  const handleUpdate = async () => {
    try {
      await updateBook(book.id, { title, author });
      Alert.alert('수정 완료', '책 정보가 수정되었습니다.');
      if ((navigation as any).canGoBack && (navigation as any).canGoBack()) {
        (navigation as any).goBack();
      } else {
        (navigation as any).navigate('Main', { screen: 'Library' });
      }
    } catch (e) {
      Alert.alert('오류', '수정에 실패했습니다.');
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      '삭제 확인',
      '정말로 이 책을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteBook(book.id);
              Alert.alert('삭제 완료', '책이 삭제되었습니다.');
              (navigation as any).navigate('Main', { screen: 'Library' });
            } catch (e) {
              Alert.alert('오류', '책 삭제에 실패했습니다.');
            }
          },
        },
      ]
    );
  };

  // 인용문/메모 수정/삭제 핸들러 예시
  const handleUpdateQuote = async (id: number, update: Partial<Quote>) => {
    if (!dbService) return;
    await dbService.updateQuote(id, {
      content: update.text,
      memo: update.memo,
      page: update.page,
      tags: update.tags?.join(',')
    });
    const q = await dbService.getQuotesByBook(book.id);
    setQuotes(q.map(q => ({
      id: q.id,
      text: q.content,
      memo: q.memo || '',
      page: q.page || 0,
      createdAt: q.created_at || '',
      tags: q.tags ? q.tags.split(',') : [],
    })));
  };
  const handleDeleteQuote = async (id: number) => {
    if (!dbService) return;
    await dbService.deleteQuote(id);
    const q = await dbService.getQuotesByBook(book.id);
    setQuotes(q.map(q => ({
      id: q.id,
      text: q.content,
      memo: q.memo || '',
      page: q.page || 0,
      createdAt: q.created_at || '',
      tags: q.tags ? q.tags.split(',') : [],
    })));
  };
  const handleUpdateNote = async (id: number, update: Partial<Note>) => {
    if (!dbService) return;
    await dbService.updateNote(id, {
      content: update.content,
      tags: update.tags?.join(',')
    });
    const n = await dbService.getNotesByBook(book.id);
    setNotes(n.map(n => ({
      id: n.id,
      content: n.content,
      createdAt: n.created_at || '',
      tags: n.tags ? n.tags.split(',') : [],
    })));
  };
  const handleDeleteNote = async (id: number) => {
    if (!dbService) return;
    await dbService.deleteNote(id);
    const n = await dbService.getNotesByBook(book.id);
    setNotes(n.map(n => ({
      id: n.id,
      content: n.content,
      createdAt: n.created_at || '',
      tags: n.tags ? n.tags.split(',') : [],
    })));
  };

  // 상태 변경 핸들러 예시
  const handleStatusChange = async (status: string) => {
    await updateBook(book.id, { status });
    // 필요시 최신화
  };

  // 상태 변경 메뉴
  const showStatusMenu = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions({
        options: ['취소', ...statusOptions.map(opt => opt.label)],
        cancelButtonIndex: 0,
      }, async (buttonIndex) => {
        if (buttonIndex > 0) {
          const newStatus = statusOptions[buttonIndex - 1].value;
          await handleStatusChange(newStatus);
          book.status = newStatus;
        }
      });
    } else {
      setStatusMenuVisible(true);
    }
  };

  // 액션 메뉴(수정/삭제)
  const showActionMenu = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions({
        options: ['취소', '수정', '삭제'],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
      }, (buttonIndex) => {
        if (buttonIndex === 1) handleUpdate();
        if (buttonIndex === 2) handleDelete();
      });
    } else {
      setActionMenuVisible(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 헤더 */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#e0e0e0' }}>
        <TouchableOpacity
          onPress={() => {
            if ((navigation as any).canGoBack && (navigation as any).canGoBack()) {
              (navigation as any).goBack();
            } else {
              (navigation as any).navigate('Main', { screen: 'Library' });
            }
          }}
          style={{ marginRight: 12, padding: 4 }}
        >
          <Ionicons name="arrow-back" size={24} color="#64748b" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1e293b', flex: 1 }}>책 상세</Text>
      </View>
      {/* 책 정보 입력 */}
      <View style={{ padding: 20, backgroundColor: '#f8fafc' }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Ionicons name="book" size={24} color="#2563eb" style={{ marginRight: 12 }} />
            <TextInput
              placeholder="책 제목을 입력하세요..."
              value={title}
              onChangeText={setTitle}
              style={{ flex: 1, fontSize: 18, fontWeight: 'bold', color: '#1e293b' }}
            />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Ionicons name="person" size={20} color="#64748b" style={{ marginRight: 12 }} />
            <TextInput
              placeholder="저자를 입력하세요..."
              value={author}
              onChangeText={setAuthor}
              style={{ flex: 1, fontSize: 16, color: '#64748b' }}
            />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Ionicons name="flag" size={20} color="#64748b" style={{ marginRight: 12 }} />
            <Text style={{ fontSize: 16, color: '#64748b', marginRight: 8 }}>상태:</Text>
            <TouchableOpacity onPress={showStatusMenu} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: statusInfo.color, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6 }}>
              <Ionicons name={statusInfo.icon as any} size={16} color="#fff" style={{ marginRight: 4 }} />
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 13 }}>{statusInfo.label}</Text>
              <Ionicons name="chevron-down" size={16} color="#fff" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>
          {book.isbn && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <Ionicons name="barcode" size={20} color="#64748b" style={{ marginRight: 12 }} />
              <Text style={{ fontSize: 16, color: '#64748b' }}>ISBN: {book.isbn}</Text>
            </View>
          )}
          {book.pages && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <Ionicons name="document-text" size={20} color="#64748b" style={{ marginRight: 12 }} />
              <Text style={{ fontSize: 16, color: '#64748b' }}>페이지: {book.pages}페이지</Text>
            </View>
          )}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="calendar" size={20} color="#64748b" style={{ marginRight: 12 }} />
            <Text style={{ fontSize: 16, color: '#64748b' }}>추가일: {book.created_at ? new Date(book.created_at).toLocaleDateString('ko-KR') : '알 수 없음'}</Text>
          </View>
        </View>
      </View>
      {/* 탭 */}
      <View style={styles.tabsContainer}>
        <TabButton title="인용문" value="quotes" isActive={activeTab === 'quotes'} />
        <TabButton title="메모" value="notes" isActive={activeTab === 'notes'} />
      </View>
      {/* 콘텐츠 */}
      <ScrollView style={styles.content}>
        {activeTab === 'quotes' ? (
          <View style={styles.quotesContainer}>
            {quotes.length === 0 ? (
              <CustomCard>
                <Text>인용문이 없습니다</Text>
              </CustomCard>
            ) : (
              quotes.map((quote) => (
                <CustomCard key={quote.id} style={styles.quoteCard}>
                  <View style={styles.quoteContent}>
                    <Ionicons name="chatbubble" size={20} color="#2563eb" style={styles.quoteIcon} />
                    <View style={styles.quoteText}>
                      <Text style={styles.quoteTextContent}>"{quote.text}"</Text>
                      {quote.memo ? (
                        <View style={styles.memoContainer}>
                          <Text style={styles.memoText}>{quote.memo}</Text>
                        </View>
                      ) : null}
                      <View style={styles.quoteMeta}>
                        <Text style={styles.quoteMetaText}>페이지 {quote.page}</Text>
                        <Text style={styles.quoteMetaText}>•</Text>
                        <Text style={styles.quoteMetaText}>{quote.createdAt}</Text>
                      </View>
                      {quote.tags && quote.tags.length > 0 ? (
                        <View style={styles.tagsContainer}>
                          {quote.tags.map((tag, index) => (
                            <CustomChip key={index} title={tag} style={styles.tagChip} textStyle={styles.tagText} />
                          ))}
                        </View>
                      ) : null}
                    </View>
                  </View>
                </CustomCard>
              ))
            )}
          </View>
        ) : (
          <View style={styles.notesContainer}>
            {notes.length === 0 ? (
              <CustomCard>
                <Text>메모가 없습니다</Text>
              </CustomCard>
            ) : (
              notes.map((note) => (
                <CustomCard key={note.id} style={styles.noteCard}>
                  <View style={styles.noteContent}>
                    <Ionicons name="document-text" size={20} color="#8b5cf6" style={styles.noteIcon} />
                    <View style={styles.noteText}>
                      <Text style={styles.noteTextContent}>{note.content}</Text>
                      <Text style={styles.noteMeta}>{note.createdAt}</Text>
                      {note.tags && note.tags.length > 0 ? (
                        <View style={styles.tagsContainer}>
                          {note.tags.map((tag, index) => (
                            <CustomChip key={index} title={tag} style={styles.tagChip} textStyle={styles.tagText} />
                          ))}
                        </View>
                      ) : null}
                    </View>
                  </View>
                </CustomCard>
              ))
            )}
          </View>
        )}
      </ScrollView>
      {/* 하단 액션 바 */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 64, borderTopWidth: 1, borderColor: '#e0e0e0', backgroundColor: '#fff' }}>
        <TouchableOpacity onPress={() => setIsQuoteModalVisible(true)} style={{ alignItems: 'center', flex: 1 }}>
          <Ionicons name="chatbubble" size={26} color="#2563eb" />
          <Text style={{ color: '#2563eb', fontSize: 12, marginTop: 2 }}>인용문</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsNoteModalVisible(true)} style={{ alignItems: 'center', flex: 1 }}>
          <Ionicons name="document-text" size={26} color="#8b5cf6" />
          <Text style={{ color: '#8b5cf6', fontSize: 12, marginTop: 2 }}>메모</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => (navigation as any).navigate('Main', { screen: 'Timer' })} style={{ alignItems: 'center', flex: 1 }}>
          <Ionicons name="timer" size={26} color="#22c55e" />
          <Text style={{ color: '#22c55e', fontSize: 12, marginTop: 2 }}>기록</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={showActionMenu} style={{ alignItems: 'center', flex: 1 }}>
          <MaterialIcons name="more-vert" size={26} color="#64748b" />
          <Text style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>더보기</Text>
        </TouchableOpacity>
      </View>
      {/* 상태 변경 드롭다운(안드로이드) */}
      {statusMenuVisible && (
        <Modal visible={statusMenuVisible} transparent animationType="fade" onRequestClose={() => setStatusMenuVisible(false)}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)' }}>
            <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16, minWidth: 200 }}>
              {statusOptions.map(opt => (
                <TouchableOpacity key={opt.value} onPress={async () => { await handleStatusChange(opt.value); book.status = opt.value; setStatusMenuVisible(false); }} style={{ paddingVertical: 12 }}>
                  <Text style={{ color: getStatusInfo(opt.value).color, fontWeight: book.status === opt.value ? 'bold' : 'normal' }}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>
      )}
      {/* 액션 메뉴(안드로이드) */}
      {actionMenuVisible && (
        <Modal visible={actionMenuVisible} transparent animationType="fade" onRequestClose={() => setActionMenuVisible(false)}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)' }}>
            <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16, minWidth: 200 }}>
              <TouchableOpacity onPress={() => { setActionMenuVisible(false); handleUpdate(); }} style={{ paddingVertical: 12 }}>
                <Text style={{ color: '#2563eb', fontWeight: 'bold' }}>수정</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setActionMenuVisible(false); handleDelete(); }} style={{ paddingVertical: 12 }}>
                <Text style={{ color: '#ef4444', fontWeight: 'bold' }}>삭제</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
      {/* 인용문/메모 추가 모달 등 기존 모달 유지 */}
      <Modal
        visible={isQuoteModalVisible}
        onRequestClose={() => setIsQuoteModalVisible(false)}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalCardContainer}>
          <View style={styles.modalHeaderCard}>
            <Text style={styles.modalTitleCard}>새 인용문 추가</Text>
            <TouchableOpacity onPress={() => setIsQuoteModalVisible(false)}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContentCard}>
            <View style={styles.ocrButtonContainer}>
              <TouchableOpacity onPress={handleOCR} style={[styles.ocrButton, styles.actionButtonCard, styles.noteButtonCard, { height: 40, paddingHorizontal: 16, borderRadius: 10, marginRight: 0 }]}> 
                <Ionicons name="camera" size={16} color="#2563eb" style={{ marginRight: 6 }} />
                <Text style={{ color: '#2563eb', fontWeight: '600', fontSize: 15 }}>OCR</Text>
              </TouchableOpacity>
              <Text style={styles.ocrText}>카메라로 텍스트 인식</Text>
            </View>
            <TextInput
              placeholder="인상 깊었던 구절을 입력하세요..."
              value={newQuote}
              onChangeText={setNewQuote}
              multiline
              numberOfLines={4}
              style={styles.modalInputCard}
            />
            <TextInput
              placeholder="이 인용문에 대한 생각이나 메모를 남겨보세요..."
              value={newQuoteMemo}
              onChangeText={setNewQuoteMemo}
              multiline
              numberOfLines={3}
              style={styles.modalInputCard}
            />
            <View style={styles.tagInputContainerCard}>
              <Text style={styles.tagLabel}>태그</Text>
              <View style={styles.tagInputRowCard}>
                <TextInput
                  placeholder="태그를 입력하세요..."
                  value={currentQuoteTag}
                  onChangeText={setCurrentQuoteTag}
                  onSubmitEditing={handleAddQuoteTag}
                  style={[styles.tagInput, styles.modalInputCard, { flex: 1, marginBottom: 0, marginRight: 8 }]}
                />
                <TouchableOpacity onPress={handleAddQuoteTag} style={[styles.actionButtonCard, styles.quoteButtonCard, { height: 40, paddingHorizontal: 16, borderRadius: 10, marginRight: 0 }]}> 
                  <Ionicons name="add" size={16} color="#fff" />
                  <Text style={{ color: '#fff', marginLeft: 4, fontWeight: '600', fontSize: 15 }}>추가</Text>
                </TouchableOpacity>
              </View>
              {newQuoteTags.length > 0 && (
                <View style={styles.tagsRowCard}>
                  {newQuoteTags.map((tag, index) => (
                    <View key={index} style={styles.tagChipCard}>
                      <Text style={styles.tagTextCard}>{tag}</Text>
                      <TouchableOpacity onPress={() => removeQuoteTag(tag)}>
                        <Ionicons name="close" size={14} color="#64748b" style={{ marginLeft: 4 }} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
            <TouchableOpacity onPress={handleAddQuote} style={[styles.actionButtonCard, styles.quoteButtonCard, { marginTop: 16 }]}> 
              <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>인용문 추가</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      <Modal
        visible={isNoteModalVisible}
        onRequestClose={() => setIsNoteModalVisible(false)}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalCardContainer}>
          <View style={styles.modalHeaderCard}>
            <Text style={styles.modalTitleCard}>새 메모 추가</Text>
            <TouchableOpacity onPress={() => setIsNoteModalVisible(false)}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContentCard}>
            <TextInput
              placeholder="이 책에 대한 생각을 자유롭게 적어보세요..."
              value={newNote}
              onChangeText={setNewNote}
              multiline
              numberOfLines={5}
              style={styles.modalInputCard}
            />
            <View style={styles.tagInputContainerCard}>
              <Text style={styles.tagLabel}>태그</Text>
              <View style={styles.tagInputRowCard}>
                <TextInput
                  placeholder="태그를 입력하세요..."
                  value={currentNoteTag}
                  onChangeText={setCurrentNoteTag}
                  onSubmitEditing={handleAddNoteTag}
                  style={[styles.tagInput, styles.modalInputCard, { flex: 1, marginBottom: 0, marginRight: 8 }]}
                />
                <TouchableOpacity onPress={handleAddNoteTag} style={[styles.actionButtonCard, styles.quoteButtonCard, { height: 40, paddingHorizontal: 16, borderRadius: 10, marginRight: 0 }]}> 
                  <Ionicons name="add" size={16} color="#fff" />
                  <Text style={{ color: '#fff', marginLeft: 4, fontWeight: '600', fontSize: 15 }}>추가</Text>
                </TouchableOpacity>
              </View>
              {newNoteTags.length > 0 && (
                <View style={styles.tagsRowCard}>
                  {newNoteTags.map((tag, index) => (
                    <View key={index} style={styles.tagChipCard}>
                      <Text style={styles.tagTextCard}>{tag}</Text>
                      <TouchableOpacity onPress={() => removeNoteTag(tag)}>
                        <Ionicons name="close" size={14} color="#64748b" style={{ marginLeft: 4 }} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
            <TouchableOpacity onPress={handleAddNote} style={[styles.actionButtonCard, styles.quoteButtonCard, { marginTop: 16 }]}> 
              <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>메모 추가</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    maxWidth: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 0,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  bookCard: {
    marginBottom: 16,
    maxWidth: '100%',
    borderRadius: 12,
    elevation: 2,
    backgroundColor: '#fff',
  },
  bookCardContent: {
    padding: 16,
  },
  bookInfo: {
    flexDirection: 'row',
  },
  bookCover: {
    width: 96,
    height: 128,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  bookDetails: {
    flex: 1,
    minWidth: 0,
  },
  bookTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bookAuthor: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  progressText: {
    fontSize: 14,
    color: '#6b7280',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  progressContainer: {
    marginTop: 16,
  },
  progressBar: {
    height: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 6,
  },
  actionButtons: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  actionButtonCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 14,
    paddingHorizontal: 0,
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    backgroundColor: '#fff', // 기본값(메모 추가용)
  },
  quoteButtonCard: {
    backgroundColor: '#2563eb',
    borderWidth: 0,
    marginRight: 12,
  },
  noteButtonCard: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#2563eb',
    marginRight: 0,
  },
  buttonIconCard: {
    marginRight: 8,
  },
  buttonTextCard: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
    color: '#fff',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
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
    paddingHorizontal: 16,
    paddingBottom: 100,
    maxWidth: '100%',
  },
  quotesContainer: {
    gap: 12,
  },
  notesContainer: {
    gap: 12,
  },
  quoteCard: {
    marginBottom: 0,
  },
  noteCard: {
    marginBottom: 0,
  },
  quoteContent: {
    flexDirection: 'row',
  },
  noteContent: {
    flexDirection: 'row',
  },
  quoteIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  noteIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  quoteText: {
    flex: 1,
  },
  noteText: {
    flex: 1,
  },
  quoteTextContent: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#1e293b',
    marginBottom: 8,
  },
  noteTextContent: {
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 8,
  },
  memoContainer: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  memoText: {
    fontSize: 14,
    color: '#374151',
  },
  quoteMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  quoteMetaText: {
    fontSize: 12,
    color: '#6b7280',
    marginRight: 8,
  },
  noteMeta: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  tagChip: {
    backgroundColor: '#e0e7ff',
  },
  tagText: {
    color: '#3730a3',
    fontSize: 12,
  },
  modalCardContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  modalHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitleCard: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  modalContentCard: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  modalInputCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
    fontSize: 15,
  },
  tagInputContainerCard: {
    marginBottom: 16,
  },
  tagInputRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tagsRowCard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  tagChipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  tagTextCard: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '500',
  },
  ocrButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ocrButton: {
    marginRight: 8,
  },
  ocrText: {
    fontSize: 14,
    color: '#6b7280',
  },
  modalInput: {
    backgroundColor: 'white',
    marginBottom: 16,
  },
  tagInputContainer: {
    marginBottom: 16,
  },
  tagLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  tagInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tagInput: {
    flex: 1,
    backgroundColor: 'white',
    marginRight: 8,
  },
  tagAddButton: {
    backgroundColor: '#2563eb',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  modalSubmitButton: {
    backgroundColor: '#2563eb',
    marginTop: 16,
  },
  card: {
    marginBottom: 16,
    maxWidth: '100%',
    borderRadius: 12,
    elevation: 2,
    backgroundColor: '#fff',
  },
  titleInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
    fontSize: 15,
  },
  authorInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
    fontSize: 15,
  },
});

export default BookDetailScreen; 