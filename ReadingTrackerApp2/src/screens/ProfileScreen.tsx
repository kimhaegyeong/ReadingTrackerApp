import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Avatar, Button, List } from 'react-native-paper';
import { useAppSelector } from '@/store/hooks';

export const ProfileScreen = () => {
  const user = useAppSelector((state) => state.user.currentUser);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text 
          size={80} 
          label={user?.displayName?.[0] || 'G'} 
        />
        <Text style={styles.name}>{user?.displayName || '게스트'}</Text>
        <Text style={styles.email}>{user?.email || '로그인이 필요합니다'}</Text>
      </View>

      <List.Section>
        <List.Subheader>독서 통계</List.Subheader>
        <List.Item
          title="총 읽은 책"
          description="0권"
          left={props => <List.Icon {...props} icon="book" />}
        />
        <List.Item
          title="총 읽은 페이지"
          description="0페이지"
          left={props => <List.Icon {...props} icon="book-open-page-variant" />}
        />
        <List.Item
          title="현재 독서 중"
          description="0권"
          left={props => <List.Icon {...props} icon="bookmark" />}
        />
      </List.Section>

      <View style={styles.buttonContainer}>
        <Button 
          mode="contained" 
          onPress={() => {}}
          style={styles.button}
        >
          프로필 수정
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  buttonContainer: {
    padding: 20,
  },
  button: {
    marginTop: 10,
  },
}); 