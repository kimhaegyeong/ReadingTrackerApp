import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from './src/theme';
import { LibraryHomeScreen } from './src/screens/LibraryHomeScreen';
import { SearchHomeScreen } from './src/screens/SearchHomeScreen';
import { StatsHomeScreen } from './src/screens/StatsHomeScreen';
import { SettingsHomeScreen } from './src/screens/SettingsHomeScreen';
import { BookDetailScreen } from './src/screens/BookDetailScreen';
import { ManualBookEntryScreen } from './src/screens/ManualBookEntryScreen';
import * as database from './src/services/database';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const LibraryStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="LibraryHome" 
      component={LibraryHomeScreen}
      options={{ title: '내 서재' }}
    />
    <Stack.Screen 
      name="BookDetail" 
      component={BookDetailScreen}
      options={{ title: '책 상세' }}
    />
    <Stack.Screen 
      name="ManualBookEntry" 
      component={ManualBookEntryScreen}
      options={{ title: '수동 등록' }}
    />
  </Stack.Navigator>
);

const SearchStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="SearchHome" 
      component={SearchHomeScreen}
      options={{ title: '책 검색' }}
    />
    <Stack.Screen 
      name="BookDetail" 
      component={BookDetailScreen}
      options={{ title: '책 상세' }}
    />
  </Stack.Navigator>
);

const StatsStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="StatsHome" 
      component={StatsHomeScreen}
      options={{ title: '독서 통계' }}
    />
  </Stack.Navigator>
);

const SettingsStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="SettingsHome" 
      component={SettingsHomeScreen}
      options={{ title: '설정' }}
    />
  </Stack.Navigator>
);

export default function App() {
  useEffect(() => {
    const initApp = async () => {
      try {
        await database.initDatabase();
        console.log('데이터베이스 초기화 완료');
      } catch (error) {
        console.error('데이터베이스 초기화 중 오류 발생:', error);
      }
    };

    initApp();
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              switch (route.name) {
                case 'Library':
                  iconName = 'library-books';
                  break;
                case 'Search':
                  iconName = 'search';
                  break;
                case 'Stats':
                  iconName = 'bar-chart';
                  break;
                case 'Settings':
                  iconName = 'settings';
                  break;
                default:
                  iconName = 'help';
              }

              return <MaterialIcons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: theme.colors.primary,
            tabBarInactiveTintColor: theme.colors.textSecondary,
            headerShown: false,
          })}
        >
          <Tab.Screen name="Library" component={LibraryStack} options={{ title: '내 서재' }} />
          <Tab.Screen name="Search" component={SearchStack} options={{ title: '검색' }} />
          <Tab.Screen name="Stats" component={StatsStack} options={{ title: '통계' }} />
          <Tab.Screen name="Settings" component={SettingsStack} options={{ title: '설정' }} />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
} 