import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Button } from './ui/Button';
import { Feather } from '@expo/vector-icons';

interface ShareOptionsDialogProps {
  visible: boolean;
  onClose: () => void;
  onShare: () => void;
  onSave: () => void;
  onCustomize: () => void;
}

const ShareOptionsDialog = ({ visible, onClose, onShare, onSave, onCustomize }: ShareOptionsDialogProps) => {
  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.dialogView}>
          <Text style={styles.title}>공유 옵션 선택</Text>
          <View style={styles.optionsContainer}>
            <Button onPress={onShare} style={styles.optionButton}>
              <Feather name="share-2" size={18} color="#6366F1" style={{ marginRight: 8 }} />
              <Text style={styles.optionText}>공유하기</Text>
            </Button>
            <Button onPress={onSave} style={styles.optionButton}>
              <Feather name="download" size={18} color="#10B981" style={{ marginRight: 8 }} />
              <Text style={styles.optionText}>갤러리에 저장</Text>
            </Button>
            <Button onPress={onCustomize} style={styles.optionButton}>
              <Feather name="sliders" size={18} color="#F59E42" style={{ marginRight: 8 }} />
              <Text style={styles.optionText}>스타일 커스터마이즈</Text>
            </Button>
          </View>
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
  dialogView: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1F2937',
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
    marginBottom: 16,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  closeButton: {
    marginTop: 8,
    backgroundColor: '#6366F1',
  },
});

export default ShareOptionsDialog; 