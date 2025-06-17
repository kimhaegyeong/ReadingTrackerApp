import React, { useCallback } from 'react';
import { View, StyleSheet, FlatList, ListRenderItem, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useAppSelector } from '../../../store/hooks';
import { Book } from '../store/booksSlice';
import { Text, FAB } from '../../../components/common';
import { colors, spacing } from '@/theme';
import { Ionicons } from '@expo/vector-icons';

type BookItemProps = {
  book: Book;
  onPress: (book: Book) => void;
};

const BookItem = React.memo(({ book, onPress }: BookItemProps) => (
  <TouchableOpacity 
    style={styles.bookItem} 
    onPress={() => onPress(book)}
    activeOpacity={0.7}
  >
    {book.coverImage ? (
      <Image 
        source={{ uri: book.coverImage }} 
        style={styles.bookCover} 
        resizeMode="cover"
      />
    ) : (
      <View style={styles.bookCoverPlaceholder}>
        <Ionicons name="book" size={32} color={colors.gray} />
      </View>
    )}
    <View style={styles.bookInfo}>
      <Text style={styles.bookTitle} numberOfLines={1}>
        {book.title}
      </Text>
      <Text style={styles.bookAuthor} numberOfLines={1}>
        {book.author}
      </Text>
      {book.currentPage !== undefined && book.pages && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(book.currentPage / book.pages) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {book.currentPage} / {book.pages} pages
          </Text>
        </View>
      )}
    </View>
  </TouchableOpacity>
));

const BookList = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'BooksList'>>();
  const books = useAppSelector(state => state.books.books);
  const status = useAppSelector(state => state.books.status);

  const handleBookPress = useCallback((book: Book) => {
    navigation.navigate('BookDetails', { bookId: book.id });
  }, [navigation]);

  const renderBookItem: ListRenderItem<Book> = useCallback(({ item }) => (
    <BookItem book={item} onPress={handleBookPress} />
  ), [handleBookPress]);

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="book-outline" size={48} color={colors.gray} />
      <Text style={styles.emptyText}>No books added yet</Text>
      <Text style={styles.emptySubtext}>Tap the + button to add your first book</Text>
    </View>
  );

  const handleAddBook = () => {
    navigation.navigate('AddBook');
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderBookItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyList}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={5}
      />
      <FAB onPress={handleAddBook} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.md,
    flexGrow: 1,
  },
  bookItem: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  bookCover: {
    width: 60,
    height: 90,
    borderRadius: 4,
    backgroundColor: colors.lightGray,
  },
  bookCoverPlaceholder: {
    width: 60,
    height: 90,
    borderRadius: 4,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookInfo: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  bookAuthor: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: spacing.xs,
  },
  progressContainer: {
    marginTop: spacing.xs,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.lightGray,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: colors.gray,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
  },
});

export default BookList;
