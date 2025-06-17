import React, { ReactNode, PropsWithChildren } from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, ActivityIndicator, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import Text from './Text';

export interface ButtonProps {
  /**
   * The title to display inside the button
   */
  title?: string;
  /**
   * Child components to render inside the button
   */
  children?: ReactNode;
  /**
   * Handler to be called when the user taps the button
   */
  onPress: () => void;
  /**
   * Button variant that affects the visual style
   * - primary: Filled button with primary color
   * - secondary: Outlined button with secondary color
   * - text: Text-only button with no background or border
   */
  variant?: 'primary' | 'secondary' | 'text';
  /**
   * Size of the button
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Whether the button is disabled
   */
  disabled?: boolean;
  /**
   * Whether to show a loading indicator
   */
  loading?: boolean;
  /**
   * Custom style for the button container
   */
  style?: ViewStyle;
  /**
   * Custom text style
   */
  textStyle?: object;
  /**
   * Icon to display before the title
   */
  icon?: ReactNode;
  /**
   * Icon to display after the title
   */
  iconRight?: ReactNode;
  /**
   * Accessibility label for the button
   */
  accessibilityLabel?: string;
  /**
   * Test ID for testing purposes
   */
  testID?: string;
}

/**
 * A customizable button component that follows the app's design system
 */
const Button: React.FC<ButtonProps> = ({
  title,
  children,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  iconRight,
  accessibilityLabel,
  testID,
}) => {
  const theme = useTheme();
  const isDisabled = disabled || loading;

  // Button styles based on variant and state
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      borderWidth: variant === 'secondary' ? 1 : 0,
      opacity: isDisabled ? 0.6 : 1,
      ...sizeStyles[size],
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.primary,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderColor: theme.colors.primary,
        };
      case 'text':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          paddingVertical: 0,
          paddingHorizontal: 0,
        };
      default:
        return baseStyle;
    }
  };

  // Text color based on variant and state
  const getTextColor = (): string => {
    if (isDisabled) return theme.colors.mediumGray;
    
    switch (variant) {
      case 'primary':
        return theme.colors.white;
      case 'secondary':
        return theme.colors.primary;
      case 'text':
        return theme.colors.primary;
      default:
        return theme.colors.primary;
    }
  };

  // Text variant based on size
  const getTextVariant = (): keyof typeof theme.textVariants => {
    switch (size) {
      case 'small':
        return 'labelLarge';
      case 'large':
        return 'bodyLarge';
      case 'medium':
      default:
        return 'bodyMedium';
    }
  };

  // Text style based on variant and state
  const getTextStyle = () => {
    const textStyleObj: any = {
      ...styles.text,
      color: getTextColor(),
      ...(icon && styles.textWithIcon),
      ...(iconRight && styles.textWithRightIcon),
      ...textStyle,
    };
    return textStyleObj;
  };

  // Render content based on loading state
  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator 
          size="small" 
          color={getTextColor()} 
          style={styles.loader} 
        />
      );
    }

    // If title is provided, render it with proper styling
    if (title) {
      return (
        <>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={getTextStyle()} numberOfLines={1}>
            {title}
          </Text>
          {iconRight && <View style={styles.iconContainer}>{iconRight}</View>}
        </>
      );
    }

    // If children are provided, render them with proper styling if they are strings
    if (children) {
      return (
        <View style={styles.childrenContainer}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          {typeof children === 'string' ? (
            <Text style={getTextStyle()} numberOfLines={1}>
              {children}
            </Text>
          ) : (
            children
          )}
          {iconRight && <View style={styles.iconContainer}>{iconRight}</View>}
        </View>
      );
    }

    // Fallback for empty button (should have at least title or children)
    return null;
  };

  // Combine styles with proper typing
  const buttonStyles: ViewStyle = {
    ...styles.button,
    ...getButtonStyle(),
    ...style,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || (typeof title === 'string' ? title : 'Button')}
      accessibilityState={{ disabled: isDisabled }}
      testID={testID}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

// Size-based styles
const sizeStyles = {
  small: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    minHeight: 36,
  },
  medium: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 44,
  },
  large: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 52,
  },
};

const styles = StyleSheet.create({
  button: {
    // Base styles are applied via getButtonStyle
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  childrenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    fontWeight: '500',
  },
  textWithIcon: {
    marginLeft: 8,
  },
  textWithRightIcon: {
    marginRight: 8,
  },
  loader: {
    margin: 2,
  },
});

export default Button;
