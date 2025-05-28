import React from 'react';
import { View, StyleSheet } from 'react-native';
import { List, Switch, Divider } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export const NotificationSettingsScreen = () => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings);

  const handleToggleDailyReminder = () => {
    // 일일 독서 알림 토글 로직
  };

  const handleToggleReadingGoals = () => {
    // 독서 목표 알림 토글 로직
  };

  const handleToggleBookmarks = () => {
    // 북마크 알림 토글 로직
  };

  return (
    <View style={styles.container}>
      <List.Section>
        <List.Subheader>알림 설정</List.Subheader>
        <List.Item
          title="일일 독서 알림"
          description="매일 독서 시간을 알려줍니다"
          left={props => <List.Icon {...props} icon="clock" />}
          right={() => (
            <Switch
              value={settings.dailyReminder}
              onValueChange={handleToggleDailyReminder}
            />
          )}
        />
        <Divider />
        <List.Item
          title="독서 목표 알림"
          description="독서 목표 달성 시 알려줍니다"
          left={props => <List.Icon {...props} icon="flag" />}
          right={() => (
            <Switch
              value={settings.readingGoals}
              onValueChange={handleToggleReadingGoals}
            />
          )}
        />
        <Divider />
        <List.Item
          title="북마크 알림"
          description="북마크 추가 시 알려줍니다"
          left={props => <List.Icon {...props} icon="bookmark" />}
          right={() => (
            <Switch
              value={settings.bookmarks}
              onValueChange={handleToggleBookmarks}
            />
          )}
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