import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { Button, TextInput, Text, useTheme, Portal, Modal, IconButton, ActivityIndicator } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Book } from '@/features/books/types';
import { useReadingLogForm } from '../hooks/useReadingLogForm';

export interface ReadingLogFormProps {
  book: Book;
  onDismiss: () => void;
  isVisible: boolean;
}

const ReadingLogForm: React.FC<ReadingLogFormProps> = ({ book, onDismiss, isVisible }) => {
  const theme = useTheme();
  const [showStartTimePicker, setShowStartTimePicker] = React.useState<boolean>(false);
  const [showEndTimePicker, setShowEndTimePicker] = React.useState<boolean>(false);
  
  const {
    // Form state
    startPage,
    endPage,
    notes,
    startTime,
    isTracking,
    isPaused,
    sessionId,
    elapsedTime,
    formattedElapsedTime,
    
    // Handlers
    setStartPage,
    setEndPage,
    setNotes,
    updateStartTime,
    handleStartSession,
    handlePauseSession,
    handleResumeSession,
    handleEndSession,
    resetForm,
  } = useReadingLogForm(book);
  
  const handleDismiss = () => {
    resetForm();
    onDismiss();
  };

  const renderForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.sectionTitle}>
        {isTracking 
          ? isPaused 
            ? 'Session Paused' 
            : 'Reading in Progress'
          : 'Start Reading Session'}
      </Text>
      
      {isTracking && (
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formattedElapsedTime}</Text>
          <Text style={styles.timerLabel}>Reading Time</Text>
        </View>
      )}
      
      {!isTracking ? (
        // Start Session Form
        <>
          <TextInput
            label="Start Page"
            value={startPage}
            onChangeText={setStartPage}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
          />
          
          <Button
            mode="outlined"
            onPress={() => setShowStartTimePicker(true)}
            style={styles.timeButton}
            icon="clock-outline"
          >
            {startTime.toLocaleString()}
          </Button>
          
          {showStartTimePicker && (
            <DateTimePicker
              value={startTime}
              mode="datetime"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(_, selectedDate) => {
                setShowStartTimePicker(false);
                if (selectedDate) {
                  updateStartTime(selectedDate);
                }
              }}
            />
          )}
        </>
      ) : (
        // Active Session Controls
        <View style={styles.sessionControls}>
          <TextInput
            label="End Page"
            value={endPage}
            onChangeText={setEndPage}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
            disabled={isPaused}
          />
          
          <View style={styles.buttonRow}>
            {isPaused ? (
              <Button
                mode="contained"
                onPress={handleResumeSession}
                style={[styles.actionButton, styles.resumeButton]}
                icon="play"
                labelStyle={styles.actionButtonLabel}
              >
                Resume
              </Button>
            ) : (
              <Button
                mode="outlined"
                onPress={handlePauseSession}
                style={[styles.actionButton, styles.pauseButton]}
                icon="pause"
                labelStyle={styles.actionButtonLabel}
              >
                Pause
              </Button>
            )}
            
            <Button
              mode="contained"
              onPress={handleEndSession}
              style={[styles.actionButton, styles.endButton]}
              icon="stop"
              labelStyle={styles.actionButtonLabel}
            >
              End
            </Button>
          </View>
        </View>
      )}
      
      <TextInput
        label="Notes"
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={3}
        style={[styles.input, styles.notesInput]}
        mode="outlined"
        disabled={isTracking && isPaused}
      />
      
      <View style={styles.buttonContainer}>
        {!isTracking ? (
          <>
            <Button
              mode="contained"
              onPress={handleStartSession}
              style={[styles.button, styles.startButton]}
              labelStyle={styles.buttonLabel}
              disabled={!startPage}
            >
              Start Session
            </Button>
            <Button
              mode="outlined"
              onPress={handleDismiss}
              style={styles.button}
              labelStyle={styles.buttonLabel}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button
            mode="outlined"
            onPress={handleDismiss}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Close
          </Button>
        )}
      </View>
    </View>
  );

  return (
    <Portal>
      <Modal
        visible={isVisible}
        onDismiss={handleDismiss}
        contentContainerStyle={[
          styles.modalContainer,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        <View style={styles.header}>
          <Text variant="headlineSmall" style={styles.title}>
            Reading Log: {book.title}
          </Text>
          <IconButton
            icon="close"
            size={24}
            onPress={onDismiss}
            style={styles.closeButton}
          />
        </View>
        
        <ScrollView style={styles.scrollView}>
          {renderForm()}
        </ScrollView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.12)',
  },
  title: {
    flex: 1,
    marginRight: 8,
  },
  closeButton: {
    margin: 0,
  },
  scrollView: {
    padding: 16,
  },
  formContainer: {
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  notesInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  timeButton: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 8,
  },
  button: {
    flex: 1,
    minWidth: 120,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  actionButtonLabel: {
    fontSize: 14,
  },
  pauseButton: {
    backgroundColor: '#FFA000',
  },
  resumeButton: {
    backgroundColor: '#4CAF50',
  },
  sessionControls: {
    width: '100%',
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  timerText: {
    fontSize: 48,
    fontWeight: '200',
    fontVariant: ['tabular-nums'],
  },
  timerLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: -8,
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  endButton: {
    backgroundColor: '#F44336',
  },
  buttonLabel: {
    paddingVertical: 6,
  },
});

export default ReadingLogForm;
