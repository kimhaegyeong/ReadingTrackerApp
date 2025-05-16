import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, Button, TouchableOpacity } from 'react-native';
import { useBookContext } from '../contexts/BookContext';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  BookDetail: { book: any };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'BookDetail'>;

export default function LibraryScreen() {
  const { books } = useBookContext();
  const navigation = useNavigation<NavigationProp>();

  const handleBookPress = (book: any) => {
    navigation.navigate('BookDetail', { book });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>내 서재</Text>
      <FlatList
        data={books}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.bookItem}
            onPress={() => handleBookPress(item)}
          >
            {item.thumbnail && <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />}
            <View>
              <Text style={styles.bookTitle}>{item.title}</Text>
              <Text>{item.authors?.join(', ')}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={{ marginTop: 40, textAlign: 'center' }}>추가된 책이 없습니다.</Text>}
      />
      <Button title="카테고리/태그 관리" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  bookItem: { flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderColor: '#eee' },
  bookTitle: { fontWeight: 'bold' },
  thumbnail: { width: 50, height: 75, marginRight: 12 },
});

