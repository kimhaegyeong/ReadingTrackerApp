import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  Alert, 
  Platform, 
  KeyboardAvoidingView,
  ActivityIndicator,
  TextInput as RNTextInput
} from 'react-native';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { Book, BookStatus } from '@/features/books/types/book';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { format } from 'date-fns';
import { styles } from './BookForm.styles';

// Form validation schema
export const bookSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  author: yup.string().required('Author is required'),
  pages: yup
    .number()
    .typeError('Must be a number')
    .positive('Must be positive')
    .integer('Must be a whole number')
    .required('Page count is required'),
  currentPage: yup
    .number()
    .typeError('Must be a number')
    .min(0, 'Cannot be negative')
    .integer('Must be a whole number')
    .default(0),
  isbn: yup
    .string()
    .matches(/^(\d{10}|\d{13}|)$/, 'Must be a valid 10 or 13 digit ISBN')
    .optional(),
  description: yup.string().optional(),
  coverImage: yup.string().url('Must be a valid URL').optional(),
  publisher: yup.string().optional(),
  publishedDate: yup.string().optional(),
  rating: yup
    .number()
    .min(0, 'Must be between 0 and 5')
    .max(5, 'Must be between 0 and 5')
    .optional(),
  categories: yup.array().of(yup.string()).optional(),
  notes: yup.string().optional(),
  status: yup
    .mixed<BookStatus>()
    .oneOf(Object.values(BookStatus))
    .default(BookStatus.Unread)
    .optional(),
}).required();

type FormData = yup.InferType<typeof bookSchema>;

// Make all fields optional for the form data
export type BookFormData = Partial<yup.InferType<typeof bookSchema>>;

interface BookFormProps {
  initialValues?: BookFormData;
  onSubmit: (data: BookFormData) => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
  onCancel?: () => void;
  onFormDirtyChange?: (isDirty: boolean) => void;
}

const BookForm: React.FC<BookFormProps> = ({
  initialValues = {},
  onSubmit,
  isSubmitting = false,
  submitButtonText = 'Save',
  onCancel,
  onFormDirtyChange,
}) => {
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [localImage, setLocalImage] = useState<string | null>(initialValues.coverImage || null);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRefs = useRef<{[key: string]: any}>({});

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    setValue,
    reset,
    trigger,
  } = useForm<BookFormData>({
    resolver: yupResolver(bookSchema) as any, // Type assertion to handle yup resolver type
    defaultValues: {
      ...initialValues,
    } as BookFormData,
  });

  // Scroll to the first error field
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstError = Object.keys(errors)[0];
      const inputRef = inputRefs.current[firstError];
      
      if (inputRef && scrollViewRef.current) {
        inputRef.measureLayout(
          scrollViewRef.current.getInnerViewNode(),
          (x: number, y: number) => {
            scrollViewRef.current?.scrollTo({ y: y - 100, animated: true });
          },
          () => {}
        );
        
        // Focus on the input if it's a text input
        if (inputRef.focus) {
          inputRef.focus();
        }
      }
    }
  }, [errors]);

  // Handle form submission with validation
  const handleFormSubmit = useCallback(async (data: BookFormData) => {
    const isValid = await trigger();
    if (isValid && data.title && data.author) {
      onSubmit({
        ...data,
        title: data.title,
        author: data.author,
        pages: Number(data.pages) || 0,
        currentPage: Number(data.currentPage) || 0,
      });
    }
  }, [onSubmit, trigger]);

  // Notify parent component about form dirty state changes
  useEffect(() => {
    if (onFormDirtyChange) {
      onFormDirtyChange(isDirty);
    }
  }, [isDirty, onFormDirtyChange]);

  // Reset form when initialValues change
  useEffect(() => {
    if (Object.keys(initialValues).length > 0) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  const watchedPages = watch('pages');
  const watchedCurrentPage = watch('currentPage');
  const watchedStatus = watch('status');

  // Calculate progress percentage
  const progress = useMemo(() => {
    if (!watchedPages || watchedPages === 0) return 0;
    return Math.round(((watchedCurrentPage || 0) / watchedPages) * 100);
  }, [watchedPages, watchedCurrentPage]);

  const pickImage = useCallback(async () => {
    try {
      setIsImageLoading(true);
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to upload images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setLocalImage(imageUri);
        setValue('coverImage', imageUri, { shouldDirty: true });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    } finally {
      setIsImageLoading(false);
    }
  }, [setValue]);

  const removeImage = useCallback(() => {
    setLocalImage(null);
    setValue('coverImage', '', { shouldDirty: true });
  }, [setValue]);

  return (
    <KeyboardAvoidingView
      testID="book-form"
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.container}>
        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.form} testID="book-form-content">
          {/* Cover Image Upload */}
          <View style={styles.coverImageContainer}>
            <Text style={styles.label}>Book Cover</Text>
            <View style={styles.coverImageWrapper}>
              {localImage ? (
                <>
                  <Image source={{ uri: localImage }} style={styles.coverImage} />
                  <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
                    <Ionicons name="close-circle" size={24} color={colors.error} />
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                  <Ionicons name="camera" size={24} color={colors.primary} />
                  <Text style={styles.uploadButtonText}>Add Cover Image</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Title */}
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                ref={(ref) => {
                  if (ref) inputRefs.current.title = ref;
                }}
                label="Title"
                placeholder="Enter book title"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.title?.message}
                autoCapitalize="words"
                returnKeyType="next"
              />
            )}
            name="title"
          />

          {/* Author */}
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                ref={(ref) => {
                  if (ref) inputRefs.current.author = ref;
                }}
                label="Author"
                placeholder="Enter author name"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.author?.message}
                autoCapitalize="words"
              />
            )}
            name="author"
          />

          <View style={styles.row}>
            {/* Pages */}
            <View style={[styles.inputGroup, { flex: 1, marginRight: spacing.sm }]}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    ref={(ref) => {
                      if (ref) inputRefs.current.pages = ref;
                    }}
                    label="Total Pages"
                    placeholder="e.g., 320"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value ? value.toString() : ''}
                    error={errors.pages?.message}
                    keyboardType="number-pad"
                  />
                )}
                name="pages"
              />
            </View>
            {/* Current Page */}
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    ref={(ref) => {
                      if (ref) inputRefs.current.currentPage = ref;
                    }}
                    label="Current Page"
                    placeholder="e.g., 150"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value ? value.toString() : ''}
                    error={errors.currentPage?.message}
                    keyboardType="number-pad"
                  />
                )}
                name="currentPage"
              />
            </View>
          </View>
        </View>

        {/* ISBN */}
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="ISBN (Optional)"
              placeholder="Enter ISBN number"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.isbn?.message}
              keyboardType="number-pad"
            />
          )}
          name="isbn"
        />

        {/* Description */}
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Description (Optional)"
              placeholder="Enter book description"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.description?.message}
              multiline
              numberOfLines={4}
              style={styles.textArea}
            />
          )}
          name="description"
        />

        {/* Publisher */}
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Publisher (Optional)"
              placeholder="Enter publisher name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.publisher?.message}
            />
          )}
          name="publisher"
        />

        {/* Published Date */}
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Published Date (Optional)"
              placeholder="YYYY-MM-DD"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.publishedDate?.message}
              keyboardType="numbers-and-punctuation"
            />
          )}
          name="publishedDate"
        />

        {/* Rating */}
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Rating (0-5, Optional)</Text>
              <View style={styles.ratingContainer}>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => onChange(star)}
                      style={styles.starButton}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={value && star <= value ? 'star' : 'star-outline'}
                        size={28}
                        color={colors.warning}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              {errors.rating?.message && (
                <Text style={styles.errorText}>{errors.rating.message}</Text>
              )}
            </View>
          )}
          name="rating"
        />

        {/* Categories */}
        <Controller
          control={control}
          name="categories"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Categories (comma-separated, Optional)"
              placeholder="e.g., Fiction, Science, Fantasy"
              onChangeText={text => {
                // 입력값을 배열로 변환
                const arr = text.split(',').map(cat => cat.trim()).filter(Boolean);
                onChange(arr);
              }}
              value={Array.isArray(value) ? value.join(', ') : value || ''}
              error={errors.categories?.message}
            />
          )}
        />

        {/* Notes */}
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Personal Notes (Optional)"
              placeholder="Add your personal notes about this book"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.notes?.message}
              multiline
              numberOfLines={4}
              style={styles.textArea}
            />
          )}
          name="notes"
        />

        {/* Status */}
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Reading Status</Text>
              <View style={styles.statusContainer}>
                {[
                  { value: BookStatus.Unread, label: 'Unread', icon: 'book-outline' },
                  { value: BookStatus.Reading, label: 'Reading', icon: 'book' },
                  { value: BookStatus.Finished, label: 'Finished', icon: 'checkmark-done' },
                ].map((status) => (
                  <TouchableOpacity
                    key={status.value}
                    style={[
                      styles.statusButton,
                      value === status.value && styles.statusButtonActive,
                    ]}
                    onPress={() => onChange(status.value)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={status.icon as any}
                      size={20}
                      color={value === status.value ? '#fff' : colors.primary}
                      style={styles.statusIcon}
                    />
                    <Text 
                      style={[
                        styles.statusButtonText,
                        value === status.value && styles.statusButtonTextActive
                      ]}
                    >
                      {status.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          name="status"
        />

        {/* Progress */}
        {watchedStatus === BookStatus.Reading && watchedPages && (
          <View style={styles.progressContainer}>
            <Text style={styles.label}>
              Progress: {watchedCurrentPage || 0} / {watchedPages} pages ({progress}%)
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
          </View>
        )}

        <View style={styles.buttonContainer}>
          {onCancel && (
            <Button
              title="Cancel"
              onPress={onCancel}
              variant="outline"
              style={styles.cancelButton}
              disabled={isSubmitting}
            />
          )}
          <Button
            title={submitButtonText}
            onPress={handleSubmit(handleFormSubmit)}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={styles.submitButton}
          />
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default BookForm;
