export const colors = {
  // Primary colors
  primary: '#4A6FA5',
  primaryDark: '#3A5A80',
  primaryLight: '#8BA8C7',
  lightPrimary: '#E6EEF7', // Added light primary color
  
  // Secondary colors
  secondary: '#FF9F1C',
  secondaryDark: '#D18A1A',
  secondaryLight: '#FFBF69',
  
  // Grayscale
  white: '#FFFFFF',
  lightGray: '#F5F7FA',
  gray: '#A3A9B7',
  mediumGray: '#6B7280',
  darkGray: '#4A5568',
  black: '#1A202C',
  text: '#1A202C',
  textSecondary: '#4A5568', // Added text secondary color
  
  // Status colors
  success: '#48BB78',
  warning: '#ECC94B',
  error: '#F56565',
  danger: '#F56565', // Alias for error
  info: '#4299E1',
  
  // Backgrounds
  background: '#F8F9FA',
  card: '#FFFFFF',
  border: '#E2E8F0',
  
  // Additional UI colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  transparent: 'transparent',
} as const;

// Make the colors type more flexible to allow theme overrides
export type Colors = {
  [K in keyof typeof colors]: string;
};
