'use client';  // Mark as client component, as we use hooks and browser APIs

import { useEffect, useRef } from 'react';
import { hydrateUserStore } from '@/store/userStore';

interface StoreHydrationProps {
  initialTheme?: 'light' | 'dark' | 'system';
  initialLanguage?: string;
}

/**
 * StoreHydration Component
 * 
 * This "invisible" component serves as a bridge between server and client state.
 * It accepts server data and initializes the Zustand store on the client side.
 * 
 * Key features:
 * 1. It doesn't render anything (returns null)
 * 2. It only runs on the client due to 'use client' directive
 * 3. It ensures hydration happens only once using a ref
 * 4. It keeps server-fetched data in sync with client state
 * 
 * This pattern avoids the need for a Provider while maintaining
 * the benefits of server-side rendering with client-side state.
 */
export default function StoreHydration({ initialTheme, initialLanguage }: StoreHydrationProps) {
  const hydrated = useRef(false);

  useEffect(() => {
    if (!hydrated.current) {
      // 只在初次渲染时执行一次hydrate操作
      const dataToHydrate = {
        theme: initialTheme,
        language: initialLanguage,
      };
      
      // 只传递有效的值
      const filteredData = Object.fromEntries(
        Object.entries(dataToHydrate).filter(([_, v]) => v !== undefined)
      );
      
      hydrateUserStore(filteredData);
      hydrated.current = true;
    }
  }, [initialTheme, initialLanguage]);

  // 组件不渲染任何内容
  return null;
} 