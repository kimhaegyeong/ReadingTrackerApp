import React, { useCallback, useEffect, useMemo } from 'react';
import { FlatList, ListRenderItem, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addBook } from '../store/booksSlice';
import { Book } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import Container from '@/components/common/Container';
import Button from '@/components/common/Button';
import Text from '@/components/common/Text';
import { MaterialIcons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'BooksList'>;

const BooksList: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const books = useAppSelector((state) => state.books.books);
  const isLoading = useAppSelector((state) => state.books.loading);

  // Add a sample book for testing
  useEffect(() => {
    // This is just for testing - remove in production
    if (books.length === 0) {
      const now = new Date().toISOString();
      dispatch(
        addBook({
          title: 'Sample Book',
          author: 'John Doe',
          coverImage: 'https://via.placeholder.com/150',
          pages: 320,
          currentPage: 0,
          status: 'unread',
          categories: [],
          startedAt: now,
          finishedAt: undefined,
          createdAt: now,
          updatedAt: now,
        } as any) // Using 'as any' to bypass the type check for now
      );
    }
  }, [dispatch, books.length]);

  // Handle navigation to add book screen
  const handleAddBook = useCallback(() => {
    navigation.navigate('AddBook');
  }, [navigation]);

  // Handle book press
  const handleBookPress = useCallback((bookId: string) => {
    navigation.navigate('BookDetails', { bookId });
  }, [navigation]);

  // Render book item
  const renderBookItem: ListRenderItem<Book> = useCallback(({ item }) => (
    <TouchableOpacity 
      style={styles.bookItem}
      onPress={() => handleBookPress(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={1}>
          {item.title}
        </Text>
        {item.author && (
          <Text style={styles.bookAuthor} numberOfLines={1}>
            by {item.author}
          </Text>
        )}
        {item.pages && (
          <Text style={styles.bookPages}>
            {item.currentPage || 0}/{item.pages} pages
          </Text>
        )}
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#666" />
    </TouchableOpacity>
  ), [handleBookPress]);

  // Memoize the list header component
  const ListHeaderComponent = useMemo(() => (
    <Text variant="headlineSmall" style={styles.header}>
      My Reading List
    </Text>
  ), []);

  // Memoize the empty component
  const ListEmptyComponent = useMemo(() => (
    <Text style={styles.emptyText} variant="bodyLarge">
      No books added yet. Tap the + button to add one!
    </Text>
  ), []);

  return (
    <Container style={styles.container}>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={renderBookItem}
        ListHeaderComponent={books.length > 0 ? ListHeaderComponent : null}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleAddBook}
      >
        <Text style={styles.addButtonText}>+ Add Book</Text>
      </TouchableOpacity>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  bookInfo: {
    flex: 1,
    marginRight: 12,
  },
  listContent: {
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
  },
  bookPages: {
    color: '#888',
    marginTop: 4,
    fontSize: 13,
  },

  bookTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  bookAuthor: {
    color: '#666',
    marginTop: 4,
    fontSize: 14,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#007AFF',
    width: 120,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BooksList;
