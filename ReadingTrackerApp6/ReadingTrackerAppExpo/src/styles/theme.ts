// 심플&미니멀 디자인 시스템 테마 정의
export const colors = {
  primary: '#2563eb',
  background: '#f8fafc',
  surface: '#ffffff',
  textPrimary: '#222',
  textSecondary: '#64748b',
  textMuted: '#b0b8c1',
  border: '#e5e7eb',
  divider: '#f1f5f9',
  success: '#22c55e',
  warning: '#eab308',
  error: '#ef4444',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 16,
};

export const typography = {
  body: { fontSize: 16, fontWeight: '400' },
  button: { fontSize: 16, fontWeight: '600' },
  title: { fontSize: 20, fontWeight: 'bold' },
};

export const iconSizes = {
  small: 16,
  medium: 20,
  large: 24,
  xlarge: 32,
};

export const commonStyles = {
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingTop: 48,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },
  tabContainer: {
    flexDirection: 'row' as const,
    backgroundColor: colors.divider,
    borderRadius: borderRadius.sm,
    padding: spacing.xs,
    marginHorizontal: spacing.md,
  },
  tabButton: {
    flex: 1,
    paddingVertical: spacing.sm * 1.5,
    alignItems: 'center' as const,
    borderRadius: borderRadius.sm,
  },
  activeTabButton: {
    backgroundColor: colors.surface,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
};

export const chartConfig = {
  backgroundColor: colors.surface,
  backgroundGradientFrom: colors.background,
  backgroundGradientTo: colors.background,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
  style: { borderRadius: 8 },
  propsForBackgroundLines: { stroke: colors.border }
};

export const buttonStyles = {
  primary: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  outline: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  text: {
    backgroundColor: 'transparent',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
};

export const inputStyles = {
  base: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.body.fontSize,
    color: colors.textPrimary,
  },
  error: {
    borderColor: colors.error,
  },
}; 