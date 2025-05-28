import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { styles } from './Recommendations.styles';

interface Book {
  id: string;
  title: string;
  authors: string[];
  imageLinks?: {
    thumbnail?: string;
  };
  description?: string;
}

interface RecommendationsProps {
  recommendations: Book[];
  onBookPress: (book: Book) => void;
  onViewAllPress: () => void;
}

export const Recommendations: React.FC<RecommendationsProps> = ({
  recommendations,
  onBookPress,
  onViewAllPress,
}) => {
  const renderBook = (book: Book) => (
    <Card
      key={book.id}
      style={styles.bookCard}
      onPress={() => onBookPress(book)}
    >
      <Image
        source={
          book.imageLinks?.thumbnail
            ? { uri: book.imageLinks.thumbnail }
            : require('@/assets/images/book-placeholder.png')
        }
        style={styles.bookCover}
        resizeMode="cover"
      />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={2}>
          {book.title}
        </Text>
        <Text style={styles.bookAuthor} numberOfLines={1}>
          {book.authors?.join(', ')}
        </Text>
        {book.description && (
          <Text style={styles.bookDescription} numberOfLines={3}>
            {book.description}
          </Text>
        )}
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>추천 도서</Text>
        <Button onPress={onViewAllPress}>전체보기</Button>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {recommendations.map(renderBook)}
      </ScrollView>
    </View>
  );
}; 