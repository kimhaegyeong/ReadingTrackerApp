import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { NotificationSettingsScreen } from '@/screens/NotificationSettingsScreen';
import { AboutScreen } from '@/screens/AboutScreen';

export type SettingsStackParamList = {
  SettingsHome: undefined;
  Profile: undefined;
  NotificationSettings: undefined;
  About: undefined;
};

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export const SettingsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SettingsHome" component={SettingsScreen} options={{ title: '설정' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
    </Stack.Navigator>
  );
}; 