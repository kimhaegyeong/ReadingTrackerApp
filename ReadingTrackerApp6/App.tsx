import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import Index from './ReadingTrackerAppExpo/src/pages/pages/Index';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Index />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc', // Tailwind의 slate-50에 해당
  },
}); 