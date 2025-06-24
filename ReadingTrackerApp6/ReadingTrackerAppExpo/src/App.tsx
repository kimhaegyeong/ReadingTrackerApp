import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Index from './pages/Index';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Index} />
        {/* 필요한 경우, BookDetail, Settings 등 추가 스크린 연결 */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
