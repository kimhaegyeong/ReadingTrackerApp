import { Book } from '@/features/books/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  BooksList: undefined;
  AddBook: undefined;
  BookDetails: { bookId: string; book?: never } | { bookId?: never; book: Book };
  EditBook: { book: Book };
};

// Re-export Book type for convenience
export type { Book };

// Type for useNavigation hook
export type RootNavigationProp<T extends keyof RootStackParamList> = NativeStackNavigationProp<
  RootStackParamList,
  T
>;

// Type for screen props
export type RootStackScreenProps<T extends keyof RootStackParamList> = {
  navigation: RootNavigationProp<T>;
  route: {
    params: RootStackParamList[T];
    key: string;
    name: string;
  };
};

// Type for useNavigation hook without specifying screen
export type RootNavigation = NativeStackNavigationProp<RootStackParamList>;
