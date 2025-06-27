import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert, FlatList, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { DatabaseService } from '../DatabaseService';
import DropDownPicker from 'react-native-dropdown-picker';

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
  const route = useRoute();
  const initialBook = (route && (route as any).params && (route as any).params.book) ? (route as any).params.book : null;
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [books, setBooks] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [manualMinutes, setManualMinutes] = useState('');
  const [manualPages, setManualPages] = useState('');
  const [notes, setNotes] = useState('');
  const [todaySessions, setTodaySessions] = useState<any[]>([]);
  const [totalStats, setTotalStats] = useState({ totalMinutes: 0, totalPages: 0 });
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [open, setOpen] = useState(false);
  const [comboValue, setComboValue] = useState<string | null>(null);
  const [items, setItems] = useState(
    books.map(book => ({
      label: `${book.title} - ${book.author}`,
      value: String(book.id),
      key: String(book.id),
    }))
  );

  // DB에서 오늘의 기록, 통계 불러오기
  const fetchSessionsAndStats = async () => {
    const db = await DatabaseService.getInstance();
    const sessions = await db.getTodaySessions();
    setTodaySessions(sessions.map(s => ({
      id: s.id,
      book: (s as any).book_title || '',
      minutes: s.duration_minutes || 0,
      pages: s.pages_read || 0,
      notes: s.memo || '',
      startTime: s.start_time ? s.start_time.slice(11, 16) : '',
      endTime: s.end_time ? s.end_time.slice(11, 16) : '',
    })));
    const stats = await db.getTotalStats();
    setTotalStats(stats);
  };

  useEffect(() => {
    fetchSessionsAndStats();
  }, []);

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

  // DB에서 불러온 책 목록
  useEffect(() => {
    (async () => {
      const db = await DatabaseService.getInstance();
      const allBooks = await db.getAllBooks();
      // [디버깅] 전체 책 목록 로그
      console.log('DB 전체 책 목록:', allBooks);
      // status !== 'deleted'인 책만 내 서재로 간주
      const libraryBooks = allBooks.filter((b: any) => b.status !== 'deleted');
      // [디버깅] 내 서재 책 목록 로그
      console.log('내 서재 책 목록:', libraryBooks);
      setBooks(libraryBooks);
      // route param으로 책이 넘어온 경우에도 삭제된 책은 무시
      if (route && (route as any).params && (route as any).params.book) {
        const book = (route as any).params.book;
        const found = libraryBooks.find((b: any) => b.id === book.id);
        if (found) {
          setSelectedBook(found.title);
          setSelectedBookId(String(found.id));
          setComboValue(String(found.id));
        }
      }
    })();
  }, []);

  // books가 바뀔 때마다 items도 갱신
  useEffect(() => {
    setItems(
      books.map(book => ({
        label: `${book.title} - ${book.author}`,
        value: String(book.id),
        key: String(book.id),
      }))
    );
  }, [books]);

  // 책 선택 시 id(string) 기준으로 상태 세팅
  const handleBookSelect = async (id: string) => {
    setComboValue(id);
    setSelectedBookId(id);
    const found = books.find(b => String(b.id) === id);
    setSelectedBook(found ? found.title : '');
  };

  const handleStart = () => {
    if (!selectedBookId) {
      Alert.alert('오류', '읽을 책을 선택해주세요');
      return;
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = async () => {
    if (seconds === 0) return;
    if (!selectedBookId) {
      Alert.alert('오류', '읽을 책을 선택해주세요');
      return;
    }
    const minutes = Math.floor(seconds / 60);
    const now = new Date();
    const start = new Date(now.getTime() - seconds * 1000);
    const session = {
      book_id: parseInt(selectedBookId!),
      start_time: `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${start.toTimeString().slice(0,8)}`,
      end_time: `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${now.toTimeString().slice(0,8)}`,
      duration_minutes: minutes,
      pages_read: parseInt(manualPages) || 0,
      memo: notes,
    };
    const db = await DatabaseService.getInstance();
    await db.addReadingSession(session);
    setIsRunning(false);
    setSeconds(0);
    setSelectedBook('');
    setSelectedBookId(null);
    setComboValue(null);
    setManualPages('');
    setNotes('');
    Alert.alert('성공', `${minutes}분 독서 기록이 저장되었습니다!`);
    fetchSessionsAndStats();
  };

  const handleManualAdd = async () => {
    if (!selectedBookId || !manualMinutes) {
      Alert.alert('오류', '책과 시간을 입력해주세요');
      return;
    }
    const now = new Date();
    const session = {
      book_id: parseInt(selectedBookId!),
      start_time: `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${now.toTimeString().slice(0,8)}`,
      end_time: `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${now.toTimeString().slice(0,8)}`,
      duration_minutes: parseInt(manualMinutes),
      pages_read: parseInt(manualPages) || 0,
      memo: notes,
    };
    const db = await DatabaseService.getInstance();
    await db.addReadingSession(session);
    setSelectedBook('');
    setSelectedBookId(null);
    setComboValue(null);
    setManualMinutes('');
    setManualPages('');
    setNotes('');
    Alert.alert('성공', '독서 기록이 추가되었습니다!');
    fetchSessionsAndStats();
  };

  // 커스텀 버튼
  const CustomButton = ({ onPress, icon, text, color, outline, disabled, style }: any) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: outline ? '#fff' : color || '#1976d2',
        borderWidth: outline ? 1 : 0,
        borderColor: color || '#1976d2',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        opacity: disabled ? 0.5 : 1,
        marginHorizontal: 4,
        justifyContent: 'center',
      }, style]}
    >
      {icon}
      <Text style={{ color: outline ? (color || '#1976d2') : '#fff', fontWeight: 'bold', marginLeft: icon ? 6 : 0 }}>{text}</Text>
    </TouchableOpacity>
  );

  // 커스텀 뱃지
  const CustomBadge = ({ children, style, textStyle }: any) => (
    <View style={[{
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 2,
      alignSelf: 'flex-start',
      backgroundColor: '#e0e7ff',
      marginLeft: 6,
    }, style]}>
      <Text style={[{ color: '#3730a3', fontSize: 12 }, textStyle]}>{children}</Text>
    </View>
  );

  // 커스텀 카드
  const CustomCard = ({ children, style }: any) => {
    const wrappedChildren = React.Children.map(children, (child) => {
      if (typeof child === 'string' && child.trim() !== '') {
        return <Text>{child}</Text>;
      }
      if (typeof child === 'string') {
        // 공백/줄바꿈은 무시
        return null;
      }
      return child;
    });
    return <View style={[styles.card, { backgroundColor: '#fff', padding: 16 }, style]}>{wrappedChildren}</View>;
  };

  // 커스텀 카드 타이틀
  const CustomCardTitle = ({ title, left }: any) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
      {left && left()}
      <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#222' }}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerCard}>
        <Text style={styles.headerTitleCard}>독서 시간 기록</Text>
        <Text style={styles.headerSubCard}>{`오늘 총 ${totalStats.totalMinutes}분, ${totalStats.totalPages}페이지 읽었어요`}</Text>
      </View>
      {/* DropDownPicker가 포함된 카드들은 ScrollView 밖에서 View로 분리 */}
        <View style={styles.cardTimer}>
          <View style={styles.cardTitleRow}>
            <Feather name="clock" size={22} color="#2563eb" style={{ marginRight: 8 }} />
            <Text style={styles.cardTitle}>타이머</Text>
          </View>
          {/* 책 선택 */}
          <Text style={styles.label}>읽을 책</Text>
        <View style={[styles.pickerWrapperCard, { overflow: 'visible', zIndex: 3000 }]}>
          <DropDownPicker
            open={open}
            value={comboValue}
            items={items}
            setOpen={setOpen}
            setValue={setComboValue}
            onChangeValue={value => handleBookSelect(value || '')}
            setItems={setItems}
            placeholder="책을 선택하세요"
            style={{ marginBottom: 8, zIndex: 3000 }}
            zIndex={3000}
            zIndexInverse={1000}
            dropDownContainerStyle={{
              zIndex: 4000,
              elevation: 10,
              position: 'absolute',
              top: 44, // 필요시 조정
              backgroundColor: '#fff',
              borderColor: '#e2e8f0',
            }}
          />
          </View>
          {/* 타이머 디스플레이 */}
          <View style={styles.timerDisplayWrapperCard}>
            <Text style={styles.timerTextCard}>{formatTime(seconds)}</Text>
            <View style={styles.timerButtonRowCard}>
              {!isRunning ? (
                <TouchableOpacity
                  onPress={handleStart}
                  style={[styles.actionButtonCard, styles.actionButtonGreen]}
                >
                  <Feather name="play" size={18} color="#fff" style={styles.buttonIconCard} />
                  <Text style={styles.buttonTextCard}>시작</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={handlePause}
                  style={[styles.actionButtonCard, styles.actionButtonOutline]}
                >
                  <Feather name="pause" size={18} color="#2563eb" style={styles.buttonIconCard} />
                  <Text style={[styles.buttonTextCard, { color: '#2563eb' }]}>일시정지</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={handleStop}
                style={[styles.actionButtonCard, styles.actionButtonRed, seconds === 0 && { opacity: 0.5 }]}
                disabled={seconds === 0}
              >
                <Feather name="square" size={18} color="#fff" style={styles.buttonIconCard} />
                <Text style={styles.buttonTextCard}>종료</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* 추가 정보 입력 */}
          <Text style={styles.label}>읽은 페이지 수</Text>
          <TextInput
            placeholder="페이지 수"
            value={manualPages}
            onChangeText={setManualPages}
            keyboardType="numeric"
            style={styles.inputCard}
          />
          <Text style={styles.label}>메모</Text>
          <TextInput
            placeholder="독서 중 느낀 점이나 메모를 남겨보세요"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={2}
            style={styles.inputCard}
          />
        </View>
        <View style={styles.cardTimer}>
          <View style={styles.cardTitleRow}>
            <Feather name="plus" size={22} color="#a21caf" style={{ marginRight: 8 }} />
            <Text style={styles.cardTitle}>수동 입력</Text>
          </View>
          <Text style={styles.label}>읽은 책</Text>
          <View style={styles.pickerWrapperCard}>
          <DropDownPicker
            open={open}
            value={comboValue}
            items={items}
            setOpen={setOpen}
            setValue={setComboValue}
            onChangeValue={value => handleBookSelect(value || '')}
            setItems={setItems}
            placeholder="책을 선택하세요"
            style={{ marginBottom: 8 }}
            zIndex={1000}
                />
          </View>
          <View style={styles.manualRowCard}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.label}>읽은 시간 (분)</Text>
              <TextInput
                placeholder="분"
                value={manualMinutes}
                onChangeText={setManualMinutes}
                keyboardType="numeric"
                style={styles.inputCard}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>읽은 페이지</Text>
              <TextInput
                placeholder="페이지"
                value={manualPages}
                onChangeText={setManualPages}
                keyboardType="numeric"
                style={styles.inputCard}
              />
            </View>
          </View>
          <Text style={styles.label}>메모</Text>
          <TextInput
            placeholder="독서 중 느낀 점이나 메모를 남겨보세요"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            style={styles.inputCard}
          />
          <TouchableOpacity
            onPress={handleManualAdd}
            style={[styles.actionButtonCard, styles.actionButtonPurple, { marginTop: 8 }]}
          >
            <Feather name="plus" size={18} color="#fff" style={styles.buttonIconCard} />
            <Text style={styles.buttonTextCard}>기록 추가</Text>
          </TouchableOpacity>
        </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* 오늘의 독서 기록 카드만 ScrollView 내부에 남김 */}
        <View style={styles.cardTimer}>
          <View style={styles.cardTitleRow}>
            <Feather name="book-open" size={22} color="#16a34a" style={{ marginRight: 8 }} />
            <Text style={styles.cardTitle}>오늘의 독서 기록</Text>
          </View>
          {todaySessions.length === 0 ? (
            <Text style={{ color: '#888', textAlign: 'center', marginVertical: 16 }}>오늘의 기록이 없습니다.</Text>
          ) : (
            todaySessions.map((item) => (
              <View key={item.id} style={styles.sessionItemCard}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                    <Text style={styles.sessionBookCard}>{item.book}</Text>
                    <View style={styles.badgeCard}><Text style={styles.badgeCardText}>{`${item.minutes}분`}</Text></View>
                    {item.pages > 0 && (
                      <View style={[styles.badgeCard, { backgroundColor: '#f3e8ff' }]}><Text style={[styles.badgeCardText, { color: '#a21caf' }]}>{`${item.pages}페이지`}</Text></View>
                    )}
                  </View>
                  <Text style={styles.sessionTimeCard}>{item.startTime} - {item.endTime}</Text>
                  {item.notes ? (
                    <Text style={styles.sessionNotesCard}>{item.notes}</Text>
                  ) : null}
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
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
    marginTop: 12,
    marginBottom: 6,
    color: '#374151',
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
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    color: '#222',
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
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerCard: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitleCard: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  headerSubCard: {
    fontSize: 14,
    color: '#6b7280',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  cardTimer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  pickerWrapperCard: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    marginBottom: 8,
    overflow: 'hidden',
  },
  timerDisplayWrapperCard: {
    alignItems: 'center',
    marginVertical: 18,
  },
  timerTextCard: {
    fontSize: 48,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 8,
  },
  timerButtonRowCard: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: '#2563eb',
  },
  actionButtonGreen: {
    backgroundColor: '#16a34a',
  },
  actionButtonRed: {
    backgroundColor: '#dc2626',
  },
  actionButtonPurple: {
    backgroundColor: '#a21caf',
  },
  actionButtonOutline: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#2563eb',
  },
  buttonIconCard: {
    marginRight: 8,
  },
  buttonTextCard: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
    color: '#fff',
  },
  inputCard: {
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1f2937',
  },
  manualRowCard: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  sessionItemCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  sessionBookCard: {
    fontWeight: '600',
    color: '#1e293b',
    fontSize: 16,
  },
  sessionTimeCard: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },
  sessionNotesCard: {
    fontSize: 14,
    color: '#334155',
    marginTop: 2,
  },
  badgeCard: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    backgroundColor: '#e0e7ff',
    marginLeft: 6,
    fontSize: 12,
  },
  badgeCardText: {
    color: '#3730a3',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default ReadingTimerScreen; 