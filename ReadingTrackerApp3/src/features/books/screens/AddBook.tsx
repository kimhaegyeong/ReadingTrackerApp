import React, { useState, useCallback } from 'react';
import { Alert, View, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useBackHandler } from '@/hooks/useBackHandler';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch } from '@/store/hooks';
import { addBookAsync, BookStatus } from '../store/booksSlice';
import BookForm, { BookFormData } from '../components/BookForm';
import { RootStackParamList } from '@/navigation/types';

// Helper function to safely parse numbers from form data
const parseNumber = (value: unknown, defaultValue = 0): number => {
  if (value === undefined || value === null || value === '') return defaultValue;
  if (typeof value === 'number') return value;
  // Handle string input with proper type checking
  const strValue = String(value);
  const trimmed = strValue.trim();
  if (trimmed === '') return defaultValue;
  const parsed = parseInt(trimmed, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

type AddBookNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddBook'>;

const AddBook = () => {
  const navigation = useNavigation<AddBookNavigationProp>();
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Handle navigation away with unsaved changes
  useBackHandler(() => {
    if (hasUnsavedChanges) {
      Alert.alert(
        'Discard changes?',
        'You have unsaved changes. Are you sure you want to discard them?',
        [
          { text: 'Cancel', style: 'cancel' as const, onPress: () => {} },
          {
            text: 'Discard',
            style: 'destructive' as const,
            onPress: () => navigation.goBack(),
          },
        ]
      );
      return true; // Prevent default back behavior
    }
    return false; // Allow default back behavior
  });

  // Helper function to safely convert to string and trim
  const safeString = (value: unknown): string => 
    value !== null && value !== undefined ? String(value).trim() : '';
    
  // Define the shape of the validated book data
  type ValidatedBookData = {
    title: string;
    author: string;
    pages: number;
    currentPage: number;
    description?: string;
    isbn?: string;
    coverImage?: string;
    publisher?: string;
    publishedDate?: string;
    categories: string | string[]; // Can be either string (comma-separated) or array
  };

  const validateBookData = (formData: BookFormData): { valid: false; message: string } | { valid: true; data: ValidatedBookData } => {
    // Convert form data to validated data with proper types
    const data: Record<string, unknown> = { ...formData };
    // Validate title
    const title = safeString(data.title);
    if (!title) {
      return { valid: false, message: 'Title is required' };
    }
    
    // Validate author
    const author = safeString(data.author);
    if (!author) {
      return { valid: false, message: 'Author is required' };
    }
    
    // Validate pages
    const pagesValue = data.pages;
    if (pagesValue === undefined || pagesValue === null || pagesValue === '') {
      return { valid: false, message: 'Number of pages is required' };
    }
    
    // Convert to number safely
    const pages = parseNumber(pagesValue, -1);
    if (pages <= 0) {
      return { valid: false, message: 'Pages must be a positive number' };
    }
    
    // Validate current page
    const currentPage = Math.max(0, parseNumber(data.currentPage, 0));
      
    if (currentPage > pages) {
      return { valid: false, message: 'Current page cannot exceed total pages' };
    }
    
    return {
      valid: true,
      data: {
        title,
        author,
        pages,
        currentPage,
        description: data.description ? String(data.description).trim() : undefined,
        isbn: data.isbn ? String(data.isbn).trim() : undefined,
        coverImage: data.coverImage ? String(data.coverImage).trim() : undefined,
        publisher: data.publisher ? String(data.publisher).trim() : undefined,
        publishedDate: data.publishedDate ? String(data.publishedDate).trim() : undefined,
        categories: data.categories 
          ? Array.isArray(data.categories) 
            ? data.categories 
            : String(data.categories).trim() 
          : []
      }
    };
  };

  const handleSubmit = async (formData: BookFormData) => {
    try {
      console.log('Form submitted with data:', formData);
      setIsSubmitting(true);
      
      // Validate form data
      const validation = validateBookData(formData);
      if (!validation.valid) {
        Alert.alert('Validation Error', validation.message);
        return;
      }

      const { 
        title, 
        author, 
        pages = 0, 
        currentPage = 0, 
        description, 
        isbn, 
        coverImage, 
        publisher, 
        publishedDate, 
        categories: categoriesInput 
      } = validation.data;
      
      // Process categories - ensure it's always a string (comma-separated if array)
      const categories = (() => {
        if (Array.isArray(categoriesInput)) {
          return categoriesInput.map(String).filter(Boolean).join(',');
        }
        if (typeof categoriesInput === 'string') {
          return categoriesInput.split(',').map((cat: string) => cat.trim()).filter(Boolean).join(',');
        }
        return ''; // Return empty string instead of empty array
      })();

      // Determine status based on current page
      const status: BookStatus = currentPage > 0 
        ? (currentPage >= pages ? BookStatus.Finished : BookStatus.Reading)
        : BookStatus.Unread;
      
      // Prepare the book data for the API with all required fields
      const bookDataForApi = {
        title,
        author,
        pages,
        currentPage,
        description,
        isbn,
        coverImage,
        publisher,
        publishedDate,
        categories,
        status
      };
      
      console.log('Book data prepared:', bookDataForApi);
      
      // Dispatch the async thunk with the prepared data
      const resultAction = await dispatch(addBookAsync(bookDataForApi));
      
      // Check if the async action was successful
      if (addBookAsync.fulfilled.match(resultAction)) {
        // Clear unsaved changes flag on successful submission
        setHasUnsavedChanges(false);
        
        // Show success message
        Alert.alert('Success', 'Book added successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        throw new Error('Failed to add book');
      }
    } catch (error) {
      console.error('Failed to add book:', error);
      let errorMessage = 'Failed to add book. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('network')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        } else if (error.message.includes('validation') || error.message.includes('required')) {
          errorMessage = 'Please fill in all required fields correctly.';
        } else if (error.message.includes('duplicate')) {
          errorMessage = 'A book with this title and author already exists.';
        } else if (error.message) {
          errorMessage = error.message;
        }
      }
      
      Alert.alert(
        'Error',
        errorMessage,
        [
          { 
            text: 'OK', 
            style: 'default',
            onPress: () => console.log('Error alert closed') 
          },
          {
            text: 'Try Again',
            style: 'cancel',
            onPress: () => handleSubmit(formData)
          }
        ]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <View style={styles.container}>
      <BookForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitButtonText="Add Book"
        onCancel={navigation.goBack}
        onFormDirtyChange={setHasUnsavedChanges}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
});

export default AddBook;
