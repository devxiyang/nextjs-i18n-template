import { create } from 'zustand';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

/**
 * Theme state hook for managing theme preferences
 * This is a client-side only state, doesn't require server hydration
 */
const useTheme = create<ThemeState>((set) => ({
  theme: 'system',
  setTheme: (theme) => set({ theme })
}));

export default useTheme; 