import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatsScreen } from '@/screens/StatsScreen';
import { ReadingGoalsScreen } from '@/screens/ReadingGoalsScreen';
import { ReadingSessionsScreen } from '@/screens/ReadingSessionsScreen';

export type StatsStackParamList = {
  StatsHome: undefined;
  ReadingGoals: undefined;
  ReadingSessions: undefined;
};

const Stack = createNativeStackNavigator<StatsStackParamList>();

export const StatsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="StatsHome"
        component={StatsScreen}
        options={{
          title: '통계',
        }}
      />
      <Stack.Screen
        name="ReadingGoals"
        component={ReadingGoalsScreen}
        options={{
          title: '독서 목표',
        }}
      />
      <Stack.Screen
        name="ReadingSessions"
        component={ReadingSessionsScreen}
        options={{
          title: '독서 세션',
        }}
      />
    </Stack.Navigator>
  );
}; 