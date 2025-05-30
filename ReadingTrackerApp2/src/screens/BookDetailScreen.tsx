import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, TextInput, IconButton, ActivityIndicator } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Book } from '@/store/slices/booksSlice';
import { colors, spacing } from '@/theme';
import { Rating } from '@/components/Rating';
import * as database from '@/services/database';

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
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarkPage, setBookmarkPage] = useState('');
  const [bookmarkNote, setBookmarkNote] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    loadBookData();
  }, [bookId]);

  const loadBookData = async () => {
    try {
      setLoading(true);
      const bookData = await database.loadBook(bookId);
      if (!bookData) {
        Alert.alert('오류', '책 정보를 찾을 수 없습니다.');
        return;
      }
      setBook(bookData);

      if (user) {
        const userBookData = await database.loadUserBookData(bookId, user.id);
        const userBookmarks = await database.loadBookmarks(bookId, user.id);
        const userReviews = await database.loadReviews(bookId, user.id);

        setUserData(userBookData);
        setBookmarks(userBookmarks);
        setReviews(userReviews);
      }
    } catch (error) {
      console.error('데이터 로드 중 오류 발생:', error);
      Alert.alert('오류', '데이터를 불러오는 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBookmark = async () => {
    if (!book || !user) return;

    const page = parseInt(bookmarkPage);
    if (isNaN(page) || page <= 0) {
      Alert.alert('오류', '유효한 페이지 번호를 입력해주세요.');
      return;
    }

    if (book.pageCount > 0 && page > book.pageCount) {
      Alert.alert('오류', `페이지 번호는 ${book.pageCount} 이하여야 합니다.`);
      return;
    }

    try {
      const bookmark: Bookmark = {
        id: Date.now().toString(),
        page,
        note: bookmarkNote,
        createdAt: new Date().toISOString()
      };

      await database.saveBookmark(bookId, user.id, bookmark);
      setBookmarks([...bookmarks, bookmark]);
      setBookmarkPage('');
      setBookmarkNote('');
      Alert.alert('성공', '북마크가 추가되었습니다.');
    } catch (error) {
      console.error('북마크 추가 중 오류 발생:', error);
      Alert.alert('오류', '북마크 추가 중 문제가 발생했습니다.');
    }
  };

  const handleAddReview = async () => {
    if (!book || !user) return;

    if (reviewRating === 0) {
      Alert.alert('오류', '평점을 선택해주세요.');
      return;
    }

    try {
      const review: Review = {
        id: Date.now().toString(),
        rating: reviewRating,
        text: reviewText,
        createdAt: new Date().toISOString()
      };

      await database.saveReview(bookId, user.id, review);
      setReviews([...reviews, review]);
      setReviewRating(0);
      setReviewText('');
      Alert.alert('성공', '리뷰가 등록되었습니다.');
    } catch (error) {
      console.error('리뷰 등록 중 오류 발생:', error);
      Alert.alert('오류', '리뷰 등록 중 문제가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!book) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>책 정보를 찾을 수 없습니다.</Text>
      </View>
    );
  }

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

      {bookmarks.length > 0 && (
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>북마크 목록</Text>
            {bookmarks.map((bookmark) => (
              <View key={bookmark.id} style={styles.bookmarkItem}>
                <Text style={styles.bookmarkPage}>
                  {bookmark.page} 페이지
                </Text>
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
            label="리뷰 내용"
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
            리뷰 등록
          </Button>
        </Card.Content>
      </Card>

      {reviews.length > 0 && (
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>리뷰 목록</Text>
            {reviews.map((review) => (
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
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