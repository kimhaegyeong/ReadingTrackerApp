import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, TextInput, IconButton } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Book } from '@/store/slices/booksSlice';
import { colors, spacing } from '@/theme';
import { Rating } from '@/components/Rating';

interface Bookmark {
  id: string;
  page: number;
  note: string;
  createdAt: string;
}

interface Review {
  id: string;
  rating: number;
  text: string;
  createdAt: string;
}

export const BookDetailScreen: React.FC<{ route: { params: { bookId: string } } }> = ({ route }) => {
  const { bookId } = route.params;
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.currentUser);
  const book = useAppSelector((state) => 
    state.books.books.find((b: Book) => b.id === bookId)
  );

  const [bookmarkPage, setBookmarkPage] = useState('');
  const [bookmarkNote, setBookmarkNote] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  if (!book) {
    return (
      <View style={styles.container}>
        <Text>책을 찾을 수 없습니다.</Text>
      </View>
    );
  }

  const userData = book.userSpecificData?.[user?.id || ''];

  const handleAddBookmark = () => {
    if (!user || !book) return;

    const page = parseInt(bookmarkPage);
    if (isNaN(page) || page < 0 || page > book.pageCount) {
      Alert.alert('오류', '유효한 페이지 번호를 입력해주세요.');
      return;
    }

    const bookmark: Bookmark = {
      id: Date.now().toString(),
      page,
      note: bookmarkNote,
      createdAt: new Date().toISOString(),
    };

    dispatch({
      type: 'books/updateBook',
      payload: {
        ...book,
        userSpecificData: {
          ...book.userSpecificData,
          [user.id]: {
            ...book.userSpecificData?.[user.id],
            bookmarks: [
              ...(book.userSpecificData?.[user.id]?.bookmarks || []),
              bookmark,
            ],
          },
        },
      },
    });

    // 활동 추가
    dispatch({
      type: 'stats/addActivity',
      payload: {
        id: Date.now().toString(),
        type: 'bookmark',
        description: `${book.title} ${page}페이지 북마크 추가`,
        timestamp: new Date().toISOString(),
        bookId: book.id,
      },
    });

    setBookmarkPage('');
    setBookmarkNote('');
  };

  const handleAddReview = () => {
    if (!user || !book) return;

    if (reviewRating === 0) {
      Alert.alert('오류', '평점을 선택해주세요.');
      return;
    }

    const review: Review = {
      id: Date.now().toString(),
      rating: reviewRating,
      text: reviewText,
      createdAt: new Date().toISOString(),
    };

    dispatch({
      type: 'books/updateBook',
      payload: {
        ...book,
        userSpecificData: {
          ...book.userSpecificData,
          [user.id]: {
            ...book.userSpecificData?.[user.id],
            reviews: [
              ...(book.userSpecificData?.[user.id]?.reviews || []),
              review,
            ],
          },
        },
      },
    });

    // 활동 추가
    dispatch({
      type: 'stats/addActivity',
      payload: {
        id: Date.now().toString(),
        type: 'review',
        description: `${book.title} 리뷰 작성 (${reviewRating}점)`,
        timestamp: new Date().toISOString(),
        bookId: book.id,
      },
    });

    setReviewRating(0);
    setReviewText('');
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.bookCard}>
        <Card.Content>
          <Text style={styles.bookTitle}>{book.title}</Text>
          <Text style={styles.bookAuthor}>
            {book.authors.join(', ')}
          </Text>
          {book.description && (
            <Text style={styles.bookDescription}>{book.description}</Text>
          )}
          <View style={styles.bookDetails}>
            {book.pageCount > 0 && (
              <Text style={styles.bookDetail}>
                {book.pageCount} 페이지
              </Text>
            )}
            {book.publishedDate && (
              <Text style={styles.bookDetail}>
                {new Date(book.publishedDate).getFullYear()}년 출간
              </Text>
            )}
            {book.publisher && (
              <Text style={styles.bookDetail}>
                {book.publisher} 출판
              </Text>
            )}
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.sectionCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>북마크 추가</Text>
          <TextInput
            mode="outlined"
            label="페이지"
            value={bookmarkPage}
            onChangeText={setBookmarkPage}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            mode="outlined"
            label="메모"
            value={bookmarkNote}
            onChangeText={setBookmarkNote}
            multiline
            numberOfLines={3}
            style={styles.input}
          />
          <Button
            mode="contained"
            onPress={handleAddBookmark}
            style={styles.button}
          >
            북마크 추가
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.sectionCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>리뷰 작성</Text>
          <Rating
            value={reviewRating}
            onValueChange={setReviewRating}
            style={styles.rating}
          />
          <TextInput
            mode="outlined"
            label="리뷰"
            value={reviewText}
            onChangeText={setReviewText}
            multiline
            numberOfLines={4}
            style={styles.input}
          />
          <Button
            mode="contained"
            onPress={handleAddReview}
            style={styles.button}
          >
            리뷰 작성
          </Button>
        </Card.Content>
      </Card>

      {userData?.bookmarks && userData.bookmarks.length > 0 && (
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>북마크 목록</Text>
            {userData.bookmarks.map((bookmark: Bookmark) => (
              <View key={bookmark.id} style={styles.bookmarkItem}>
                <Text style={styles.bookmarkPage}>{bookmark.page}페이지</Text>
                {bookmark.note && (
                  <Text style={styles.bookmarkNote}>{bookmark.note}</Text>
                )}
                <Text style={styles.bookmarkDate}>
                  {new Date(bookmark.createdAt).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      {userData?.reviews && userData.reviews.length > 0 && (
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>리뷰 목록</Text>
            {userData.reviews.map((review: Review) => (
              <View key={review.id} style={styles.reviewItem}>
                <Rating
                  value={review.rating}
                  readonly
                  style={styles.reviewRating}
                />
                {review.text && (
                  <Text style={styles.reviewText}>{review.text}</Text>
                )}
                <Text style={styles.reviewDate}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bookCard: {
    margin: spacing.medium,
  },
  bookTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: spacing.xsmall,
  },
  bookAuthor: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.medium,
  },
  bookDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.medium,
  },
  bookDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  bookDetail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: spacing.medium,
    marginBottom: spacing.xsmall,
  },
  sectionCard: {
    margin: spacing.medium,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.medium,
  },
  input: {
    marginBottom: spacing.medium,
  },
  button: {
    marginTop: spacing.small,
  },
  rating: {
    marginBottom: spacing.medium,
  },
  bookmarkItem: {
    marginBottom: spacing.medium,
    padding: spacing.small,
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  bookmarkPage: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: spacing.xsmall,
  },
  bookmarkNote: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xsmall,
  },
  bookmarkDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  reviewItem: {
    marginBottom: spacing.medium,
    padding: spacing.small,
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  reviewRating: {
    marginBottom: spacing.xsmall,
  },
  reviewText: {
    fontSize: 14,
    marginBottom: spacing.xsmall,
  },
  reviewDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
}); 