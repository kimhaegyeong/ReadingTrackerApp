import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeStack } from '@/navigation/HomeStack';
import { SearchStack } from '@/navigation/SearchStack';
import { StatsStack } from '@/navigation/StatsStack';
import { SettingsStack } from '@/navigation/SettingsStack';
import { IconButton } from 'react-native-paper';
import { colors } from '../theme/colors';

export type RootTabParamList = {
  Library: undefined;
  Search: undefined;
  Stats: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Library':
              iconName = 'book';
              break;
            case 'Search':
              iconName = 'magnify';
              break;
            case 'Stats':
              iconName = 'chart-bar';
              break;
            case 'Settings':
              iconName = 'cog';
              break;
            default:
              iconName = 'help';
          }

          return (
            <IconButton
              icon={iconName}
              size={size}
              iconColor={focused ? colors.primary : color}
            />
          );
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Library" 
        component={HomeStack}
        options={{
          title: '내 서재',
        }}
      />
      <Tab.Screen 
        name="Search" 
        component={SearchStack}
        options={{
          title: '책 검색',
        }}
      />
      <Tab.Screen 
        name="Stats" 
        component={StatsStack}
        options={{
          title: '통계',
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsStack}
        options={{
          title: '설정',
        }}
      />
    </Tab.Navigator>
  );
}; 