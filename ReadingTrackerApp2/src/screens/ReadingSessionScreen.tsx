import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, TextInput, ProgressBar, IconButton, Portal, Dialog } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { colors, spacing } from '@/theme';
import { addReadingTime, addPagesRead, addActivity } from '@/store/slices/statsSlice';
import { addReadingSession } from '@/store/slices/booksSlice';
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
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isPaused) {
      timer = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPaused]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePause = () => {
    setIsPaused(true);
    setPausedTime(duration);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleEndSession = () => {
    if (!startPage || !endPage) {
      Alert.alert('오류', '시작 페이지와 마지막 페이지를 입력해주세요.');
      return;
    }

    const start = parseInt(startPage);
    const end = parseInt(endPage);
    const pagesRead = end - start;

    if (isNaN(start) || isNaN(end) || pagesRead < 0) {
      Alert.alert('오류', '올바른 페이지 번호를 입력해주세요.');
      return;
    }

    if (currentBook && pagesRead > 0) {
      const session = {
        id: Date.now().toString(),
        startTime: new Date(Date.now() - duration * 1000).toISOString(),
        endTime: new Date().toISOString(),
        pagesRead,
        notes,
      };

      dispatch(addReadingSession({ bookId: currentBook.id, session }));
      dispatch(addReadingTime(Math.floor(duration / 60)));
      dispatch(addPagesRead(pagesRead));
      dispatch(addActivity({
        id: Date.now().toString(),
        type: 'reading_session',
        description: `${currentBook.title} ${pagesRead}페이지 읽음`,
        timestamp: Date.now(),
        bookId: currentBook.id,
      }));

      setShowSummary(true);
    }
  };

  const handleCloseSummary = () => {
    setShowSummary(false);
    setDuration(0);
    setStartPage('');
    setEndPage('');
    setNotes('');
  };

  if (!currentBook) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>현재 읽고 있는 책이 없습니다.</Text>
        <Text style={styles.subMessage}>내 서재에서 책을 선택해주세요.</Text>
      </View>
    );
  }

  const progress = (currentBook.currentPage / currentBook.pageCount) * 100;

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.bookTitle}>{currentBook.title}</Text>
          <Text style={styles.bookAuthor}>{currentBook.authors.join(', ')}</Text>
          <ProgressBar
            progress={progress / 100}
            style={styles.progressBar}
            color={colors.primary}
          />
          <Text style={styles.progressText}>
            {currentBook.currentPage} / {currentBook.pageCount} 페이지
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
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
              <IconButton
                icon="stop"
                size={30}
                onPress={handleEndSession}
              />
            </View>
          </View>

          <TextInput
            label="시작 페이지"
            value={startPage}
            onChangeText={setStartPage}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="마지막 페이지"
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
        </Card.Content>
      </Card>

      <Portal>
        <Dialog visible={showSummary} onDismiss={handleCloseSummary}>
          <Dialog.Title>독서 세션 완료</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.summaryText}>
              독서 시간: {formatTime(duration)}
            </Text>
            <Text style={styles.summaryText}>
              읽은 페이지: {parseInt(endPage) - parseInt(startPage)} 페이지
            </Text>
            {notes && (
              <Text style={styles.summaryText}>
                메모: {notes}
              </Text>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleCloseSummary}>확인</Button>
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
  summaryText: {
    fontSize: 16,
    marginBottom: spacing.small,
  },
}); 