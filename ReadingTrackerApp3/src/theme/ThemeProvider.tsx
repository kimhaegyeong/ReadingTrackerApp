import React, { createContext, useContext, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { colors, Colors } from './colors';
import { spacing, Spacing } from './spacing';
import { textVariants, TextVariant, FontWeight, createTextStyle, getTextStyle } from './typography';

// Define the theme type
export interface Theme {
  colors: Colors;
  spacing: typeof spacing;
  textVariants: typeof textVariants;
  isDark: boolean;
  getSpacing: (key: Spacing) => number;
  getTextStyle: (variant?: TextVariant) => ReturnType<typeof getTextStyle>;
  createTextStyle: typeof createTextStyle;
}

// Create the theme context
const ThemeContext = createContext<Theme | undefined>(undefined);

// Props for the ThemeProvider
interface ThemeProviderProps {
  children: ReactNode;
  isDark?: boolean; // Optional override for the color scheme
}

// Theme provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  isDark: isDarkOverride 
}) => {
  const colorScheme = useColorScheme();
  const isDark = isDarkOverride ?? colorScheme === 'dark';

  // Get the appropriate color palette based on the theme
  const themeColors: Colors = {
    ...colors,
    background: isDark ? colors.black : colors.background,
    card: isDark ? colors.darkGray : colors.card,
    text: isDark ? colors.white : colors.black,
    textSecondary: isDark ? colors.mediumGray : colors.darkGray,
    border: isDark ? colors.darkGray : colors.border,
  } as const;

  // Create the theme object
  const theme: Theme = {
    colors: themeColors,
    spacing,
    textVariants,
    isDark,
    getSpacing: (key) => spacing[key],
    getTextStyle: (variant = 'bodyMedium') => getTextStyle(variant),
    createTextStyle,
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme
export const useTheme = (): Theme => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Re-export types and utilities
export type { TextVariant, FontWeight };
export { colors, spacing, createTextStyle, getTextStyle };
