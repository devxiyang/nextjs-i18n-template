import { create } from 'zustand';

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
}

interface UserState {
  preferences: UserPreferences;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLanguage: (language: string) => void;
  hydrate: (data: Partial<UserPreferences>) => void;
}

/**
 * User state store for managing theme preferences and language settings
 * This is a client-side only state, doesn't require server hydration
 */
const useUserStore = create<UserState>((set) => ({
  preferences: {
    theme: 'system',
    language: 'en',
  },
  setTheme: (theme) => set((state) => ({
    preferences: { ...state.preferences, theme }
  })),
  setLanguage: (language) => set((state) => ({
    preferences: { ...state.preferences, language }
  })),
  // This hydrate method is an example of how to implement server data hydration
  // In the actual application, language and theme usually don't need hydration as they are client-side state
  hydrate: (data) => set((state) => ({
    preferences: { ...state.preferences, ...data }
  }))
}));

/**
 * This function is example code showing how to implement server data hydration
 * In the current application, this function is not needed as language and theme are client-side state
 */
export const hydrateUserStore = (data: Partial<UserPreferences>) => {
  useUserStore.getState().hydrate(data);
};

export default useUserStore; 