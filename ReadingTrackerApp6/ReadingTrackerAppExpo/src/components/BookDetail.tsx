import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

export default function BookDetail({ book, onBack }) {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  // 기타 상태들 필요시 추가

  if (!book) return null;

  return (
    <ScrollView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>책 상세</Text>
      </View>

      {/* 책 정보 카드 */}
      <View style={styles.card}>
        <View style={styles.cardRow}>
          <View style={[styles.cover, { backgroundColor: book.coverColor || '#3B82F6' }]}> 
            <Feather name="book-open" size={48} color="#fff" />
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.bookTitle}>{book.title}</Text>
            <Text style={styles.bookAuthor}>{book.author}</Text>
            <View style={styles.statusRow}>
              <MaterialCommunityIcons name="check-circle" size={18} color="#34D399" />
              <Text style={styles.statusText}>{book.status}</Text>
              {book.status === 'reading' && (
                <Text style={styles.progressText}>{book.progress}% 완료</Text>
              )}
            </View>
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={[styles.statValue, { color: '#3B82F6' }]}>{book.quotes}</Text>
                <Text style={styles.statLabel}>인용문</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={[styles.statValue, { color: '#8B5CF6' }]}>{book.notes}</Text>
                <Text style={styles.statLabel}>메모</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={[styles.statValue, { color: '#34D399' }]}>{book.readingTime}</Text>
                <Text style={styles.statLabel}>독서 시간</Text>
              </View>
            </View>
          </View>
        </View>
        {book.status === 'reading' && (
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBar, { width: `${book.progress}%` }]} />
          </View>
        )}
      </View>

      {/* 액션 버튼 */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => setIsQuoteModalOpen(true)}>
          <Ionicons name="chatbox-ellipses-outline" size={20} color="#2563EB" />
          <Text style={styles.actionBtnText}>인용문 추가</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => setIsNoteModalOpen(true)}>
          <Ionicons name="document-text-outline" size={20} color="#2563EB" />
          <Text style={styles.actionBtnText}>메모 추가</Text>
        </TouchableOpacity>
      </View>

      {/* 인용문 추가 모달 */}
      <Modal visible={isQuoteModalOpen} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>인용문 추가</Text>
            <TextInput style={styles.input} placeholder="인용문 입력" />
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setIsQuoteModalOpen(false)}>
              <Text style={styles.modalCloseText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* 메모 추가 모달 */}
      <Modal visible={isNoteModalOpen} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>메모 추가</Text>
            <TextInput style={styles.input} placeholder="메모 입력" />
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setIsNoteModalOpen(false)}>
              <Text style={styles.modalCloseText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFF' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  backBtn: { marginRight: 8 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#222' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, margin: 16, elevation: 2 },
  cardRow: { flexDirection: 'row' },
  cover: { width: 72, height: 96, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  infoCol: { flex: 1 },
  bookTitle: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  bookAuthor: { color: '#666', fontSize: 15, marginBottom: 4 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  statusText: { marginLeft: 4, color: '#34D399', fontWeight: '500' },
  progressText: { marginLeft: 8, color: '#888', fontSize: 12 },
  statsGrid: { flexDirection: 'row', marginTop: 8 },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { fontWeight: 'bold', fontSize: 16 },
  statLabel: { color: '#888', fontSize: 12 },
  progressBarBg: { height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, marginTop: 6, overflow: 'hidden' },
  progressBar: { height: 6, backgroundColor: '#3B82F6', borderRadius: 3 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 16 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E0E7FF', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  actionBtnText: { marginLeft: 6, color: '#2563EB', fontWeight: '500' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 24, width: 300 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 8, marginBottom: 12 },
  modalCloseBtn: { alignSelf: 'flex-end', marginTop: 8 },
  modalCloseText: { color: '#2563EB', fontWeight: 'bold' },
});
