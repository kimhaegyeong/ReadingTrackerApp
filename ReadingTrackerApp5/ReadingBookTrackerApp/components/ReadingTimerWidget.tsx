import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, AppState } from 'react-native';
import { Button } from './ui/Button';

interface ReadingTimerWidgetProps {
  onSave: (seconds: number) => void;
}

const formatTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map(v => v.toString().padStart(2, '0')).join(':');
};

const ReadingTimerWidget = ({ onSave }: ReadingTimerWidgetProps) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const appState = useRef(AppState.currentState);
  const backgroundTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        if (backgroundTimeRef.current && isActive) {
          const elapsed = Math.floor((Date.now() - backgroundTimeRef.current) / 1000);
          setSeconds(s => s + elapsed);
        }
      } else if (nextAppState.match(/inactive|background/)) {
        backgroundTimeRef.current = Date.now();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [isActive]);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else if (!isActive && intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if(intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  const handleToggle = () => setIsActive(!isActive);

  const handleReset = () => {
    setIsActive(false);
    setSeconds(0);
  };

  const handleSave = () => {
    if (seconds > 0) {
      onSave(seconds);
      handleReset();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{formatTime(seconds)}</Text>
      <View style={styles.buttonContainer}>
        <Button onPress={handleToggle} style={[styles.button, isActive ? styles.stopButton : styles.startButton]}>
          {isActive ? '일시정지' : '시작'}
        </Button>
        <Button onPress={handleReset} style={[styles.button, styles.resetButton]} textStyle={styles.resetButtonText}>
          초기화
        </Button>
      </View>
      <Button onPress={handleSave} style={[styles.button, styles.saveButton]} disabled={seconds === 0}>
        기록 저장
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    marginVertical: 16,
  },
  timerText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
    fontVariant: ['tabular-nums'],
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 12,
  },
  button: {
    flex: 1,
  },
  startButton: {
    backgroundColor: '#818CF8',
  },
  stopButton: {
    backgroundColor: '#F59E0B',
  },
  resetButton: {
    backgroundColor: '#E5E7EB',
  },
  resetButtonText: {
    color: '#4B5563',
  },
  saveButton: {
    width: '100%',
    backgroundColor: '#10B981',
  },
});

export default ReadingTimerWidget; 