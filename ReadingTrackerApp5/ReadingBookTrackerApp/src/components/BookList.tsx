import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { Book } from '@/contexts/BookContext';
import BookCard from '@/components/BookCard';

type BookListProps = {
  books: Book[];
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
};

const BookList = ({ books, ListHeaderComponent }: BookListProps) => {
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
      renderItem={({ item }) => <BookCard book={item} />}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={ListHeaderComponent}
      showsVerticalScrollIndicator={false}
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
    paddingVertical: 24,
  },
});

export default BookList;
