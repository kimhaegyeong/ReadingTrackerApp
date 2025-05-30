import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { registerRootComponent } from 'expo';
import { useEffect } from 'react';
import { initDatabase } from './src/database/database';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// 각 스크린 import
import StartLoginScreen from './src/screens/StartLoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import LibraryScreen from './src/screens/LibraryScreen';
import BookDetailScreen from './src/screens/BookDetailScreen';
import RecordEditScreen from './src/screens/RecordEditScreen';
import MemoManageScreen from './src/screens/MemoManageScreen';
import StatsScreen from './src/screens/StatsScreen';
import GoalSettingScreen from './src/screens/GoalSettingScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import CommunityScreen from './src/screens/CommunityScreen';

// Context providers
import { AuthProvider } from './src/contexts/AuthContext';
import { ReadingProvider } from './src/contexts/ReadingContext';
import { SearchProvider } from './src/contexts/SearchContext';
import { BookProvider } from './src/contexts/BookContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      id={undefined}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home';
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Search') iconName = 'search';
          else if (route.name === 'Library') iconName = 'library-books';
          else if (route.name === 'Stats') iconName = 'bar-chart';
          else if (route.name === 'Profile') iconName = 'person';
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: '홈' }} />
      <Tab.Screen name="Search" component={SearchScreen} options={{ title: '검색' }} />
      <Tab.Screen name="Library" component={LibraryScreen} options={{ title: '서재' }} />
      <Tab.Screen name="Stats" component={StatsScreen} options={{ title: '통계' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: '프로필' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    const setupDatabase = async () => {
      try {
        await initDatabase();
        console.log('Database initialized successfully');
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };

    setupDatabase();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <AuthProvider>
          <ReadingProvider>
            <SearchProvider>
              <BookProvider>
                <SafeAreaProvider>
                  <Stack.Navigator 
                    id={undefined}
                    initialRouteName="StartLogin">
                    <Stack.Screen name="StartLogin" component={StartLoginScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} initialParams={{ id: undefined }} />
                    {/* 상세/기능 페이지 */}
                    <Stack.Screen name="BookDetail" component={BookDetailScreen} options={{ title: '책 상세' }} />
                    <Stack.Screen name="RecordEdit" component={RecordEditScreen} options={{ title: '독서 기록 추가/수정' }} />
                    <Stack.Screen name="MemoManage" component={MemoManageScreen} options={{ title: '메모 관리' }} />
                    <Stack.Screen name="GoalSetting" component={GoalSettingScreen} options={{ title: '목표 설정' }} />
                    <Stack.Screen name="Community" component={CommunityScreen} options={{ title: '커뮤니티' }} />
                  </Stack.Navigator>
                </SafeAreaProvider>
              </BookProvider>
            </SearchProvider>
          </ReadingProvider>
        </AuthProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

registerRootComponent(App);
