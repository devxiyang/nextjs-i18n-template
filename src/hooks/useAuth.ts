import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Authentication result type
export type AuthActionResult = {
  success: boolean;
  error?: string;
  redirectUrl?: string;
  message?: string;
};

// Combined authentication state interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isPending: boolean;
  
  // State management methods
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  signOut: () => void;
  
  // Action execution method
  executeAction: <T extends AuthActionResult>(
    action: () => Promise<T>,
    onSuccess?: (result: T) => void,
    onError?: (errorMessage: string) => void
  ) => Promise<void>;
}

// Create combined authentication state and action hook
const useAuth = create<AuthState>((set, get) => ({
  // State
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  isPending: false,
  
  // State management methods
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  signOut: () => set({ user: null, isAuthenticated: false }),
  
  // Action execution method
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