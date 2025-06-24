import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          ...Platform.select({
            ios: {
              backgroundColor: '#fff',
            },
            default: {},
          }),
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '내 서재',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" colors={[color]} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: '책 검색',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="magnifyingglass" colors={[color]} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: '통계',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.bar.fill" colors={[color]} />,
        }}
      />
    </Tabs>
  );
}