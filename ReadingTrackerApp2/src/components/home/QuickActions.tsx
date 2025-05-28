import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { styles } from './QuickActions.styles';

export const QuickActions = () => {
  const navigation = useNavigation();

  const handleSearch = () => {
    navigation.navigate('SearchBooks');
  };

  const handleAddBook = () => {
    navigation.navigate('AddBook');
  };

  const handleStartReading = () => {
    navigation.navigate('ReadingSession');
  };

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        icon="magnify"
        onPress={handleSearch}
        style={styles.button}
      >
        책 검색
      </Button>
      <Button
        mode="contained"
        icon="book-plus"
        onPress={handleAddBook}
        style={styles.button}
      >
        책 추가
      </Button>
      <Button
        mode="contained"
        icon="book-open-page-variant"
        onPress={handleStartReading}
        style={styles.button}
      >
        독서 시작
      </Button>
    </View>
  );
}; 