import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export const GuestBadge: React.FC = () => {
  const { user } = useAuth();

  if (!user || user.type !== 'guest') {
    return null;
  }

  return (
    <View style={styles.container}>
      <Ionicons name="person-outline" size={16} color="#666" />
      <Text style={styles.text}>비회원</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8
  },
  text: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4
  }
}); 