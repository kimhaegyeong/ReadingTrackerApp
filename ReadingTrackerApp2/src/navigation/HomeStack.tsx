import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '@/screens/HomeScreen';
import { BookDetailScreen } from '@/screens/BookDetailScreen';

export type HomeStackParamList = {
  LibraryHome: undefined;
  BookDetail: { bookId: string };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="LibraryHome" component={HomeScreen} options={{ title: '내 서재' }} />
      <Stack.Screen name="BookDetail" component={BookDetailScreen} options={{ title: '책 상세' }} />
    </Stack.Navigator>
  );
}; 