import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';
import { colors } from '@/theme';

interface RatingProps {
  value: number;
  onValueChange?: (value: number) => void;
  readonly?: boolean;
  style?: any;
}

export const Rating: React.FC<RatingProps> = ({
  value,
  onValueChange,
  readonly = false,
  style,
}) => {
  const handlePress = (newValue: number) => {
    if (!readonly && onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => handlePress(star)}
          disabled={readonly}
        >
          <IconButton
            icon={star <= value ? 'star' : 'star-outline'}
            size={24}
            iconColor={star <= value ? colors.primary : colors.textSecondary}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}); 