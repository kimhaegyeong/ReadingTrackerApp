import React, { useState, useEffect, useCallback } from 'react';
import { Alert, StyleSheet, View, BackHandler } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useBackHandler } from '@/hooks/useBackHandler';
import { useAppDispatch } from '@/store/hooks';
import { updateBook } from '../store/booksSlice';
import { Book } from '../types';
import { BookStatus } from '../types/book';
import BookForm, { bookSchema, BookFormData } from '../components/BookForm';
import { RootStackParamList } from '@/navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as yup from 'yup';

type EditBookRouteProp = {
  key: string;
  name: string;
  params: {
    book: Book;
  };
};

// Define the form data type based on the book schema but make all fields optional
// Form data type that matches the Book type but with categories as string for the form
type FormData = Partial<{
  title: string;
  author: string;
  pages: number;
  currentPage: number;
  isbn?: string;
  description?: string;
  coverImage?: string;
  publisher?: string;
  publishedDate?: string;
  rating?: number;
  categories?: string[]; // string[]로 변경
  notes?: string;
  status: BookStatus;
}>

type EditBookNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditBook'>;

const EditBook = () => {
  const navigation = useNavigation<EditBookNavigationProp>();
  const route = useRoute<EditBookRouteProp>();
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const { book } = route.params;

  // Handle navigation away with unsaved changes
  useFocusEffect(
    useCallback(() => {
      const unsubscribe = navigation.addListener('beforeRemove', (e) => {
        if (!hasUnsavedChanges) {
          return;
        }

        e.preventDefault();

        Alert.alert(
          'Discard changes?',
          'You have unsaved changes. Are you sure you want to discard them?',
          [
            { text: 'Cancel', style: 'cancel', onPress: () => {} },
            {
              text: 'Discard',
              style: 'destructive',
              onPress: () => navigation.dispatch(e.data.action),
            },
          ]
        );
      });

      return unsubscribe;
    }, [navigation, hasUnsavedChanges])
  );

  // Handle hardware back button on Android
  const handleBackPress = useCallback(() => {
    if (hasUnsavedChanges) {
      Alert.alert(
        'Discard changes?',
        'You have unsaved changes. Are you sure you want to discard them?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
        ]
      );
      return true;
    }
    return false;
  }, [hasUnsavedChanges, navigation]);

  useBackHandler(handleBackPress);

  const handleSubmit = async (formData: BookFormData) => {
    try {
      setIsSubmitting(true);
      
      // categories를 항상 string[]로 보장
      const categories: string[] = Array.isArray(formData.categories)
        ? formData.categories.filter((cat): cat is string => Boolean(cat))
        : typeof formData.categories === 'string'
          ? (formData.categories as string).split(',').map((cat: string) => cat.trim()).filter((cat): cat is string => Boolean(cat))
          : [];
      
      // Book 타입에 맞게 변환
      const updatedBook: Book = {
        ...book,
        ...formData,
        id: book.id,
        categories,
        // Update startedAt if just started reading
        startedAt: formData.status === BookStatus.Reading && !book.startedAt 
          ? new Date().toISOString() 
          : book.startedAt,
        // Update finishedAt if just finished
        finishedAt: formData.status === BookStatus.Finished && !book.finishedAt 
          ? new Date().toISOString() 
          : formData.status === BookStatus.Finished 
            ? book.finishedAt 
            : undefined,
        // Ensure required fields have default values
        currentPage: formData.currentPage ?? 0,
        pages: formData.pages ?? 0,
        status: formData.status ?? BookStatus.Unread,
        // Preserve timestamps
        createdAt: book.createdAt,
        updatedAt: new Date().toISOString(),
      };

      // Validate the data against the schema
      await bookSchema.validate(updatedBook, { abortEarly: false });
      
      // Extract only the fields that can be updated
      const { id, createdAt, updatedAt: _, ...updates } = updatedBook;
      
      // Prepare the update data with proper types
      const updateData = {
        id,
        ...updates,
        categories
      };
      
      // Dispatch the update action with type assertion
      await dispatch(updateBook(updateData as any));
      
      // Navigate back on success
      navigation.goBack();
    } catch (error: unknown) {
      console.error('Failed to update book:', error);
      
      // Handle validation errors
      if (error instanceof yup.ValidationError) {
        const errorMessage = error.errors?.join('\n') || 'Please check your input and try again.';
        Alert.alert('Validation Error', errorMessage);
      } else {
        Alert.alert('Error', 'Failed to update book. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <BookForm
        initialValues={{
          title: book.title,
          author: book.author,
          pages: book.pages,
          currentPage: book.currentPage,
          isbn: book.isbn,
          description: book.description,
          coverImage: book.coverImage,
          publisher: book.publisher,
          publishedDate: book.publishedDate,
          rating: book.rating,
          categories: Array.isArray(book.categories)
            ? book.categories.filter((cat): cat is string => Boolean(cat))
            : typeof book.categories === 'string'
              ? (book.categories as string).split(',').map((cat: string) => cat.trim()).filter((cat): cat is string => Boolean(cat))
              : [],
          notes: book.notes,
          status: book.status,
        }}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitButtonText="Update Book"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default EditBook;
