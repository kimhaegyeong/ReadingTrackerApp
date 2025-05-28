import React from 'react';
import { View, StyleSheet } from 'react-native';
import { List, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SettingsStackParamList } from '@/navigation/SettingsStack';

type SettingsScreenNavigationProp = NativeStackNavigationProp<SettingsStackParamList, 'Settings'>;

export const SettingsScreen = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <List.Section>
        <List.Subheader>계정</List.Subheader>
        <List.Item
          title="프로필"
          left={props => <List.Icon {...props} icon="account" />}
          onPress={() => navigation.navigate('Profile')}
        />
        <Divider />
        <List.Item
          title="알림 설정"
          left={props => <List.Icon {...props} icon="bell" />}
          onPress={() => navigation.navigate('NotificationSettings')}
        />
      </List.Section>

      <List.Section>
        <List.Subheader>앱 정보</List.Subheader>
        <List.Item
          title="앱 정보"
          left={props => <List.Icon {...props} icon="information" />}
          onPress={() => navigation.navigate('About')}
        />
        <Divider />
        <List.Item
          title="버전"
          description="1.0.0"
          left={props => <List.Icon {...props} icon="tag" />}
        />
      </List.Section>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
}); 