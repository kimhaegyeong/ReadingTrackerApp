import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { List, Switch, Button, Text } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/userSlice';
import { colors, spacing } from '@/theme';
import * as database from '@/services/database';

export const SettingsHomeScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.currentUser);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [dataSync, setDataSync] = useState(true);

  useEffect(() => {
    if (user) {
      // 사용자 설정 로드
      loadUserSettings();
    }
  }, [user]);

  const loadUserSettings = async () => {
    if (!user) return;
    
    try {
      const userData = await database.loadUserData(user.id);
      if (userData) {
        setDarkMode(userData.settings?.darkMode || false);
        setNotifications(userData.settings?.notifications || true);
        setDataSync(userData.settings?.dataSync || true);
      }
    } catch (error) {
      console.error('사용자 설정 로드 중 오류:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃 하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel'
        },
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: () => {
            dispatch(logout());
          }
        }
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      '데이터 초기화',
      '모든 데이터가 삭제됩니다. 계속하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel'
        },
        {
          text: '초기화',
          style: 'destructive',
          onPress: async () => {
            try {
              await database.clearAllData();
              Alert.alert('성공', '모든 데이터가 초기화되었습니다.');
            } catch (error) {
              console.error('데이터 초기화 중 오류:', error);
              Alert.alert('오류', '데이터 초기화 중 문제가 발생했습니다.');
            }
          }
        }
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>로그인이 필요합니다.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <List.Section>
        <List.Subheader>앱 설정</List.Subheader>
        <List.Item
          title="다크 모드"
          right={() => (
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
            />
          )}
        />
        <List.Item
          title="알림"
          right={() => (
            <Switch
              value={notifications}
              onValueChange={setNotifications}
            />
          )}
        />
        <List.Item
          title="데이터 동기화"
          right={() => (
            <Switch
              value={dataSync}
              onValueChange={setDataSync}
            />
          )}
        />
      </List.Section>

      <List.Section>
        <List.Subheader>데이터 관리</List.Subheader>
        <List.Item
          title="데이터 초기화"
          onPress={handleClearData}
          right={props => <List.Icon {...props} icon="delete" />}
        />
      </List.Section>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          로그아웃
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  buttonContainer: {
    padding: spacing.medium,
  },
  logoutButton: {
    backgroundColor: colors.error,
  },
}); 