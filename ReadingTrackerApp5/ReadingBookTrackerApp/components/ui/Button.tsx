import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, StyleProp, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Button = ({ children, style, textStyle, disabled, ...props }: ButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled ? styles.disabledButton : styles.enabledButton,
        style,
      ]}
      disabled={disabled}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text style={[styles.text, disabled ? styles.disabledText : styles.enabledText, textStyle]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  enabledButton: {
    backgroundColor: '#4F46E5',
  },
  disabledButton: {
    backgroundColor: '#E5E7EB',
  },
  text: {
    fontWeight: '600',
    fontSize: 16,
  },
  enabledText: {
    color: '#fff',
  },
  disabledText: {
    color: '#A3A3A3',
  },
}); 