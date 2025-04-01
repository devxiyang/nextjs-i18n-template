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
 * 用户状态存储，用于管理用户的主题偏好和语言设置
 * 这是一个纯客户端状态，不需要服务器水合
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
  // 此hydrate方法为示例代码，展示如何实现服务器数据水合
  // 在实际的应用中，语言和主题通常不需要水合，因为它们是客户端状态
  hydrate: (data) => set((state) => ({
    preferences: { ...state.preferences, ...data }
  }))
}));

/**
 * 此函数为示例代码，展示服务器数据水合的实现方式
 * 在当前应用中不需要使用此函数，因为语言和主题是客户端状态
 */
export const hydrateUserStore = (data: Partial<UserPreferences>) => {
  useUserStore.getState().hydrate(data);
};

export default useUserStore; 