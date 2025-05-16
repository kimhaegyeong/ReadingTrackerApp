import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, Image, TouchableOpacity, Share } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Rating } from 'react-native-ratings';
import { LinearGradient } from 'expo-linear-gradient';

// 탭 컴포넌트들
const InfoTab = () => (
  <ScrollView style={styles.tabContent}>
    <View style={styles.infoSection}>
      <Text style={styles.sectionTitle}>출판 정보</Text>
      <Text>출판사: 예시출판사</Text>
      <Text>출판일: 2020-01-01</Text>
      <Text>ISBN: 978-89-1234-5678</Text>
    </View>
    <View style={styles.infoSection}>
      <Text style={styles.sectionTitle}>도서 소개</Text>
      <Text style={styles.description}>
        어린왕자는 프랑스의 작가 생텍쥐페리가 쓴 소설로, 
        어른들의 세계를 어린 왕자의 시선으로 바라보는 이야기입니다.
      </Text>
    </View>
    <View style={styles.infoSection}>
      <Text style={styles.sectionTitle}>키워드</Text>
      <View style={styles.keywordContainer}>
        <Text style={styles.keyword}>#판타지</Text>
        <Text style={styles.keyword}>#철학</Text>
        <Text style={styles.keyword}>#성장</Text>
      </View>
    </View>
  </ScrollView>
);

const MemoTab = () => (
  <ScrollView style={styles.tabContent}>
    <View style={styles.memoSection}>
      <Text style={styles.sectionTitle}>메모 목록</Text>
      <TouchableOpacity style={styles.memoItem}>
        <Text style={styles.memoDate}>2024-03-15</Text>
        <Text style={styles.memoText}>주인공의 성장 과정이 인상적이었다.</Text>
      </TouchableOpacity>
    </View>
  </ScrollView>
);

const StatsTab = () => (
  <ScrollView style={styles.tabContent}>
    <View style={styles.statsSection}>
      <Text style={styles.sectionTitle}>독서 통계</Text>
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>총 읽은 페이지</Text>
        <Text style={styles.statValue}>150/200</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>평균 독서 속도</Text>
        <Text style={styles.statValue}>30페이지/시간</Text>
      </View>
    </View>
  </ScrollView>
);

export default function BookDetailScreen() {
  const [index, setIndex] = useState(0);
  const [rating, setRating] = useState(4);
  const [routes] = useState([
    { key: 'info', title: '정보' },
    { key: 'memo', title: '메모' },
    { key: 'stats', title: '통계' },
  ]);

  const renderScene = SceneMap({
    info: InfoTab,
    memo: MemoTab,
    stats: StatsTab,
  });

  const handleShare = async () => {
    try {
      await Share.share({
        message: '어린왕자 독서 중! 현재 75% 완독했어요.',
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Image 
            source={{ uri: 'https://example.com/book-cover.jpg' }}
            style={styles.coverImage}
          />
          <View style={styles.bookInfo}>
            <Text style={styles.title}>어린왕자</Text>
            <Text style={styles.author}>생텍쥐페리</Text>
            <Rating
              showRating
              onFinishRating={setRating}
              style={styles.rating}
              startingValue={rating}
            />
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {}}
          >
            <Text style={styles.buttonText}>독서 시작</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleShare}
          >
            <Text style={styles.buttonText}>공유하기</Text>
          </TouchableOpacity>
        </View>

        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          renderTabBar={props => (
            <TabBar
              {...props}
              style={styles.tabBar}
              indicatorStyle={styles.tabIndicator}
              labelStyle={styles.tabLabel}
            />
          )}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  coverImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
  bookInfo: {
    marginLeft: 20,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  author: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  rating: {
    paddingVertical: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-around',
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  tabBar: {
    backgroundColor: '#fff',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabIndicator: {
    backgroundColor: '#007AFF',
  },
  tabLabel: {
    color: '#333',
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  infoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    lineHeight: 24,
    color: '#333',
  },
  keywordContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  keyword: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  memoSection: {
    marginBottom: 20,
  },
  memoItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  memoDate: {
    color: '#666',
    fontSize: 12,
    marginBottom: 5,
  },
  memoText: {
    fontSize: 16,
  },
  statsSection: {
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statLabel: {
    fontSize: 16,
    color: '#333',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
});
