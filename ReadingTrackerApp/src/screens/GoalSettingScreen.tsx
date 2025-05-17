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
  Platform,
  Switch,
  Modal
} from 'react-native';
import { saveReadingGoal, getCurrentReadingGoal, updateReadingGoal, UpdateReadingGoal } from '../database/goalOperations';
import type { ReadingGoal } from '../database/types';
import { MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar } from 'react-native-calendars';
import * as ExpoCalendar from 'expo-calendar';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useReadingContext } from '../contexts/ReadingContext';

type RootStackParamList = {
  MainTabs: undefined;
  GoalSetting: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface CalendarDay {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
}

export default function GoalSettingScreen() {
  const [yearlyBooks, setYearlyBooks] = useState('');
  const [monthlyBooks, setMonthlyBooks] = useState('');
  const [yearlyPages, setYearlyPages] = useState('');
  const [monthlyPages, setMonthlyPages] = useState('');
  const [currentGoal, setCurrentGoal] = useState<ReadingGoal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(new Date().getFullYear(), 11, 31));
  const [isPublic, setIsPublic] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationTime, setNotificationTime] = useState('09:00');
  const [goalType, setGoalType] = useState<'books' | 'pages' | 'both'>('both');
  const [achievementProbability, setAchievementProbability] = useState(0);
  const [calendarPermission, setCalendarPermission] = useState<boolean | null>(null);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const navigation = useNavigation<NavigationProp>();
  const { refreshGoals } = useReadingContext();

  useEffect(() => {
    loadCurrentGoal();
    checkCalendarPermission();
  }, []);

  useEffect(() => {
    calculateAchievementProbability();
  }, [yearlyBooks, yearlyPages]);

  const calculateAchievementProbability = () => {
    // 간단한 달성 가능성 계산 로직
    const yearlyBooksNum = parseInt(yearlyBooks) || 0;
    const yearlyPagesNum = parseInt(yearlyPages) || 0;
    
    let probability = 0;
    if (goalType === 'books') {
      probability = Math.min(100, (yearlyBooksNum / 50) * 100);
    } else if (goalType === 'pages') {
      probability = Math.min(100, (yearlyPagesNum / 10000) * 100);
    } else {
      probability = Math.min(100, ((yearlyBooksNum / 50 + yearlyPagesNum / 10000) / 2) * 100);
    }
    
    setAchievementProbability(Math.round(probability));
  };

  const loadCurrentGoal = async () => {
    try {
      setIsLoading(true);
      const goal = await getCurrentReadingGoal();
      if (goal) {
        setCurrentGoal(goal);
        setYearlyBooks(goal.yearly_books?.toString() || '');
        setMonthlyBooks(goal.monthly_books?.toString() || '');
        setYearlyPages(goal.yearly_pages?.toString() || '');
        setMonthlyPages(goal.monthly_pages?.toString() || '');
        setStartDate(new Date(goal.startDate));
        setEndDate(new Date(goal.endDate));
        setIsPublic(goal.isPublic || false);
        setNotificationsEnabled(goal.notificationsEnabled || false);
        setNotificationTime(goal.notificationTime || '09:00');
      }
    } catch (error) {
      console.error('목표 로딩 중 오류 발생:', error);
      Alert.alert('오류', '목표를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const checkCalendarPermission = async () => {
    const { status } = await ExpoCalendar.requestCalendarPermissionsAsync();
    setCalendarPermission(status === 'granted');
  };

  const handleDateChange = async (date: Date, type: 'start' | 'end') => {
    if (type === 'start') {
      setStartDate(date);
      setShowStartDatePicker(false);
    } else {
      setEndDate(date);
      setShowEndDatePicker(false);
    }
  };

  const renderCalendarModal = (visible: boolean, onClose: () => void, selectedDate: Date, onSelect: (date: Date) => void) => (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer, isDarkMode && styles.darkModalContainer]}>
        <View style={[styles.calendarContainer, isDarkMode && styles.darkCalendarContainer]}>
          <View style={styles.calendarHeader}>
            <Text style={[styles.calendarTitle, isDarkMode && styles.darkText]}>날짜 선택</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color={isDarkMode ? "#fff" : "#333"} />
            </TouchableOpacity>
          </View>
          <Calendar
            style={styles.calendar}
            current={selectedDate.toISOString().split('T')[0]}
            minDate={new Date().toISOString().split('T')[0]}
            maxDate={new Date(new Date().getFullYear() + 1, 11, 31).toISOString().split('T')[0]}
            onDayPress={(day: CalendarDay) => {
              onSelect(new Date(day.timestamp));
            }}
            theme={{
              backgroundColor: isDarkMode ? '#1c1c1c' : '#ffffff',
              calendarBackground: isDarkMode ? '#1c1c1c' : '#ffffff',
              textSectionTitleColor: isDarkMode ? '#ffffff' : '#333333',
              selectedDayBackgroundColor: '#007AFF',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#007AFF',
              dayTextColor: isDarkMode ? '#ffffff' : '#333333',
              textDisabledColor: isDarkMode ? '#666666' : '#d9e1e8',
              monthTextColor: isDarkMode ? '#ffffff' : '#333333',
              arrowColor: '#007AFF',
            }}
          />
        </View>
      </View>
    </Modal>
  );

  const renderGoalTypeSelector = () => (
    <View style={styles.goalTypeContainer}>
      <Text style={[styles.label, isDarkMode && styles.darkText]}>목표 유형</Text>
      <View style={styles.goalTypeButtons}>
        <TouchableOpacity
          style={[
            styles.goalTypeButton,
            goalType === 'books' && styles.goalTypeButtonActive,
            isDarkMode && styles.darkGoalTypeButton
          ]}
          onPress={() => setGoalType('books')}
        >
          <Text style={[styles.goalTypeText, goalType === 'books' && styles.goalTypeTextActive]}>
            책 수
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.goalTypeButton,
            goalType === 'pages' && styles.goalTypeButtonActive,
            isDarkMode && styles.darkGoalTypeButton
          ]}
          onPress={() => setGoalType('pages')}
        >
          <Text style={[styles.goalTypeText, goalType === 'pages' && styles.goalTypeTextActive]}>
            페이지
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.goalTypeButton,
            goalType === 'both' && styles.goalTypeButtonActive,
            isDarkMode && styles.darkGoalTypeButton
          ]}
          onPress={() => setGoalType('both')}
        >
          <Text style={[styles.goalTypeText, goalType === 'both' && styles.goalTypeTextActive]}>
            둘 다
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDateSelector = () => (
    <View style={[styles.dateContainer, isDarkMode && styles.darkDateContainer]}>
      <Text style={[styles.label, isDarkMode && styles.darkText]}>기간 설정</Text>
      <View style={styles.dateButtons}>
        <TouchableOpacity
          style={[styles.dateButton, isDarkMode && styles.darkDateButton]}
          onPress={() => setShowStartDatePicker(true)}
        >
          <MaterialIcons 
            name="calendar-today" 
            size={20} 
            color={isDarkMode ? "#fff" : "#333"} 
          />
          <Text style={[styles.dateButtonText, isDarkMode && styles.darkDateButtonText]}>
            {startDate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        <MaterialIcons 
          name="arrow-forward" 
          size={20} 
          color={isDarkMode ? "#fff" : "#333"} 
          style={styles.dateArrow} 
        />
        <TouchableOpacity
          style={[styles.dateButton, isDarkMode && styles.darkDateButton]}
          onPress={() => setShowEndDatePicker(true)}
        >
          <MaterialIcons 
            name="calendar-today" 
            size={20} 
            color={isDarkMode ? "#fff" : "#333"} 
          />
          <Text style={[styles.dateButtonText, isDarkMode && styles.darkDateButtonText]}>
            {endDate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
      </View>
      {renderCalendarModal(
        showStartDatePicker,
        () => setShowStartDatePicker(false),
        startDate,
        (date) => handleDateChange(date, 'start')
      )}
      {renderCalendarModal(
        showEndDatePicker,
        () => setShowEndDatePicker(false),
        endDate,
        (date) => handleDateChange(date, 'end')
      )}
    </View>
  );

  const renderAchievementProbability = () => (
    <View style={styles.probabilityContainer}>
      <Text style={[styles.label, isDarkMode && styles.darkText]}>
        달성 가능성: {achievementProbability}%
      </Text>
      <LinearGradient
        colors={['#FF4B4B', '#FFA500', '#4CAF50']}
        style={styles.probabilityBar}
      >
        <View 
          style={[
            styles.probabilityIndicator,
            { width: `${achievementProbability}%` }
          ]} 
        />
      </LinearGradient>
    </View>
  );

  const renderSettings = () => (
    <View style={styles.settingsContainer}>
      <View style={styles.settingItem}>
        <Text style={[styles.label, isDarkMode && styles.darkText]}>목표 공개</Text>
        <Switch
          value={isPublic}
          onValueChange={setIsPublic}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isPublic ? '#007AFF' : '#f4f3f4'}
        />
      </View>
      <View style={styles.settingItem}>
        <Text style={[styles.label, isDarkMode && styles.darkText]}>알림 설정</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={notificationsEnabled ? '#007AFF' : '#f4f3f4'}
        />
      </View>
      {notificationsEnabled && (
        <View style={styles.notificationTimeContainer}>
          <Text style={[styles.label, isDarkMode && styles.darkText]}>알림 시간</Text>
          <TextInput
            style={[styles.input, isDarkMode && styles.darkInput]}
            value={notificationTime}
            onChangeText={setNotificationTime}
            placeholder="HH:MM"
            placeholderTextColor={isDarkMode ? "#aaa" : "#999"}
          />
        </View>
      )}
    </View>
  );

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
        id: currentGoal?.id || 0,
        target: parseInt(yearlyBooks) || 0,
        progress: 0,
        completed: false,
        period: 'yearly',
        startDate: startDate,
        endDate: endDate,
        isPublic: isPublic,
        notificationsEnabled: notificationsEnabled,
        notificationTime: notificationsEnabled ? notificationTime : undefined,
        yearly_books: parseInt(yearlyBooks) || 0,
        monthly_books: parseInt(monthlyBooks) || 0,
        yearly_pages: parseInt(yearlyPages) || 0,
        monthly_pages: parseInt(monthlyPages) || 0
      };

      if (currentGoal?.id) {
        await updateReadingGoal(goal as UpdateReadingGoal);
        Alert.alert('성공', '목표가 업데이트되었습니다.', [
          { 
            text: '확인', 
            onPress: async () => {
              await refreshGoals();
              navigation.navigate('MainTabs' as never);
            }
          }
        ]);
      } else {
        await saveReadingGoal(goal);
        Alert.alert('성공', '목표가 저장되었습니다.', [
          { 
            text: '확인', 
            onPress: async () => {
              await refreshGoals();
              navigation.navigate('MainTabs' as never);
            }
          }
        ]);
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
        
        {renderGoalTypeSelector()}
        {renderDateSelector()}
        {renderAchievementProbability()}
        
        {(goalType === 'books' || goalType === 'both') && (
          <>
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
          </>
        )}

        {(goalType === 'pages' || goalType === 'both') && (
          <>
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
          </>
        )}

        {renderSettings()}

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
  goalTypeContainer: {
    marginBottom: 20,
  },
  goalTypeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  goalTypeButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  darkGoalTypeButton: {
    backgroundColor: '#333',
  },
  goalTypeButtonActive: {
    backgroundColor: '#007AFF',
  },
  goalTypeText: {
    color: '#333',
    fontWeight: '600',
  },
  goalTypeTextActive: {
    color: '#fff',
  },
  dateContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
  },
  darkDateContainer: {
    backgroundColor: '#1c1c1c',
  },
  dateButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  darkDateButton: {
    backgroundColor: '#333',
    borderColor: '#444',
  },
  dateButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  darkDateButtonText: {
    color: '#fff',
  },
  dateArrow: {
    marginHorizontal: 8,
  },
  probabilityContainer: {
    marginBottom: 20,
  },
  probabilityBar: {
    height: 8,
    borderRadius: 4,
    marginTop: 8,
    overflow: 'hidden',
  },
  probabilityIndicator: {
    height: '100%',
    backgroundColor: '#fff',
    opacity: 0.5,
  },
  settingsContainer: {
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  notificationTimeContainer: {
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  darkModalContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  calendarContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  darkCalendarContainer: {
    backgroundColor: '#1c1c1c',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  calendar: {
    width: '100%',
    height: 350,
  },
});
