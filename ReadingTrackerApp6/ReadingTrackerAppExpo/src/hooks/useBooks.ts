import { useBookContext } from '../BookContext';

export const useBooks = () => {
  return useBookContext();
}; 