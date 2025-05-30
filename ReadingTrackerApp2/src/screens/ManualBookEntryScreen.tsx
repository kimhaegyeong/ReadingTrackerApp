import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing } from '@/theme';
import * as database from '@/services/database';
import { v4 as uuidv4 } from 'uuid';
import { Book } from '@/store/slices/booksSlice';

export const ManualBookEntryScreen: React.FC = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [description, setDescription] = useState('');
  const [pageCount, setPageCount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!title.trim()) {
      setError('책 제목을 입력해주세요.');
      return;
    }

    if (!authors.trim()) {
      setError('저자 정보를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const book: Book & { createdAt: string } = {
        id: uuidv4(),
        title: title.trim(),
        authors: authors.split(',').map(author => author.trim()),
        description: description.trim(),
        pageCount: parseInt(pageCount) || 0,
        publishedDate: new Date().toISOString().split('T')[0],
        publisher: '',
        thumbnail: '',
        status: 'reading',
        currentPage: 0,
        startDate: new Date().toISOString(),
        endDate: null,
        rating: 0,
        review: '',
        bookmarks: [],
        reviews: [],
        readingSessions: [],
        categories: [],
        language: 'ko',
        imageLinks: {
          thumbnail: '',
          smallThumbnail: ''
        },
        isbn: '',
        userSpecificData: {
          status: 'reading',
          currentPage: 0,
          startDate: new Date().toISOString(),
          endDate: null,
          rating: 0,
          review: '',
          bookmarks: [],
          reviews: [],
          readingSessions: []
        },
        createdAt: new Date().toISOString()
      };

      console.log('저장할 책 정보:', book);
      await database.saveBook(book);
      console.log('책 저장 완료');
      
      navigation.goBack();
    } catch (error) {
      console.error('책 저장 중 오류 발생:', error);
      setError('책 저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <TextInput
          label="책 제목"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="저자 (쉼표로 구분)"
          value={authors}
          onChangeText={setAuthors}
          style={styles.input}
          mode="outlined"
          placeholder="예: 홍길동, 김철수"
        />
        <TextInput
          label="설명"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          mode="outlined"
          multiline
          numberOfLines={4}
        />
        <TextInput
          label="페이지 수"
          value={pageCount}
          onChangeText={setPageCount}
          style={styles.input}
          mode="outlined"
          keyboardType="numeric"
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.button}
          loading={loading}
          disabled={loading}
        >
          저장
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.medium,
  },
  input: {
    marginBottom: spacing.medium,
  },
  button: {
    marginTop: spacing.medium,
  },
  errorText: {
    color: colors.error,
    marginBottom: spacing.small,
  },
}); 