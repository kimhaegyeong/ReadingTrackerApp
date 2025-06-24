import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useShareContext } from '@/contexts/ShareContext';
import { Feather } from '@expo/vector-icons';
import { Button } from './ui/Button';

interface ShareHistoryProps {
  onReshare: (itemId: string) => void;
  onClear?: () => void;
}

const ShareHistory = ({ onReshare, onClear }: ShareHistoryProps) => {
  const { history } = useShareContext();

  if (history.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>공유한 내역이 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>공유 히스토리</Text>
        {onClear && (
          <TouchableOpacity onPress={onClear} style={styles.clearButton}>
            <Feather name="trash-2" size={18} color="#EF4444" />
            <Text style={styles.clearText}>전체 삭제</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={history}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Image source={{ uri: item.imageUri }} style={styles.thumbnail} />
            <View style={styles.infoContainer}>
              <Text style={styles.itemType}>{item.type === 'book' ? '책' : item.type === 'quote' ? '인용문' : '메모'}</Text>
              <Text style={styles.itemDate}>{new Date(item.sharedAt).toLocaleString()}</Text>
            </View>
            <Button onPress={() => onReshare(item.id)} style={styles.reshareButton}>
              <Feather name="share-2" size={16} color="#6366F1" />
              <Text style={styles.reshareText}>재공유</Text>
            </Button>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  clearText: {
    color: '#EF4444',
    fontSize: 13,
    marginLeft: 4,
  },
  listContent: {
    paddingBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#E5E7EB',
  },
  infoContainer: {
    flex: 1,
  },
  itemType: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6366F1',
  },
  itemDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  reshareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginLeft: 8,
  },
  reshareText: {
    color: '#6366F1',
    fontSize: 14,
    marginLeft: 4,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    color: '#A3A3A3',
    fontSize: 15,
  },
});

export default ShareHistory; 