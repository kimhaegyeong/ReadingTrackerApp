import React from 'react';
import { View, Text, FlatList, StyleSheet, ListRenderItem } from 'react-native';
import { Book } from '@/contexts/BookContext';
import BookCard from '@/components/BookCard';

type BookListProps = {
  books: Book[];
};

const BookList = ({ books }: BookListProps) => {
  const renderItem: ListRenderItem<Book> = ({ item }) => <BookCard book={item} />;

  if (books.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>등록된 도서가 없습니다.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={books}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    marginTop: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  }
});

export default BookList; 