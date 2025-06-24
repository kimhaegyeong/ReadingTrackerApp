import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { BookProvider } from '@/contexts/BookContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

// 환경변수 로드 (expo 환경에서는 process.env 자동 주입, node 환경은 dotenv 필요)
// import 'dotenv/config'; // expo에서는 별도 필요 없음

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  // 환경변수 기반 자동 showTabs
  const showTabs = false; // 탭을 아예 표시하지 않음

  useEffect(() => {
    (async () => {
      try {
        const done = await AsyncStorage.getItem('onboardingDone');
        if (!done) {
          setShowOnboarding(true);
        }
      } catch (error) {
        setShowOnboarding(true);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' }}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <BookProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          {showOnboarding ? (
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          ) : null}
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </BookProvider>
  );
}
