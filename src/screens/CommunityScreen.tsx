import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function CommunityScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>커뮤니티</Text>
      <Button title="독서 챌린지 참여" onPress={() => {}} />
      <Button title="책 추천 받기" onPress={() => {}} />
      <Button title="리뷰 공유" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
});
