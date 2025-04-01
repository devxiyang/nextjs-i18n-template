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

// 创建用户状态存储
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
  hydrate: (data) => set((state) => ({
    preferences: { ...state.preferences, ...data }
  }))
}));

// 导出直接的hydrate函数
export const hydrateUserStore = (data: Partial<UserPreferences>) => {
  useUserStore.getState().hydrate(data);
};

export default useUserStore; 