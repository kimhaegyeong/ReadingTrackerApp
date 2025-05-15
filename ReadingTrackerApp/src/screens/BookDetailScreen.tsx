import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function BookDetailScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>책 상세 정보</Text>
      <Text>제목: 어린왕자</Text>
      <Text>저자: 생텍쥐페리</Text>
      <Text>출판사: 예시출판사</Text>
      <Text>출판일: 2020-01-01</Text>
      <Text>페이지: 200</Text>
      <Text>평점: ★★★★☆</Text>
      <Button title="독서 기록 추가" onPress={() => {}} />
      <Button title="메모/하이라이트 이동" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
});
