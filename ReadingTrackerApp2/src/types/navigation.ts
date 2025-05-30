import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Library: NavigatorScreenParams<LibraryStackParamList>;
  Search: NavigatorScreenParams<SearchStackParamList>;
  Stats: NavigatorScreenParams<StatsStackParamList>;
  Settings: NavigatorScreenParams<SettingsStackParamList>;
};

export type LibraryStackParamList = {
  LibraryHome: undefined;
  BookDetail: { bookId: string };
  ManualBookEntry: undefined;
};

export type SearchStackParamList = {
  SearchHome: undefined;
  BookDetail: { bookId: string };
};

export type StatsStackParamList = {
  StatsHome: undefined;
};

export type SettingsStackParamList = {
  SettingsHome: undefined;
}; 