import React, { useState } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Book, BookStatus } from '@/contexts/BookContext';

type AddBookModalProps = {
  visible: boolean;
  onClose: () => void;
  onAddBook: (book: Omit<Book, 'id' | 'quotes' | 'notes'>) => void;
};

const statusOptions: BookStatus[] = ['읽고 싶은', '읽는 중', '다 읽은'];

const AddBookModal = ({ visible, onClose, onAddBook }: AddBookModalProps) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState<BookStatus>('읽고 싶은');
  const [error, setError] = useState('');

  const handleAdd = () => {
    if (!title.trim() || !author.trim()) {
      setError('제목과 저자를 모두 입력해주세요.');
      return;
    }
    onAddBook({ title, author, status });
    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setAuthor('');
    setStatus('읽고 싶은');
    setError('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={handleClose}>
      <Pressable style={styles.centeredView} onPress={handleClose}>
        <Pressable style={styles.modalView} onPress={e => e.stopPropagation()}>
          <Text style={styles.modalTitle}>새 책 직접 등록</Text>
          
          <TextInput
            style={styles.input}
            placeholder="책 제목"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#9CA3AF"
          />
          <TextInput
            style={styles.input}
            placeholder="저자"
            value={author}
            onChangeText={setAuthor}
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.label}>독서 상태</Text>
          <View style={styles.statusContainer}>
            {statusOptions.map(option => (
              <TouchableOpacity
                key={option}
                style={[styles.statusButton, status === option && styles.activeStatus]}
                onPress={() => setStatus(option)}
              >
                <Text style={[styles.statusText, status === option && styles.activeStatusText]}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.buttonContainer}>
            <Button onPress={handleClose} style={styles.cancelButton} textStyle={styles.cancelButtonText}>
              취소
            </Button>
            <Button onPress={handleAdd}>
              추가
            </Button>
          </View>
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
    borderRadius: 20,
    padding: 24,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  input: {
    height: 48,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 8,
    color: '#374151',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statusButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  activeStatus: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  statusText: {
    color: '#374151',
  },
  activeStatusText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#EF4444',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 8,
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
  },
  cancelButtonText: {
    color: '#374151',
  },
});

export default AddBookModal; 