import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@/theme';

export interface FABProps {
  onPress: () => void;
  icon?: string;
  style?: ViewStyle;
  size?: number;
  color?: string;
  backgroundColor?: string;
}

const FAB: React.FC<FABProps> = ({
  onPress,
  icon = 'add',
  style,
  size = 24,
  color = colors.white,
  backgroundColor = colors.primary,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons name={icon as any} size={size} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default FAB;
