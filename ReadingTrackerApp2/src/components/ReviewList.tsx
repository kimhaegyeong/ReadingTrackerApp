import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, IconButton, Menu } from 'react-native-paper';
import { colors, spacing } from '@/theme';
import { Rating } from './Rating';

interface Review {
  id: string;
  rating: number;
  text: string;
  timestamp: number;
  userId: string;
  userName: string;
}

interface ReviewListProps {
  reviews: Review[];
  onDeleteReview: (id: string) => void;
  onEditReview: (review: Review) => void;
  currentUserId?: string;
}

export const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  onDeleteReview,
  onEditReview,
  currentUserId,
}) => {
  const [menuVisible, setMenuVisible] = React.useState<string | null>(null);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      {reviews.map((review) => (
        <Card key={review.id} style={styles.reviewCard}>
          <Card.Content>
            <View style={styles.reviewHeader}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{review.userName}</Text>
                <Text style={styles.date}>{formatDate(review.timestamp)}</Text>
              </View>
              {currentUserId === review.userId && (
                <Menu
                  visible={menuVisible === review.id}
                  onDismiss={() => setMenuVisible(null)}
                  anchor={
                    <IconButton
                      icon="dots-vertical"
                      onPress={() => setMenuVisible(review.id)}
                    />
                  }
                >
                  <Menu.Item
                    onPress={() => {
                      onEditReview(review);
                      setMenuVisible(null);
                    }}
                    title="수정"
                    leadingIcon="pencil"
                  />
                  <Menu.Item
                    onPress={() => {
                      onDeleteReview(review.id);
                      setMenuVisible(null);
                    }}
                    title="삭제"
                    leadingIcon="delete"
                  />
                </Menu>
              )}
            </View>
            <Rating
              value={review.rating}
              readonly
              style={styles.rating}
            />
            <Text style={styles.reviewText}>{review.text}</Text>
          </Card.Content>
        </Card>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  reviewCard: {
    marginBottom: spacing.medium,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.small,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  rating: {
    marginBottom: spacing.small,
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
  },
}); 