import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, SafeAreaView } from 'react-native';
import { Button } from 'react-native-elements';
import { Feather, MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { Switch } from 'react-native';

const SettingsScreen = ({ navigation }: any) => {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    autoBackup: true,
    readingGoal: '24',
    userName: '독서러버'
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleLogout = () => {
    alert('로그아웃 되었습니다.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
        {/* Header */}
        <View style={styles.header}>
          <Button mode="text" onPress={() => navigation.goBack && navigation.goBack()} compact>
            <Feather name="arrow-left" size={20} color="#222" />
          </Button>
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.headerTitle}>설정</Text>
            <Text style={styles.headerSub}>앱 설정을 관리하세요</Text>
          </View>
        </View>
        {/* 사용자 설정 */}
        <View style={styles.card}>
          <Text style={styles.label}>사용자 이름</Text>
          <TextInput
            style={styles.input}
            value={settings.userName}
            onChangeText={v => handleSettingChange('userName', v)}
            placeholder="이름 입력"
          />
          <Text style={[styles.label, { marginTop: 16 }]}>연간 독서 목표(권)</Text>
          <TextInput
            style={styles.input}
            value={settings.readingGoal}
            onChangeText={v => handleSettingChange('readingGoal', v)}
            placeholder="24"
            keyboardType="numeric"
          />
        </View>
        {/* 알림 설정 */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>독서 알림</Text>
            <Switch value={settings.notifications} onValueChange={v => handleSettingChange('notifications', v)} />
          </View>
          <Text style={styles.desc}>일정한 시간에 독서 알림을 받습니다</Text>
        </View>
        {/* 테마 설정 */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>다크 모드</Text>
            <Switch value={settings.darkMode} onValueChange={v => handleSettingChange('darkMode', v)} />
          </View>
        </View>
        {/* 데이터 관리 */}
        <View style={styles.card}>
          <Text style={styles.label}>자동 백업</Text>
          <Switch value={settings.autoBackup} onValueChange={v => handleSettingChange('autoBackup', v)} />
        </View>
        <View style={styles.divider} />
        <Button
          title="데이터 백업 (미구현)"
          disabled
          buttonStyle={{ marginBottom: 8, backgroundColor: '#e0e0e0' }}
        />
        <Button
          title="데이터 복원 (미구현)"
          disabled
          buttonStyle={{ marginBottom: 8, backgroundColor: '#e0e0e0' }}
        />
        <Button
          title="로그아웃"
          onPress={handleLogout}
          buttonStyle={styles.logoutButton}
          icon={<Feather name="log-out" size={18} color="#fff" />}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#222' },
  headerSub: { fontSize: 13, color: '#607d8b', marginTop: 2 },
  card: { marginBottom: 18, borderRadius: 12 },
  label: { fontSize: 15, color: '#222', marginBottom: 4 },
  input: { backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#e0e0e0', paddingHorizontal: 12, paddingVertical: 8, fontSize: 16, marginBottom: 4 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 8 },
  desc: { color: '#607d8b', fontSize: 13, marginTop: 2 },
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  logoutButton: {
    backgroundColor: '#e53935',
    borderRadius: 8,
    padding: 12,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 8 },
});

export default SettingsScreen; 