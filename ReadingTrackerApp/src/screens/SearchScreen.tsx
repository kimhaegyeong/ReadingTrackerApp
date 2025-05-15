import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  Button, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  Modal,
  ScrollView,
  Keyboard,
  Platform,
  useColorScheme,
  Dimensions,
  Alert,
  Animated
} from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Camera, CameraView } from 'expo-camera';
import * as Speech from 'expo-speech';
import { debounce } from 'lodash';
import { useBookContext } from '../contexts/BookContext';
import { useSearchContext } from '../contexts/SearchContext';
import { useAuth } from '../contexts/AuthContext';
import Constants from 'expo-constants';
import GOOGLE_BOOKS_API_KEY from '../config/googleBooksApiKey';

const { width } = Dimensions.get('window');

export default function SearchScreen() {
  type RootStackParamList = {
    BookDetail: { bookId: string };
    // Add other routes as needed
  };

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { user } = useAuth();
  const { addBook } = useBookContext();
  const { 
    searchHistory, 
    savedFilters, 
    activeFilters, 
    viewMode,
    addToSearchHistory,
    removeFromSearchHistory,
    toggleFilterActive,
    clearActiveFilters,
    setViewMode,
    saveFilter
  } = useSearchContext();

  // State for search
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [filteredResults, setFilteredResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // State for filters
  const [showFilters, setShowFilters] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [filterAuthor, setFilterAuthor] = useState('');
  const [filterPublisher, setFilterPublisher] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterYearFrom, setFilterYearFrom] = useState('');
  const [filterYearTo, setFilterYearTo] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('');

  // State for barcode scanner
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [scanned, setScanned] = useState(false);

  // State for manual entry
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualTitle, setManualTitle] = useState('');
  const [manualAuthor, setManualAuthor] = useState('');
  const [manualPublisher, setManualPublisher] = useState('');
  const [manualYear, setManualYear] = useState('');
  const [manualIsbn, setManualIsbn] = useState('');
  const [manualPages, setManualPages] = useState('');

  // Refs and animations
  const searchInputRef = useRef<TextInput>(null);
  const listRef = useRef<FlatList>(null);
  const filterAnimation = useRef(new Animated.Value(0)).current;

  // Theme
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // Request camera permissions
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === 'granted');
    })();
  }, []);

  // Apply filters when activeFilters changes
  useEffect(() => {
    if (results.length > 0) {
      applyFilters();
    }
  }, [activeFilters, results]);

  // Reset manual entry fields when modal is closed
  useEffect(() => {
    if (!showManualEntry) {
      setManualTitle('');
      setManualAuthor('');
      setManualPublisher('');
      setManualYear('');
      setManualIsbn('');
      setManualPages('');
    }
  }, [showManualEntry]);

  // Animate filter panel
  useEffect(() => {
    Animated.timing(filterAnimation, {
      toValue: showFilters ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [showFilters, filterAnimation]);

  // Debounced search for auto-suggestions
  const debouncedSearch = useCallback(
    debounce((text: string) => {
      if (text.length > 1) {
        fetchSuggestions(text);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300),
    []
  );

  // Handle query change
  const handleQueryChange = (text: string) => {
    setQuery(text);
    if (text.length > 1) {
      setShowHistory(false);
      setShowSuggestions(true);
      debouncedSearch(text);
    } else if (text.length === 0) {
      setShowHistory(true);
      setShowSuggestions(false);
      setSuggestions([]);
    } else {
      setShowHistory(false);
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  // Fetch search suggestions
  const fetchSuggestions = async (text: string) => {
    try {
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(text)}&maxResults=5&key=${GOOGLE_BOOKS_API_KEY}`;
      const res = await fetch(url);
      const json = await res.json();

      if (json.items) {
        const newSuggestions = json.items
          .map((item: any) => item.volumeInfo.title)
          .filter((title: string, index: number, self: string[]) => 
            title && self.indexOf(title) === index
          );
        setSuggestions(newSuggestions.slice(0, 5));
      } else {
        setSuggestions([]);
      }
    } catch (e) {
      console.log('Error fetching suggestions:', e);
      setSuggestions([]);
    }
  };

  // Search books
  const searchBooks = async (searchQuery = query, newSearch = true) => {
    if (!searchQuery.trim()) return;

    if (newSearch) {
      setPage(1);
      setHasMore(true);
      setResults([]);
      setFilteredResults([]);
      setSearchPerformed(true);
      addToSearchHistory(searchQuery);
    }

    setLoading(true);
    Keyboard.dismiss();

    try {
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&startIndex=${newSearch ? 0 : (page - 1) * 10}&maxResults=10&key=${GOOGLE_BOOKS_API_KEY}`;
      const res = await fetch(url);
      const json = await res.json();

      if (json.items) {
        if (newSearch) {
          setResults(json.items);
        } else {
          setResults(prev => [...prev, ...json.items]);
        }

        setPage(prev => prev + 1);
        setHasMore(json.items.length === 10);
      } else {
        if (!newSearch) {
          setHasMore(false);
        }
      }
    } catch (e) {
      console.log('Error searching books:', e);
      if (newSearch) {
        setResults([]);
      }
    } finally {
      setLoading(false);
      setShowHistory(false);
      setShowSuggestions(false);
    }
  };

  // Apply filters to search results
  const applyFilters = () => {
    if (!results || results.length === 0) {
      console.log('No results to filter.');
      setFilteredResults([]);
      return;
    }

    if (activeFilters.length === 0) {
      setFilteredResults(results);
      return;
    }

    const filtered = results.filter(item => {
      const info = item.volumeInfo || {}; // Ensure info is defined

      return activeFilters.every(filter => {
        let matches = true;

        if (filter.author && info.authors) {
          matches = matches && info.authors.some(author => 
            author.toLowerCase().includes(filter.author.toLowerCase())
          );
        }

        if (filter.publisher && info.publisher) {
          matches = matches && info.publisher.toLowerCase().includes(filter.publisher.toLowerCase());
        }

        if (filter.category && info.categories) {
          matches = matches && info.categories.some(category => 
            category.toLowerCase().includes(filter.category.toLowerCase())
          );
        }

        if (filter.yearFrom && info.publishedDate) {
          const year = parseInt(info.publishedDate.substring(0, 4));
          matches = matches && year >= parseInt(String(filter.yearFrom));
        }

        if (filter.yearTo && info.publishedDate) {
          const year = parseInt(info.publishedDate.substring(0, 4));
          matches = matches && year <= parseInt(String(filter.yearTo));
        }

        if (filter.language && info.language) {
          matches = matches && info.language.toLowerCase() === filter.language.toLowerCase();
        }

        return matches;
      });
    });

    setFilteredResults(filtered);
  };

  // Handle barcode scan
  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    setScanned(true);

    try {
      setLoading(true);
      const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${data}&key=${GOOGLE_BOOKS_API_KEY}`;
      const res = await fetch(url);
      const json = await res.json();

      if (json.items && json.items.length > 0) {
        setResults([json.items[0]]);
        setFilteredResults([json.items[0]]);
        setSearchPerformed(true);
        setQuery(`ISBN: ${data}`);
      } else {
        Alert.alert('도서 정보 없음', '스캔한 바코드에 해당하는 도서를 찾을 수 없습니다. 수동으로 입력해 주세요.');
        setShowManualEntry(true);
        setManualIsbn(data);
      }
    } catch (e) {
      console.log('Error scanning barcode:', e);
      Alert.alert('오류', '바코드 스캔 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      setShowScanner(false);
    }
  };

  // Handle manual book entry
  const handleManualEntry = () => {
    if (!manualTitle.trim()) {
      Alert.alert('오류', '제목은 필수 입력 항목입니다.');
      return;
    }

    const newBook = {
      id: `manual_${Date.now()}`,
      title: manualTitle,
      authors: manualAuthor ? [manualAuthor] : [],
      publisher: manualPublisher,
      publishedDate: manualYear,
      industryIdentifiers: manualIsbn ? [
        { type: 'ISBN_13', identifier: manualIsbn }
      ] : undefined,
      pageCount: manualPages ? parseInt(manualPages) : undefined,
    };

    addBook({
      id: newBook.id,
      title: newBook.title,
      authors: newBook.authors,
    });

    Alert.alert('성공', '도서가 내 서재에 추가되었습니다.');

    // Reset form
    setManualTitle('');
    setManualAuthor('');
    setManualPublisher('');
    setManualYear('');
    setManualIsbn('');
    setManualPages('');
    setShowManualEntry(false);
  };

  // Start voice search
  const startVoiceSearch = async () => {
    try {
      const isAvailable = await Speech.isSpeakingAsync();
      if (!isAvailable) {
        Alert.alert('오류', '음성 인식을 사용할 수 없습니다.');
        return;
      }

      Alert.alert(
        '음성 검색',
        '검색어를 말씀해 주세요.',
        [
          { text: '취소', style: 'cancel' },
          { 
            text: '검색 시작', 
            onPress: () => {
              // In a real app, you would use a voice recognition API here
              // For this example, we'll just show a mock alert after a delay
              setTimeout(() => {
                Alert.alert(
                  '음성 인식 결과',
                  '검색어: "해리 포터"',
                  [
                    { 
                      text: '검색', 
                      onPress: () => {
                        setQuery('해리 포터');
                        searchBooks('해리 포터');
                      } 
                    },
                    { text: '취소', style: 'cancel' }
                  ]
                );
              }, 2000);
            } 
          }
        ]
      );
    } catch (e) {
      console.log('Error starting voice search:', e);
      Alert.alert('오류', '음성 검색을 시작하는 중 오류가 발생했습니다.');
    }
  };

  // Save current filter
  const saveCurrentFilter = () => {
    if (!filterName.trim()) {
      Alert.alert('오류', '필터 이름을 입력해 주세요.');
      return;
    }

    const newFilter = {
      name: filterName,
      author: filterAuthor,
      publisher: filterPublisher,
      category: filterCategory,
      yearFrom: filterYearFrom ? parseInt(filterYearFrom) : undefined,
      yearTo: filterYearTo ? parseInt(filterYearTo) : undefined,
      language: filterLanguage,
    };

    saveFilter(newFilter);

    // Reset form
    setFilterName('');
    setFilterAuthor('');
    setFilterPublisher('');
    setFilterCategory('');
    setFilterYearFrom('');
    setFilterYearTo('');
    setFilterLanguage('');
    setShowFilterModal(false);

    Alert.alert('성공', '필터가 저장되었습니다.');
  };

  // Load more results when reaching end of list
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      searchBooks(query, false);
    }
  };

  // Render search result item
  type BookItem = {
    id: string;
    volumeInfo: {
      title: string;
      authors: string[];
      publishedDate: string;
      publisher: string;
      imageLinks?: {
        thumbnail?: string;
      };
      // Add other properties as needed
    };
  };

  const renderResultItem = ({ item }: { item: BookItem }) => {
    const info = item.volumeInfo;
    return (
      <TouchableOpacity 
        style={[styles.resultItem, isDarkMode && styles.darkResultItem]}
        onPress={() => navigation.navigate('BookDetail', { bookId: item.id })}
        activeOpacity={0.7}
      >
        {info.imageLinks?.thumbnail ? (
          <Image source={{ uri: info.imageLinks.thumbnail }} style={styles.thumbnail} />
        ) : (
          <View style={styles.thumbnailPlaceholder}>
            <MaterialIcons name="book" size={30} color="#999" />
          </View>
        )}
        <View style={styles.resultInfo}>
          <Text style={[styles.title, isDarkMode && styles.darkText]} numberOfLines={2}>
            {info.title}
          </Text>
          <Text style={[styles.author, isDarkMode && styles.darkSubText]} numberOfLines={1}>
            {info.authors?.join(', ')}
          </Text>
          {info.publishedDate && (
            <Text style={[styles.publishInfo, isDarkMode && styles.darkSubText]}>
              {info.publisher ? `${info.publisher} · ` : ''}
              {info.publishedDate.substring(0, 4)}
            </Text>
          )}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => {
                addBook({
                  id: item.id,
                  title: info.title,
                  authors: info.authors || [],
                  thumbnail: info.imageLinks?.thumbnail,
                });
                Alert.alert('성공', '내 서재에 추가되었습니다.');
              }}
            >
              <Text style={styles.addBtnText}>내 서재에 추가</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.detailBtn}
              onPress={() => navigation.navigate('BookDetail', { bookId: item.id })}
            >
              <Text style={styles.detailBtnText}>상세정보</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Render grid view item
  const renderGridItem = ({ item }: { item: any }) => {
    const info = item.volumeInfo;
    return (
      <TouchableOpacity 
        style={[styles.gridItem, isDarkMode && styles.darkGridItem]}
        onPress={() => navigation.navigate('BookDetail', { bookId: item.id })}
        activeOpacity={0.7}
      >
        {info.imageLinks?.thumbnail ? (
          <Image source={{ uri: info.imageLinks.thumbnail }} style={styles.gridThumbnail} />
        ) : (
          <View style={styles.gridThumbnailPlaceholder}>
            <MaterialIcons name="book" size={30} color="#999" />
          </View>
        )}
        <Text style={[styles.gridTitle, isDarkMode && styles.darkText]} numberOfLines={2}>
          {info.title}
        </Text>
        <Text style={[styles.gridAuthor, isDarkMode && styles.darkSubText]} numberOfLines={1}>
          {info.authors?.join(', ')}
        </Text>
        <TouchableOpacity
          style={styles.gridAddBtn}
          onPress={() => {
            addBook({
              id: item.id,
              title: info.title,
              authors: info.authors || [],
              thumbnail: info.imageLinks?.thumbnail,
            });
            Alert.alert('성공', '내 서재에 추가되었습니다.');
          }}
        >
          <MaterialIcons name="add" size={16} color="#fff" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  // Render filter chip
  const renderFilterChip = (filter: any) => (
    <TouchableOpacity
      key={filter.id}
      style={[
        styles.filterChip,
        filter.isActive && styles.activeFilterChip,
        isDarkMode && styles.darkFilterChip,
        filter.isActive && isDarkMode && styles.darkActiveFilterChip
      ]}
      onPress={() => toggleFilterActive(filter.id)}
    >
      <Text 
        style={[
          styles.filterChipText,
          filter.isActive && styles.activeFilterChipText,
          isDarkMode && styles.darkFilterChipText,
          filter.isActive && isDarkMode && styles.darkActiveFilterChipText
        ]}
      >
        {filter.name}
      </Text>
      {filter.isActive && (
        <MaterialIcons 
          name="close" 
          size={16} 
          color={isDarkMode ? "#fff" : "#007AFF"} 
          style={styles.filterChipIcon} 
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Search Bar */}
      <View style={[styles.searchBarContainer, isDarkMode && styles.darkSearchBarContainer]}>
        <View style={[styles.searchInputContainer, isDarkMode && styles.darkSearchInputContainer]}>
          <MaterialIcons 
            name="search" 
            size={24} 
            color={isDarkMode ? "#aaa" : "#999"} 
            style={styles.searchIcon} 
          />
          <TextInput
            ref={searchInputRef}
            style={[styles.searchInput, isDarkMode && styles.darkSearchInput]}
            placeholder="책 제목, 저자, ISBN 검색"
            placeholderTextColor={isDarkMode ? "#aaa" : "#999"}
            value={query}
            onChangeText={handleQueryChange}
            onSubmitEditing={() => searchBooks()}
            onFocus={() => setShowHistory(query.length === 0)}
          />
          {query.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => {
                setQuery('');
                setShowHistory(true);
              }}
            >
              <MaterialIcons name="close" size={20} color={isDarkMode ? "#aaa" : "#999"} />
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={styles.voiceButton}
            onPress={startVoiceSearch}
          >
            <MaterialIcons name="mic" size={24} color={isDarkMode ? "#aaa" : "#999"} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchActionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, isDarkMode && styles.darkActionButton]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <MaterialIcons 
              name="filter-list" 
              size={20} 
              color={isDarkMode ? "#fff" : "#333"} 
            />
            <Text style={[styles.actionButtonText, isDarkMode && styles.darkActionButtonText]}>
              필터
            </Text>
            {activeFilters.length > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFilters.length}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, isDarkMode && styles.darkActionButton]}
            onPress={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
          >
            <MaterialIcons 
              name={viewMode === 'list' ? "grid-view" : "view-list"} 
              size={20} 
              color={isDarkMode ? "#fff" : "#333"} 
            />
            <Text style={[styles.actionButtonText, isDarkMode && styles.darkActionButtonText]}>
              {viewMode === 'list' ? '그리드' : '리스트'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search History Dropdown */}
      {showHistory && searchHistory.length > 0 && (
        <View style={[styles.dropdownContainer, isDarkMode && styles.darkDropdownContainer]}>
          <View style={styles.dropdownHeader}>
            <Text style={[styles.dropdownTitle, isDarkMode && styles.darkText]}>최근 검색어</Text>
            <TouchableOpacity 
              //onPress={() => clearSearchHistory()}
              >
              <Text style={styles.clearHistoryText}>전체 삭제</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.historyList}>
            {searchHistory.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.historyItem, isDarkMode && styles.darkHistoryItem]}
                onPress={() => {
                  setQuery(item.query);
                  searchBooks(item.query);
                }}
              >
                <MaterialIcons name="history" size={18} color={isDarkMode ? "#aaa" : "#999"} />
                <Text style={[styles.historyText, isDarkMode && styles.darkText]} numberOfLines={1}>
                  {item.query}
                </Text>
                <TouchableOpacity
                  style={styles.historyDeleteBtn}
                  onPress={() => removeFromSearchHistory(item.query)}
                >
                  <MaterialIcons name="close" size={18} color={isDarkMode ? "#aaa" : "#999"} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Search Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <View style={[styles.dropdownContainer, isDarkMode && styles.darkDropdownContainer]}>
          <ScrollView style={styles.suggestionsList}>
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.suggestionItem, isDarkMode && styles.darkSuggestionItem]}
                onPress={() => {
                  setQuery(suggestion);
                  searchBooks(suggestion);
                }}
              >
                <MaterialIcons name="search" size={18} color={isDarkMode ? "#aaa" : "#999"} />
                <Text style={[styles.suggestionText, isDarkMode && styles.darkText]} numberOfLines={1}>
                  {suggestion}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Filter Panel */}
      <Animated.View 
        style={[
          styles.filterPanel,
          isDarkMode && styles.darkFilterPanel,
          {
            maxHeight: filterAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 200]
            }),
            opacity: filterAnimation,
            paddingVertical: filterAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 10]
            })
          }
        ]}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.filterAddChip, isDarkMode && styles.darkFilterAddChip]}
            onPress={() => setShowFilterModal(true)}
          >
            <MaterialIcons name="add" size={18} color={isDarkMode ? "#fff" : "#007AFF"} />
            <Text style={[styles.filterAddChipText, isDarkMode && styles.darkFilterAddChipText]}>
              필터 추가
            </Text>
          </TouchableOpacity>

          {savedFilters.map(renderFilterChip)}

          {activeFilters.length > 0 && (
            <TouchableOpacity
              style={[styles.clearFiltersChip, isDarkMode && styles.darkClearFiltersChip]}
              onPress={() => {
                clearActiveFilters();
                // 필터 초기화 후 검색 결과 다시 필터링
                if (results.length > 0) {
                  setFilteredResults(results);
                }
              }}
            >
              <Text style={[styles.clearFiltersText, isDarkMode && styles.darkClearFiltersText]}>
                필터 초기화
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </Animated.View>

      {/* Search Results */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={[styles.loadingText, isDarkMode && styles.darkText]}>검색 중...</Text>
        </View>
      ) : searchPerformed && (activeFilters.length > 0 ? filteredResults : results).length === 0 ? (
        <View style={styles.noResultsContainer}>
          <MaterialIcons name="search-off" size={64} color={isDarkMode ? "#555" : "#ccc"} />
          <Text style={[styles.noResultsText, isDarkMode && styles.darkText]}>
            검색 결과가 없습니다
          </Text>
          <Text style={[styles.noResultsSubText, isDarkMode && styles.darkSubText]}>
            다른 검색어로 시도하거나 필터를 조정해 보세요
          </Text>
          <View style={styles.noResultsActions}>
            <TouchableOpacity
              style={styles.manualEntryBtn}
              onPress={() => setShowManualEntry(true)}
            >
              <Text style={styles.manualEntryBtnText}>수동으로 책 추가하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={activeFilters.length > 0 ? filteredResults : results}
          renderItem={viewMode === 'list' ? renderResultItem : renderGridItem}
          keyExtractor={item => item.id}
          contentContainerStyle={viewMode === 'grid' ? styles.gridContainer : null}
          numColumns={viewMode === 'grid' ? 2 : 1}
          key={viewMode} // Force re-render when view mode changes
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={hasMore && !loading ? (
            <ActivityIndicator style={{ margin: 20 }} />
          ) : null}
        />
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={[styles.floatingButton, styles.scanButton, isDarkMode && styles.darkFloatingButton]}
          onPress={() => setShowScanner(true)}
        >
          <MaterialIcons name="qr-code-scanner" size={24} color="#fff" />
          <Text style={styles.floatingButtonText}>바코드 스캔</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.floatingButton, styles.manualButton, isDarkMode && styles.darkFloatingButton]}
          onPress={() => setShowManualEntry(true)}
        >
          <MaterialIcons name="edit" size={24} color="#fff" />
          <Text style={styles.floatingButtonText}>수동 입력</Text>
        </TouchableOpacity>
      </View>

      {/* Barcode Scanner Modal */}
      <Modal
        visible={showScanner}
        animationType="slide"
        onRequestClose={() => setShowScanner(false)}
      >
        <View style={[styles.modalContainer, isDarkMode && styles.darkModalContainer]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowScanner(false)}
            >
              <MaterialIcons name="close" size={24} color={isDarkMode ? "#fff" : "#000"} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>바코드 스캔</Text>
            <View style={{ width: 24 }} />
          </View>

          {hasCameraPermission === null ? (
            <View style={styles.cameraPermissionContainer}>
              <Text style={[styles.cameraPermissionText, isDarkMode && styles.darkText]}>
                카메라 권한을 확인하는 중...
              </Text>
            </View>
          ) : hasCameraPermission === false ? (
            <View style={styles.cameraPermissionContainer}>
              <Text style={[styles.cameraPermissionText, isDarkMode && styles.darkText]}>
                카메라 접근 권한이 없습니다
              </Text>
              <TouchableOpacity
                style={styles.permissionButton}
                onPress={async () => {
                  const { status } = await Camera.requestCameraPermissionsAsync();
                  setHasCameraPermission(status === 'granted');
                }}
              >
                <Text style={styles.permissionButtonText}>권한 요청</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.cameraContainer}>
              <CameraView
                style={styles.camera}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
              >
                <View style={styles.scanOverlay}>
                  <View style={styles.scanFrame} />
                  <Text style={styles.scanInstructions}>
                    책의 바코드를 프레임 안에 위치시키세요
                  </Text>
                </View>
              </CameraView>
              {scanned && (
                <TouchableOpacity
                  style={styles.rescanButton}
                  onPress={() => setScanned(false)}
                >
                  <Text style={styles.rescanButtonText}>다시 스캔</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </Modal>

      {/* Manual Entry Modal */}
      <Modal
        visible={showManualEntry}
        animationType="slide"
        onRequestClose={() => setShowManualEntry(false)}
      >
        <View style={[styles.modalContainer, isDarkMode && styles.darkModalContainer]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setShowManualEntry(false);
                setManualTitle('');
                setManualAuthor('');
                setManualPublisher('');
                setManualYear('');
                setManualIsbn('');
                setManualPages('');
              }}
            >
              <MaterialIcons name="close" size={24} color={isDarkMode ? "#fff" : "#000"} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>책 수동 입력</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.manualEntryForm}>
            <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>제목 *</Text>
            <TextInput
              style={[styles.formInput, isDarkMode && styles.darkFormInput]}
              value={manualTitle}
              onChangeText={setManualTitle}
              placeholder="책 제목"
              placeholderTextColor={isDarkMode ? "#aaa" : "#999"}
            />

            <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>저자</Text>
            <TextInput
              style={[styles.formInput, isDarkMode && styles.darkFormInput]}
              value={manualAuthor}
              onChangeText={setManualAuthor}
              placeholder="저자 이름"
              placeholderTextColor={isDarkMode ? "#aaa" : "#999"}
            />

            <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>출판사</Text>
            <TextInput
              style={[styles.formInput, isDarkMode && styles.darkFormInput]}
              value={manualPublisher}
              onChangeText={setManualPublisher}
              placeholder="출판사"
              placeholderTextColor={isDarkMode ? "#aaa" : "#999"}
            />

            <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>출판년도</Text>
            <TextInput
              style={[styles.formInput, isDarkMode && styles.darkFormInput]}
              value={manualYear}
              onChangeText={setManualYear}
              placeholder="YYYY"
              placeholderTextColor={isDarkMode ? "#aaa" : "#999"}
              keyboardType="number-pad"
              maxLength={4}
            />

            <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>ISBN</Text>
            <TextInput
              style={[styles.formInput, isDarkMode && styles.darkFormInput]}
              value={manualIsbn}
              onChangeText={setManualIsbn}
              placeholder="ISBN"
              placeholderTextColor={isDarkMode ? "#aaa" : "#999"}
              keyboardType="number-pad"
            />

            <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>페이지 수</Text>
            <TextInput
              style={[styles.formInput, isDarkMode && styles.darkFormInput]}
              value={manualPages}
              onChangeText={setManualPages}
              placeholder="페이지 수"
              placeholderTextColor={isDarkMode ? "#aaa" : "#999"}
              keyboardType="number-pad"
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleManualEntry}
            >
              <Text style={styles.submitButtonText}>저장</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={[styles.modalContainer, isDarkMode && styles.darkModalContainer]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowFilterModal(false)}
            >
              <MaterialIcons name="close" size={24} color={isDarkMode ? "#fff" : "#000"} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>필터 추가</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.filterForm}>
            <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>필터 이름 *</Text>
            <TextInput
              style={[styles.formInput, isDarkMode && styles.darkFormInput]}
              value={filterName}
              onChangeText={setFilterName}
              placeholder="필터 이름"
              placeholderTextColor={isDarkMode ? "#aaa" : "#999"}
            />

            <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>저자</Text>
            <TextInput
              style={[styles.formInput, isDarkMode && styles.darkFormInput]}
              value={filterAuthor}
              onChangeText={setFilterAuthor}
              placeholder="저자 이름"
              placeholderTextColor={isDarkMode ? "#aaa" : "#999"}
            />

            <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>출판사</Text>
            <TextInput
              style={[styles.formInput, isDarkMode && styles.darkFormInput]}
              value={filterPublisher}
              onChangeText={setFilterPublisher}
              placeholder="출판사"
              placeholderTextColor={isDarkMode ? "#aaa" : "#999"}
            />

            <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>카테고리</Text>
            <TextInput
              style={[styles.formInput, isDarkMode && styles.darkFormInput]}
              value={filterCategory}
              onChangeText={setFilterCategory}
              placeholder="카테고리"
              placeholderTextColor={isDarkMode ? "#aaa" : "#999"}
            />

            <View style={styles.yearRangeContainer}>
              <View style={styles.yearInputContainer}>
                <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>출판년도 (시작)</Text>
                <TextInput
                  style={[styles.formInput, isDarkMode && styles.darkFormInput]}
                  value={filterYearFrom}
                  onChangeText={setFilterYearFrom}
                  placeholder="YYYY"
                  placeholderTextColor={isDarkMode ? "#aaa" : "#999"}
                  keyboardType="number-pad"
                  maxLength={4}
                />
              </View>

              <View style={styles.yearInputContainer}>
                <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>출판년도 (종료)</Text>
                <TextInput
                  style={[styles.formInput, isDarkMode && styles.darkFormInput]}
                  value={filterYearTo}
                  onChangeText={setFilterYearTo}
                  placeholder="YYYY"
                  placeholderTextColor={isDarkMode ? "#aaa" : "#999"}
                  keyboardType="number-pad"
                  maxLength={4}
                />
              </View>
            </View>

            <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>언어</Text>
            <TextInput
              style={[styles.formInput, isDarkMode && styles.darkFormInput]}
              value={filterLanguage}
              onChangeText={setFilterLanguage}
              placeholder="언어 코드 (예: ko, en)"
              placeholderTextColor={isDarkMode ? "#aaa" : "#999"}
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={saveCurrentFilter}
            >
              <Text style={styles.submitButtonText}>필터 저장</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // Container styles
  container: { 
    flex: 1, 
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },

  // Search bar styles
  searchBarContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    zIndex: 10,
  },
  darkSearchBarContainer: {
    backgroundColor: '#121212',
    borderBottomColor: '#333',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  darkSearchInputContainer: {
    backgroundColor: '#333',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: '#333',
  },
  darkSearchInput: {
    color: '#fff',
  },
  clearButton: {
    padding: 8,
  },
  voiceButton: {
    padding: 8,
    marginLeft: 4,
  },
  searchActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  darkActionButton: {
    backgroundColor: '#333',
  },
  actionButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#333',
  },
  darkActionButtonText: {
    color: '#fff',
  },
  filterBadge: {
    backgroundColor: '#007AFF',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },

  // Dropdown styles
  dropdownContainer: {
    position: 'absolute',
    top: 72,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 5,
    maxHeight: 300,
  },
  darkDropdownContainer: {
    backgroundColor: '#1e1e1e',
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  clearHistoryText: {
    color: '#007AFF',
    fontSize: 14,
  },
  historyList: {
    maxHeight: 250,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  darkHistoryItem: {
    borderBottomColor: '#333',
  },
  historyText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  historyDeleteBtn: {
    padding: 8,
  },
  suggestionsList: {
    maxHeight: 250,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  darkSuggestionItem: {
    borderBottomColor: '#333',
  },
  suggestionText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },

  // Filter panel styles
  filterPanel: {
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
    zIndex: 4,
  },
  darkFilterPanel: {
    backgroundColor: '#1a1a1a',
  },
  filterAddChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f2ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginHorizontal: 6,
  },
  darkFilterAddChip: {
    backgroundColor: '#0a3d62',
  },
  filterAddChipText: {
    color: '#007AFF',
    marginLeft: 4,
    fontSize: 14,
  },
  darkFilterAddChipText: {
    color: '#fff',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginHorizontal: 6,
  },
  darkFilterChip: {
    backgroundColor: '#333',
  },
  activeFilterChip: {
    backgroundColor: '#e6f2ff',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  darkActiveFilterChip: {
    backgroundColor: '#0a3d62',
    borderColor: '#0A84FF',
  },
  filterChipText: {
    color: '#666',
    fontSize: 14,
  },
  darkFilterChipText: {
    color: '#ccc',
  },
  activeFilterChipText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  darkActiveFilterChipText: {
    color: '#fff',
  },
  filterChipIcon: {
    marginLeft: 4,
  },
  clearFiltersChip: {
    backgroundColor: '#ffebee',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginHorizontal: 6,
  },
  darkClearFiltersChip: {
    backgroundColor: '#4a1515',
  },
  clearFiltersText: {
    color: '#f44336',
    fontSize: 14,
  },
  darkClearFiltersText: {
    color: '#ff8a80',
  },

  // Loading and no results styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  noResultsSubText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  noResultsActions: {
    marginTop: 24,
  },
  manualEntryBtn: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  manualEntryBtnText: {
    color: '#fff',
    fontWeight: '600',
  },

  // List view styles
  resultItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  darkResultItem: {
    backgroundColor: '#1e1e1e',
    borderBottomColor: '#333',
  },
  thumbnail: {
    width: 80,
    height: 120,
    borderRadius: 4,
    marginRight: 16,
  },
  thumbnailPlaceholder: {
    width: 80,
    height: 120,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  resultInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  publishInfo: {
    fontSize: 12,
    color: '#888',
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  addBtn: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  detailBtn: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  detailBtnText: {
    color: '#333',
    fontSize: 14,
  },

  // Grid view styles
  gridContainer: {
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  gridItem: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  darkGridItem: {
    backgroundColor: '#1e1e1e',
  },
  gridThumbnail: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  gridThumbnailPlaceholder: {
    width: '100%',
    height: 180,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    padding: 8,
    paddingBottom: 4,
  },
  gridAuthor: {
    fontSize: 12,
    color: '#666',
    paddingHorizontal: 8,
    paddingBottom: 12,
  },
  gridAddBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#007AFF',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },

  // Action buttons styles
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
  },
  floatingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    marginLeft: 12,
  },
  darkFloatingButton: {
    shadowColor: '#000',
    shadowOpacity: 0.5,
  },
  scanButton: {
    backgroundColor: '#FF9500',
  },
  manualButton: {
    backgroundColor: '#007AFF',
  },
  floatingButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  darkModalContainer: {
    backgroundColor: '#121212',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },

  // Camera styles
  cameraPermissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cameraPermissionText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  scanOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 100,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 8,
    marginBottom: 20,
  },
  scanInstructions: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  rescanButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  rescanButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  // Form styles
  manualEntryForm: {
    padding: 16,
  },
  filterForm: {
    padding: 16,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  darkFormInput: {
    backgroundColor: '#333',
    borderColor: '#555',
    color: '#fff',
  },
  yearRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  yearInputContainer: {
    width: '48%',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 40,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Text styles
  darkText: {
    color: '#fff',
  },
  darkSubText: {
    color: '#aaa',
  },
});