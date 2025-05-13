import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useBookContext } from '../contexts/BookContext';
import GOOGLE_BOOKS_API_KEY from '../config/googleBooksApiKey';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { addBook } = useBookContext();

  const searchBooks = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${GOOGLE_BOOKS_API_KEY}`;
      const res = await fetch(url);
      const json = await res.json();
      console.log(json); 
      setResults(json.items || []);
    } catch (e) {
      setResults([]);
      console.log(e); 
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="책 제목, 저자, ISBN 검색"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={searchBooks}
      />
      <Button title="검색" onPress={searchBooks} />
      {loading && <ActivityIndicator style={{ margin: 10 }} />}
      <FlatList
        data={results}
        renderItem={({ item }) => {
          const info = item.volumeInfo;
          return (
            <View style={styles.resultItem}>
              {info.imageLinks?.thumbnail && (
                <Image source={{ uri: info.imageLinks.thumbnail }} style={styles.thumbnail} />
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{info.title}</Text>
                <Text>{info.authors?.join(', ')}</Text>
                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={() => addBook({
                    id: item.id,
                    title: info.title,
                    authors: info.authors || [],
                    thumbnail: info.imageLinks?.thumbnail,
                  })}
                >
                  <Text style={{ color: '#fff' }}>내 서재에 추가</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        keyExtractor={item => item.id}
      />
      <Button title="바코드 스캔" onPress={() => {}} />
      <Button title="수동 입력" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
  resultItem: { flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderColor: '#eee' },
  thumbnail: { width: 50, height: 75, marginRight: 12 },
  title: { fontWeight: 'bold' },
  addBtn: { marginTop: 8, backgroundColor: '#007bff', padding: 6, borderRadius: 6, alignSelf: 'flex-start' },
});

