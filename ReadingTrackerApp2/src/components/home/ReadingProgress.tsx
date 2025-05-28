import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, ProgressBar } from 'react-native-paper';
import { colors, spacing, typography } from '@/theme';

interface Book {
  id: string;
  title: string;
  authors: string[];
  imageLinks?: {
    thumbnail?: string;
  };
}

export interface ReadingProgressProps {
  book?: Book;
  progress?: number;
  lastReadAt?: string;
}

export const ReadingProgress: React.FC<ReadingProgressProps> = ({
  book,
  progress = 0,
  lastReadAt,
}) => {
  if (!book) {
    return (
      <Card style={styles.container}>
        <Card.Content>
          <Text style={styles.emptyText}>현재 읽고 있는 책이 없습니다.</Text>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card style={styles.container}>
      <Card.Content>
        <Text style={styles.title}>현재 읽고 있는 책</Text>
        <Text style={styles.bookTitle}>{book.title}</Text>
        <Text style={styles.author}>{book.authors?.join(', ')}</Text>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>독서 진행률</Text>
          <ProgressBar
            progress={progress}
            color={colors.primary}
            style={styles.progressBar}
          />
          <Text style={styles.progressPercentage}>
            {Math.round(progress * 100)}%
          </Text>
        </View>
        {lastReadAt && (
          <Text style={styles.lastRead}>
            마지막 독서: {new Date(lastReadAt).toLocaleDateString()}
          </Text>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: spacing.medium,
    backgroundColor: colors.surface,
  },
  title: {
    ...typography.heading,
    color: colors.text,
    marginBottom: spacing.small,
  },
  bookTitle: {
    ...typography.subheading,
    color: colors.text,
    marginBottom: spacing.xsmall,
  },
  author: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.medium,
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
  lastRead: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.medium,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
}); 