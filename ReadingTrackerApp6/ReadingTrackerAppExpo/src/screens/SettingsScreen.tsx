import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, SafeAreaView } from 'react-native';
import { Card, Button, Switch, Divider } from 'react-native-paper';
import { Feather, MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';

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
        <Card style={styles.card}>
          <Card.Title title="사용자 설정" left={props => <Feather name="user" size={20} color="#1976d2" />} />
          <Card.Content>
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
          </Card.Content>
        </Card>
        {/* 알림 설정 */}
        <Card style={styles.card}>
          <Card.Title title="알림 설정" left={props => <Ionicons name="notifications-outline" size={20} color="#43a047" />} />
          <Card.Content>
            <View style={styles.rowBetween}>
              <Text style={styles.label}>독서 알림</Text>
              <Switch value={settings.notifications} onValueChange={v => handleSettingChange('notifications', v)} />
            </View>
            <Text style={styles.desc}>일정한 시간에 독서 알림을 받습니다</Text>
          </Card.Content>
        </Card>
        {/* 테마 설정 */}
        <Card style={styles.card}>
          <Card.Title title="테마 설정" left={props => <MaterialIcons name="palette" size={20} color="#8B5CF6" />} />
          <Card.Content>
            <View style={styles.rowBetween}>
              <Text style={styles.label}>다크 모드</Text>
              <Switch value={settings.darkMode} onValueChange={v => handleSettingChange('darkMode', v)} />
            </View>
          </Card.Content>
        </Card>
        {/* 데이터 관리 */}
        <Card style={styles.card}>
          <Card.Title title="데이터 관리" left={props => <MaterialIcons name="storage" size={20} color="#F59E0B" />} />
          <Card.Content>
            <View style={styles.rowBetween}>
              <Text style={styles.label}>자동 백업</Text>
              <Switch value={settings.autoBackup} onValueChange={v => handleSettingChange('autoBackup', v)} />
            </View>
            <Divider style={{ marginVertical: 12 }} />
            <Button mode="outlined" icon="download" style={{ marginBottom: 8 }} disabled>
              데이터 백업 (미구현)
            </Button>
            <Button mode="outlined" icon="upload" style={{ marginBottom: 8 }} disabled>
              데이터 복원 (미구현)
            </Button>
            <Button mode="contained" icon="delete" color="#e53935" disabled>
              모든 데이터 삭제 (미구현)
            </Button>
          </Card.Content>
        </Card>
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
});

export default SettingsScreen; 