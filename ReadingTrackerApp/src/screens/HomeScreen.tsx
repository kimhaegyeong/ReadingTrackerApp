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

const { width } = Dimensions.get('window');
const BOOK_CARD_WIDTH = width * 0.7;
const BOOK_CARD_MARGIN = 10;

export default function HomeScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { books } = useBookContext();
  const { 
    readingSessions, 
    goals, 
    highlights,
    getTodayReadingTime,
    getReadingStreak,
    getRecentHighlights
  } = useReadingContext();

  const [greeting, setGreeting] = useState('');
  const [currentBooks, setCurrentBooks] = useState([]);
  const [recentHighlights, setRecentHighlights] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [activeBookIndex, setActiveBookIndex] = useState(0);

  const scrollX = useRef(new Animated.Value(0)).current;
  const fabAnim = useRef(new Animated.Value(0)).current;
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // Set greeting based on time of day
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

  // Set current books
  useEffect(() => {
    // In a real app, you would have a "current" flag on books
    // For now, we'll just use the first 3 books as "current"
    setCurrentBooks(books.slice(0, 3).map(book => ({
      ...book,
      progress: Math.random() * 100, // Mock progress
      lastRead: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() // Random date within last week
    })));

    // Mock recommended books
    setRecommendedBooks([
      { id: 'rec1', title: '사피엔스', author: '유발 하라리', genre: '역사/과학' },
      { id: 'rec2', title: '아몬드', author: '손원평', genre: '소설' },
      { id: 'rec3', title: '부의 추월차선', author: '엠제이 드마코', genre: '자기계발' },
    ]);

    // Get recent highlights
    setRecentHighlights(getRecentHighlights(3));

    setIsLoading(false);
  }, [books, getRecentHighlights]);

  // Animate FAB
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return `${hours}시간 ${mins}분`;
    }
    return `${mins}분`;
  };

  const getProgressColor = (progress) => {
    if (progress < 30) return ['#FF9500', '#FFCC00'];
    if (progress < 70) return ['#34C759', '#32D74B'];
    return ['#007AFF', '#5AC8FA'];
  };

  const renderBookCarousel = () => {
    if (currentBooks.length === 0) {
      return (
        <View style={styles.emptyStateContainer}>
          <MaterialIcons name="library-books" size={48} color={isDarkMode ? '#777' : '#ccc'} />
          <Text style={[styles.emptyStateText, isDarkMode && styles.darkText]}>
            아직 읽고 있는 책이 없어요
          </Text>
          <TouchableOpacity 
            style={styles.emptyStateButton}
            onPress={() => navigation.navigate('Search')}
          >
            <Text style={styles.emptyStateButtonText}>책 찾아보기</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View>
        <Animated.FlatList
          data={currentBooks}
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
                </Animated.View>
              </TouchableOpacity>
            );
          }}
          keyExtractor={item => item.id}
        />

        <View style={styles.paginationContainer}>
          {currentBooks.map((_, index) => (
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

  const renderReadingSummary = () => {
    const todayTime = getTodayReadingTime();
    const streak = getReadingStreak();

    return (
      <View style={[styles.summaryCard, isDarkMode && styles.darkCard]}>
        <Text style={[styles.cardTitle, isDarkMode && styles.darkText]}>오늘의 독서</Text>
        <View style={styles.summaryContent}>
          <View style={styles.summaryItem}>
            <MaterialIcons name="timer" size={24} color={isDarkMode ? '#fff' : '#007AFF'} />
            <Text style={[styles.summaryValue, isDarkMode && styles.darkText]}>
              {formatTime(todayTime)}
            </Text>
            <Text style={[styles.summaryLabel, isDarkMode && styles.darkSubText]}>독서 시간</Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryItem}>
            <MaterialIcons name="local-fire-department" size={24} color={isDarkMode ? '#fff' : '#FF9500'} />
            <Text style={[styles.summaryValue, isDarkMode && styles.darkText]}>
              {streak}일
            </Text>
            <Text style={[styles.summaryLabel, isDarkMode && styles.darkSubText]}>연속 독서</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderGoalWidget = () => {
    // Use the first active goal, or show a placeholder if none exists
    const activeGoal = goals.find(goal => !goal.completed);

    if (!activeGoal) {
      return (
        <TouchableOpacity 
          style={[styles.goalCard, styles.emptyGoalCard, isDarkMode && styles.darkCard]}
          onPress={() => navigation.navigate('GoalSetting')}
        >
          <MaterialIcons name="add-circle-outline" size={24} color={isDarkMode ? '#fff' : '#007AFF'} />
          <Text style={[styles.emptyGoalText, isDarkMode && styles.darkText]}>독서 목표 설정하기</Text>
        </TouchableOpacity>
      );
    }

    const progress = (activeGoal.progress / activeGoal.target) * 100;

    return (
      <TouchableOpacity 
        style={[styles.goalCard, isDarkMode && styles.darkCard]}
        onPress={() => navigation.navigate('GoalSetting')}
      >
        <View style={styles.goalHeader}>
          <Text style={[styles.cardTitle, isDarkMode && styles.darkText]}>독서 목표</Text>
          <Text style={[styles.goalPeriod, isDarkMode && styles.darkSubText]}>
            {activeGoal.period === 'daily' ? '일간' : 
             activeGoal.period === 'weekly' ? '주간' : 
             activeGoal.period === 'monthly' ? '월간' : '연간'}
          </Text>
        </View>

        <View style={styles.goalProgressContainer}>
          <View style={styles.goalProgressBarContainer}>
            <LinearGradient
              colors={getProgressColor(progress)}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.goalProgressBar, { width: `${progress}%` }]}
            />
          </View>
        </View>

        <View style={styles.goalDetails}>
          <Text style={[styles.goalProgress, isDarkMode && styles.darkText]}>
            {activeGoal.progress} / {activeGoal.target}
            {activeGoal.type === 'books' ? ' 권' : 
             activeGoal.type === 'pages' ? ' 페이지' : ' 시간'}
          </Text>
          <Text style={[styles.goalRemaining, isDarkMode && styles.darkSubText]}>
            {activeGoal.target - activeGoal.progress}
            {activeGoal.type === 'books' ? '권' : 
             activeGoal.type === 'pages' ? '페이지' : '시간'} 남음
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderRecentHighlights = () => {
    if (recentHighlights.length === 0) {
      return null;
    }

    return (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>최근 메모/하이라이트</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MemoManage')}>
            <Text style={styles.seeAllText}>모두 보기</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.highlightsContainer}
        >
          {recentHighlights.map((highlight) => {
            const book = books.find(b => b.id === highlight.bookId);

            return (
              <TouchableOpacity 
                key={highlight.id}
                style={[styles.highlightCard, isDarkMode && styles.darkCard]}
                onPress={() => navigation.navigate('MemoManage', { highlightId: highlight.id })}
              >
                <Text style={[styles.highlightContent, isDarkMode && styles.darkText]} numberOfLines={4}>
                  "{highlight.content}"
                </Text>
                <View style={styles.highlightFooter}>
                  <Text style={[styles.highlightBook, isDarkMode && styles.darkSubText]} numberOfLines={1}>
                    {book?.title || '알 수 없는 책'} - p.{highlight.page}
                  </Text>
                  <TouchableOpacity style={styles.bookmarkButton}>
                    <MaterialIcons name="bookmark-border" size={18} color={isDarkMode ? '#aaa' : '#777'} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const renderRecommendedBooks = () => {
    if (recommendedBooks.length === 0) {
      return null;
    }

    return (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>추천 도서</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Search', { tab: 'recommendations' })}>
            <Text style={styles.seeAllText}>모두 보기</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={recommendedBooks}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recommendationsContainer}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.recommendedBookCard, isDarkMode && styles.darkCard]}
              onPress={() => navigation.navigate('Search', { query: item.title })}
            >
              <View style={styles.recommendedBookCover}>
                <MaterialIcons name="book" size={30} color="#999" />
              </View>
              <View style={styles.recommendedBookInfo}>
                <Text style={[styles.recommendedBookTitle, isDarkMode && styles.darkText]} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={[styles.recommendedBookAuthor, isDarkMode && styles.darkSubText]} numberOfLines={1}>
                  {item.author}
                </Text>
                <View style={styles.recommendedBookGenre}>
                  <Text style={styles.recommendedBookGenreText}>{item.genre}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
        />
      </View>
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
              navigation.navigate('RecordEdit');
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
              navigation.navigate('MemoManage', { mode: 'add' });
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
              navigation.navigate('RecordEdit');
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={[styles.greeting, isDarkMode && styles.darkText]}>{greeting}</Text>

        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>현재 읽고 있는 책</Text>
        {renderBookCarousel()}

        {renderReadingSummary()}

        {renderGoalWidget()}

        {renderRecentHighlights()}

        {renderRecommendedBooks()}

        <View style={styles.bottomPadding} />
      </ScrollView>

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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 20,
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
    fontSize: 12,
    color: '#666',
    width: 36,
    textAlign: 'right',
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
  emptyGoalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  emptyGoalText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalPeriod: {
    fontSize: 14,
    color: '#666',
  },
  goalProgressContainer: {
    marginBottom: 12,
  },
  goalProgressBarContainer: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  goalProgressBar: {
    height: '100%',
    borderRadius: 4,
  },
  goalDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalProgress: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  goalRemaining: {
    fontSize: 14,
    color: '#666',
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
  bookmarkButton: {
    padding: 4,
  },

  // Recommended books section
  recommendationsContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
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
  recommendedBookInfo: {
    flex: 1,
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
  recommendedBookGenre: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
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
});
