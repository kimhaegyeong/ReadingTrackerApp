import React from 'react';
import { TextInput, StyleSheet, View, TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons'; // Assuming you use expo vector icons

interface BookSearchInputProps extends TextInputProps {
  // onChange prop is different in RN, it's onChangeText.
  // We accept TextInputProps which includes onChangeText.
}

const BookSearchInput = (props: BookSearchInputProps) => {
  return (
    <View style={styles.container}>
      <Feather name="search" size={20} color="#9CA3AF" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1, // This was causing the issue by taking up all vertical space.
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 48,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    height: '100%',
  },
});

export default BookSearchInput; 