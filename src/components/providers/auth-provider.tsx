'use client';

import useAuthStore from '@/store/authStore';
import { User } from '@supabase/supabase-js';
import { useEffect, useRef } from 'react';

interface AuthProviderProps {
  initialUser: User | null;
}

/**
 * Auth Provider Component
 * 
 * This component initializes the auth store with user data.
 * It should be placed high in the component tree, typically in a layout component.
 */
export function AuthProvider({ initialUser }: AuthProviderProps) {
  const authStore = useAuthStore();
  const initialized = useRef(false);
  
  // Initialize auth store with user data from server
  useEffect(() => {
    // Only initialize once to prevent infinite loops
    if (!initialized.current) {
      // Set initial loading state to false
      authStore.setLoading(false);
      
      // If we have a user, update the store
      if (initialUser) {
        authStore.setUser(initialUser);
        authStore.setAuthenticated(true);
      }
      
      initialized.current = true;
    }
  }, [initialUser]); // Remove authStore from dependencies
  
  // This is a headless component, it doesn't render anything
  return null;
} 