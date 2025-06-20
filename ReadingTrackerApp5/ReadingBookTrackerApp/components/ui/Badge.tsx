import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from 'react-native';

interface BadgeProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
}

export const Badge = ({ children, style, textStyle, onPress }: BadgeProps) => {
  const Component = onPress ? TouchableOpacity : View;
  
  return (
    <Component onPress={onPress} style={[styles.badge, style]}>
      <Text style={[styles.text, textStyle]}>{children}</Text>
    </Component>
  );
};

const styles = StyleSheet.create({
  badge: {
    display: 'flex',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#E5E7EB', // default color
    alignSelf: 'flex-start',
  },
  text: {
    color: '#374151',
    fontWeight: '500',
    fontSize: 13,
  },
}); 