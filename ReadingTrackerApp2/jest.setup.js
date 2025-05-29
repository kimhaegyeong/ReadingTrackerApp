import '@testing-library/jest-native/extend-expect';

// Mock react-native-paper
jest.mock('react-native-paper', () => {
  const DefaultTheme = {
    dark: false,
    roundness: 4,
    colors: {
      primary: '#6200ee',
      accent: '#03dac4',
      background: '#f6f6f6',
      surface: '#ffffff',
      error: '#B00020',
      text: '#000000',
      onSurface: '#000000',
      disabled: '#000000',
      placeholder: '#000000',
      backdrop: '#000000',
      notification: '#000000',
      secondary: '#03dac4',
    },
  };

  const Dialog = ({ visible, children, onDismiss }) => {
    const { View } = require('react-native');
    return visible ? <View testID="dialog">{children}</View> : null;
  };

  Dialog.Title = ({ children }) => {
    const { Text } = require('react-native');
    return <Text testID="dialog-title">{children}</Text>;
  };

  Dialog.Content = ({ children }) => {
    const { View } = require('react-native');
    return <View testID="dialog-content">{children}</View>;
  };

  Dialog.Actions = ({ children }) => {
    const { View } = require('react-native');
    return <View testID="dialog-actions">{children}</View>;
  };

  return {
    Provider: ({ children }) => {
      const { View } = require('react-native');
      return <View>{children}</View>;
    },
    Portal: ({ children }) => {
      const { View } = require('react-native');
      return <View>{children}</View>;
    },
    Button: ({ onPress, children, mode, style }) => {
      const { View, Text } = require('react-native');
      return (
        <View onPress={onPress} testID="button" style={style}>
          <Text>{children}</Text>
        </View>
      );
    },
    TextInput: ({ value, onChangeText, label, error, style, multiline, numberOfLines }) => {
      const { View, Text } = require('react-native');
      return (
        <View testID="text-input" style={style}>
          <Text>{label}</Text>
          <Text>{value}</Text>
          {error && <Text testID="error-text">{error}</Text>}
        </View>
      );
    },
    Card: ({ children, style }) => {
      const { View } = require('react-native');
      return <View style={style}>{children}</View>;
    },
    'Card.Content': ({ children, style }) => {
      const { View } = require('react-native');
      return <View style={style}>{children}</View>;
    },
    'Card.Actions': ({ children, style }) => {
      const { View } = require('react-native');
      return <View style={style}>{children}</View>;
    },
    Dialog,
    Text: ({ children, style, variant }) => {
      const { Text } = require('react-native');
      return <Text style={style}>{children}</Text>;
    },
    IconButton: ({ onPress, icon, size, style }) => {
      const { View, Text } = require('react-native');
      return (
        <View onPress={onPress} testID="icon-button" style={style}>
          <Text>{icon}</Text>
        </View>
      );
    },
    FAB: ({ onPress, icon, style, label }) => {
      const { View, Text } = require('react-native');
      return (
        <View onPress={onPress} testID="fab" style={style}>
          <Text>{icon}</Text>
          {label && <Text>{label}</Text>}
        </View>
      );
    },
    List: ({ children, style }) => {
      const { View } = require('react-native');
      return <View style={style}>{children}</View>;
    },
    'List.Item': ({ title, description, onPress, left, right, style }) => {
      const { View, Text } = require('react-native');
      return (
        <View onPress={onPress} testID="list-item" style={style}>
          {left && <View>{left}</View>}
          <View>
            <Text>{title}</Text>
            {description && <Text>{description}</Text>}
          </View>
          {right && <View>{right}</View>}
        </View>
      );
    },
    Divider: ({ style }) => {
      const { View } = require('react-native');
      return <View testID="divider" style={style} />;
    },
    Surface: ({ children, style }) => {
      const { View } = require('react-native');
      return <View style={style}>{children}</View>;
    },
    useTheme: () => ({
      colors: DefaultTheme.colors,
      dark: DefaultTheme.dark,
      roundness: DefaultTheme.roundness,
    }),
    DefaultTheme,
  };
});

// Mock react-native-ratings
jest.mock('react-native-ratings', () => ({
  Rating: ({ startingValue, onFinishRating, style, readonly }) => {
    const { View, Text } = require('react-native');
    return (
      <View testID="rating" style={style}>
        <Text>Rating: {startingValue}</Text>
        {!readonly && <View onPress={() => onFinishRating && onFinishRating(startingValue)} />}
      </View>
    );
  },
}));

// Mock @react-navigation/native
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    setOptions: jest.fn(),
  }),
  useRoute: () => ({
    params: {
      bookId: 'test-book-id',
      book: {
        id: 'test-book-id',
        title: 'Test Book',
        author: 'Test Author',
        description: 'Test Description',
        coverUrl: 'https://test.com/cover.jpg',
      },
    },
  }),
}));

// Mock NetInfo
jest.mock('@react-native-community/netinfo', () => ({
  useNetInfo: () => ({
    isConnected: true,
    isInternetReachable: true,
    type: 'wifi',
    details: {
      isConnectionExpensive: false,
    },
  }),
}));

// Mock react-native
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Alert: {
      alert: jest.fn(),
    },
    Linking: {
      openURL: jest.fn(),
      canOpenURL: jest.fn(),
    },
    Platform: {
      ...RN.Platform,
      select: jest.fn((obj) => obj.ios),
    },
    Settings: {
      get: jest.fn(),
      set: jest.fn(),
    },
  };
}); 