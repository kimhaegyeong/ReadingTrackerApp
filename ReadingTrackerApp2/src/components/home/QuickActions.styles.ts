import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.medium,
    backgroundColor: colors.surface,
    marginTop: spacing.small,
  },
  button: {
    flex: 1,
    marginHorizontal: spacing.xsmall,
  },
}); 