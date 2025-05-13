import React from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';

const books = [
  { id: '1', title: '어린왕자', author: '생텍쥐페리', current: true },
  { id: '2', title: '데미안', author: '헤르만 헤세', current: false },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>현재 읽고 있는 책</Text>
      <View style={styles.currentBook}>
        <Text style={styles.bookTitle}>{books[0].title}</Text>
        <Text>{books[0].author}</Text>
      </View>
      <Text style={styles.subtitle}>최근 읽은 책</Text>
      <FlatList
        data={books}
        renderItem={({ item }) => (
          <View style={styles.bookItem}>
            <Text style={styles.bookTitle}>{item.title}</Text>
            <Text>{item.author}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
      />
      <Button title="독서 기록 추가" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginTop: 24 },
  currentBook: { padding: 16, backgroundColor: '#e6f0ff', borderRadius: 8, marginBottom: 16 },
  bookItem: { padding: 10, borderBottomWidth: 1, borderColor: '#eee' },
  bookTitle: { fontWeight: 'bold' },
});
