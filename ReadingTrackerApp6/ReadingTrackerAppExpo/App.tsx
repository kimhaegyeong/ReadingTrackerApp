import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
import { DatabaseService } from './src/DatabaseService';
import { BookProvider } from './src/BookContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const queryClient = new QueryClient();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'ellipse';
          if (route.name === 'Library') iconName = focused ? 'library' : 'library-outline';
          else if (route.name === 'Stats') iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          else if (route.name === 'Timer') iconName = focused ? 'timer' : 'timer-outline';
          else if (route.name === 'Search') iconName = focused ? 'search' : 'search-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Library" component={BookLibraryScreen} options={{ title: '서재' }} />
      <Tab.Screen name="Stats" component={ReadingStatsScreen} options={{ title: '통계' }} />
      <Tab.Screen name="Timer" component={ReadingTimerScreen} options={{ title: '독서기록' }} />
      <Tab.Screen name="Search" component={BookSearchScreen} options={{ title: '검색' }} />
      <Tab.Screen name="Profile" component={UserProfileScreen} options={{ title: '프로필' }} />
    </Tab.Navigator>
  );
}

function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="BookDetail" component={BookDetailScreen as any} options={{ headerShown: false }} />
      <Stack.Screen name="AddBook" component={AddBookScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default function App() {
  React.useEffect(() => {
    DatabaseService.getInstance();
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <BookProvider>
        <NavigationContainer>
          <StackNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </BookProvider>
    </QueryClientProvider>
  );
}
