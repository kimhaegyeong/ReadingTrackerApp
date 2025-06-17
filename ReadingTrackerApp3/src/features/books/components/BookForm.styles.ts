import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../../../src/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: spacing.md,
  },
  form: {
    flex: 1,
  },
  coverImageContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  coverImageWrapper: {
    position: 'relative',
    width: 150,
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.lightGray,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 2,
  },
  uploadButton: {
    width: 150,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: 8,
    backgroundColor: colors.lightGray,
  },
  uploadButtonText: {
    marginTop: spacing.sm,
    color: colors.primary,
    fontWeight: '500',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  column: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: colors.text,
    marginBottom: spacing.xs,
    fontWeight: '500',
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  ratingContainer: {
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 200,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  starButton: {
    padding: spacing.xs,
  },
  // Status selection styles
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    borderRadius: 8,
    backgroundColor: colors.lightGray,
    padding: 4,
    marginBottom: spacing.lg,
  },
  statusButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginHorizontal: 2,
  },
  statusButtonActive: {
    backgroundColor: colors.primary,
  },
  statusButtonText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 6,
    fontWeight: '500',
  },
  statusButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  statusIcon: {
    marginRight: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginTop: 4,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 50,
    color: colors.text,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: spacing.md,
  },
  progressContainer: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.lightGray,
    borderRadius: 4,
    marginTop: spacing.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.lg,
  },
  submitButton: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  cancelButton: {
    flex: 1,
    marginRight: spacing.sm,
  },
  submitButtonNoCancel: {
    marginTop: spacing.md,
  },
  inputText: {
    color: colors.text,
    fontSize: 16,
  },
  placeholderText: {
    color: colors.mediumGray,
    fontSize: 16,
  },
});
