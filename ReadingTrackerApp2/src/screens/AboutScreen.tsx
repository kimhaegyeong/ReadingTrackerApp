import React from 'react';
import { View, StyleSheet } from 'react-native';
import { List, Text, IconButton, useTheme } from 'react-native-paper';

export const AboutScreen = () => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="book-open-variant"
          size={80}
          iconColor={theme.colors.primary}
          style={styles.appIcon}
        />
        <Text style={styles.appName}>독서 기록</Text>
        <Text style={styles.version}>버전 1.0.0</Text>
      </View>

      <List.Section>
        <List.Subheader>앱 정보</List.Subheader>
        <List.Item
          title="개발자"
          description="Your Name"
          left={props => <List.Icon {...props} icon="account" />}
        />
        <List.Item
          title="이메일"
          description="your.email@example.com"
          left={props => <List.Icon {...props} icon="email" />}
        />
        <List.Item
          title="웹사이트"
          description="https://example.com"
          left={props => <List.Icon {...props} icon="web" />}
        />
      </List.Section>

      <List.Section>
        <List.Subheader>법적 정보</List.Subheader>
        <List.Item
          title="개인정보 처리방침"
          left={props => <List.Icon {...props} icon="shield-account" />}
          onPress={() => {}}
        />
        <List.Item
          title="이용약관"
          left={props => <List.Icon {...props} icon="file-document" />}
          onPress={() => {}}
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
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  appIcon: {
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  version: {
    fontSize: 16,
    color: '#666',
  },
}); 