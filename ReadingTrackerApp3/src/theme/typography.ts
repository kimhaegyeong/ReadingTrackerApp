import { Platform, TextStyle } from 'react-native';
import { colors } from './colors';

// Font families
export const fontFamilies = {
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'sans-serif',
  }),
  medium: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
    default: 'sans-serif-medium',
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto-Bold',
    default: 'sans-serif',
  }),
  light: Platform.select({
    ios: 'System',
    android: 'Roboto-Light',
    default: 'sans-serif-light',
  }),
  thin: Platform.select({
    ios: 'System',
    android: 'Roboto-Thin',
    default: 'sans-serif-thin',
  }),
} as const;

// Font sizes
export const fontSizes = {
  displayLarge: 57,
  displayMedium: 45,
  displaySmall: 36,
  headlineLarge: 32,
  headlineMedium: 28,
  headlineSmall: 24,
  titleLarge: 22,
  titleMedium: 18,
  titleSmall: 16,
  bodyLarge: 16,
  bodyMedium: 14,
  bodySmall: 12,
  labelLarge: 14,
  labelMedium: 12,
  labelSmall: 11,
} as const;

// Line heights
export const lineHeights = {
  displayLarge: 64,
  displayMedium: 52,
  displaySmall: 44,
  headlineLarge: 40,
  headlineMedium: 36,
  headlineSmall: 32,
  titleLarge: 28,
  titleMedium: 24,
  titleSmall: 20,
  bodyLarge: 24,
  bodyMedium: 20,
  bodySmall: 16,
  labelLarge: 20,
  labelMedium: 16,
  labelSmall: 16,
} as const;

// Font weights
export const fontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  bold: '700' as const,
} as const;

// Text variants
export const textVariants = {
  // Display styles
  displayLarge: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.displayLarge,
    lineHeight: lineHeights.displayLarge,
    letterSpacing: 0,
    color: colors.black,
  },
  displayMedium: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.displayMedium,
    lineHeight: lineHeights.displayMedium,
    letterSpacing: 0,
    color: colors.black,
  },
  displaySmall: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.displaySmall,
    lineHeight: lineHeights.displaySmall,
    letterSpacing: 0,
    color: colors.black,
  },
  
  // Headline styles
  headlineLarge: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.headlineLarge,
    lineHeight: lineHeights.headlineLarge,
    letterSpacing: 0,
    color: colors.black,
  },
  headlineMedium: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.headlineMedium,
    lineHeight: lineHeights.headlineMedium,
    letterSpacing: 0,
    color: colors.black,
  },
  headlineSmall: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.headlineSmall,
    lineHeight: lineHeights.headlineSmall,
    letterSpacing: 0,
    color: colors.black,
  },
  
  // Title styles
  titleLarge: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes.titleLarge,
    lineHeight: lineHeights.titleLarge,
    letterSpacing: 0.15,
    color: colors.black,
  },
  titleMedium: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes.titleMedium,
    lineHeight: lineHeights.titleMedium,
    letterSpacing: 0.15,
    color: colors.black,
  },
  titleSmall: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes.titleSmall,
    lineHeight: lineHeights.titleSmall,
    letterSpacing: 0.1,
    color: colors.black,
  },
  
  // Body styles
  bodyLarge: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.bodyLarge,
    lineHeight: lineHeights.bodyLarge,
    letterSpacing: 0.5,
    color: colors.darkGray,
  },
  bodyMedium: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.bodyMedium,
    lineHeight: lineHeights.bodyMedium,
    letterSpacing: 0.25,
    color: colors.darkGray,
  },
  bodySmall: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.bodySmall,
    lineHeight: lineHeights.bodySmall,
    letterSpacing: 0.4,
    color: colors.mediumGray,
  },
  
  // Label styles
  labelLarge: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes.labelLarge,
    lineHeight: lineHeights.labelLarge,
    letterSpacing: 0.1,
    color: colors.mediumGray,
  },
  labelMedium: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes.labelMedium,
    lineHeight: lineHeights.labelMedium,
    letterSpacing: 0.5,
    color: colors.mediumGray,
  },
  labelSmall: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes.labelSmall,
    lineHeight: lineHeights.labelSmall,
    letterSpacing: 0.5,
    color: colors.mediumGray,
    textTransform: 'uppercase' as const,
  },
};

export type TextVariant = keyof typeof textVariants;
export type FontWeight = keyof typeof fontWeights;

/**
 * Get text style for a specific variant
 */
export const getTextStyle = (variant: TextVariant = 'bodyMedium'): TextStyle => {
  return textVariants[variant];
};

/**
 * Create a custom text style
 */
export const createTextStyle = (
  size: keyof typeof fontSizes,
  weight: FontWeight = 'regular',
  color: string = colors.black,
  lineHeight?: number,
  letterSpacing?: number
): TextStyle => {
  const baseStyle = {
    fontFamily: weight === 'bold' ? fontFamilies.bold : 
                weight === 'medium' ? fontFamilies.medium : fontFamilies.regular,
    fontSize: fontSizes[size],
    color,
    lineHeight: lineHeight || fontSizes[size] * 1.5, // Default line height
    letterSpacing: letterSpacing || 0,
  };

  return baseStyle;
};
