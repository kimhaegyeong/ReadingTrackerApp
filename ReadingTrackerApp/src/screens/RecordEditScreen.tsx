import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { saveReadingRecord, updateReadingRecord, getReadingRecord } from '../database/recordOperations';
import { ReadingRecord, UpdateReadingRecord, Book } from '../types';
import { getBookInfo } from '../database/bookOperations';

type RootStackParamList = {
  RecordEdit: {
    bookId?: string;
    recordId?: number;
  };
};

type RecordEditScreenRouteProp = RouteProp<RootStackParamList, 'RecordEdit'>;

export default function RecordEditScreen() {
  const route = useRoute<RecordEditScreenRouteProp>();
  const navigation = useNavigation();
  const { bookId, recordId } = route.params;

  const [book, setBook] = useState<Book | null>(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pageRange, setPageRange] = useState('');
  const [readingHours, setReadingHours] = useState('');
  const [readingMinutes, setReadingMinutes] = useState('');
  const [memo, setMemo] = useState('');
  const [emotion, setEmotion] = useState('');
  const [satisfaction, setSatisfaction] = useState(3);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pageError, setPageError] = useState('');

  const emotions = ['😊', '😢', '😡', '😴', '🤔', '😮', '😍', '😱', '😭', '😤'];

  useEffect(() => {
    if (bookId) {
      loadBookInfo();
    }
    if (recordId) {
      loadRecord();
    }
  }, [bookId, recordId]);

  const loadBookInfo = async () => {
    try {
      const bookInfo = await getBookInfo(bookId!);
      if (bookInfo) {
        setBook(bookInfo);
      }
    } catch (error) {
      Alert.alert('오류', '책 정보를 불러오는데 실패했습니다.');
    }
  };

  const loadRecord = async () => {
    try {
      const record = await getReadingRecord(recordId!);
      if (record) {
        setDate(new Date(record.date));
        setPageRange(`${record.startPage}-${record.endPage}`);
        setEmotion(record.emotion);
        setSatisfaction(record.satisfaction);
        setMemo(record.memo);
        setTags(record.tags);
      }
    } catch (error) {
      Alert.alert('오류', '기록을 불러오는데 실패했습니다.');
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const validatePageRange = (range: string): boolean => {
    const pageRangeRegex = /^\d+-\d+$/;
    if (!pageRangeRegex.test(range)) {
      setPageError('페이지 범위는 "시작-끝" 형식으로 입력해주세요.');
      return false;
    }

    const [startPage, endPage] = range.split('-').map(Number);
    if (startPage >= endPage) {
      setPageError('시작 페이지는 끝 페이지보다 작아야 합니다.');
      return false;
    }

    if (book && endPage > book.totalPages) {
      setPageError(`페이지 범위는 전체 페이지 수(${book.totalPages}페이지)를 초과할 수 없습니다.`);
      return false;
    }

    setPageError('');
    return true;
  };

  const validateReadingTime = (): boolean => {
    const hours = parseInt(readingHours) || 0;
    const minutes = parseInt(readingMinutes) || 0;
    const totalMinutes = hours * 60 + minutes;

    if (totalMinutes <= 0) {
      Alert.alert('오류', '독서 시간은 1분 이상이어야 합니다.');
      return false;
    }

    if (totalMinutes > 24 * 60) {
      Alert.alert('오류', '독서 시간은 24시간을 초과할 수 없습니다.');
      return false;
    }

    return true;
  };

  const validateDate = (): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date > today) {
      Alert.alert('오류', '미래 날짜는 선택할 수 없습니다.');
      return false;
    }
    return true;
  };

  const validateInputs = (): boolean => {
    if (!validateDate()) return false;
    if (!validatePageRange(pageRange)) return false;
    if (!validateReadingTime()) return false;
    return true;
  };

  const handleSave = async () => {
    if (!validateInputs()) return;

    try {
      setIsLoading(true);
      const [startPage, endPage] = pageRange.split('-').map(Number);
      const totalMinutes = (parseInt(readingHours) || 0) * 60 + (parseInt(readingMinutes) || 0);
      
      const record: ReadingRecord = {
        bookId: bookId || '',
        date: date.toISOString(),
        startPage,
        endPage,
        readingTime: totalMinutes,
        emotion,
        satisfaction,
        memo,
        tags
      };

      if (recordId) {
        record.id = recordId;
        await updateReadingRecord(record as UpdateReadingRecord);
      } else {
        await saveReadingRecord(record);
      }

      Alert.alert('성공', '독서 기록이 저장되었습니다.', [
        { text: '확인', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('오류', '기록 저장에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>독서 기록 {recordId ? '수정' : '추가'}</Text>
      
      {book && (
        <View style={styles.bookInfo}>
          {book.thumbnail && (
            <Image source={{ uri: book.thumbnail }} style={styles.bookCover} />
          )}
          <View style={styles.bookDetails}>
            <Text style={styles.bookTitle}>{book.title}</Text>
            <Text style={styles.bookAuthor}>{book.authors?.join(', ')}</Text>
            <Text style={styles.bookPages}>전체 {book.totalPages}페이지</Text>
          </View>
        </View>
      )}

      <Text style={styles.label}>날짜</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}

      <Text style={styles.label}>읽은 페이지 범위</Text>
      <TextInput 
        style={[styles.input, pageError ? styles.inputError : null]} 
        placeholder="예: 1-20" 
        value={pageRange}
        onChangeText={(text) => {
          setPageRange(text);
          validatePageRange(text);
        }}
        keyboardType="numeric"
      />
      {pageError ? <Text style={styles.errorText}>{pageError}</Text> : null}

      <Text style={styles.label}>독서 시간</Text>
      <View style={styles.timeInputContainer}>
        <View style={styles.timeInput}>
          <TextInput 
            style={styles.input} 
            placeholder="시간" 
            keyboardType="numeric"
            value={readingHours}
            onChangeText={setReadingHours}
          />
          <Text style={styles.timeLabel}>시간</Text>
        </View>
        <View style={styles.timeInput}>
          <TextInput 
            style={styles.input} 
            placeholder="분" 
            keyboardType="numeric"
            value={readingMinutes}
            onChangeText={setReadingMinutes}
          />
          <Text style={styles.timeLabel}>분</Text>
        </View>
      </View>

      <Text style={styles.label}>감정</Text>
      <View style={styles.emotionContainer}>
        {emotions.map((emoji) => (
          <TouchableOpacity
            key={emoji}
            style={[styles.emotionButton, emotion === emoji && styles.selectedEmotion]}
            onPress={() => setEmotion(emoji)}
          >
            <Text style={styles.emotionText}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>만족도</Text>
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={5}
        step={1}
        value={satisfaction}
        onValueChange={setSatisfaction}
        minimumTrackTintColor="#1EB1FC"
        maximumTrackTintColor="#000000"
      />
      <Text style={styles.satisfactionText}>만족도: {satisfaction}/5</Text>

      <Text style={styles.label}>태그</Text>
      <View style={styles.tagContainer}>
        {tags.map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
            <TouchableOpacity onPress={() => setTags(tags.filter(t => t !== tag))}>
              <Text style={styles.tagRemove}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <View style={styles.tagInputContainer}>
        <TextInput
          style={styles.tagInput}
          placeholder="새 태그 추가"
          value={newTag}
          onChangeText={setNewTag}
        />
        <Button title="추가" onPress={addTag} />
      </View>

      <Text style={styles.label}>메모</Text>
      <TextInput 
        style={[styles.input, styles.memoInput]} 
        placeholder="메모를 입력하세요" 
        multiline 
        value={memo}
        onChangeText={setMemo}
      />

      <Button 
        title={isLoading ? "저장 중..." : "저장"} 
        onPress={handleSave}
        disabled={isLoading}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#fff' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 12 
  },
  bookInfo: {
    flexDirection: 'row',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  bookCover: {
    width: 80,
    height: 120,
    borderRadius: 4,
  },
  bookDetails: {
    marginLeft: 12,
    flex: 1,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  bookPages: {
    fontSize: 14,
    color: '#666',
  },
  label: { 
    fontSize: 16, 
    fontWeight: '600', 
    marginBottom: 8 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 12 
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 12,
  },
  dateText: {
    fontSize: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12
  },
  timeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  timeInput: {
    flex: 1,
    marginRight: 8,
  },
  timeLabel: {
    position: 'absolute',
    right: 12,
    top: 12,
    color: '#666',
  },
  emotionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12
  },
  emotionButton: {
    padding: 8,
    margin: 4,
    borderRadius: 20,
    backgroundColor: '#f0f0f0'
  },
  selectedEmotion: {
    backgroundColor: '#1EB1FC'
  },
  emotionText: {
    fontSize: 24
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 8
  },
  satisfactionText: {
    textAlign: 'center',
    marginBottom: 12
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1EB1FC',
    padding: 8,
    borderRadius: 16,
    margin: 4
  },
  tagText: {
    color: 'white',
    marginRight: 4
  },
  tagRemove: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  tagInputContainer: {
    flexDirection: 'row',
    marginBottom: 12
  },
  tagInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginRight: 8
  },
  memoInput: {
    height: 120,
    textAlignVertical: 'top'
  }
});
