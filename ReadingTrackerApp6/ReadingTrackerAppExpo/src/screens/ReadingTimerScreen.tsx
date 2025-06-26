import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert, FlatList, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Button, Card, TextInput, Badge, Title, IconButton } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const books = [
  { id: 1, title: '사피엔스', author: '유발 하라리' },
  { id: 2, title: '아몬드', author: '손원평' },
  { id: 3, title: '코스모스', author: '칼 세이건' },
  { id: 4, title: '1984', author: '조지 오웰' },
];

const initialSessions = [
  {
    id: 1,
    book: '아몬드',
    minutes: 25,
    pages: 15,
    notes: '감정에 대한 새로운 관점을 얻었다',
    startTime: '14:30',
    endTime: '14:55',
  },
  {
    id: 2,
    book: '사피엔스',
    minutes: 20,
    pages: 8,
    notes: '허구와 현실의 경계에 대한 흥미로운 내용',
    startTime: '16:00',
    endTime: '16:20',
  },
];

const formatTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;
};

const ReadingTimerScreen = () => {
  const navigation = useNavigation();
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [selectedBook, setSelectedBook] = useState('');
  const [manualMinutes, setManualMinutes] = useState('');
  const [manualPages, setManualPages] = useState('');
  const [notes, setNotes] = useState('');
  const [todaySessions, setTodaySessions] = useState(initialSessions);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleStart = () => {
    if (!selectedBook) {
      Alert.alert('오류', '읽을 책을 선택해주세요');
      return;
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    if (seconds === 0) return;
    const minutes = Math.floor(seconds / 60);
    const now = new Date();
    const start = new Date(now.getTime() - seconds * 1000);
    const session = {
      id: Date.now(),
      book: selectedBook,
      minutes: minutes,
      pages: parseInt(manualPages) || 0,
      notes: notes,
      startTime: start.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      endTime: now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    };
    setTodaySessions([session, ...todaySessions]);
    setIsRunning(false);
    setSeconds(0);
    setSelectedBook('');
    setManualPages('');
    setNotes('');
    Alert.alert('성공', `${minutes}분 독서 기록이 저장되었습니다!`);
  };

  const handleManualAdd = () => {
    if (!selectedBook || !manualMinutes) {
      Alert.alert('오류', '책과 시간을 입력해주세요');
      return;
    }
    const session = {
      id: Date.now(),
      book: selectedBook,
      minutes: parseInt(manualMinutes),
      pages: parseInt(manualPages) || 0,
      notes: notes,
      startTime: '수동 입력',
      endTime: '수동 입력',
    };
    setTodaySessions([session, ...todaySessions]);
    setSelectedBook('');
    setManualMinutes('');
    setManualPages('');
    setNotes('');
    Alert.alert('성공', '독서 기록이 추가되었습니다!');
  };

  const getTotalStats = () => {
    const totalMinutes = todaySessions.reduce((sum, session) => sum + session.minutes, 0);
    const totalPages = todaySessions.reduce((sum, session) => sum + session.pages, 0);
    return { totalMinutes, totalPages };
  };

  const { totalMinutes, totalPages } = getTotalStats();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <IconButton
            icon={() => <Ionicons name="arrow-back" size={24} color="#333" />}
            onPress={() => navigation.goBack()}
            style={{ marginRight: 4 }}
          />
          <View>
            <Text style={styles.headerTitle}>독서 시간 기록</Text>
            <Text style={styles.headerSub}>{`오늘 총 ${totalMinutes}분, ${totalPages}페이지 읽었어요`}</Text>
          </View>
        </View>

        {/* 타이머 카드 */}
        <Card style={styles.card}>
          <Card.Title
            title="타이머"
            left={(props) => <Feather name="clock" size={22} color="#2563eb" style={{ marginRight: 8 }} />}
          />
          <Card.Content>
            {/* 책 선택 */}
            <Text style={styles.label}>읽을 책</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedBook}
                onValueChange={(itemValue: string) => setSelectedBook(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="책을 선택하세요" value="" />
                {books.map((book) => (
                  <Picker.Item
                    key={book.id}
                    label={`${book.title} - ${book.author}`}
                    value={book.title}
                  />
                ))}
              </Picker>
            </View>
            {/* 타이머 디스플레이 */}
            <View style={styles.timerDisplayWrapper}>
              <Text style={styles.timerText}>{formatTime(seconds)}</Text>
              <View style={styles.timerButtonRow}>
                {!isRunning ? (
                  <Button
                    mode="contained"
                    icon="play"
                    onPress={handleStart}
                    style={{ backgroundColor: '#16a34a' }}
                  >
                    시작
                  </Button>
                ) : (
                  <Button mode="outlined" icon="pause" onPress={handlePause}
                  >일시정지</Button>
                )}
                <Button
                  mode="contained"
                  icon="stop"
                  onPress={handleStop}
                  disabled={seconds === 0}
                  style={{ backgroundColor: '#dc2626' }}
                >
                  종료
                </Button>
              </View>
            </View>
            {/* 추가 정보 입력 */}
            <Text style={styles.label}>읽은 페이지 수</Text>
            <TextInput
              mode="outlined"
              placeholder="페이지 수"
              value={manualPages}
              onChangeText={setManualPages}
              keyboardType="numeric"
              style={styles.input}
            />
            <Text style={styles.label}>메모</Text>
            <TextInput
              mode="outlined"
              placeholder="독서 중 느낀 점이나 메모를 남겨보세요"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={2}
              style={styles.input}
            />
          </Card.Content>
        </Card>

        {/* 수동 입력 카드 */}
        <Card style={styles.card}>
          <Card.Title
            title="수동 입력"
            left={(props) => <Feather name="plus" size={22} color="#a21caf" style={{ marginRight: 8 }} />}
          />
          <Card.Content>
            <Text style={styles.label}>읽은 책</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedBook}
                onValueChange={(itemValue: string) => setSelectedBook(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="책을 선택하세요" value="" />
                {books.map((book) => (
                  <Picker.Item
                    key={book.id}
                    label={`${book.title} - ${book.author}`}
                    value={book.title}
                  />
                ))}
              </Picker>
            </View>
            <View style={styles.manualRow}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.label}>읽은 시간 (분)</Text>
                <TextInput
                  mode="outlined"
                  placeholder="분"
                  value={manualMinutes}
                  onChangeText={setManualMinutes}
                  keyboardType="numeric"
                  style={styles.input}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>읽은 페이지</Text>
                <TextInput
                  mode="outlined"
                  placeholder="페이지"
                  value={manualPages}
                  onChangeText={setManualPages}
                  keyboardType="numeric"
                  style={styles.input}
                />
              </View>
            </View>
            <Text style={styles.label}>메모</Text>
            <TextInput
              mode="outlined"
              placeholder="독서 중 느낀 점이나 메모를 남겨보세요"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              style={styles.input}
            />
            <Button
              mode="contained"
              icon="plus"
              onPress={handleManualAdd}
              style={{ backgroundColor: '#a21caf', marginTop: 8 }}
            >
              기록 추가
            </Button>
          </Card.Content>
        </Card>

        {/* 오늘의 독서 기록 */}
        <Card style={[styles.card, { marginBottom: 32 }]}> 
          <Card.Title
            title="오늘의 독서 기록"
            left={(props) => <Feather name="book-open" size={22} color="#16a34a" style={{ marginRight: 8 }} />}
          />
          <Card.Content>
            {todaySessions.length === 0 ? (
              <Text style={{ color: '#888', textAlign: 'center', marginVertical: 16 }}>오늘의 기록이 없습니다.</Text>
            ) : (
              <FlatList
                data={todaySessions}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.sessionItem}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                        <Text style={styles.sessionBook}>{item.book}</Text>
                        <Badge style={{ marginLeft: 6, backgroundColor: '#e0e7ff', color: '#3730a3' }}>{`${item.minutes}분`}</Badge>
                        {item.pages > 0 && (
                          <Badge style={{ marginLeft: 6, backgroundColor: '#f3e8ff', color: '#a21caf' }}>{`${item.pages}페이지`}</Badge>
                        )}
                      </View>
                      <Text style={styles.sessionTime}>{item.startTime} - {item.endTime}</Text>
                      {item.notes ? (
                        <Text style={styles.sessionNotes}>{item.notes}</Text>
                      ) : null}
                    </View>
                  </View>
                )}
                scrollEnabled={false}
              />
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSub: {
    color: '#64748b',
    fontSize: 14,
    marginTop: 2,
  },
  card: {
    marginBottom: 18,
    borderRadius: 12,
    elevation: 2,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    marginTop: 8,
    marginBottom: 2,
    color: '#334155',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 44,
    width: '100%',
  },
  timerDisplayWrapper: {
    alignItems: 'center',
    marginVertical: 18,
  },
  timerText: {
    fontSize: 48,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 8,
  },
  timerButtonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  input: {
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  manualRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  sessionBook: {
    fontWeight: '600',
    color: '#1e293b',
    fontSize: 16,
  },
  sessionTime: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },
  sessionNotes: {
    fontSize: 14,
    color: '#334155',
    marginTop: 2,
  },
});

export default ReadingTimerScreen; 