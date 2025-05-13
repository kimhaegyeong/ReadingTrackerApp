import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>프로필/설정</Text>
      <Button title="개인 정보 관리" onPress={() => {}} />
      <Button title="테마/디자인 설정" onPress={() => {}} />
      <Button title="알림 설정" onPress={() => {}} />
      <Button title="데이터 백업/복원" onPress={() => {}} />
      <Button title="개인정보 설정" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
});
