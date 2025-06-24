import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { useBookContext, Quote, Note } from '../../contexts/BookContext';
import { Card } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { Feather } from '@expo/vector-icons';

type TaggedItem = (Quote | Note) & { bookTitle: string; bookId: string; type: 'quote' | 'note' };

export default function TagDetailScreen() {
  const { tag } = useLocalSearchParams<{ tag: string }>();
  const { books } = useBookContext();
  const router = useRouter();
  const decodedTag = tag ? decodeURIComponent(tag) : '';

  const taggedItems: TaggedItem[] = [];
  books.forEach(book => {
    book.quotes
      .filter(q => q.tags.includes(decodedTag))
      .forEach(q => taggedItems.push({ ...q, bookTitle: book.title, bookId: book.id, type: 'quote' }));
    book.notes
      .filter(n => n.tags.includes(decodedTag))
      .forEach(n => taggedItems.push({ ...n, bookTitle: book.title, bookId: book.id, type: 'note' }));
  });

  const renderItem = ({ item }: { item: TaggedItem }) => (
    <Card style={styles.itemCard}>
      <Text style={styles.itemText}>{item.text}</Text>
      <View style={styles.itemFooter}>
        <Text style={styles.bookTitle}>- {item.bookTitle}</Text>
        <Badge style={item.type === 'quote' ? styles.quoteBadge : styles.noteBadge}>
          {item.type === 'quote' ? '인용' : '메모'}
        </Badge>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#6366F1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
          #{decodedTag}
        </Text>
      </View>
      <Stack.Screen options={{ title: `#${decodedTag}` }} />
      <FlatList
        data={taggedItems}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={() => (
          <Text style={styles.sectionHeader}>'{decodedTag}' 태그가 포함된 기록</Text>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>해당 태그를 가진 기록이 없습니다.</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  listContainer: { padding: 16 },
  sectionHeader: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#1F2937' },
  itemCard: { marginBottom: 12, padding: 16 },
  itemText: { fontSize: 16, color: '#374151', marginBottom: 12 },
  itemFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bookTitle: { fontSize: 14, color: '#6B7280', fontStyle: 'italic' },
  quoteBadge: { backgroundColor: '#DBEAFE', },
  noteBadge: { backgroundColor: '#FEE2E2', },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyText: { fontSize: 16, color: '#9CA3AF' },
}); 