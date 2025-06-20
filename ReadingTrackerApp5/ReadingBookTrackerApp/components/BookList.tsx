import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { Book } from '../contexts/BookContext';
import BookCard from './BookCard';

interface BookListProps {
  books: Book[];
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null | undefined;
}

const BookList = ({ books, ListHeaderComponent }: BookListProps) => {
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
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});

export default BookList; 