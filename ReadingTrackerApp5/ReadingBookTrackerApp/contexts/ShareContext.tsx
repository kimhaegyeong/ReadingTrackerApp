import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ShareTheme = 'light' | 'dark' | 'minimal';
export type ShareLayout = 'card' | 'list' | 'elegant';

export interface ShareHistoryItem {
  id: string;
  type: 'book' | 'quote' | 'note';
  refId: string; // bookId, quoteId, noteId 등
  imageUri: string;
  sharedAt: number;
  options: {
    theme: ShareTheme;
    layout: ShareLayout;
    showAuthor: boolean;
    showStatus: boolean;
  };
}

interface ShareContextType {
  theme: ShareTheme;
  setTheme: (theme: ShareTheme) => void;
  layout: ShareLayout;
  setLayout: (layout: ShareLayout) => void;
  showAuthor: boolean;
  setShowAuthor: (show: boolean) => void;
  showStatus: boolean;
  setShowStatus: (show: boolean) => void;
  history: ShareHistoryItem[];
  addHistory: (item: ShareHistoryItem) => void;
  clearHistory: () => void;
}

const ShareContext = createContext<ShareContextType | undefined>(undefined);

export const ShareProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ShareTheme>('light');
  const [layout, setLayout] = useState<ShareLayout>('card');
  const [showAuthor, setShowAuthor] = useState(true);
  const [showStatus, setShowStatus] = useState(true);
  const [history, setHistory] = useState<ShareHistoryItem[]>([]);

  const addHistory = (item: ShareHistoryItem) => setHistory(prev => [item, ...prev]);
  const clearHistory = () => setHistory([]);

  return (
    <ShareContext.Provider value={{ theme, setTheme, layout, setLayout, showAuthor, setShowAuthor, showStatus, setShowStatus, history, addHistory, clearHistory }}>
      {children}
    </ShareContext.Provider>
  );
};

export const useShareContext = () => {
  const ctx = useContext(ShareContext);
  if (!ctx) throw new Error('useShareContext must be used within ShareProvider');
  return ctx;
}; 