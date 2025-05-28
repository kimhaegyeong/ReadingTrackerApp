import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    padding: spacing.medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.medium,
  },
  sectionTitle: {
    ...typography.heading,
    color: colors.text,
  },
  viewAllButton: {
    marginLeft: spacing.medium,
  },
  scrollContent: {
    paddingRight: spacing.medium,
  },
  bookCard: {
    width: 200,
    marginRight: spacing.medium,
    backgroundColor: colors.card,
  },
  bookCover: {
    width: '100%',
    height: 300,
    backgroundColor: colors.background,
  },
  bookInfo: {
    padding: spacing.small,
  },
  bookTitle: {
    ...typography.subtitle,
    color: colors.text,
    marginBottom: spacing.xsmall,
  },
  bookAuthor: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xsmall,
  },
  bookDescription: {
    ...typography.caption,
    color: colors.textSecondary,
  },
}); 