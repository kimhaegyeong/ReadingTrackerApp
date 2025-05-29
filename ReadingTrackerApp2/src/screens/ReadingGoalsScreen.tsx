import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, ProgressBar, useTheme, TextInput, Portal, Dialog } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateReadingGoals } from '@/store/slices/statsSlice';

export const ReadingGoalsScreen = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const stats = useAppSelector((state) => state.stats);
  const books = useAppSelector((state) => state.books.books);

  const [isEditing, setIsEditing] = useState(false);
  const [yearlyGoal, setYearlyGoal] = useState(stats.yearlyGoal.toString());
  const [monthlyGoal, setMonthlyGoal] = useState(stats.monthlyGoal.toString());
  const [weeklyGoal, setWeeklyGoal] = useState(stats.weeklyGoal.toString());

  const completedBooks = books.filter(book => book.status === 'completed').length;
  const booksThisMonth = books.filter(book => {
    const endDate = new Date(book.endDate || '');
    const now = new Date();
    return book.status === 'completed' && 
           endDate.getMonth() === now.getMonth() && 
           endDate.getFullYear() === now.getFullYear();
  }).length;
  const booksThisWeek = books.filter(book => {
    const endDate = new Date(book.endDate || '');
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    return book.status === 'completed' && endDate >= weekStart;
  }).length;

  const yearlyProgress = (completedBooks / stats.yearlyGoal) * 100;
  const monthlyProgress = (booksThisMonth / stats.monthlyGoal) * 100;
  const weeklyProgress = (booksThisWeek / stats.weeklyGoal) * 100;

  const handleSaveGoals = () => {
    const newYearlyGoal = parseInt(yearlyGoal);
    const newMonthlyGoal = parseInt(monthlyGoal);
    const newWeeklyGoal = parseInt(weeklyGoal);

    if (isNaN(newYearlyGoal) || isNaN(newMonthlyGoal) || isNaN(newWeeklyGoal)) {
      Alert.alert('오류', '올바른 숫자를 입력해주세요.');
      return;
    }

    if (newYearlyGoal < 0 || newMonthlyGoal < 0 || newWeeklyGoal < 0) {
      Alert.alert('오류', '목표는 0보다 커야 합니다.');
      return;
    }

    dispatch(updateReadingGoals({
      yearlyGoal: newYearlyGoal,
      monthlyGoal: newMonthlyGoal,
      weeklyGoal: newWeeklyGoal,
    }));

    setIsEditing(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>연간 목표</Text>
          <Text style={styles.goalText}>
            {completedBooks} / {stats.yearlyGoal} 권
          </Text>
          <ProgressBar
            progress={yearlyProgress / 100}
            style={styles.progressBar}
            color={theme.colors.primary}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>월간 목표</Text>
          <Text style={styles.goalText}>
            {booksThisMonth} / {stats.monthlyGoal} 권
          </Text>
          <ProgressBar
            progress={monthlyProgress / 100}
            style={styles.progressBar}
            color={theme.colors.primary}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>주간 목표</Text>
          <Text style={styles.goalText}>
            {booksThisWeek} / {stats.weeklyGoal} 권
          </Text>
          <ProgressBar
            progress={weeklyProgress / 100}
            style={styles.progressBar}
            color={theme.colors.primary}
          />
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={() => setIsEditing(true)}
        style={styles.editButton}
      >
        목표 수정하기
      </Button>

      <Portal>
        <Dialog visible={isEditing} onDismiss={() => setIsEditing(false)}>
          <Dialog.Title>독서 목표 설정</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="연간 목표 (권)"
              value={yearlyGoal}
              onChangeText={setYearlyGoal}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              label="월간 목표 (권)"
              value={monthlyGoal}
              onChangeText={setMonthlyGoal}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              label="주간 목표 (권)"
              value={weeklyGoal}
              onChangeText={setWeeklyGoal}
              keyboardType="numeric"
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsEditing(false)}>취소</Button>
            <Button onPress={handleSaveGoals}>저장</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  goalText: {
    fontSize: 16,
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  editButton: {
    marginTop: 8,
  },
  input: {
    marginBottom: 16,
  },
}); 