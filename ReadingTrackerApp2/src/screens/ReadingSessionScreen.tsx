import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, TextInput, ProgressBar, IconButton } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { colors, spacing } from '@/theme';
import { addReadingTime, addPagesRead, addActivity } from '@/store/slices/statsSlice';
import { Book } from '@/store/slices/booksSlice';

export const ReadingSessionScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentBook = useAppSelector((state) => state.books.currentBook);
  const [duration, setDuration] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [pausedTime, setPausedTime] = useState(0);
  const [startPage, setStartPage] = useState('');
  const [endPage, setEndPage] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isPaused) {
      timer = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPaused]);

  const handlePause = () => {
    setIsPaused(true);
    setPausedTime(duration);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleEndSession = () => {
    if (!currentBook) {
      Alert.alert('오류', '현재 읽고 있는 책이 없습니다.');
      return;
    }

    const start = parseInt(startPage);
    const end = parseInt(endPage);

    if (isNaN(start) || isNaN(end) || start < 0 || end > currentBook.pageCount || start >= end) {
      Alert.alert('오류', '올바른 페이지 범위를 입력해주세요.');
      return;
    }

    const pagesRead = end - start;
    const minutesRead = Math.floor(duration / 60);

    dispatch(addReadingTime(minutesRead));
    dispatch(addPagesRead(pagesRead));
    dispatch(addActivity({
      id: Date.now().toString(),
      type: 'reading_session',
      description: `${currentBook.title} ${pagesRead}페이지 읽음`,
      timestamp: Date.now(),
      bookId: currentBook.id,
    }));

    Alert.alert('독서 세션 종료', `${minutesRead}분 동안 ${pagesRead}페이지를 읽었습니다.`);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!currentBook) {
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.message}>현재 읽고 있는 책이 없습니다.</Text>
            <Text style={styles.subMessage}>책을 선택하고 독서를 시작해보세요.</Text>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="현재 읽는 책" />
        <Card.Content>
          <Text style={styles.bookTitle}>{currentBook.title}</Text>
          <Text style={styles.bookAuthor}>{currentBook.authors.join(', ')}</Text>
          <ProgressBar
            progress={currentBook.userSpecificData.currentPage / currentBook.pageCount}
            color={colors.primary}
            style={styles.progressBar}
          />
          <Text style={styles.progressText}>
            {currentBook.userSpecificData.currentPage} / {currentBook.pageCount} 페이지
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="독서 시간" />
        <Card.Content>
          <View style={styles.timerContainer}>
            <Text style={styles.timer}>{formatTime(duration)}</Text>
            <View style={styles.timerControls}>
              {isPaused ? (
                <IconButton
                  icon="play"
                  size={30}
                  onPress={handleResume}
                />
              ) : (
                <IconButton
                  icon="pause"
                  size={30}
                  onPress={handlePause}
                />
              )}
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="독서 기록" />
        <Card.Content>
          <TextInput
            label="시작 페이지"
            value={startPage}
            onChangeText={setStartPage}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="종료 페이지"
            value={endPage}
            onChangeText={setEndPage}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="메모"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            style={styles.input}
          />
          <Button
            mode="contained"
            onPress={handleEndSession}
            style={styles.button}
          >
            독서 세션 종료
          </Button>
        </Card.Content>
      </Card>
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
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.small,
  },
  bookAuthor: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.medium,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  progressText: {
    marginTop: spacing.small,
    textAlign: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: spacing.medium,
  },
  timer: {
    fontSize: 48,
    fontFamily: 'monospace',
    marginBottom: spacing.medium,
  },
  timerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  input: {
    marginBottom: spacing.small,
  },
  button: {
    marginTop: spacing.small,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: spacing.small,
  },
  subMessage: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.textSecondary,
  },
}); 