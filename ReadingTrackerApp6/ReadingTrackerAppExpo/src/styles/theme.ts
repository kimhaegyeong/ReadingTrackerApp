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
  xxl: 48,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: 'bold' as const },
  h2: { fontSize: 22, fontWeight: 'bold' as const },
  h3: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 15, color: colors.textPrimary },
  caption: { fontSize: 12, color: colors.textMuted },
  button: { fontSize: 16, fontWeight: '600' as const },
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
    borderRadius: 10,
    marginBottom: spacing.md,
    padding: spacing.md,
    // elevation, border, 그림자 제거
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
    borderRadius: 8,
    padding: 4,
    marginHorizontal: spacing.md,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center' as const,
    borderRadius: 6,
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