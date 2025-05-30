import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SearchBooksScreen } from '@/screens/SearchBooksScreen';
import { BookDetailScreen } from '@/screens/BookDetailScreen';
import { ManualBookEntryScreen } from '@/screens/ManualBookEntryScreen';

export type SearchStackParamList = {
  SearchHome: undefined;
  BookDetail: { bookId: string };
  ManualBookEntry: undefined;
};

const Stack = createNativeStackNavigator<SearchStackParamList>();

export const SearchStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SearchHome" component={SearchBooksScreen} options={{ title: '책 검색' }} />
      <Stack.Screen name="BookDetail" component={BookDetailScreen} options={{ title: '책 상세' }} />
      <Stack.Screen name="ManualBookEntry" component={ManualBookEntryScreen} options={{ title: '수동 등록' }} />
    </Stack.Navigator>
  );
}; 