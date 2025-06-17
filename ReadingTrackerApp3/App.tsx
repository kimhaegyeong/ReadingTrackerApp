import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { store } from '@/store/store';
import { AppNavigator } from '@/navigation/AppNavigator';

// Create a navigation theme that matches our app's design
const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4A6FA5',
    background: '#F8F9FA',
    card: '#FFFFFF',
    text: '#1A202C',
    border: '#E2E8F0',
    notification: '#F56565',
  },
};

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#8BA8C7',
    background: '#1A202C',
    card: '#2D3748',
    text: '#F7FAFC',
    border: '#4A5568',
    notification: '#F56565',
  },
};

// Main App component
function AppContent() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? CustomDarkTheme : CustomLightTheme;

  return (
    <NavigationContainer theme={theme}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <AppNavigator />
    </NavigationContainer>
  );
}

// Root component with providers
function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
