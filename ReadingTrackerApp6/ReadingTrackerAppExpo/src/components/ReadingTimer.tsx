import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

export default function ReadingTimer({ onBack }) {
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [inputMinutes, setInputMinutes] = useState('');
  const intervalRef = useRef(null);

  const startTimer = () => {
    if (timer <= 0) return;
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
  };

  const resetTimer = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
    setTimer(0);
  };

  const openSetModal = () => {
    setShowModal(true);
    setInputMinutes('');
  };

  const setCustomTimer = () => {
    const min = parseInt(inputMinutes, 10);
    if (!isNaN(min) && min > 0) {
      setTimer(min * 60);
      setShowModal(false);
    }
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color="#2563EB" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>집중 타이머</Text>
      </View>
      {/* 타이머 표시 */}
      <View style={styles.timerBox}>
        <Text style={styles.timerText}>{formatTime(timer)}</Text>
      </View>
      {/* 타이머 컨트롤 */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlBtn} onPress={isRunning ? pauseTimer : startTimer}>
          <Ionicons name={isRunning ? 'pause' : 'play'} size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlBtn} onPress={resetTimer}>
          <Ionicons name="refresh" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlBtn} onPress={openSetModal}>
          <Ionicons name="timer-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* 시간 설정 모달 */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>분 단위로 입력</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="예: 25"
              keyboardType="numeric"
              value={inputMinutes}
              onChangeText={setInputMinutes}
            />
            <View style={{ flexDirection: 'row', marginTop: 16 }}>
              <TouchableOpacity style={styles.modalBtn} onPress={setCustomTimer}>
                <Text style={styles.modalBtnText}>설정</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#E5E7EB' }]} onPress={() => setShowModal(false)}>
                <Text style={[styles.modalBtnText, { color: '#222' }]}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFF', padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  backBtn: { marginRight: 8, padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#2563EB' },
  timerBox: { alignItems: 'center', marginVertical: 32 },
  timerText: { fontSize: 64, fontWeight: 'bold', color: '#222' },
  controls: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  controlBtn: { backgroundColor: '#2563EB', borderRadius: 32, padding: 18, marginHorizontal: 12 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { backgroundColor: '#fff', borderRadius: 12, padding: 24, width: 280, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  modalInput: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 10, width: 120, fontSize: 18, textAlign: 'center', backgroundColor: '#F3F4F6' },
  modalBtn: { backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 24, marginHorizontal: 6 },
  modalBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
