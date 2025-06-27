import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { DatabaseService, UserProfile } from '../DatabaseService';

// 공통 카드 컴포넌트 (통일된 스타일)
const CustomCard = ({ children, style }: any) => {
  const wrappedChildren = React.Children.map(children, (child) => {
    if (typeof child === 'string' && child.trim() !== '') {
      return <Text>{child}</Text>;
    }
    if (typeof child === 'string') {
      return null;
    }
    return child;
  });
  return <View style={[styles.card, style]}>{wrappedChildren}</View>;
};

const UserProfileScreen = ({ navigation }: any) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<{ name: string; bio: string; email: string }>({ name: '', bio: '', email: '' });
  const [userStats, setUserStats] = useState({ totalMinutes: 0, totalPages: 0 });

  useEffect(() => {
    const fetchProfile = async () => {
      const db = await DatabaseService.getInstance();
      const user = await db.getUserProfile();
      setProfile(user);
      setForm({ name: user.name, bio: user.bio || '', email: user.email || '' });
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
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <MaterialIcons name="menu-book" size={28} color="#2563eb" />
          <Text style={styles.headerTitle}>내 프로필</Text>
        </View>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* 프로필 카드 */}
        <CustomCard style={styles.profileCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.avatarWrap}>
              <MaterialIcons name="person" size={40} color="#fff" />
            </View>
            <View style={{ marginLeft: 20, flex: 1 }}>
              {editMode ? (
                <TextInput
                  style={[styles.profileName, styles.input]}
                  value={form.name}
                  onChangeText={v => setForm(f => ({ ...f, name: v }))}
                  placeholder="이름"
                  placeholderTextColor="#b0b8c1"
                />
              ) : (
                <Text style={styles.profileName}>{profile.name}</Text>
              )}
              {editMode ? (
                <TextInput
                  style={[styles.profileDesc, styles.input, { marginTop: 6 }]}
                  value={form.bio}
                  onChangeText={v => setForm(f => ({ ...f, bio: v }))}
                  placeholder="소개"
                  placeholderTextColor="#b0b8c1"
                />
              ) : (
                <Text style={styles.profileDesc}>{profile.bio || '지식과 함께 성장하는 중'}</Text>
              )}
            </View>
          </View>
          <View style={{ marginTop: 18 }}>
            <Text style={styles.label}>이메일</Text>
            {editMode ? (
              <TextInput
                style={[styles.profileDesc, styles.input, { marginTop: 2 }]}
                value={form.email}
                onChangeText={v => setForm(f => ({ ...f, email: v }))}
                placeholder="이메일"
                placeholderTextColor="#b0b8c1"
                keyboardType="email-address"
              />
            ) : (
              <Text style={styles.profileDesc}>{profile.email || '-'}</Text>
            )}
          </View>
          <View style={{ flexDirection: 'row', marginTop: 18 }}>
            {editMode ? (
              <>
                <TouchableOpacity onPress={handleSave} style={[styles.button, styles.buttonPrimary, { marginRight: 8 }]}>
                  <Text style={styles.buttonText}>저장</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setEditMode(false); setForm({ name: profile.name, bio: profile.bio || '', email: profile.email || '' }); }} style={[styles.button, styles.buttonOutline]}>
                  <Text style={[styles.buttonText, { color: '#2563eb' }]}>취소</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity onPress={() => setEditMode(true)} style={[styles.button, styles.buttonOutline]}>
                <Text style={[styles.buttonText, { color: '#2563eb' }]}>프로필 수정</Text>
              </TouchableOpacity>
            )}
          </View>
        </CustomCard>
        {/* 누적 통계 카드 */}
        <CustomCard>
          <View style={styles.cardTitleRow}>
            <Feather name="target" size={20} color="#1976d2" style={{ marginRight: 8 }} />
            <Text style={styles.cardTitle}>누적 독서 통계</Text>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.totalMinutes}</Text>
              <Text style={styles.statLabel}>분</Text>
              </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.totalPages}</Text>
              <Text style={styles.statLabel}>페이지</Text>
            </View>
          </View>
        </CustomCard>
      </ScrollView>
    </SafeAreaView>
  );
};

// 스타일 통일: 카드, 헤더, 버튼, 폰트, 여백 등
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  profileCard: {
    flexDirection: 'column',
    marginBottom: 20,
  },
  avatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  profileDesc: {
    color: '#607d8b',
    fontSize: 14,
    marginTop: 2,
  },
  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    color: '#222',
    marginBottom: 2,
  },
  label: {
    color: '#607d8b',
    fontSize: 13,
    marginBottom: 2,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#2563eb',
  },
  buttonOutline: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#2563eb',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#fff',
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(243,244,246,0.7)',
    padding: 16,
    borderRadius: 10,
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
});

export default UserProfileScreen; 