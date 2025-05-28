import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SearchBooksScreen } from '@/screens/SearchBooksScreen';
import { BookDetailScreen } from '@/screens/BookDetailScreen';

export type SearchStackParamList = {
  SearchBooks: undefined;
  BookDetail: { bookId: string };
};

const Stack = createNativeStackNavigator<SearchStackParamList>();

export const SearchStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SearchBooks" component={SearchBooksScreen} options={{ title: '책 검색' }} />
      <Stack.Screen name="BookDetail" component={BookDetailScreen} options={{ title: '책 상세' }} />
    </Stack.Navigator>
  );
}; 