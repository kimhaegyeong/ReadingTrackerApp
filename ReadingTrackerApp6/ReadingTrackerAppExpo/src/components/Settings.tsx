import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function Settings({ onBack }) {
  const [darkMode, setDarkMode] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert('로그아웃', '정말 로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { text: '로그아웃', style: 'destructive', onPress: () => {/* TODO: 로그아웃 처리 */} },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color="#2563EB" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>설정</Text>
      </View>
      {/* 설정 항목 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>환경설정</Text>
        <View style={styles.row}>
          <Text style={styles.label}>다크 모드</Text>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>푸시 알림</Text>
          <Switch value={pushEnabled} onValueChange={setPushEnabled} />
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>계정</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFF', padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  backBtn: { marginRight: 8, padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#2563EB' },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#2563EB', marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 10 },
  label: { fontSize: 15, color: '#222' },
  logoutBtn: { backgroundColor: '#F87171', borderRadius: 8, padding: 16, alignItems: 'center' },
  logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
