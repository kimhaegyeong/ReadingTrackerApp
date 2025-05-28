import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Text, TextInput, Button } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateReadingGoals } from '@/store/slices/statsSlice';

export const ReadingGoalsScreen = () => {
  const dispatch = useAppDispatch();
  const stats = useAppSelector((state) => state.stats);
  const [yearlyGoal, setYearlyGoal] = useState(stats.yearlyGoal.toString());
  const [monthlyGoal, setMonthlyGoal] = useState(stats.monthlyGoal.toString());
  const [weeklyGoal, setWeeklyGoal] = useState(stats.weeklyGoal.toString());

  const handleSaveGoals = () => {
    dispatch(
      updateReadingGoals({
        yearlyGoal: parseInt(yearlyGoal) || 0,
        monthlyGoal: parseInt(monthlyGoal) || 0,
        weeklyGoal: parseInt(weeklyGoal) || 0,
      })
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>독서 목표 설정</Title>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>연간 목표 (권)</Text>
            <TextInput
              value={yearlyGoal}
              onChangeText={setYearlyGoal}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>월간 목표 (권)</Text>
            <TextInput
              value={monthlyGoal}
              onChangeText={setMonthlyGoal}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>주간 목표 (권)</Text>
            <TextInput
              value={weeklyGoal}
              onChangeText={setWeeklyGoal}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
          <Button mode="contained" onPress={handleSaveGoals} style={styles.button}>
            목표 저장
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>현재 진행 상황</Title>
          <View style={styles.progressContainer}>
            <View style={styles.progressItem}>
              <Text style={styles.progressLabel}>연간 목표</Text>
              <Text style={styles.progressValue}>
                {stats.booksReadThisYear} / {stats.yearlyGoal}권
              </Text>
            </View>
            <View style={styles.progressItem}>
              <Text style={styles.progressLabel}>월간 목표</Text>
              <Text style={styles.progressValue}>
                {stats.booksReadThisMonth} / {stats.monthlyGoal}권
              </Text>
            </View>
            <View style={styles.progressItem}>
              <Text style={styles.progressLabel}>주간 목표</Text>
              <Text style={styles.progressValue}>
                {stats.booksReadThisWeek} / {stats.weeklyGoal}권
              </Text>
            </View>
          </View>
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
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'transparent',
  },
  button: {
    marginTop: 8,
  },
  progressContainer: {
    marginTop: 16,
  },
  progressItem: {
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 16,
    marginBottom: 4,
  },
  progressValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 