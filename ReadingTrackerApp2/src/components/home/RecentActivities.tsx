import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import { styles } from './RecentActivities.styles';

interface Activity {
  id: string;
  type: 'reading' | 'bookmark' | 'review';
  bookTitle: string;
  timestamp: string;
  details?: string;
}

interface RecentActivitiesProps {
  activities: Activity[];
  onActivityPress: (activity: Activity) => void;
}

export const RecentActivities: React.FC<RecentActivitiesProps> = ({
  activities,
  onActivityPress,
}) => {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'reading':
        return 'book-open-variant';
      case 'bookmark':
        return 'bookmark';
      case 'review':
        return 'star';
      default:
        return 'information';
    }
  };

  const getActivityTitle = (type: Activity['type']) => {
    switch (type) {
      case 'reading':
        return '독서 진행';
      case 'bookmark':
        return '북마크 추가';
      case 'review':
        return '리뷰 작성';
      default:
        return '활동';
    }
  };

  const renderActivity = ({ item }: { item: Activity }) => (
    <Card style={styles.activityCard} onPress={() => onActivityPress(item)}>
      <Card.Content style={styles.activityContent}>
        <IconButton
          icon={getActivityIcon(item.type)}
          size={24}
          style={styles.activityIcon}
        />
        <View style={styles.activityInfo}>
          <Text style={styles.activityTitle}>{getActivityTitle(item.type)}</Text>
          <Text style={styles.bookTitle}>{item.bookTitle}</Text>
          {item.details && (
            <Text style={styles.activityDetails}>{item.details}</Text>
          )}
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>최근 활동</Text>
      <FlatList
        data={activities}
        renderItem={renderActivity}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}; 