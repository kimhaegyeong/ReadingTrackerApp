import React, { ReactNode } from 'react';
import { Text as RNText, StyleSheet, TextStyle } from 'react-native';
import { useTheme, TextVariant } from '@/theme/ThemeProvider';

export interface TextProps {
  variant?: TextVariant;
  style?: TextStyle;
  color?: string;
  children: ReactNode;
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  onPress?: () => void;
  testID?: string;
}

/**
 * A customizable Text component that uses the app's theme
 */
const Text: React.FC<TextProps> = ({
  variant = 'bodyMedium',
  style,
  color,
  children,
  numberOfLines,
  ellipsizeMode,
  textAlign,
  onPress,
  testID,
  ...rest
}) => {
  const theme = useTheme();
  const textStyle = theme.getTextStyle(variant);

  return (
    <RNText
      style={[
        styles.text,
        textStyle,
        color && { color },
        textAlign && { textAlign },
        style,
      ]}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      onPress={onPress}
      testID={testID}
      {...rest}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  text: {
    // Default text styles are applied via the theme
  },
});

export default Text;
