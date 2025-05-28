import { DefaultTheme } from 'react-native-paper';

export const colors = {
  primary: '#6200ee',
  secondary: '#03dac6',
  background: '#f6f6f6',
  surface: '#ffffff',
  error: '#b00020',
  text: '#000000',
  textSecondary: '#666666',
  disabled: '#cccccc',
  placeholder: '#999999',
  backdrop: 'rgba(0, 0, 0, 0.5)',
  border: '#e0e0e0',
};

export const spacing = {
  xsmall: 4,
  small: 8,
  medium: 16,
  large: 24,
  xlarge: 32,
};

export const typography = {
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subheading: {
    fontSize: 20,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
  },
  caption: {
    fontSize: 12,
  },
};

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: colors.secondary,
    background: colors.background,
    surface: colors.surface,
    error: colors.error,
    text: colors.text,
    disabled: colors.disabled,
    placeholder: colors.placeholder,
    backdrop: colors.backdrop,
  },
}; 