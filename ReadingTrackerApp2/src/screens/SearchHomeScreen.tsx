import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Searchbar, Card, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing } from '@/theme';
import { searchBooks } from '@/services/googleBooks';
import { SearchStackParamList } from '@/types/navigation';

type SearchScreenNavigationProp = NativeStackNavigationProp<SearchStackParamList>;

export const SearchHomeScreen: React.FC = () => {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const results = await searchBooks(searchQuery);
      setBooks(results);
    } catch (error) {
      console.error('책 검색 중 오류 발생:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderBookItem = ({ item }: { item: any }) => (
    <Card
      style={styles.bookCard}
      onPress={() => navigation.navigate('BookDetail', { bookId: item.id })}
    >
      <Card.Content>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookAuthor}>
          {item.authors?.join(', ') || '저자 정보 없음'}
        </Text>
        {item.description && (
          <Text style={styles.bookDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="책 제목, 저자, ISBN으로 검색"
        onChangeText={setSearchQuery}
        value={searchQuery}
        onSubmitEditing={handleSearch}
        style={styles.searchBar}
      />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={books}
          renderItem={renderBookItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchBar: {
    margin: spacing.medium,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
}); 