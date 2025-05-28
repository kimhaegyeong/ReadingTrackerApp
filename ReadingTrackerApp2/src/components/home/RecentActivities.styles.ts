import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    padding: spacing.medium,
    backgroundColor: colors.surface,
    marginTop: spacing.small,
  },
  sectionTitle: {
    ...typography.heading,
    marginBottom: spacing.medium,
  },
  activityCard: {
    marginBottom: spacing.small,
    elevation: 2,
  },
  activityContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    margin: 0,
    marginRight: spacing.small,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    ...typography.subheading,
    color: colors.primary,
    marginBottom: spacing.xsmall,
  },
  bookTitle: {
    ...typography.body,
    marginBottom: spacing.xsmall,
  },
  activityDetails: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xsmall,
  },
  timestamp: {
    ...typography.caption,
    color: colors.textSecondary,
  },
}); 