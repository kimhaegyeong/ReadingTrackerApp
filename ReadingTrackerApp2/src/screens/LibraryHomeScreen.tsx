import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Card, FAB, ActivityIndicator } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppSelector } from '@/store/hooks';
import { colors, spacing } from '@/theme';
import * as database from '@/services/database';
import { LibraryStackParamList } from '@/types/navigation';
import { Book } from '@/store/slices/booksSlice';

type LibraryScreenNavigationProp = NativeStackNavigationProp<LibraryStackParamList>;

export const LibraryHomeScreen: React.FC = () => {
  const navigation = useNavigation<LibraryScreenNavigationProp>();
  const user = useAppSelector((state) => state.user.currentUser);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadBooks = async () => {
    try {
      console.log('책 목록 로드 시작');
      const allBooks = await database.loadAllBooks();
      console.log('로드된 책 목록:', allBooks);
      setBooks(allBooks as Book[]);
    } catch (error) {
      console.error('책 목록 로드 중 오류 발생:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 화면이 포커스될 때마다 데이터 새로고침
  useFocusEffect(
    React.useCallback(() => {
      loadBooks();
    }, [])
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadBooks();
  }, []);

  const renderBookItem = ({ item }: { item: Book }) => (
    <Card
      style={styles.bookCard}
      onPress={() => navigation.navigate('BookDetail', { bookId: item.id })}
    >
      <Card.Content>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookAuthor}>
          {Array.isArray(item.authors) ? item.authors.join(', ') : item.authors}
        </Text>
        {item.description && (
          <Text style={styles.bookDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderBookItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>등록된 책이 없습니다.</Text>
            <Text style={styles.emptySubText}>
              + 버튼을 눌러 새로운 책을 추가해보세요.
            </Text>
          </View>
        }
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('ManualBookEntry')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.medium,
  },
  bookCard: {
    marginBottom: spacing.medium,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.xsmall,
  },
  bookAuthor: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.small,
  },
  bookDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  fab: {
    position: 'absolute',
    margin: spacing.medium,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.large,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginBottom: spacing.small,
  },
  emptySubText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
}); 