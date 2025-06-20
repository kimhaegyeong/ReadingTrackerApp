import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  BookDetail: { id: string };
  Settings: undefined;
  Profile: undefined;
  Search: undefined;
  NotFound: undefined;
  ReadingStats: undefined;
};

export type HomeScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Home'>['navigation'];
export type BookDetailScreenRouteProp = NativeStackScreenProps<RootStackParamList, 'BookDetail'>['route']; 