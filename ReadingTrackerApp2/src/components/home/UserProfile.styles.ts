import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    padding: spacing.medium,
    backgroundColor: colors.surface,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: spacing.medium,
  },
  infoContainer: {
    flex: 1,
  },
  nickname: {
    ...typography.heading,
    marginBottom: spacing.small,
  },
  goalText: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xsmall,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.background,
    color: colors.primary,
  },
  progressText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xsmall,
    textAlign: 'right',
  },
}); 