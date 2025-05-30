import { ExpoConfig, ConfigContext } from 'expo/config';
import 'dotenv/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'ReadingTrackerApp2',
  slug: 'ReadingTrackerApp2',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.readingtrackerapp2'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    package: 'com.readingtrackerapp2'
  },
  web: {
    favicon: './assets/favicon.png'
  },
  extra: {
    GOOGLE_BOOKS_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_BOOKS_API_KEY || 'YOUR_API_KEY_HERE'
  },
  plugins: [
    [
      'expo-build-properties',
      {
        ios: {
          useFrameworks: 'static'
        }
      }
    ]
  ]
}); 