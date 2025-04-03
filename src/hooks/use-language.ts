import { create } from 'zustand';

interface LanguageState {
  language: string;
  setLanguage: (language: string) => void;
}

/**
 * Language state hook for managing language settings
 * This is a client-side only state, doesn't require server hydration
 */
const useLanguage = create<LanguageState>((set) => ({
  language: 'en',
  setLanguage: (language) => set({ language })
}));

export default useLanguage; 