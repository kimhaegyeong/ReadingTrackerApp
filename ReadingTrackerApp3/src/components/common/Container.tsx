import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle, ScrollView, SafeAreaView } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

export interface ContainerProps {
  /**
   * Children components to render inside the container
   */
  children: ReactNode;
  /**
   * Whether to use SafeAreaView (default: true)
   */
  safeArea?: boolean;
  /**
   * Whether to make the container scrollable (default: false)
   */
  scrollable?: boolean;
  /**
   * Custom style for the container
   */
  style?: ViewStyle;
  /**
   * Custom style for the content container (inside ScrollView if scrollable)
   */
  contentContainerStyle?: ViewStyle;
  /**
   * Background color for the container
   */
  backgroundColor?: string;
  /**
   * Padding around the content
   */
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Test ID for testing purposes
   */
  testID?: string;
}

/**
 * A container component that provides consistent spacing and layout
 */
const Container: React.FC<ContainerProps> = ({
  children,
  safeArea = true,
  scrollable = false,
  style,
  contentContainerStyle,
  backgroundColor,
  padding = 'md',
  testID,
}) => {
  const theme = useTheme();

  // Get padding value from theme
  const getPadding = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'xs':
        return theme.spacing.xs;
      case 'sm':
        return theme.spacing.sm;
      case 'lg':
        return theme.spacing.lg;
      case 'xl':
        return theme.spacing.xl;
      case 'md':
      default:
        return theme.spacing.md;
    }
  };

  // Base container styles
  const containerStyles: ViewStyle = {
    flex: 1,
    backgroundColor: backgroundColor || theme.colors.background,
    padding: getPadding(),
  };

  // Content container styles (used inside ScrollView)
  const contentStyles: ViewStyle = {
    flexGrow: 1,
    ...contentContainerStyle,
  };

  // Render the appropriate container based on props
  const renderContainer = () => {
    // Scrollable container
    if (scrollable) {
      return (
        <ScrollView
          style={[styles.container, containerStyles, style]}
          contentContainerStyle={contentStyles}
          showsVerticalScrollIndicator={false}
          testID={testID}
        >
          {children}
        </ScrollView>
      );
    }

    // Non-scrollable container
    return (
      <View style={[styles.container, containerStyles, style]} testID={testID}>
        {children}
      </View>
    );
  };

  // Wrap with SafeAreaView if needed
  if (safeArea) {
    return (
      <SafeAreaView style={styles.flex} testID={testID}>
        {renderContainer()}
      </SafeAreaView>
    );
  }

  return renderContainer();
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});

export default Container;
