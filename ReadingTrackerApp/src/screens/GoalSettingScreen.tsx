import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  useColorScheme,
  ActivityIndicator,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { saveReadingGoal, getCurrentReadingGoal, updateReadingGoal, ReadingGoal } from '../database/goalOperations';
import { MaterialIcons } from '@expo/vector-icons';

export default function GoalSettingScreen() {
  const [yearlyBooks, setYearlyBooks] = useState('');
  const [monthlyBooks, setMonthlyBooks] = useState('');
  const [yearlyPages, setYearlyPages] = useState('');
  const [monthlyPages, setMonthlyPages] = useState('');
  const [currentGoal, setCurrentGoal] = useState<ReadingGoal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  useEffect(() => {
    loadCurrentGoal();
  }, []);

  const loadCurrentGoal = async () => {
    try {
      setIsLoading(true);
      const goal = await getCurrentReadingGoal();
      if (goal) {
        setCurrentGoal(goal);
        setYearlyBooks(goal.yearly_books.toString());
        setMonthlyBooks(goal.monthly_books.toString());
        setYearlyPages(goal.yearly_pages.toString());
        setMonthlyPages(goal.monthly_pages.toString());
      }
    } catch (error) {
      console.error('목표 로딩 중 오류 발생:', error);
      Alert.alert('오류', '목표를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateInputs = (): boolean => {
    const yearlyBooksNum = parseInt(yearlyBooks);
    const monthlyBooksNum = parseInt(monthlyBooks);
    const yearlyPagesNum = parseInt(yearlyPages);
    const monthlyPagesNum = parseInt(monthlyPages);

    if (isNaN(yearlyBooksNum) || yearlyBooksNum < 0) {
      Alert.alert('입력 오류', '연간 책 목표는 0 이상의 숫자여야 합니다.');
      return false;
    }

    if (isNaN(monthlyBooksNum) || monthlyBooksNum < 0) {
      Alert.alert('입력 오류', '월간 책 목표는 0 이상의 숫자여야 합니다.');
      return false;
    }

    if (isNaN(yearlyPagesNum) || yearlyPagesNum < 0) {
      Alert.alert('입력 오류', '연간 페이지 목표는 0 이상의 숫자여야 합니다.');
      return false;
    }

    if (isNaN(monthlyPagesNum) || monthlyPagesNum < 0) {
      Alert.alert('입력 오류', '월간 페이지 목표는 0 이상의 숫자여야 합니다.');
      return false;
    }

    // 월간 목표가 연간 목표보다 클 수 없음
    if (monthlyBooksNum * 12 > yearlyBooksNum) {
      Alert.alert('입력 오류', '월간 책 목표의 12배가 연간 책 목표보다 클 수 없습니다.');
      return false;
    }

    if (monthlyPagesNum * 12 > yearlyPagesNum) {
      Alert.alert('입력 오류', '월간 페이지 목표의 12배가 연간 페이지 목표보다 클 수 없습니다.');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateInputs()) {
      return;
    }

    try {
      setIsSaving(true);
      Keyboard.dismiss();

      const startDate = new Date().toISOString().split('T')[0];
      const endDate = new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0];

      const goal: ReadingGoal = {
        yearly_books: parseInt(yearlyBooks),
        monthly_books: parseInt(monthlyBooks),
        yearly_pages: parseInt(yearlyPages),
        monthly_pages: parseInt(monthlyPages),
        start_date: startDate,
        end_date: endDate
      };

      if (currentGoal) {
        await updateReadingGoal({ ...goal, id: currentGoal.id });
        Alert.alert('성공', '목표가 업데이트되었습니다.');
      } else {
        await saveReadingGoal(goal);
        Alert.alert('성공', '목표가 저장되었습니다.');
      }
    } catch (error) {
      console.error('목표 저장 중 오류 발생:', error);
      Alert.alert('오류', '목표를 저장하는 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderInputField = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    keyboardType: 'number-pad' | 'numeric' = 'number-pad'
  ) => (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, isDarkMode && styles.darkText]}>{label}</Text>
      <View style={[styles.inputWrapper, isDarkMode && styles.darkInputWrapper]}>
        <TextInput
          style={[styles.input, isDarkMode && styles.darkInput]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={isDarkMode ? "#aaa" : "#999"}
          keyboardType={keyboardType}
          returnKeyType="done"
          onSubmitEditing={Keyboard.dismiss}
        />
        {value !== '' && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => onChangeText('')}
          >
            <MaterialIcons 
              name="close" 
              size={20} 
              color={isDarkMode ? "#aaa" : "#999"} 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, isDarkMode && styles.darkContainer]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={[styles.loadingText, isDarkMode && styles.darkText]}>
          목표를 불러오는 중...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, isDarkMode && styles.darkContainer]}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, isDarkMode && styles.darkText]}>목표 설정</Text>
        
        {renderInputField(
          '연간 책 목표',
          yearlyBooks,
          setYearlyBooks,
          '예: 50권'
        )}

        {renderInputField(
          '월간 책 목표',
          monthlyBooks,
          setMonthlyBooks,
          '예: 5권'
        )}

        {renderInputField(
          '연간 페이지 목표',
          yearlyPages,
          setYearlyPages,
          '예: 10000페이지'
        )}

        {renderInputField(
          '월간 페이지 목표',
          monthlyPages,
          setMonthlyPages,
          '예: 1000페이지'
        )}

        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>저장</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  scrollContent: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  darkText: {
    color: '#fff',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  darkInputWrapper: {
    borderColor: '#555',
    backgroundColor: '#333',
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  darkInput: {
    color: '#fff',
  },
  clearButton: {
    padding: 12,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
