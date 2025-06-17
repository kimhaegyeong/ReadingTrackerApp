import React, { useLayoutEffect, useState, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  Image, 
  ScrollView, 
  Alert, 
  Platform,
  TouchableOpacity,
  Linking,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  updateBook, 
  removeBook,
  startReading, 
  finishReading,
  updateReadingProgress,
  BookStatus
} from '../store/booksSlice';
import { Book } from '../types';
import { Button, Text, Container, Input } from '@/components/common';
import { RootStackParamList } from '@/navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@/theme';
import { format, parseISO, differenceInDays } from 'date-fns';

// Define text styles to replace typography
const textStyles = StyleSheet.create({
  h1: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  h2: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  body: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});

type BookDetailsRouteProp = {
  key: string;
  name: string;
  params: {
    book?: Book;
    bookId?: string;
  };
};

type BookDetailsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BookDetails'>;

const BookDetails = () => {
  const navigation = useNavigation<BookDetailsNavigationProp>();
  const route = useRoute<BookDetailsRouteProp>();
  const dispatch = useAppDispatch();
  
  // Get book from route params or find it in the store
  const routeBook = route.params?.book;
  const routeBookId = route.params?.bookId;
  
  // Find book in the store if only bookId is provided
  const foundBook = useAppSelector((state) => 
    routeBookId ? state.books.books.find((b) => b.id === routeBookId) : null
  );
  
  // Use the book from route params or the one found in the store
  const book = routeBook || foundBook;
  
  // Navigate back if book is not found
  React.useEffect(() => {
    if (!book) {
      Alert.alert('Error', 'Book not found', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }
  }, [book, navigation]);
  
  if (!book) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const [isProgressModalVisible, setProgressModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(book.currentPage?.toString() || '0');
  const [isUpdating, setUpdating] = useState(false);

  const progress = book.pages ? Math.round((book.currentPage / book.pages) * 100) : 0;
  const isReading = book.status === BookStatus.Reading;
  const isFinished = book.status === BookStatus.Finished;
  const isUnread = book.status === BookStatus.Unread || !book.status;

  const handleUpdateProgress = useCallback(async () => {
    if (!book.pages) return;
    
    const page = parseInt(currentPage, 10);
    if (isNaN(page) || page < 0 || page > book.pages) {
      Alert.alert('Invalid Page', `Please enter a page number between 0 and ${book.pages}`);
      return;
    }

    setUpdating(true);
    try {
      await dispatch(updateReadingProgress({ 
        id: book.id, 
        currentPage: page,
        updatedAt: new Date().toISOString() 
      }));
      setProgressModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update reading progress');
    } finally {
      setUpdating(false);
    }
  }, [currentPage, book.pages, book.id, dispatch]);

  const handleStartReading = useCallback(async () => {
    try {
      await dispatch(startReading(book.id));
    } catch (error) {
      Alert.alert('Error', 'Failed to start reading');
    }
  }, [book.id, dispatch]);

  const handleFinishReading = useCallback(async () => {
    try {
      await dispatch(finishReading({ 
        id: book.id, 
        rating: book.rating,
        updatedAt: new Date().toISOString() 
      }));
    } catch (error) {
      Alert.alert('Error', 'Failed to mark as finished');
    }
  }, [book.id, book.rating, dispatch]);

  const handleDeleteBook = async () => {
    Alert.alert(
      'Delete Book',
      'Are you sure you want to delete this book?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(removeBook(book.id));
              navigation.goBack();
            } catch (error) {
              console.error('Failed to delete book:', error);
              Alert.alert('Error', 'Failed to delete the book. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleEdit = useCallback(() => {
    navigation.navigate('EditBook', { book });
  }, [navigation, book]);

  const renderHeader = useCallback(() => (
    <View style={styles.header}>
      {book.coverImage ? (
        <Image source={{ uri: book.coverImage }} style={styles.coverImage} />
      ) : (
        <View style={[styles.coverImage, { backgroundColor: colors.lightGray, justifyContent: 'center', alignItems: 'center' }]}>
          <Ionicons name="book-outline" size={64} color={colors.mediumGray} />
        </View>
      )}
      <Text style={{ ...textStyles.h1, marginTop: spacing.md }}>{book.title}</Text>
      <Text style={{ ...textStyles.body, color: colors.mediumGray, marginBottom: spacing.md }}>
        {book.author}
      </Text>
      
      {book.rating && book.rating > 0 && (
        <View style={{ flexDirection: 'row', marginTop: spacing.xs }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Ionicons
              key={star}
              name={star <= (book.rating || 0) ? 'star' : 'star-outline'}
              size={24}
              color={colors.warning}
              style={{ marginRight: 4 }}
            />
          ))}
        </View>
      )}
    </View>
  ), [book.coverImage, book.title, book.author, book.rating]);

  const renderActionButtons = useCallback(() => (
    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.white }}>
      <Button
        title={isReading ? 'Update Progress' : 'Start Reading'}
        onPress={isReading ? () => setProgressModalVisible(true) : handleStartReading}
        variant={isReading ? 'primary' : 'secondary'}
        style={{ marginLeft: spacing.sm }}
      />
      
      {isReading && (
        <Button
          title="Mark as Finished"
          onPress={handleFinishReading}
          variant="secondary"
          style={{ marginLeft: spacing.sm }}
        />
      )}
      
      <Button
        title="Edit Book"
        onPress={handleEdit}
        variant="secondary"
        style={{ marginLeft: spacing.sm }}
      />
      
      <Button
        title="Delete Book"
        onPress={handleDeleteBook}
        variant="secondary"
        style={{ marginLeft: spacing.sm, borderColor: colors.error }}
        textStyle={{ color: colors.error }}
      />
    </View>
  ), [isReading, handleStartReading, handleFinishReading, handleEdit, handleDeleteBook]);

  const renderReadingProgress = useCallback(() => (
    <View style={{ marginBottom: spacing.lg, padding: spacing.md, backgroundColor: colors.white, borderRadius: 8 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
        <Text style={{ ...textStyles.h2, marginBottom: 0 }}>Reading Progress</Text>
        <TouchableOpacity 
          onPress={() => setProgressModalVisible(true)}
          style={{ padding: spacing.xs }}
        >
          <Ionicons name="pencil" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
      
      {book.pages ? (
        <>
          <View style={{ marginBottom: spacing.md }}>
            <View style={{ height: 8, backgroundColor: colors.lightGray, borderRadius: 4, overflow: 'hidden' }}>
              <View 
                style={{
                  height: '100%',
                  width: `${progress}%`,
                  backgroundColor: isFinished ? colors.success : colors.primary,
                  borderRadius: 4
                }} 
              />
            </View>
            <Text style={{ textAlign: 'right', marginTop: spacing.xs, color: colors.mediumGray }}>
              {book.currentPage || 0} / {book.pages} pages ({progress}%)
            </Text>
          </View>
          
          {!isFinished && (
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              {isReading ? (
                <Button 
                  title="Mark as Finished" 
                  onPress={handleFinishReading} 
                  variant="secondary"
                  size="small"
                  style={{ marginLeft: spacing.sm }}
                />
              ) : (
                <Button 
                  title="Start Reading" 
                  onPress={handleStartReading} 
                  size="small"
                  style={{ marginLeft: spacing.sm }}
                />
              )}
            </View>
          )}
        </>
      ) : (
        <Text style={{ color: colors.mediumGray, fontStyle: 'italic' }}>
          No page count set. Edit book to add pages.
        </Text>
      )}
    </View>
  ), [book.pages, book.currentPage, progress, isFinished, isReading, handleFinishReading, handleStartReading]);

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        {/* Cover and Basic Info */}
        {renderHeader()}

        {/* Progress Section */}
        {renderReadingProgress()}

        {/* Book Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Pages:</Text>
            <Text style={styles.detailValue}>{book.pages || 'N/A'}</Text>
          </View>
          {book.isbn && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>ISBN:</Text>
              <Text style={styles.detailValue}>{book.isbn}</Text>
            </View>
          )}
          {book.categories?.length > 0 && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Categories:</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', flex: 1 }}>
                {book.categories.map((category, index) => (
                  <View 
                    key={index} 
                    style={{
                      backgroundColor: colors.lightGray,
                      borderRadius: 12,
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      marginRight: 4,
                      marginBottom: 4
                    }}
                  >
                    <Text style={{ fontSize: 12, color: colors.text }}>{category}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          {book.startedAt && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Started:</Text>
              <Text style={styles.detailValue}>
                {new Date(book.startedAt).toLocaleDateString()}
              </Text>
            </View>
          )}
          {book.finishedAt && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Finished:</Text>
              <Text style={styles.detailValue}>
                {new Date(book.finishedAt).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>

        {/* Description */}
        {book.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>
              {book.description}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Button
          title="Edit"
          onPress={() => navigation.navigate('EditBook', { book })}
          variant="secondary"
          style={styles.editButton}
        />
        <Button
          title="Delete"
          onPress={handleDeleteBook}
          variant="secondary"
          style={styles.deleteButton}
          textStyle={styles.deleteButtonText}
        />
      </View>

      {/* Update Progress Modal */}
      <Modal
        visible={isProgressModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setProgressModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Reading Progress</Text>
              <TouchableOpacity onPress={() => setProgressModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.modalLabel}>Current Page</Text>
              <TextInput
                style={styles.modalInput}
                keyboardType="numeric"
                value={currentPage}
                onChangeText={setCurrentPage}
                placeholder="Enter current page"
                placeholderTextColor={colors.textSecondary}
              />
              {book.pages && (
                <Text style={styles.modalHint}>
                  {Math.round((parseInt(currentPage || '0') / book.pages) * 100)}% complete
                </Text>
              )}
            </View>
            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                onPress={() => setProgressModalVisible(false)}
                variant="secondary"
                style={styles.modalButton}
              />
              <Button
                title={isUpdating ? 'Updating...' : 'Update'}
                onPress={handleUpdateProgress}
                disabled={isUpdating}
                style={styles.modalButton}
                loading={isUpdating}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    width: 100,
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  description: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  coverImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: colors.lightGray,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 4,
    color: colors.text,
  },
  author: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  star: {
    marginRight: 4,
  },
  statusBadge: {
    backgroundColor: colors.lightPrimary,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
  },
  statusText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  editProgressButton: {
    padding: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.lightGray,
    borderRadius: 2,
    flex: 1,
    marginRight: 8,
  },
  progressFill: {
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: colors.text,
  },
  progressActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    marginRight: 8,
  },
  noPagesText: {
    color: colors.textSecondary,
    fontStyle: 'italic',
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  editButton: {
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    flex: 1,
    borderColor: colors.danger,
  },
  deleteButtonText: {
    color: colors.danger,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  modalBody: {
    marginBottom: Platform.OS === 'ios' ? 32 : 16,
  },
  modalLabel: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.white,
  },
  modalHint: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  modalButton: {
    marginLeft: 8,
    minWidth: 100,
  },
});

export default BookDetails;
