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
  currentBookCard: {
    marginBottom: spacing.large,
  },
  currentBookContent: {
    flexDirection: 'row',
  },
  bookCover: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginRight: spacing.medium,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    ...typography.subheading,
    marginBottom: spacing.xsmall,
  },
  bookAuthor: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.small,
  },
  lastRead: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.medium,
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
  goalsContainer: {
    marginTop: spacing.medium,
  },
  goalItem: {
    marginBottom: spacing.medium,
  },
  goalLabel: {
    ...typography.body,
    marginBottom: spacing.xsmall,
  },
  goalProgress: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xsmall,
  },
  goalProgressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.background,
    color: colors.secondary,
  },
}); 