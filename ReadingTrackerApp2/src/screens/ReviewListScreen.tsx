import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { RouteProp } from '@react-navigation/native';
import { HomeStackParamList } from '@/navigation/HomeStack';

type ReviewListScreenProps = {
  route: RouteProp<HomeStackParamList, 'ReviewList'>;
};

export const ReviewListScreen: React.FC<ReviewListScreenProps> = ({ route }) => {
  const { bookId } = route.params;

  return (
    <View style={styles.container}>
      <Text>리뷰 목록 화면</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
}); 