import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Book, useBookContext, BookStatus } from '@/contexts/BookContext';
import { Badge } from '@/components/ui/Badge';

const statusColorMap: Record<BookStatus, string> = {
  '읽는 중': '#FACC15',
  '다 읽은': '#22C55E',
  '읽고 싶은': '#818CF8',
};

const BookCard = ({ book }: { book: Book }) => {
  const { removeBook } = useBookContext();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handlePress = () => {
    router.push(`/book/${book.id}`);
  };

  const handleMenuPress = (e: any) => {
    e.stopPropagation(); // Prevent card press when opening menu
    setMenuOpen(prev => !prev);
  };

  const handleDeletePress = (e: any) => {
    e.stopPropagation();
    // The confirmation is now handled inside removeBook
    removeBook(book.id);
    setMenuOpen(false);
  };

  const statusColor = statusColorMap[book.status] || '#E5E7EB';
  
  return (
    <TouchableOpacity onPress={handlePress} style={styles.card}>
      {book.coverImage ? (
         <Image source={{ uri: book.coverImage }} style={styles.coverImage} />
      ) : (
        <View style={[styles.coverImage, { backgroundColor: statusColor, justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={styles.coverLetter}>{book.title[0]}</Text>
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>{book.title}</Text>
        <Text style={styles.author} numberOfLines={1}>{book.author}</Text>
        <Badge style={[styles.badge, { backgroundColor: statusColor }]}>
          <Text style={styles.badgeText}>{book.status}</Text>
        </Badge>
      </View>
      
      <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>
        <Text style={styles.menuText}>⋮</Text>
      </TouchableOpacity>

      {menuOpen && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity onPress={handleDeletePress} style={styles.dropdownItem}>
            <Text style={styles.deleteText}>삭제</Text>
          </TouchableOpacity>
        </View>
      )}
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
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  coverImage: {
    width: 48,
    height: 64,
    borderRadius: 8,
    marginRight: 16,
  },
  coverLetter: {
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
    marginBottom: 2,
  },
  author: {
    color: '#6B7280',
    fontSize: 14,
    marginBottom: 4,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  badgeText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 12,
  },
  menuButton: {
    padding: 8,
    marginLeft: 8,
  },
  menuText: {
    fontSize: 22,
    color: '#6B7280',
    fontWeight: 'bold'
  },
  dropdownMenu: {
    position: 'absolute',
    top: 45,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  deleteText: {
    color: '#EF4444',
    fontWeight: '500',
  }
});

export default BookCard; 