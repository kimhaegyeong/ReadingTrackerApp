import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Text, Button, ProgressBar, useTheme, IconButton } from 'react-native-paper';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/navigation/HomeStack';
import { useAppSelector } from '@/store/hooks';
import { Book } from '@/store/slices/booksSlice';

type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'LibraryHome'>;

export const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const books = useAppSelector((state) => state.books.books);
  const theme = useTheme();

  const handleBookPress = (bookId: string) => {
    navigation.navigate('BookDetail', { bookId });
  };

  const getProgress = (book: Book) => {
    if (!book.pageCount || book.pageCount === 0) return 0;
    return (book.currentPage || 0) / book.pageCount;
  };

  const handleSearchPress = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'Search',
        params: {
          screen: 'SearchHome',
        },
      })
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <IconButton
        icon="book-open-variant"
        size={80}
        iconColor={theme.colors.primary}
        style={styles.emptyIcon}
      />
      <Text style={styles.emptyTitle}>아직 추가된 책이 없어요</Text>
      <Text style={styles.emptySubtitle}>
        책을 검색하고 내 서재에 추가해보세요
      </Text>
      <Button 
        mode="contained" 
        onPress={handleSearchPress}
        style={styles.addButton}
      >
        책 검색하기
      </Button>
    </View>
  );

  const renderBookItem = ({ item }: { item: Book }) => (
    <Card style={styles.card} onPress={() => handleBookPress(item.id)}>
      <Card.Cover source={{ uri: item.thumbnail }} />
      <Card.Title 
        title={item.title} 
        subtitle={item.authors?.join(', ')}
      />
      <Card.Content>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {item.currentPage || 0} / {item.pageCount || '?'} 페이지
          </Text>
          <ProgressBar
            progress={getProgress(item)}
            style={styles.progressBar}
            color={theme.colors.primary}
          />
        </View>
        <Text style={styles.status}>
          상태: {item.status === 'reading' ? '읽는 중' : 
                 item.status === 'completed' ? '완독' : '읽을 예정'}
        </Text>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => navigation.navigate('BookDetail', { bookId: item.id })}>
          독서 시작
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderBookItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressText: {
    marginBottom: 4,
    fontSize: 12,
    color: '#666',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  status: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 40,
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  addButton: {
    paddingHorizontal: 24,
  },
}); 