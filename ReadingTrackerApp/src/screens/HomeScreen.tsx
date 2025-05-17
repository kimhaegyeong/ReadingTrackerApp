import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  Animated, 
  Dimensions, 
  Platform,
  useColorScheme,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useBookContext } from '../contexts/BookContext';
import { useReadingContext } from '../contexts/ReadingContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LineChart, PieChart } from 'react-native-chart-kit';

type RootStackParamList = {
  MainTabs: undefined;
  Search: { query?: string; tab?: string };
  BookDetail: { bookId: string };
  RecordEdit: { bookId?: string };
  GoalSetting: undefined;
  MemoManage: { highlightId?: string; mode?: string; bookId?: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Book {
  id: string;
  title: string;
  authors?: string[];
  thumbnail?: string;
  progress: number;
  lastRead: string;
}

interface ReadingGoal {
  id: number;
  target: number;
  progress: number;
  completed: boolean;
  period: 'yearly' | 'monthly';
  endDate: string;
  startDate: string;
  isPublic: boolean;
  notificationsEnabled: boolean;
  notificationTime?: string;
}

interface RecommendedBook {
  id: string;
  title: string;
  author: string;
  genre: string;
  coverUrl: string;
  reason?: string;
}

interface ReadingHighlight {
  id: string;
  bookId: string;
  content: string;
  page: number;
}

interface WidgetConfig {
  id: string;
  visible: boolean;
}

interface ReadingData {
  date: string;
  minutes: number;
}

interface ReadingStats {
  dailyMinutes: number;
  weeklyMinutes: number;
  monthlyMinutes: number;
  genreDistribution: {
    genre: string;
    percentage: number;
    color: string;
  }[];
  readingTimeDistribution: {
    hour: number;
    minutes: number;
  }[];
}

interface ReadingSession {
  id: string;
  bookId: string;
  startTime: string;
  endTime: string;
  duration: number;
  pagesRead: number;
}

interface PieChartData {
  data: Array<{
    name: string;
    population: number;
    color: string;
    legendFontColor?: string;
    legendFontSize?: number;
  }>;
}

const { width } = Dimensions.get('window');
const BOOK_CARD_WIDTH = width * 0.7;
const BOOK_CARD_MARGIN = 10;

interface WidgetItem {
  id: string;
  component: React.ReactNode;
}

const BookCarousel = ({ books, isDarkMode, navigation }: { books: Book[], isDarkMode: boolean, navigation: NavigationProp }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [activeBookIndex, setActiveBookIndex] = useState(0);

  if (books.length === 0) {
    return (
      <View style={styles.emptyStateContainer}>
        <MaterialIcons name="library-books" size={48} color={isDarkMode ? '#777' : '#ccc'} />
        <Text style={[styles.emptyStateText, isDarkMode && styles.darkText]}>
          아직 읽고 있는 책이 없어요
        </Text>
        <TouchableOpacity 
          style={styles.emptyStateButton}
          onPress={() => navigation.navigate('Search', { query: '' })}
        >
          <Text style={styles.emptyStateButtonText}>책 찾아보기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View>
      <Animated.FlatList
        data={books}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={BOOK_CARD_WIDTH + BOOK_CARD_MARGIN * 2}
        decelerationRate="fast"
        contentContainerStyle={styles.carouselContainer}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / (BOOK_CARD_WIDTH + BOOK_CARD_MARGIN * 2)
          );
          setActiveBookIndex(index);
        }}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * (BOOK_CARD_WIDTH + BOOK_CARD_MARGIN * 2),
            index * (BOOK_CARD_WIDTH + BOOK_CARD_MARGIN * 2),
            (index + 1) * (BOOK_CARD_WIDTH + BOOK_CARD_MARGIN * 2),
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.9, 1, 0.9],
            extrapolate: 'clamp',
          });

          return (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('BookDetail', { bookId: item.id })}
              onLongPress={() => navigation.navigate('RecordEdit', { bookId: item.id })}
            >
              <Animated.View 
                style={[
                  styles.bookCard, 
                  { transform: [{ scale }] },
                  isDarkMode && styles.darkBookCard
                ]}
              >
                <View style={styles.bookCardContent}>
                  {item.thumbnail ? (
                    <Image source={{ uri: item.thumbnail }} style={styles.bookCover} />
                  ) : (
                    <View style={styles.bookCoverPlaceholder}>
                      <MaterialIcons name="book" size={40} color="#999" />
                    </View>
                  )}
                  <View style={styles.bookInfo}>
                    <Text style={[styles.bookTitle, isDarkMode && styles.darkText]} numberOfLines={2}>
                      {item.title}
                    </Text>
                    <Text style={[styles.bookAuthor, isDarkMode && styles.darkSubText]} numberOfLines={1}>
                      {item.authors?.join(', ')}
                    </Text>
                    <Text style={[styles.lastReadText, isDarkMode && styles.darkSubText]}>
                      마지막 독서: {formatDate(item.lastRead)}
                    </Text>
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBarContainer}>
                        <LinearGradient
                          colors={getProgressColor(item.progress)}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={[styles.progressBar, { width: `${item.progress}%` }]}
                        />
                      </View>
                      <Text style={[styles.progressText, isDarkMode && styles.darkSubText]}>
                        {Math.round(item.progress)}%
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.bookActions}>
                  <TouchableOpacity 
                    style={styles.bookActionButton}
                    onPress={() => navigation.navigate('RecordEdit', { bookId: item.id })}
                  >
                    <MaterialIcons name="timer" size={20} color={isDarkMode ? '#fff' : '#007AFF'} />
                    <Text style={[styles.bookActionText, isDarkMode && styles.darkText]}>타이머</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.bookActionButton}
                    onPress={() => navigation.navigate('MemoManage', { bookId: item.id })}
                  >
                    <MaterialIcons name="note-add" size={20} color={isDarkMode ? '#fff' : '#007AFF'} />
                    <Text style={[styles.bookActionText, isDarkMode && styles.darkText]}>메모</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.bookActionButton}
                    onPress={() => navigation.navigate('BookDetail', { bookId: item.id })}
                  >
                    <MaterialIcons name="bookmark-border" size={20} color={isDarkMode ? '#fff' : '#007AFF'} />
                    <Text style={[styles.bookActionText, isDarkMode && styles.darkText]}>북마크</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={item => item.id}
      />

      <View style={styles.paginationContainer}>
        {books.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === activeBookIndex && styles.paginationDotActive,
              isDarkMode && styles.darkPaginationDot,
              index === activeBookIndex && isDarkMode && styles.darkPaginationDotActive
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const ReadingSummary = ({ isDarkMode, todayTime, yesterdayTime, streak, weeklyReadingData }: {
  isDarkMode: boolean;
  todayTime: number;
  yesterdayTime: number;
  streak: number;
  weeklyReadingData: ReadingData[];
}) => {
  const hasReadingData = weeklyReadingData.some(data => data.minutes > 0);

  return (
    <View style={[styles.widget, isDarkMode && styles.darkWidget]}>
      <View style={styles.widgetHeader}>
        <Text style={[styles.widgetTitle, isDarkMode && styles.darkText]}>주간 독서 요약</Text>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, isDarkMode && styles.darkText]}>{formatTime(todayTime)}</Text>
          <Text style={[styles.statLabel, isDarkMode && styles.darkText]}>오늘</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, isDarkMode && styles.darkText]}>{formatTime(yesterdayTime)}</Text>
          <Text style={[styles.statLabel, isDarkMode && styles.darkText]}>어제</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, isDarkMode && styles.darkText]}>{streak}일</Text>
          <Text style={[styles.statLabel, isDarkMode && styles.darkText]}>연속</Text>
        </View>
      </View>
      {hasReadingData ? (
        <View style={styles.chartContainer}>
          <LineChart
            data={{
              labels: weeklyReadingData.map(data => data.date),
              datasets: [{
                data: weeklyReadingData.map(data => Math.max(0, data.minutes || 0)),
              }],
            }}
            width={width - 80}
            height={180}
            chartConfig={{
              backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
              backgroundGradientFrom: isDarkMode ? '#1e1e1e' : '#ffffff',
              backgroundGradientTo: isDarkMode ? '#1e1e1e' : '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 122, 255, ${opacity})`,
              labelColor: (opacity = 1) => isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: 6,
                strokeWidth: 2,
                stroke: isDarkMode ? '#ffffff' : '#007AFF',
              },
            }}
            bezier
            style={styles.chart}
            fromZero={true}
          />
        </View>
      ) : (
        <View style={[styles.emptyChartContainer, isDarkMode && styles.darkEmptyChartContainer]}>
          <MaterialIcons name="show-chart" size={48} color={isDarkMode ? '#444' : '#ccc'} />
          <Text style={[styles.emptyChartText, isDarkMode && styles.darkText]}>
            아직 독서 기록이 없어요
          </Text>
        </View>
      )}
    </View>
  );
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};

const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0) {
    return `${hours}시간 ${mins}분`;
  }
  return `${mins}분`;
};

const getProgressColor = (progress: number): readonly [string, string] => {
  if (progress < 30) return ['#FF9500', '#FFCC00'] as const;
  if (progress < 70) return ['#34C759', '#32D74B'] as const;
  return ['#007AFF', '#5AC8FA'] as const;
};

const ReadingStats = ({ isDarkMode, readingStats }: { isDarkMode: boolean; readingStats: ReadingStats }) => {
  const pieData: PieChartData = {
    data: readingStats.genreDistribution
      .filter(item => item.percentage > 0)
      .map(item => ({
        name: item.genre,
        population: Math.max(0, item.percentage),
        color: item.color,
        legendFontColor: isDarkMode ? '#fff' : '#000',
        legendFontSize: 12,
      }))
  };

  return (
    <View style={[styles.widget, isDarkMode && styles.darkWidget]}>
      <View style={styles.widgetHeader}>
        <Text style={[styles.widgetTitle, isDarkMode && styles.darkText]}>독서 통계</Text>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, isDarkMode && styles.darkText]}>{readingStats.dailyMinutes}분</Text>
          <Text style={[styles.statLabel, isDarkMode && styles.darkText]}>오늘</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, isDarkMode && styles.darkText]}>{readingStats.weeklyMinutes}분</Text>
          <Text style={[styles.statLabel, isDarkMode && styles.darkText]}>이번 주</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, isDarkMode && styles.darkText]}>{readingStats.monthlyMinutes}분</Text>
          <Text style={[styles.statLabel, isDarkMode && styles.darkText]}>이번 달</Text>
        </View>
      </View>
      <View style={styles.chartContainer}>
        <PieChart
          data={pieData}
          width={width - 80}
          height={180}
          chartConfig={{
            backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
            backgroundGradientFrom: isDarkMode ? '#1e1e1e' : '#ffffff',
            backgroundGradientTo: isDarkMode ? '#1e1e1e' : '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
          avoidFalseZero={true}
        />
      </View>
    </View>
  );
};

const GoalWidget = ({ isDarkMode, goals }: { isDarkMode: boolean; goals: ReadingGoal[] }) => {
  const activeGoal = goals.find(goal => !goal.completed);
  if (!activeGoal) return null;

  const progress = (activeGoal.progress / activeGoal.target) * 100;
  const [startColor, endColor] = getProgressColor(progress);

  return (
    <View style={[styles.goalCard, isDarkMode && styles.darkCard]}>
      <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
        독서 목표
      </Text>
      <View style={styles.goalProgress}>
        <LinearGradient
          colors={[startColor, endColor]}
          style={[styles.progressBar, { width: `${progress}%` }]}
        />
      </View>
      <View style={styles.goalInfo}>
        <Text style={[styles.goalText, isDarkMode && styles.darkText]}>
          {activeGoal.target}권 읽기
        </Text>
        <Text style={[styles.progressText, isDarkMode && styles.darkText]}>
          {activeGoal.progress}권 완료
        </Text>
      </View>
    </View>
  );
};

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();
  const { books } = useBookContext();
  const { 
    readingSessions, 
    goals, 
    highlights,
    getTodayReadingTime,
    getReadingStreak,
    getRecentHighlights,
    getReadingSessionsByDate,
    getReadingStats
  } = useReadingContext();

  const [greeting, setGreeting] = useState('');
  const [currentBooks, setCurrentBooks] = useState<Book[]>([]);
  const [recentHighlights, setRecentHighlights] = useState<ReadingHighlight[]>([]);
  const [recommendedBooks, setRecommendedBooks] = useState<RecommendedBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [todayReadingTime, setTodayReadingTime] = useState<number>(0);
  const [yesterdayReadingTime, setYesterdayReadingTime] = useState<number>(0);
  const [showGoalCelebration, setShowGoalCelebration] = useState(false);
  const celebrationAnim = useRef(new Animated.Value(0)).current;
  const fabAnim = useRef(new Animated.Value(0)).current;
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const [widgetConfig, setWidgetConfig] = useState<WidgetConfig[]>([
    { id: 'bookCarousel', visible: true },
    { id: 'readingSummary', visible: true },
    { id: 'goalWidget', visible: true },
    { id: 'highlights', visible: true },
    { id: 'recommendedBooks', visible: true },
  ]);

  const [weeklyReadingData, setWeeklyReadingData] = useState<ReadingData[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [readingStats, setReadingStats] = useState<ReadingStats>({
    dailyMinutes: 0,
    weeklyMinutes: 0,
    monthlyMinutes: 0,
    genreDistribution: [],
    readingTimeDistribution: []
  });

  useEffect(() => {
    const loadReadingStats = () => {
      const stats = getReadingStats();
      setReadingStats(stats);
    };

    loadReadingStats();
  }, [getReadingStats]);

  useEffect(() => {
    const hour = new Date().getHours();
    let newGreeting = '';

    if (hour < 12) {
      newGreeting = '좋은 아침이에요';
    } else if (hour < 17) {
      newGreeting = '좋은 오후에요';
    } else {
      newGreeting = '좋은 저녁이에요';
    }

    if (user?.name) {
      newGreeting += `, ${user.name}님`;
    }

    setGreeting(newGreeting);
  }, [user]);

  useEffect(() => {
    setCurrentBooks(books.slice(0, 3).map(book => ({
      ...book,
      progress: Math.random() * 100,
      lastRead: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    })));

    setRecommendedBooks([
      { id: 'rec1', title: '사피엔스', author: '유발 하라리', genre: '역사/과학', coverUrl: '' },
      { id: 'rec2', title: '아몬드', author: '손원평', genre: '소설', coverUrl: '' },
      { id: 'rec3', title: '부의 추월차선', author: '엠제이 드마코', genre: '자기계발', coverUrl: '' },
    ]);

    setRecentHighlights(getRecentHighlights(3));
    setYesterdayReadingTime(Math.floor(Math.random() * 120));

    const activeGoal = goals.find(goal => !goal.completed);
    if (activeGoal && activeGoal.progress >= activeGoal.target) {
      setShowGoalCelebration(true);
      Animated.sequence([
        Animated.spring(celebrationAnim, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.spring(celebrationAnim, {
          toValue: 0,
          friction: 3,
          useNativeDriver: true,
        })
      ]).start(() => setShowGoalCelebration(false));
    }

    setIsLoading(false);
  }, [books, getRecentHighlights, goals]);

  useEffect(() => {
    Animated.spring(fabAnim, {
      toValue: isFabOpen ? 1 : 0,
      friction: 6,
      useNativeDriver: true,
    }).start();
  }, [isFabOpen, fabAnim]);

  const toggleFab = () => {
    setIsFabOpen(!isFabOpen);
  };

  const toggleWidgetVisibility = (widgetId: string) => {
    setWidgetConfig(prev => 
      prev.map(widget => 
        widget.id === widgetId 
          ? { ...widget, visible: !widget.visible }
          : widget
      )
    );
  };

  const handleStartTimer = (bookId: string) => {
    navigation.navigate('RecordEdit', { bookId });
  };

  const handleAddMemo = () => {
    navigation.navigate('MemoManage', { mode: 'add' });
  };

  const handleAddRecord = () => {
    navigation.navigate('RecordEdit', { bookId: '' });
  };

  const renderWidget = (widgetId: string) => {
    switch (widgetId) {
      case 'bookCarousel':
        return (
          <View>
            <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
              현재 읽고 있는 책
            </Text>
            <BookCarousel books={currentBooks} isDarkMode={isDarkMode} navigation={navigation} />
          </View>
        );
      case 'readingSummary':
        return (
          <View>
            <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
              오늘의 독서 요약
            </Text>
            <ReadingSummary
              isDarkMode={isDarkMode}
              todayTime={getTodayReadingTime()}
              yesterdayTime={yesterdayReadingTime}
              streak={getReadingStreak()}
              weeklyReadingData={weeklyReadingData}
            />
          </View>
        );
      case 'goalWidget':
        return (
          <View>
            <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
              독서 목표
            </Text>
            <GoalWidget isDarkMode={isDarkMode} goals={goals} />
          </View>
        );
      case 'readingStats':
        return (
          <View>
            <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
              독서 통계
            </Text>
            <ReadingStats isDarkMode={isDarkMode} readingStats={readingStats} />
          </View>
        );
      default:
        return null;
    }
  };

  const renderWidgets = () => {
    const visibleWidgets = widgetConfig
      .filter(widget => widget.visible)
      .map(widget => ({
        id: widget.id,
        component: renderWidget(widget.id)
      }));

    return (
      <FlatList
        data={visibleWidgets}
        renderItem={({ item }) => (
          <View style={[styles.widgetContainer, isDarkMode && styles.darkWidgetContainer]}>
            {item.component}
          </View>
        )}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.widgetList}
      />
    );
  };

  const renderFloatingActionButton = () => {
    const rotation = fabAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '45deg']
    });

    const actionButtonsOpacity = fabAnim;
    const actionButtonsTranslateY = fabAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [20, 0]
    });

    return (
      <View style={styles.fabContainer}>
        {/* Action buttons */}
        <Animated.View 
          style={[
            styles.fabAction,
            { 
              opacity: actionButtonsOpacity,
              transform: [{ translateY: actionButtonsTranslateY }],
              bottom: 160
            }
          ]}
          pointerEvents={isFabOpen ? 'auto' : 'none'}
        >
          <TouchableOpacity 
            style={[styles.fabActionButton, { backgroundColor: '#FF9500' }]}
            onPress={() => {
              toggleFab();
              if (currentBooks.length > 0) {
                handleStartTimer(currentBooks[0].id);
              } else {
                handleAddRecord();
              }
            }}
          >
            <MaterialIcons name="timer" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={[styles.fabActionText, isDarkMode && styles.darkText]}>타이머 시작</Text>
        </Animated.View>

        <Animated.View 
          style={[
            styles.fabAction,
            { 
              opacity: actionButtonsOpacity,
              transform: [{ translateY: actionButtonsTranslateY }],
              bottom: 100
            }
          ]}
          pointerEvents={isFabOpen ? 'auto' : 'none'}
        >
          <TouchableOpacity 
            style={[styles.fabActionButton, { backgroundColor: '#34C759' }]}
            onPress={() => {
              toggleFab();
              handleAddMemo();
            }}
          >
            <MaterialIcons name="note-add" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={[styles.fabActionText, isDarkMode && styles.darkText]}>메모 추가</Text>
        </Animated.View>

        <Animated.View 
          style={[
            styles.fabAction,
            { 
              opacity: actionButtonsOpacity,
              transform: [{ translateY: actionButtonsTranslateY }],
              bottom: 40
            }
          ]}
          pointerEvents={isFabOpen ? 'auto' : 'none'}
        >
          <TouchableOpacity 
            style={[styles.fabActionButton, { backgroundColor: '#007AFF' }]}
            onPress={() => {
              toggleFab();
              handleAddRecord();
            }}
          >
            <MaterialIcons name="edit" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={[styles.fabActionText, isDarkMode && styles.darkText]}>독서 기록 추가</Text>
        </Animated.View>

        {/* Main FAB */}
        <TouchableOpacity
          style={[styles.fab, isDarkMode && styles.darkFab]}
          onPress={toggleFab}
          activeOpacity={0.8}
        >
          <Animated.View style={{ transform: [{ rotate: rotation }] }}>
            <MaterialIcons name="add" size={24} color="#fff" />
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered, isDarkMode && styles.darkContainer]}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={styles.header}>
        <Text style={[styles.greeting, isDarkMode && styles.darkText]}>{greeting}</Text>
      </View>
      {renderWidgets()}
      {renderFloatingActionButton()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  darkText: {
    color: '#fff',
  },
  darkSubText: {
    color: '#aaa',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    marginLeft: 20,
  },
  sectionContainer: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  seeAllText: {
    color: '#007AFF',
    fontSize: 14,
  },

  // Book carousel
  carouselContainer: {
    paddingHorizontal: 10,
  },
  bookCard: {
    width: BOOK_CARD_WIDTH,
    marginHorizontal: BOOK_CARD_MARGIN,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    padding: 16,
  },
  darkBookCard: {
    backgroundColor: '#1e1e1e',
  },
  bookCardContent: {
    flexDirection: 'row',
  },
  bookCover: {
    width: 80,
    height: 120,
    borderRadius: 6,
    marginRight: 16,
  },
  bookCoverPlaceholder: {
    width: 80,
    height: 120,
    borderRadius: 6,
    marginRight: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  lastReadText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#007AFF',
    width: 16,
  },
  darkPaginationDot: {
    backgroundColor: '#444',
  },
  darkPaginationDotActive: {
    backgroundColor: '#007AFF',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginBottom: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    marginBottom: 16,
  },
  emptyStateButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontWeight: '600',
  },

  // Reading summary card
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  darkCard: {
    backgroundColor: '#1e1e1e',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#eee',
    marginHorizontal: 10,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
  },

  // Goal widget
  goalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  goalProgress: {
    marginBottom: 12,
  },
  goalInfo: {
    marginTop: 12,
  },
  goalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#34C759',
    borderRadius: 4,
  },
  celebrationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  celebrationText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  celebrationSubText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
  },

  // Highlights section
  highlightsContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  highlightCard: {
    width: width * 0.7,
    marginHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  highlightContent: {
    fontSize: 16,
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  highlightFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  highlightBook: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  highlightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  highlightActionButton: {
    padding: 4,
    marginLeft: 8,
  },

  // Recommended books section
  recommendedSection: {
    marginTop: 24,
  },
  recommendedHeader: {
    marginBottom: 16,
  },
  genreFilter: {
    marginTop: 12,
    paddingHorizontal: 20,
  },
  genreChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  genreChipSelected: {
    backgroundColor: '#007AFF',
  },
  darkGenreChip: {
    backgroundColor: '#2c2c2c',
  },
  darkGenreChipSelected: {
    backgroundColor: '#0A84FF',
  },
  genreChipText: {
    fontSize: 14,
    color: '#333',
  },
  genreChipTextSelected: {
    color: '#fff',
  },
  darkGenreChipText: {
    color: '#fff',
  },
  darkGenreChipTextSelected: {
    color: '#fff',
  },
  recommendedScroll: {
    paddingHorizontal: 10,
  },
  recommendedBookCard: {
    width: 160,
    marginHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  recommendedBookCover: {
    width: '100%',
    height: 120,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recommendedBookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  recommendedBookAuthor: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  recommendationReason: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  recommendedBookGenre: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  recommendedBookGenreText: {
    fontSize: 10,
    color: '#666',
  },

  // Floating Action Button
  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  darkFab: {
    backgroundColor: '#0A84FF',
  },
  fabAction: {
    position: 'absolute',
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fabActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  fabActionText: {
    marginRight: 16,
    fontSize: 14,
    fontWeight: '600',
  },

  // Misc
  bottomPadding: {
    height: 80,
  },
  timeDiffText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  timeDiffContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  timeDiffLabel: {
    fontSize: 12,
    color: '#666',
  },

  // Widget settings
  widgetSettingsContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  widgetSettingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  widgetSettingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  widgetSettingToggle: {
    marginRight: 16,
  },
  widgetSettingLabel: {
    flex: 1,
    fontSize: 16,
  },
  widgetSettingDrag: {
    padding: 8,
  },

  // Chart
  chartContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  timeDistributionContainer: {
    marginTop: 20,
  },
  timeDistributionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
    paddingHorizontal: 10,
  },
  timeDistributionItem: {
    alignItems: 'center',
    flex: 1,
  },
  timeDistributionBar: {
    width: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  timeDistributionLabel: {
    fontSize: 10,
    color: '#666',
  },
  bookActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  bookActionButton: {
    alignItems: 'center',
  },
  bookActionText: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 4,
  },
  sectionActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionActionButton: {
    marginLeft: 16,
  },
  widgetList: {
    paddingBottom: 100, // FAB를 위한 여백
  },
  widgetContainer: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  darkWidgetContainer: {
    backgroundColor: '#1e1e1e',
  },
  header: {
    padding: 20,
  },
  widget: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  darkWidget: {
    backgroundColor: '#1e1e1e',
  },
  widgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  widgetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  emptyChartContainer: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    marginTop: 20,
  },
  darkEmptyChartContainer: {
    backgroundColor: '#2c2c2c',
  },
  emptyChartText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
