import React from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';

export default function GoalSettingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>목표 설정</Text>
      <Text>연간 목표</Text>
      <TextInput style={styles.input} placeholder="예: 50권" />
      <Text>월간 목표</Text>
      <TextInput style={styles.input} placeholder="예: 5권" />
      <Button title="저장" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
});
