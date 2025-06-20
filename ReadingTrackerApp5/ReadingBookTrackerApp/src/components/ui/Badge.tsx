import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

type BadgeProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  color?: string;
};

export const Badge = ({ children, style, textStyle, color = '#E5E7EB' }: BadgeProps) => {
  return (
    <View style={[styles.badge, { backgroundColor: color }, style]}>
      <Text style={[styles.text, textStyle]}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    color: '#1F2937',
    fontWeight: '500',
    fontSize: 12,
  },
});