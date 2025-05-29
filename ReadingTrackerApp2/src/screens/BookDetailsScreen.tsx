import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, TextInput, IconButton, Portal, Dialog } from 'react-native-paper';
import { Rating } from 'react-native-ratings';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { colors, spacing } from '@/theme';
import { addBookmark, addReview, setCurrentBook, updateBookmark, deleteBookmark, deleteReview } from '@/store/slices/booksSlice';
import { Book, Bookmark, Review } from '@/store/slices/booksSlice';

export const BookDetailsScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const book = useAppSelector((state) => state.books.currentBook);
  const [showBookmarkDialog, setShowBookmarkDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [bookmarkPage, setBookmarkPage] = useState('');
  const [bookmarkNote, setBookmarkNote] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewContent, setReviewContent] = useState('');
  const [editBookmarkId, setEditBookmarkId] = useState<string | null>(null);
  const [editBookmarkPage, setEditBookmarkPage] = useState('');
  const [editBookmarkNote, setEditBookmarkNote] = useState('');
  const [deleteBookmarkId, setDeleteBookmarkId] = useState<string | null>(null);
  const [deleteReviewId, setDeleteReviewId] = useState<string | null>(null);

  if (!book) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>책 정보를 찾을 수 없습니다.</Text>
      </View>
    );
  }

  const handleAddBookmark = () => {
    if (!bookmarkPage) {
      Alert.alert('오류', '페이지 번호를 입력해주세요.');
      return;
    }

    const page = parseInt(bookmarkPage);
    if (isNaN(page) || page < 1 || page > book.pageCount) {
      Alert.alert('오류', '올바른 페이지 번호를 입력해주세요.');
      return;
    }

    const bookmark: Bookmark = {
      id: Date.now().toString(),
      page,
      note: bookmarkNote,
      createdAt: new Date().toISOString(),
    };

    dispatch(addBookmark({ bookId: book.id, bookmark }));
    setShowBookmarkDialog(false);
    setBookmarkPage('');
    setBookmarkNote('');
  };

  const handleAddReview = () => {
    if (reviewRating === 0) {
      Alert.alert('오류', '평점을 선택해주세요.');
      return;
    }

    const review: Review = {
      id: Date.now().toString(),
      rating: reviewRating,
      content: reviewContent,
      createdAt: new Date().toISOString(),
    };

    dispatch(addReview({ bookId: book.id, review }));
    setShowReviewDialog(false);
    setReviewRating(0);
    setReviewContent('');
  };

  const handleStartReading = () => {
    dispatch(setCurrentBook(book));
  };

  const handleEditBookmark = (bookmark: Bookmark) => {
    setEditBookmarkId(bookmark.id);
    setEditBookmarkPage(bookmark.page.toString());
    setEditBookmarkNote(bookmark.note || '');
    setShowBookmarkDialog(false);
  };

  const handleSaveEditBookmark = () => {
    if (!editBookmarkId) return;
    const page = parseInt(editBookmarkPage);
    if (isNaN(page) || page < 1 || page > book.pageCount) {
      Alert.alert('오류', '올바른 페이지 번호를 입력해주세요.');
      return;
    }
    dispatch(updateBookmark({
      bookId: book.id,
      bookmark: {
        id: editBookmarkId,
        page,
        note: editBookmarkNote,
        createdAt: book.bookmarks.find(b => b.id === editBookmarkId)?.createdAt || new Date().toISOString(),
      },
    }));
    setEditBookmarkId(null);
    setEditBookmarkPage('');
    setEditBookmarkNote('');
  };

  const handleDeleteBookmark = (id: string) => {
    setDeleteBookmarkId(id);
  };

  const confirmDeleteBookmark = () => {
    if (!deleteBookmarkId) return;
    dispatch(deleteBookmark({ bookId: book.id, bookmarkId: deleteBookmarkId }));
    setDeleteBookmarkId(null);
  };

  const handleDeleteReview = (id: string) => {
    setDeleteReviewId(id);
  };

  const confirmDeleteReview = () => {
    if (!deleteReviewId) return;
    dispatch(deleteReview({ bookId: book.id, reviewId: deleteReviewId }));
    setDeleteReviewId(null);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Cover source={{ uri: book.thumbnail }} style={styles.cover} />
        <Card.Content>
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>{book.authors.join(', ')}</Text>
          <Text style={styles.description}>{book.description}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>출판사:</Text>
            <Text style={styles.infoValue}>{book.publisher}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>출판일:</Text>
            <Text style={styles.infoValue}>{book.publishedDate}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>페이지:</Text>
            <Text style={styles.infoValue}>{book.pageCount}페이지</Text>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleStartReading}
          style={styles.button}
        >
          읽기 시작하기
        </Button>
        <Button
          mode="outlined"
          onPress={() => setShowBookmarkDialog(true)}
          style={styles.button}
        >
          북마크 추가
        </Button>
        <Button
          mode="outlined"
          onPress={() => setShowReviewDialog(true)}
          style={styles.button}
        >
          리뷰 작성
        </Button>
      </View>

      {book.bookmarks.length > 0 && (
        <Card style={styles.card}>
          <Card.Title title="북마크" />
          <Card.Content>
            {book.bookmarks.map((bookmark) => (
              <View key={bookmark.id} style={styles.bookmarkItem}>
                <Text style={styles.bookmarkPage}>{bookmark.page}페이지</Text>
                {bookmark.note && (
                  <Text style={styles.bookmarkNote}>{bookmark.note}</Text>
                )}
                <Text style={styles.bookmarkDate}>
                  {new Date(bookmark.createdAt).toLocaleDateString()}
                </Text>
                <View style={{ flexDirection: 'row', marginTop: 4 }}>
                  <IconButton icon="pencil" size={18} onPress={() => handleEditBookmark(bookmark)} />
                  <IconButton icon="delete" size={18} onPress={() => handleDeleteBookmark(bookmark.id)} />
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      {book.reviews.length > 0 && (
        <Card style={styles.card}>
          <Card.Title title="리뷰" />
          <Card.Content>
            {book.reviews.map((review) => (
              <View key={review.id} style={styles.reviewItem}>
                <Rating
                  readonly
                  startingValue={review.rating}
                  imageSize={20}
                  style={styles.rating}
                />
                <Text style={styles.reviewContent}>{review.content}</Text>
                <Text style={styles.reviewDate}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </Text>
                <IconButton icon="delete" size={18} onPress={() => handleDeleteReview(review.id)} />
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      <Portal>
        <Dialog visible={showBookmarkDialog} onDismiss={() => setShowBookmarkDialog(false)}>
          <Dialog.Title>북마크 추가</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="페이지 번호"
              value={bookmarkPage}
              onChangeText={setBookmarkPage}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              label="메모"
              value={bookmarkNote}
              onChangeText={setBookmarkNote}
              multiline
              numberOfLines={3}
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowBookmarkDialog(false)}>취소</Button>
            <Button onPress={handleAddBookmark}>추가</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={showReviewDialog} onDismiss={() => setShowReviewDialog(false)}>
          <Dialog.Title>리뷰 작성</Dialog.Title>
          <Dialog.Content>
            <Rating
              showRating
              onFinishRating={setReviewRating}
              style={styles.rating}
            />
            <TextInput
              label="리뷰 내용"
              value={reviewContent}
              onChangeText={setReviewContent}
              multiline
              numberOfLines={4}
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowReviewDialog(false)}>취소</Button>
            <Button onPress={handleAddReview}>작성</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={!!editBookmarkId} onDismiss={() => setEditBookmarkId(null)}>
          <Dialog.Title>북마크 수정</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="페이지 번호"
              value={editBookmarkPage}
              onChangeText={setEditBookmarkPage}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              label="메모"
              value={editBookmarkNote}
              onChangeText={setEditBookmarkNote}
              multiline
              numberOfLines={3}
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setEditBookmarkId(null)}>취소</Button>
            <Button onPress={handleSaveEditBookmark}>저장</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={!!deleteBookmarkId} onDismiss={() => setDeleteBookmarkId(null)}>
          <Dialog.Title>북마크 삭제</Dialog.Title>
          <Dialog.Content>
            <Text>정말로 이 북마크를 삭제하시겠습니까?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteBookmarkId(null)}>취소</Button>
            <Button onPress={confirmDeleteBookmark}>삭제</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={!!deleteReviewId} onDismiss={() => setDeleteReviewId(null)}>
          <Dialog.Title>리뷰 삭제</Dialog.Title>
          <Dialog.Content>
            <Text>정말로 이 리뷰를 삭제하시겠습니까?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteReviewId(null)}>취소</Button>
            <Button onPress={confirmDeleteReview}>삭제</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.medium,
  },
  card: {
    marginBottom: spacing.medium,
  },
  cover: {
    height: 300,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: spacing.medium,
    marginBottom: spacing.small,
  },
  author: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: spacing.medium,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: spacing.medium,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: spacing.small,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 80,
  },
  infoValue: {
    fontSize: 16,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.medium,
  },
  button: {
    flex: 1,
    marginHorizontal: spacing.small,
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
    marginBottom: spacing.small,
  },
  bookmarkNote: {
    fontSize: 14,
    marginBottom: spacing.small,
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
  reviewContent: {
    fontSize: 14,
    marginVertical: spacing.small,
  },
  reviewDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  input: {
    marginBottom: spacing.small,
  },
  rating: {
    marginBottom: spacing.medium,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: spacing.large,
  },
}); 