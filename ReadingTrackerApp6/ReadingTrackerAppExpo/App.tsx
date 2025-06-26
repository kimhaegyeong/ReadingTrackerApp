import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import BookLibraryScreen from './src/screens/BookLibraryScreen';
import BookDetailScreen from './src/screens/BookDetailScreen';
import BookSearchScreen from './src/screens/BookSearchScreen';
import ReadingTimerScreen from './src/screens/ReadingTimerScreen';
import ReadingStatsScreen from './src/screens/ReadingStatsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';
import AddBookScreen from './src/screens/AddBookScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const queryClient = new QueryClient();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'ellipse';
          if (route.name === 'Library') iconName = focused ? 'library-outline' : 'library-outline';
          else if (route.name === 'Search') iconName = focused ? 'search-outline' : 'search-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person-outline' : 'person-outline';
          else if (route.name === 'Settings') iconName = focused ? 'settings-outline' : 'settings-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Library" component={BookLibraryScreen} options={{ title: '서재' }} />
      <Tab.Screen name="Search" component={BookSearchScreen} options={{ title: '검색' }} />
      <Tab.Screen name="Profile" component={UserProfileScreen} options={{ title: '프로필' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: '설정', tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} /> }} />
    </Tab.Navigator>
  );
}

function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="BookDetail" component={BookDetailScreen} options={{ title: '책 상세' }} />
      <Stack.Screen name="ReadingTimer" component={ReadingTimerScreen} options={{ title: '독서 타이머' }} />
      <Stack.Screen name="ReadingStats" component={ReadingStatsScreen} options={{ title: '독서 통계' }} />
      <Stack.Screen name="AddBook" component={AddBookScreen} options={{ title: '책 추가' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        <NavigationContainer>
          <StackNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </PaperProvider>
    </QueryClientProvider>
  );
}
