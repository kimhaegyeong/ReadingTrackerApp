import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons, Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import BookLibrary from '../components/BookLibrary';
// 필요한 경우 BookDetail, AddBookDialog 등도 import (상대경로로)
// import AddBookDialog from '../components/AddBookDialog';
// import BookDetail from '../components/BookDetail';
// import UserProfile from '../components/UserProfile';
// import BookSearch from '../components/BookSearch';
// import ReadingTimer from '../components/ReadingTimer';
// import Settings from '../components/Settings';
// import ReadingStats from '../components/ReadingStats';

export default function Index() {
  const [selectedBook, setSelectedBook] = useState(null);
  // 기타 상태들 필요시 추가

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Feather name="book-open" size={32} color="#2563EB" />
          <Text style={styles.headerTitle}>리브노트</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="stats-chart" size={20} color="#2563EB" />
            <Text style={styles.headerBtnText}>통계</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="timer-outline" size={20} color="#2563EB" />
            <Text style={styles.headerBtnText}>독서 기록</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.headerBtn, styles.addBookBtn]}>
            <Feather name="plus" size={20} color="#fff" />
            <Text style={[styles.headerBtnText, { color: '#fff' }]}>책 추가</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* 메인 컨텐츠 */}
      <ScrollView style={styles.main}>
        <BookLibrary onBookSelect={setSelectedBook} />
        {/* 기타 탭/페이지는 필요시 추가 */}
      </ScrollView>
      {/* 하단 네비게이션 */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Feather name="book-open" size={20} color="#2563EB" />
          <Text style={styles.navText}>서재</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Feather name="search" size={20} color="#2563EB" />
          <Text style={styles.navText}>검색</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Feather name="user" size={20} color="#2563EB" />
          <Text style={styles.navText}>프로필</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Feather name="settings" size={20} color="#2563EB" />
          <Text style={styles.navText}>설정</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', marginLeft: 8, color: '#2563EB' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  headerBtn: { flexDirection: 'row', alignItems: 'center', marginLeft: 12, backgroundColor: '#E0E7FF', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  addBookBtn: { backgroundColor: '#2563EB' },
  headerBtnText: { marginLeft: 4, color: '#2563EB', fontWeight: '500' },
  main: { flex: 1, padding: 16 },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 60, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  navItem: { alignItems: 'center', justifyContent: 'center' },
  navText: { fontSize: 12, color: '#2563EB', marginTop: 2 },
});
