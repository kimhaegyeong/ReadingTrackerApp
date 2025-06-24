import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { useShareContext } from '@/contexts/ShareContext';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface ShareCardCustomizerProps {
  visible: boolean;
  onClose: () => void;
  previewContent: React.ReactNode;
}

const themes = [
  { id: 'light', name: '라이트', backgroundColor: '#fff', textColor: '#1F2937' },
  { id: 'dark', name: '다크', backgroundColor: '#1F2937', textColor: '#fff' },
  { id: 'minimal', name: '미니멀', backgroundColor: '#F3F4F6', textColor: '#374151' },
];

const layouts = [
  { id: 'card', name: '카드형' },
  { id: 'list', name: '리스트형' },
  { id: 'elegant', name: '엘레강스' },
];

const ShareCardCustomizer = ({ visible, onClose, previewContent }: ShareCardCustomizerProps) => {
  const {
    theme, setTheme,
    layout, setLayout,
    showAuthor, setShowAuthor,
    showStatus, setShowStatus
  } = useShareContext();

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalView}>
          <Text style={styles.title}>공유 카드 스타일 커스터마이즈</Text>
          <ScrollView>
            <Text style={styles.sectionTitle}>테마</Text>
            <View style={styles.row}>
              {themes.map(t => (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.optionButton, theme === t.id && styles.selectedOption]}
                  onPress={() => setTheme(t.id as any)}
                >
                  <Text style={{ color: theme === t.id ? '#6366F1' : '#374151' }}>{t.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.sectionTitle}>레이아웃</Text>
            <View style={styles.row}>
              {layouts.map(l => (
                <TouchableOpacity
                  key={l.id}
                  style={[styles.optionButton, layout === l.id && styles.selectedOption]}
                  onPress={() => setLayout(l.id as any)}
                >
                  <Text style={{ color: layout === l.id ? '#6366F1' : '#374151' }}>{l.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.sectionTitle}>표시 옵션</Text>
            <View style={styles.row}>
              <TouchableOpacity style={styles.checkOption} onPress={() => setShowAuthor(!showAuthor)}>
                <View style={[styles.checkbox, showAuthor && styles.checkedBox]} />
                <Text style={styles.checkLabel}>저자 표시</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.checkOption} onPress={() => setShowStatus(!showStatus)}>
                <View style={[styles.checkbox, showStatus && styles.checkedBox]} />
                <Text style={styles.checkLabel}>상태 표시</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.sectionTitle}>미리보기</Text>
            <View style={styles.previewContainer}>
              {/* 실시간 미리보기 */}
              {previewContent}
            </View>
          </ScrollView>
          <Button onPress={onClose} style={styles.closeButton}>닫기</Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxHeight: '85%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1F2937',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#6366F1',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    backgroundColor: '#F3F4F6',
  },
  selectedOption: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  checkOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    marginRight: 6,
    backgroundColor: '#fff',
  },
  checkedBox: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  checkLabel: {
    fontSize: 14,
    color: '#374151',
  },
  previewContainer: {
    marginTop: 12,
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 12,
    backgroundColor: '#6366F1',
  },
});

export default ShareCardCustomizer; 