/**
 * A consistent spacing scale for the application
 * Based on an 8pt grid system (common in Material Design)
 */
export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export type Spacing = keyof typeof spacing;

/**
 * Get the actual pixel value for a spacing key
 */
export const getSpacing = (key: Spacing): number => {
  return spacing[key];
};

/**
 * Get responsive spacing based on screen size (future use)
 */
export const responsiveSpacing = {
  small: (key: Spacing) => getSpacing(key) * 0.75,
  medium: (key: Spacing) => getSpacing(key),
  large: (key: Spacing) => getSpacing(key) * 1.25,
};
