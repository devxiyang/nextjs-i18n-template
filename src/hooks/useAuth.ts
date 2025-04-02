import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';

// 认证结果类型
export type AuthActionResult = {
  success: boolean;
  error?: string;
  redirectUrl?: string;
  message?: string;
};

// 合并的认证状态接口
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isPending: boolean;
  
  // 状态管理方法
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  signOut: () => void;
  
  // 操作执行方法
  executeAction: <T extends AuthActionResult>(
    action: () => Promise<T>,
    onSuccess?: (result: T) => void,
    onError?: (errorMessage: string) => void
  ) => Promise<void>;
}

// 创建合并后的认证状态和操作钩子
const useAuth = create<AuthState>((set, get) => ({
  // 状态
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  isPending: false,
  
  // 状态管理方法
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  signOut: () => set({ user: null, isAuthenticated: false }),
  
  // 操作执行方法
  executeAction: async (action, onSuccess, onError) => {
    set({ isPending: true, error: null });
    
    try {
      const result = await action();
      
      if (!result.success) {
        const errorMessage = result.error || "Operation failed, please try again later";
        set({ error: errorMessage, isPending: false });
        toast.error(errorMessage);
        if (onError) onError(errorMessage);
        return;
      }
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      set({ isPending: false });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      set({ error: errorMessage, isPending: false });
      toast.error(errorMessage);
      if (onError) onError(errorMessage);
    }
  }
}));

export default useAuth; 