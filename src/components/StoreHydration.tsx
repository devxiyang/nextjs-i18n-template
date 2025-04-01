'use client';  // Mark as client component, as we use hooks and browser APIs

import { useEffect, useRef } from 'react';
import { hydrateSEOLocationsStore } from '@/store/seodata.init';
import { LocationAndLanguage } from '@/lib/types.thirdapi';

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
export default function StoreHydration({ 
  seoLocations
}: { 
  seoLocations: LocationAndLanguage[] 
}) {
  // Using useRef to track if hydration has run
  const hasEffectRun = useRef(false);
  
  // Run only once after initial render
  useEffect(() => {
    // Skip if effect has already run
    if (hasEffectRun.current) {
      return;
    }
    
    // Mark effect as run
    hasEffectRun.current = true;
    
    // Hydrate the store
    hydrateSEOLocationsStore(seoLocations);
  }, []); // Empty dependency array - only run once

  // This component doesn't render anything
  return null;
} 