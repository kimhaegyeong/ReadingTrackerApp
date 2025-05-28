import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { colors, spacing, typography } from '@/theme';

export interface UserProfileProps {
  profileImage?: string;
  nickname?: string;
  readingGoalProgress?: number;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  profileImage,
  nickname = '사용자',
  readingGoalProgress = 0,
}) => {
  return (
    <View style={styles.container}>
      <Image
        source={profileImage ? { uri: profileImage } : require('../../assets/images/default-profile.png')}
        style={styles.profileImage}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.nickname}>{nickname}</Text>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>독서 목표 진행률</Text>
          <ProgressBar
            progress={readingGoalProgress}
            color={colors.primary}
            style={styles.progressBar}
          />
          <Text style={styles.progressPercentage}>
            {Math.round(readingGoalProgress * 100)}%
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: spacing.medium,
    backgroundColor: colors.surface,
    borderRadius: 8,
    margin: spacing.medium,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: spacing.medium,
  },
  infoContainer: {
    flex: 1,
  },
  nickname: {
    ...typography.heading,
    color: colors.text,
    marginBottom: spacing.small,
  },
  progressContainer: {
    marginTop: spacing.small,
  },
  progressText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xsmall,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  progressPercentage: {
    ...typography.caption,
    color: colors.primary,
    textAlign: 'right',
    marginTop: spacing.xsmall,
  },
}); 