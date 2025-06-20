import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Book, useBookContext, BookStatus } from '@/contexts/BookContext';
import { Badge } from '@/components/ui/Badge';

const statusColor: Record<BookStatus, string> = {
  '읽는 중': '#FACC15',
  '다 읽은': '#22C55E',
  '읽고 싶은': '#818CF8',
};

const BookCard = ({ book }: { book: Book }) => {
  const { removeBook } = useBookContext();
  const router = useRouter();
  // const [menuOpen, setMenuOpen] = useState(false); // Menu can be added later

  const handlePress = () => {
    router.push(`/book/${book.id}` as any);
  };

  const handleDelete = () => {
    Alert.alert(
      '도서 삭제',
      `'${book.title}'을(를) 정말로 삭제하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => removeBook(book.id),
        },
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.8}>
      <View style={[styles.cover, { backgroundColor: statusColor[book.status] || '#E5E7EB' }]}>
        <Text style={styles.coverText}>{book.title[0]}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>{book.title}</Text>
        <Text style={styles.author} numberOfLines={1}>{book.author}</Text>
        <Badge
          color={statusColor[book.status]}
          style={{ marginTop: 4 }}
          textStyle={{ color: '#fff', fontWeight: '500' }}
        >
          {book.status}
        </Badge>
      </View>
      <TouchableOpacity style={styles.menuButton} onPress={handleDelete}>
        <Text style={styles.menuText}>⋮</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },
  cover: {
    width: 48,
    height: 64,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  coverText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    fontSize: 17,
    color: '#1F2937',
    marginBottom: 2,
  },
  author: {
    color: '#6B7280',
    fontSize: 14,
  },
  menuButton: {
    marginLeft: 8,
    padding: 8,
  },
  menuText: {
    fontSize: 22,
    color: '#6B7280',
  },
});

export default BookCard; 