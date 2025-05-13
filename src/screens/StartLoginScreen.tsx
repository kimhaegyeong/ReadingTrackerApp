import React from 'react';
import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity } from 'react-native';

export default function StartLoginScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reading Tracker</Text>
      <TextInput style={styles.input} placeholder="이메일" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="비밀번호" secureTextEntry />
      <Button title="로그인" onPress={() => navigation.replace('MainTabs')} />
      <TouchableOpacity style={styles.link}><Text>회원가입</Text></TouchableOpacity>
      <TouchableOpacity style={styles.link}><Text>소셜 로그인</Text></TouchableOpacity>
      <TouchableOpacity style={styles.link}><Text>비회원으로 시작</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 32 },
  input: { width: '80%', padding: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 16 },
  link: { marginTop: 8 },
});
