import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from 'react-native';

interface BadgeProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
}

const Badge = ({ children, style, textStyle, onPress }: BadgeProps) => {
  const Component = onPress ? TouchableOpacity : View;
  
  return (
    <Component onPress={onPress} style={[styles.badge, style]}>
      <Text style={[styles.text, textStyle]}>{children}</Text>
    </Component>
  );
};

export default Badge;

const styles = StyleSheet.create({
  badge: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 28,
    lineHeight: 28,
    paddingVertical: 0,
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