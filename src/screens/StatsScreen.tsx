import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StatsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>독서 통계</Text>
      <Text>월별/연별 독서량 그래프 (예시)</Text>
      <Text>장르별 비율, 목표 현황 등</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
});
