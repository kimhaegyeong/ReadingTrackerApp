import React, { forwardRef } from 'react';
import { 
  TextInput as RNTextInput, 
  TextInputProps as RNTextInputProps, 
  StyleSheet, 
  View, 
  Text, 
  TextInput,
  TextStyle,
  ViewStyle,
  StyleProp
} from 'react-native';
import { colors } from '@/theme';

export interface InputProps extends Omit<RNTextInputProps, 'style'> {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<TextStyle>;
  disabled?: boolean;
}

const Input = forwardRef<RNTextInput, InputProps>(
  ({ label, error, style, containerStyle, disabled, ...props }, ref) => {
    return (
      <View style={[styles.container, containerStyle]}>
        {label && <Text style={styles.label}>{label}</Text>}
        <RNTextInput
          ref={ref}
          style={[
            styles.input,
            error && styles.inputError,
            disabled && styles.disabledInput,
            style,
          ]}
          placeholderTextColor={colors.gray}
          editable={!disabled}
          {...props}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 4,
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.error,
  },
  disabledInput: {
    backgroundColor: colors.lightGray,
    color: colors.gray,
    opacity: 0.7,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: colors.error,
  },
});

export default Input;
