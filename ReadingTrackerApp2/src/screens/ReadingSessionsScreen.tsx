import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Text } from 'react-native-paper';
import { useAppSelector } from '@/store/hooks';

export const ReadingSessionsScreen = () => {
  const stats = useAppSelector((state) => state.stats);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}시간 ${mins}분`;
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>독서 시간 통계</Title>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>총 독서 시간</Text>
              <Text style={styles.statValue}>
                {formatDuration(stats.totalReadingTime)}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>최근 독서 활동</Title>
          {stats.recentActivities.length > 0 ? (
            stats.recentActivities.map((activity) => (
              <View key={activity.id} style={styles.activityItem}>
                <Text style={styles.activityDescription}>
                  {activity.description}
                </Text>
                <Text style={styles.activityTime}>
                  {new Date(activity.timestamp).toLocaleString('ko-KR')}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noActivities}>아직 독서 활동이 없습니다.</Text>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  activityItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  activityDescription: {
    fontSize: 16,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
  },
  noActivities: {
    textAlign: 'center',
    color: '#666',
    marginTop: 16,
  },
}); 