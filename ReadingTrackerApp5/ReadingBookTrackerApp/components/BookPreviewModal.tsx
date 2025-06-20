import React from 'react';
import { Modal, View, Text, Image, StyleSheet, Pressable, ScrollView } from 'react-native';
import { ExternalBook } from '@/lib/apis';
import { Button } from '@/components/ui/Button';

type BookPreviewModalProps = {
  book: ExternalBook | null;
  visible: boolean;
  onClose: () => void;
  onAddBook: (book: ExternalBook) => void;
  isAdded: boolean;
};

const BookPreviewModal = ({ book, visible, onClose, onAddBook, isAdded }: BookPreviewModalProps) => {
  if (!visible || !book) return null;

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.centeredView} onPress={onClose}>
        <Pressable style={styles.modalView} onPress={e => e.stopPropagation()}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {book.thumbnail && (
              <Image source={{ uri: book.thumbnail }} style={styles.thumbnail} />
            )}
            <Text style={styles.title}>{book.title}</Text>
            <Text style={styles.author}>{book.author}</Text>
            <Text style={styles.publisher}>
              {book.publisher} {book.publishedDate && `· ${book.publishedDate}`}
            </Text>
            <Text style={styles.source}>
              {book.source === 'aladin' ? '알라딘' : 'Google Books'}
            </Text>
            
            {book.description && (
              <Text style={styles.description}>{book.description}</Text>
            )}
            
            <View style={styles.buttonContainer}>
              <Button
                onPress={() => onAddBook(book)}
                disabled={isAdded}
                style={[styles.addButton, isAdded && styles.disabledButton]}
                textStyle={isAdded ? styles.disabledButtonText : styles.addButtonText}
              >
                {isAdded ? '등록됨' : '서재에 추가'}
              </Button>
              <Button onPress={onClose} style={styles.closeButton}>
                닫기
              </Button>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: '80%',
    width: '90%',
  },
  thumbnail: {
    width: 96,
    height: 128,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    color: '#1F2937',
  },
  author: {
    color: '#6B7280',
    fontSize: 15,
    marginBottom: 4,
  },
  publisher: {
    color: '#A3A3A3',
    fontSize: 13,
    marginBottom: 8,
  },
  source: {
    color: '#818CF8',
    fontSize: 13,
    marginBottom: 16,
  },
  description: {
    color: '#374151',
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  buttonContainer: {
    gap: 8,
  },
  addButton: {
    backgroundColor: '#818CF8',
  },
  disabledButton: {
    backgroundColor: '#E5E7EB',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  disabledButtonText: {
    color: '#A3A3A3',
  },
  closeButton: {
    backgroundColor: '#E5E7EB',
  },
});

export default BookPreviewModal; 