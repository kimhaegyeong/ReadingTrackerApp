import React from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';

export default function RecordEditScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>독서 기록 추가/수정</Text>
      <Text>날짜</Text>
      <TextInput style={styles.input} placeholder="YYYY-MM-DD" />
      <Text>읽은 페이지 범위</Text>
      <TextInput style={styles.input} placeholder="예: 1-20" />
      <Text>독서 시간(분)</Text>
      <TextInput style={styles.input} placeholder="예: 30" keyboardType="numeric" />
      <Text>메모</Text>
      <TextInput style={styles.input} placeholder="메모를 입력하세요" multiline />
      <Button title="저장" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
});
