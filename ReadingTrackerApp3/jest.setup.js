// Basic Jest setup for React Native
import { jest } from '@jest/globals';

// Mock React Native
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  
  return {
    ...RN,
    // Mock commonly used React Native components
    Alert: {
      ...RN.Alert,
      alert: jest.fn(),
    },
    Platform: {
      ...RN.Platform,
      OS: 'ios',
      select: ({ ios, android }) => (ios || android),
    },
    // Mock FlatList and other components used in your app
    FlatList: 'FlatList',
    TextInput: 'TextInput',
    View: 'View',
    Text: 'Text',
    Button: 'Button',
    TouchableOpacity: 'TouchableOpacity',
    StyleSheet: {
      ...RN.StyleSheet,
      create: jest.fn(),
    },
  };
});

// Mock expo modules
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(() => Promise.resolve({
    cancelled: false,
    assets: [{ uri: 'test-image-uri' }],
  })),
  MediaTypeOptions: { Images: 'Images' },
}));

// Mock navigation
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
    addListener: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
}));

// Mock redux
const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: jest.fn((selector) => 
    selector({
      books: {
        books: [],
        status: 'idle',
        error: null,
        loading: false,
      },
    })
  ),
}));

// Mock react-native-vector-icons
jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: 'MaterialIcons',
}));

// Mock react-native-paper
jest.mock('react-native-paper', () => ({
  Button: 'Button',
  TextInput: 'TextInput',
  Portal: 'Portal',
  Dialog: 'Dialog',
  Provider: 'Provider',
  DefaultTheme: {},
}));

// Setup fetch mock
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  }),
  SafeAreaProvider: ({ children }) => children,
}));

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => ({
  // Add any specific mocks from react-native-gesture-handler if needed
}));
