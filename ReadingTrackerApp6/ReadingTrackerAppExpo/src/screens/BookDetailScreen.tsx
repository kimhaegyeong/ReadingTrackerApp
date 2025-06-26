import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Card, Title, Paragraph, Button, TextInput, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

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

const BookDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const { book } = route.params;
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

  const [quotes, setQuotes] = useState<Quote[]>([
    {
      id: 1,
      text: "인간이 다른 동물과 구별되는 점은 허구를 믿을 수 있다는 것이다.",
      memo: "이 부분이 특히 인상깊었다. 허구를 통해 대규모 협력이 가능해진다는 관점이 흥미롭다.",
      page: 45,
      createdAt: "2023-11-01",
      tags: ["철학", "인간의 본질", "허구"]
    },
    {
      id: 2,
      text: "우리는 모두 상상 속의 질서를 믿고 있다.",
      memo: "",
      page: 89,
      createdAt: "2023-11-02",
      tags: ["사회", "질서", "상상"]
    }
  ]);

  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      content: "저자의 관점에서 인류 문명의 발전 과정을 바라보는 시각이 흥미롭다. 특히 농업혁명이 인간에게 미친 영향에 대한 해석이 새로웠다.",
      createdAt: "2023-11-01",
      tags: ["농업혁명", "문명사", "역사적 관점"]
    }
  ]);

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

  const handleAddQuote = () => {
    if (!newQuote.trim()) return;
    
    const quote: Quote = {
      id: Date.now(),
      text: newQuote,
      memo: newQuoteMemo,
      page: Math.floor(Math.random() * 300) + 1,
      createdAt: new Date().toLocaleDateString(),
      tags: [...newQuoteTags]
    };
    
    setQuotes([...quotes, quote]);
    setNewQuote('');
    setNewQuoteMemo('');
    setNewQuoteTags([]);
    setIsQuoteModalVisible(false);
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    const note: Note = {
      id: Date.now(),
      content: newNote,
      createdAt: new Date().toLocaleDateString(),
      tags: [...newNoteTags]
    };
    
    setNotes([...notes, note]);
    setNewNote('');
    setNewNoteTags([]);
    setIsNoteModalVisible(false);
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
      <View style={[styles.badge, { backgroundColor: color }]}> <Text style={styles.badgeText}>{label}</Text> </View>
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

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => (navigation as any).goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#64748b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>책 상세</Text>
      </View>

      {/* Book Info Card */}
      <Card style={styles.bookCard}>
        <Card.Content style={styles.bookCardContent}>
          <View style={styles.bookInfo}>
            <View style={[styles.bookCover, { backgroundColor: book.coverColor }]}> <Ionicons name="book" size={48} color="white" /> </View>
            <View style={styles.bookDetails}>
              <Title style={styles.bookTitle}>{book.title}</Title>
              <Paragraph style={styles.bookAuthor}>{book.author}</Paragraph>
              <View style={styles.statusContainer}>
                {getStatusBadge(book.status)}
                {book.status === 'reading' && (
                  <Text style={styles.progressText}>{book.progress}% 완료</Text>
                )}
              </View>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{book.quotes}</Text>
                  <Text style={styles.statLabel}>인용문</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{book.notes}</Text>
                  <Text style={styles.statLabel}>메모</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{book.readingTime}</Text>
                  <Text style={styles.statLabel}>독서 시간</Text>
                </View>
              </View>
            </View>
          </View>
          {book.status === 'reading' && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${book.progress}%` }]} />
              </View>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button
          mode="contained"
          onPress={() => setIsQuoteModalVisible(true)}
          style={styles.quoteButton}
        >
          <Ionicons name="chatbubble" size={16} color="white" />
          인용문 추가
        </Button>
        <Button
          mode="outlined"
          onPress={() => setIsNoteModalVisible(true)}
          style={styles.noteButton}
        >
          <Ionicons name="document-text" size={16} />
          메모 추가
        </Button>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TabButton title="인용문" value="quotes" isActive={activeTab === 'quotes'} />
        <TabButton title="메모" value="notes" isActive={activeTab === 'notes'} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'quotes' ? (
          <View style={styles.quotesContainer}>
            {quotes.map((quote) => (
              <Card key={quote.id} style={styles.quoteCard}>
                <Card.Content>
                  <View style={styles.quoteContent}>
                    <Ionicons name="chatbubble" size={20} color="#2563eb" style={styles.quoteIcon} />
                    <View style={styles.quoteText}>
                      <Text style={styles.quoteTextContent}>"{quote.text}"</Text>
                      {quote.memo && (
                        <View style={styles.memoContainer}>
                          <Text style={styles.memoText}>{quote.memo}</Text>
                        </View>
                      )}
                      <View style={styles.quoteMeta}>
                        <Text style={styles.quoteMetaText}>페이지 {quote.page}</Text>
                        <Text style={styles.quoteMetaText}>•</Text>
                        <Text style={styles.quoteMetaText}>{quote.createdAt}</Text>
                      </View>
                      {quote.tags && quote.tags.length > 0 && (
                        <View style={styles.tagsContainer}>
                          {quote.tags.map((tag, index) => (
                            <Chip key={index} style={styles.tagChip} textStyle={styles.tagText}>
                              {tag}
                            </Chip>
                          ))}
                        </View>
                      )}
                    </View>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </View>
        ) : (
          <View style={styles.notesContainer}>
            {notes.map((note) => (
              <Card key={note.id} style={styles.noteCard}>
                <Card.Content>
                  <View style={styles.noteContent}>
                    <Ionicons name="document-text" size={20} color="#8b5cf6" style={styles.noteIcon} />
                    <View style={styles.noteText}>
                      <Text style={styles.noteTextContent}>{note.content}</Text>
                      <Text style={styles.noteMeta}>{note.createdAt}</Text>
                      {note.tags && note.tags.length > 0 && (
                        <View style={styles.tagsContainer}>
                          {note.tags.map((tag, index) => (
                            <Chip key={index} style={styles.tagChip} textStyle={styles.tagText}>
                              {tag}
                            </Chip>
                          ))}
                        </View>
                      )}
                    </View>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </View>
        )}
      </View>

      {/* Quote Modal */}
      <Modal
        visible={isQuoteModalVisible}
        onRequestClose={() => setIsQuoteModalVisible(false)}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>새 인용문 추가</Text>
            <TouchableOpacity onPress={() => setIsQuoteModalVisible(false)}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <View style={styles.ocrButtonContainer}>
              <Button mode="outlined" onPress={handleOCR} style={styles.ocrButton}>
                <Ionicons name="camera" size={16} />
                OCR
              </Button>
              <Text style={styles.ocrText}>카메라로 텍스트 인식</Text>
            </View>
            <TextInput
              label="인용문"
              placeholder="인상 깊었던 구절을 입력하세요..."
              value={newQuote}
              onChangeText={setNewQuote}
              multiline
              numberOfLines={4}
              style={styles.modalInput}
            />
            <TextInput
              label="메모 (선택사항)"
              placeholder="이 인용문에 대한 생각이나 메모를 남겨보세요..."
              value={newQuoteMemo}
              onChangeText={setNewQuoteMemo}
              multiline
              numberOfLines={3}
              style={styles.modalInput}
            />
            <View style={styles.tagInputContainer}>
              <Text style={styles.tagLabel}>태그</Text>
              <View style={styles.tagInputRow}>
                <TextInput
                  placeholder="태그를 입력하세요..."
                  value={currentQuoteTag}
                  onChangeText={setCurrentQuoteTag}
                  onSubmitEditing={handleAddQuoteTag}
                  style={styles.tagInput}
                />
                <Button onPress={handleAddQuoteTag} style={styles.tagAddButton}>
                  <Ionicons name="add" size={16} />
                </Button>
              </View>
              {newQuoteTags.length > 0 && (
                <View style={styles.tagsRow}>
                  {newQuoteTags.map((tag, index) => (
                    <Chip key={index} onClose={() => removeQuoteTag(tag)} style={styles.tagChip}>
                      {tag}
                    </Chip>
                  ))}
                </View>
              )}
            </View>
            <Button mode="contained" onPress={handleAddQuote} style={styles.modalSubmitButton}>
              인용문 추가
            </Button>
          </ScrollView>
        </View>
      </Modal>
      {/* Note Modal */}
      <Modal
        visible={isNoteModalVisible}
        onRequestClose={() => setIsNoteModalVisible(false)}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>새 메모 추가</Text>
            <TouchableOpacity onPress={() => setIsNoteModalVisible(false)}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <TextInput
              label="메모"
              placeholder="이 책에 대한 생각을 자유롭게 적어보세요..."
              value={newNote}
              onChangeText={setNewNote}
              multiline
              numberOfLines={5}
              style={styles.modalInput}
            />
            <View style={styles.tagInputContainer}>
              <Text style={styles.tagLabel}>태그</Text>
              <View style={styles.tagInputRow}>
                <TextInput
                  placeholder="태그를 입력하세요..."
                  value={currentNoteTag}
                  onChangeText={setCurrentNoteTag}
                  onSubmitEditing={handleAddNoteTag}
                  style={styles.tagInput}
                />
                <Button onPress={handleAddNoteTag} style={styles.tagAddButton}>
                  <Ionicons name="add" size={16} />
                </Button>
              </View>
              {newNoteTags.length > 0 && (
                <View style={styles.tagsRow}>
                  {newNoteTags.map((tag, index) => (
                    <Chip key={index} onClose={() => removeNoteTag(tag)} style={styles.tagChip}>
                      {tag}
                    </Chip>
                  ))}
                </View>
              )}
            </View>
            <Button mode="contained" onPress={handleAddNote} style={styles.modalSubmitButton}>
              메모 추가
            </Button>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
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
    margin: 16,
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
  quoteButton: {
    flex: 1,
    backgroundColor: '#2563eb',
  },
  noteButton: {
    flex: 1,
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  modalContent: {
    flex: 1,
    padding: 16,
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
});

export default BookDetailScreen; 