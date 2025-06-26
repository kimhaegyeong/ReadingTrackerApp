import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Button } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';

const AddBookScreen = ({ navigation }: any) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [pages, setPages] = useState('');

  const handleSave = () => {
    // 실제로는 저장 로직 필요
    navigation.goBack && navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack && navigation.goBack()} style={styles.backBtn}>
            <Feather name="arrow-left" size={24} color="#222" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>직접 책 입력</Text>
        </View>
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="책 제목"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="저자"
            value={author}
            onChangeText={setAuthor}
          />
          <TextInput
            style={styles.input}
            placeholder="ISBN (선택)"
            value={isbn}
            onChangeText={setIsbn}
          />
          <TextInput
            style={styles.input}
            placeholder="페이지 수 (선택)"
            value={pages}
            onChangeText={setPages}
            keyboardType="numeric"
          />
          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.saveButton}
            contentStyle={{ paddingVertical: 10 }}
          >
            저장
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  backBtn: { marginRight: 12, padding: 4, borderRadius: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#222' },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    marginTop: 8,
  },
});

export default AddBookScreen; 