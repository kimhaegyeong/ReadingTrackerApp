import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { Button } from '../../components/ui/Button';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const slides = [
  {
    key: 'library',
    title: '내 서재를 한눈에',
    description: '읽고 싶은 책, 읽는 중, 다 읽은 책을 한 곳에서 관리하세요.',
    icon: 'book-open',
  },
  {
    key: 'search',
    title: '책 검색 & 등록',
    description: '알라딘/구글북스에서 원하는 책을 검색하고 내 서재에 추가하세요.',
    icon: 'search',
  },
  {
    key: 'stats',
    title: '독서 기록 & 통계',
    description: '독서 시간, 인용문, 메모, 태그까지! 나만의 독서 히스토리를 쌓으세요.',
    icon: 'bar-chart-2',
  },
];

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    if (newIndex !== index) {
      setIndex(newIndex);
    }
  };

  const handleMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    setIndex(newIndex);
  };

  const handleNext = async () => {
    if (index < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ 
        index: index + 1, 
        animated: true,
        viewPosition: 0
      });
    } else {
      await AsyncStorage.setItem('onboardingDone', 'true');
      router.replace('/');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <FlatList
          ref={flatListRef}
          data={slides}
          keyExtractor={item => item.key}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          scrollEventThrottle={16}
          bounces={false}
          decelerationRate="fast"
          snapToInterval={width}
          snapToAlignment="center"
          renderItem={({ item }) => (
            <View style={[styles.slide, { width }]}> 
              <Feather name={item.icon as any} size={64} color="#6366F1" style={styles.icon} />
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          )}
        />
      </View>
      <View style={styles.footer}>
        <View style={styles.dotsContainer}>
          {slides.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.activeDot]} />
          ))}
        </View>
        <Button onPress={handleNext} style={styles.button}>
          {index === slides.length - 1 ? '시작하기' : '다음'}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  footer: {
    padding: 24,
    paddingBottom: 48,
    alignItems: 'center',
  },
  icon: { 
    marginBottom: 32 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#1F2937', 
    marginBottom: 16, 
    textAlign: 'center' 
  },
  description: { 
    fontSize: 16, 
    color: '#6B7280', 
    textAlign: 'center', 
    marginBottom: 32,
    lineHeight: 24,
  },
  dotsContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginBottom: 32 
  },
  dot: { 
    width: 10, 
    height: 10, 
    borderRadius: 5, 
    backgroundColor: '#E5E7EB', 
    marginHorizontal: 4 
  },
  activeDot: { 
    backgroundColor: '#6366F1' 
  },
  button: { 
    width: '100%' 
  },
}); 