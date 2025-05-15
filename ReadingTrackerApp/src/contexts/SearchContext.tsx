import * as React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { 
  initDatabase, 
  saveFilter as saveFilterDB, 
  getFilters as getFiltersDB, 
  deleteFilter as deleteFilterDB,
  saveSearchHistory as saveSearchHistoryDB,
  getSearchHistory as getSearchHistoryDB,
  clearSearchHistory as clearSearchHistoryDB
} from '../utils/database';

export interface SearchFilter {
  id: string;
  name: string;
  author?: string;
  publisher?: string;
  category?: string;
  yearFrom?: number;
  yearTo?: number;
  language?: string;
  isActive: boolean;
}

export interface SearchHistory {
  query: string;
  timestamp: number;
}

interface SearchContextType {
  searchHistory: SearchHistory[];
  savedFilters: SearchFilter[];
  activeFilters: SearchFilter[];
  viewMode: 'grid' | 'list';
  addToSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  removeFromSearchHistory: (query: string) => void;
  saveFilter: (filter: Omit<SearchFilter, 'id' | 'isActive'>) => void;
  updateFilter: (filter: SearchFilter) => void;
  deleteFilter: (id: string) => void;
  toggleFilterActive: (id: string) => void;
  clearActiveFilters: () => void;
  setViewMode: (mode: 'grid' | 'list') => void;
}

const SearchContext = createContext<SearchContextType>({
  searchHistory: [],
  savedFilters: [],
  activeFilters: [],
  viewMode: 'list',
  addToSearchHistory: () => {},
  clearSearchHistory: () => {},
  removeFromSearchHistory: () => {},
  saveFilter: () => {},
  updateFilter: () => {},
  deleteFilter: () => {},
  toggleFilterActive: () => {},
  clearActiveFilters: () => {},
  setViewMode: () => {},
});

export const useSearchContext = () => useContext(SearchContext);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [savedFilters, setSavedFilters] = useState<SearchFilter[]>([]);
  const [activeFilters, setActiveFilters] = useState<SearchFilter[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // 데이터베이스 초기화
  useEffect(() => {
    const init = async () => {
      try {
        await initDatabase();
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };
    init();
  }, []);

  // Load data when user changes
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setSearchHistory([]);
        setSavedFilters([]);
        setActiveFilters([]);
        return;
      }

      try {
        // Load search history
        const history = await getSearchHistoryDB();
        setSearchHistory(history);

        // Load saved filters
        const filters = await getFiltersDB();
        setSavedFilters(filters);
        setActiveFilters(filters.filter(filter => filter.isActive));
      } catch (error) {
        console.error('Error loading search data:', error);
      }
    };

    loadData();
  }, [user]);

  const addToSearchHistory = async (query: string) => {
    if (!query.trim()) return;
    
    try {
      await saveSearchHistoryDB(query);
      const history = await getSearchHistoryDB();
      setSearchHistory(history);
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  const clearSearchHistory = async () => {
    try {
      await clearSearchHistoryDB();
      setSearchHistory([]);
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  };

  const removeFromSearchHistory = async (query: string) => {
    try {
      const filteredHistory = searchHistory.filter(item => item.query !== query);
      setSearchHistory(filteredHistory);
      // TODO: Implement remove from database
    } catch (error) {
      console.error('Error removing from search history:', error);
    }
  };

  const saveFilter = async (filterData: Omit<SearchFilter, 'id' | 'isActive'>) => {
    try {
      const newFilter: SearchFilter = {
        ...filterData,
        id: Date.now().toString(),
        isActive: false,
      };
      
      await saveFilterDB(newFilter);
      const filters = await getFiltersDB();
      setSavedFilters(filters);
    } catch (error) {
      console.error('Error saving filter:', error);
    }
  };

  const updateFilter = async (updatedFilter: SearchFilter) => {
    try {
      await saveFilterDB(updatedFilter);
      const filters = await getFiltersDB();
      setSavedFilters(filters);
      
      if (activeFilters.some(filter => filter.id === updatedFilter.id)) {
        setActiveFilters(prev => 
          prev.map(filter => 
            filter.id === updatedFilter.id ? updatedFilter : filter
          )
        );
      }
    } catch (error) {
      console.error('Error updating filter:', error);
    }
  };

  const deleteFilter = async (id: string) => {
    try {
      await deleteFilterDB(id);
      const filters = await getFiltersDB();
      setSavedFilters(filters);
      setActiveFilters(prev => prev.filter(filter => filter.id !== id));
    } catch (error) {
      console.error('Error deleting filter:', error);
    }
  };

  const toggleFilterActive = async (id: string) => {
    try {
      const filter = savedFilters.find(f => f.id === id);
      if (!filter) return;
      
      const updatedFilter = { ...filter, isActive: !filter.isActive };
      await saveFilterDB(updatedFilter);
      
      const filters = await getFiltersDB();
      setSavedFilters(filters);
      
      if (updatedFilter.isActive) {
        setActiveFilters(prev => [...prev, updatedFilter]);
      } else {
        setActiveFilters(prev => prev.filter(f => f.id !== id));
      }
    } catch (error) {
      console.error('Error toggling filter:', error);
    }
  };

  const clearActiveFilters = async () => {
    try {
      const updatedFilters = savedFilters.map(filter => ({
        ...filter,
        isActive: false
      }));
      
      for (const filter of updatedFilters) {
        await saveFilterDB(filter);
      }
      
      const filters = await getFiltersDB();
      setSavedFilters(filters);
      setActiveFilters([]);
    } catch (error) {
      console.error('Error clearing active filters:', error);
    }
  };

  return (
    <SearchContext.Provider
      value={{
        searchHistory,
        savedFilters,
        activeFilters,
        viewMode,
        addToSearchHistory,
        clearSearchHistory,
        removeFromSearchHistory,
        saveFilter,
        updateFilter,
        deleteFilter,
        toggleFilterActive,
        clearActiveFilters,
        setViewMode,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
