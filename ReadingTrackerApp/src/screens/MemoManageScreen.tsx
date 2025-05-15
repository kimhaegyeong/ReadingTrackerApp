import React from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';

const memos = [
  { id: '1', content: '인상 깊은 구절 1' },
  { id: '2', content: '메모 예시 2' },
];

export default function MemoManageScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>메모 및 하이라이트 관리</Text>
      <FlatList
        data={memos}
        renderItem={({ item }) => (
          <View style={styles.memoItem}>
            <Text>{item.content}</Text>
            <Button title="편집" onPress={() => {}} />
            <Button title="삭제" onPress={() => {}} />
          </View>
        )}
        keyExtractor={item => item.id}
      />
      <Button title="공유하기" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  memoItem: { padding: 10, borderBottomWidth: 1, borderColor: '#eee' },
});
