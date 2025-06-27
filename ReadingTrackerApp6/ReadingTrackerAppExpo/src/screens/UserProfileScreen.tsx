import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Feather, MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { DatabaseService, UserProfile } from '../DatabaseService';

// 커스텀 카드
const CustomCard = ({ children, style }: any) => {
  const wrappedChildren = React.Children.map(children, (child) => {
    if (typeof child === 'string' && child.trim() !== '') {
      return <Text>{child}</Text>;
    }
    if (typeof child === 'string') {
      // 공백/줄바꿈은 무시
      return null;
    }
    return child;
  });
  return <View style={[styles.card, { backgroundColor: '#fff', padding: 16 }, style]}>{wrappedChildren}</View>;
};

// 커스텀 카드 타이틀
const CustomCardTitle = ({ title, left }: any) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
    {left && left()}
    <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#222', marginLeft: 4 }}>{title}</Text>
  </View>
);

const UserProfileScreen = ({ navigation }: any) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<{ name: string; bio: string; email: string }>({ name: '', bio: '', email: '' });
  // DB 기반 상태 (컴포넌트 내부에서 선언)
  const [userStats, setUserStats] = useState({ totalMinutes: 0, totalPages: 0 });

  useEffect(() => {
    const fetchProfile = async () => {
      const db = await DatabaseService.getInstance();
      const user = await db.getUserProfile();
      setProfile(user);
      setForm({ name: user.name, bio: user.bio || '', email: user.email || '' });
      // 통계 fetch
      const stats = await db.getTotalStats();
      setUserStats(stats);
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    const db = await DatabaseService.getInstance();
    await db.updateUserProfile({ name: form.name, bio: form.bio, email: form.email });
    setEditMode(false);
    const user = await db.getUserProfile();
    setProfile(user);
    Alert.alert('성공', '프로필이 저장되었습니다!');
  };

  if (!profile) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
        {/* 프로필 헤더 */}
        <CustomCard style={styles.profileCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.avatarWrap}>
              <MaterialIcons name="menu-book" size={40} color="#fff" />
            </View>
            <View style={{ marginLeft: 16, flex: 1 }}>
              {editMode ? (
                <TextInput
                  style={[styles.profileName, { backgroundColor: '#f3f4f6', borderRadius: 8, paddingHorizontal: 8 }]}
                  value={form.name}
                  onChangeText={v => setForm(f => ({ ...f, name: v }))}
                  placeholder="이름"
                />
              ) : (
                <Text style={styles.profileName}>{profile.name}</Text>
              )}
              {editMode ? (
                <TextInput
                  style={[styles.profileDesc, { backgroundColor: '#f3f4f6', borderRadius: 8, paddingHorizontal: 8, marginTop: 4 }]}
                  value={form.bio}
                  onChangeText={v => setForm(f => ({ ...f, bio: v }))}
                  placeholder="소개"
                />
              ) : (
                <Text style={styles.profileDesc}>{profile.bio || '지식과 함께 성장하는 중'}</Text>
              )}
              {/* 연속 기록(추후 확장 가능) */}
            </View>
          </View>
          <View style={{ marginTop: 12 }}>
            <Text style={{ color: '#607d8b', fontSize: 13 }}>이메일</Text>
            {editMode ? (
              <TextInput
                style={[styles.profileDesc, { backgroundColor: '#f3f4f6', borderRadius: 8, paddingHorizontal: 8, marginTop: 2 }]}
                value={form.email}
                onChangeText={v => setForm(f => ({ ...f, email: v }))}
                placeholder="이메일"
                keyboardType="email-address"
              />
            ) : (
              <Text style={styles.profileDesc}>{profile.email || '-'}</Text>
            )}
          </View>
          <View style={{ flexDirection: 'row', marginTop: 12 }}>
            {editMode ? (
              <>
                <TouchableOpacity onPress={handleSave} style={{ backgroundColor: '#1976d2', borderRadius: 8, padding: 8, marginRight: 8 }}>
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>저장</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setEditMode(false); setForm({ name: profile.name, bio: profile.bio || '', email: profile.email || '' }); }} style={{ backgroundColor: '#e5e7eb', borderRadius: 8, padding: 8 }}>
                  <Text style={{ color: '#222' }}>취소</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity onPress={() => setEditMode(true)} style={{ backgroundColor: '#e5e7eb', borderRadius: 8, padding: 8 }}>
                <Text style={{ color: '#222' }}>프로필 수정</Text>
              </TouchableOpacity>
            )}
          </View>
        </CustomCard>
        {/* 총 독서 시간/페이지 */}
        <CustomCard>
          <CustomCardTitle title="누적 독서 통계" left={() => <Feather name="target" size={20} color="#1976d2" />} />
          <View style={styles.rowBetween}>
            <Text style={styles.goalValue}>{userStats.totalMinutes}분</Text>
            <Text style={styles.goalPercent}>{userStats.totalPages}페이지</Text>
          </View>
        </CustomCard>
        {/* 통계 그리드 (추가 통계 필요시 여기에 추가) */}
        {/* 독서 현황(추후 확장 가능) */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: { flex: 1, backgroundColor: '#f8fafc' },
  profileCard: { marginBottom: 18, borderRadius: 12, backgroundColor: 'linear-gradient(90deg, #1976d2 0%, #8B5CF6 100%)' },
  avatarWrap: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#8B5CF6', alignItems: 'center', justifyContent: 'center' },
  profileName: { fontSize: 20, fontWeight: 'bold', color: '#222' },
  profileDesc: { color: '#607d8b', fontSize: 13, marginTop: 2 },
  streakBadge: { backgroundColor: '#FFD600', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'flex-start', marginTop: 8 },
  streakText: { color: '#222', fontWeight: 'bold', fontSize: 13 },
  card: { marginBottom: 18, borderRadius: 12 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 8 },
  goalValue: { fontSize: 18, fontWeight: 'bold', color: '#1976d2' },
  goalPercent: { color: '#607d8b', fontSize: 13 },
  progressBarWrap: { height: 8, backgroundColor: '#e0e0e0', borderRadius: 4, marginTop: 8, overflow: 'hidden' },
  progressBar: { height: 8, backgroundColor: '#1976d2', borderRadius: 4 },
  goalDesc: { color: '#607d8b', fontSize: 13, marginTop: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 12 },
  statCard: { width: '48%', marginBottom: 12, borderRadius: 12 },
  statContent: { alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  statLabel: { color: '#607d8b', fontSize: 13 },
  statusLabel: { color: '#607d8b', fontSize: 15 },
  statusValue: { color: '#1976d2', fontWeight: 'bold', fontSize: 15 },
  achieveRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  achieveIcon: { fontSize: 22, marginRight: 8 },
  achieveTitle: { fontWeight: 'bold', color: '#222' },
  achieveDate: { color: '#607d8b', fontSize: 13 },
});

export default UserProfileScreen; 