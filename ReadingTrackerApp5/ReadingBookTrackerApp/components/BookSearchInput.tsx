import React from 'react';
import { TextInput, StyleSheet, View, TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons'; // Assuming you use expo vector icons

interface BookSearchInputProps extends TextInputProps {}

const BookSearchInput = ({ style, ...props }: BookSearchInputProps) => {
  return (
    <View style={styles.container}>
      <Feather name="search" size={20} color="#9CA3AF" style={styles.icon} />
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor="#9CA3AF"
        editable={true}
        onChangeText={text => {
          if (props.onChangeText) props.onChangeText(text);
          console.log('입력값:', text);
        }}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 48,
    width: '100%',
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    height: '100%',
    minWidth: 0,
    minHeight: 40,
  },
});

export default BookSearchInput; 