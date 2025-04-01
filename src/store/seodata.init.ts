'use client'

import { LocationAndLanguage } from '@/lib/types.thirdapi'
import { create } from 'zustand'
import { fetchLocations } from '@/server/seodata.actions'

/**
 * Interface for the DataForSEO store
 * Defines the state structure and available actions
 */
interface SEOLocationsStore {
    // 状态
    locations: LocationAndLanguage[]  // 位置和语言数据
    isLoading: boolean  // 加载状态
    isInitialized: boolean  // 初始化状态
    error: string | null  // 错误信息

    setLocations: (locations: LocationAndLanguage[]) => void  // 更新位置数据
    resetStore: () => void  // 重置状态
    hydrate: (data: LocationAndLanguage[]) => void  // 从服务器数据初始化状态
}

// Initial state to ensure consistent snapshots
const initialState = {
    locations: [],
    isLoading: false,
    isInitialized: false,
    error: null
};

// Keep hydration status outside of React lifecycle
let storeHydrated = false;

/**
 * Create the Zustand store with optimizations for React 18 and Next.js
 * 
 * We implement specific strategies to avoid infinite render loops:
 * 1. Use stable references for all state objects
 * 2. Track hydration status outside of component state
 * 3. Ensure server snapshot consistency
 */
const useSEOLocationsStore = create<SEOLocationsStore>((set, get) => ({
    // Initial state - always return the same reference for empty arrays
    ...initialState,
    
    // 更新位置数据
    setLocations: (locations) => set(() => ({ 
        locations,
        isInitialized: true,
        isLoading: false 
    })),
    
    // 重置状态
    resetStore: () => set(() => initialState),
    
    // 从服务器数据初始化状态 - 确保只设置一次
    hydrate: (data) => {
        // Skip if already hydrated or no valid data
        if (storeHydrated) {
            return;
        }
        
        // Mark as hydrated first to prevent race conditions
        storeHydrated = true;
        
        // Then update state
        set(() => ({ 
            locations: data || [],
            isInitialized: true,
            isLoading: false,
            error: null
        }));
    }
}));

/**
 * Utility function to directly hydrate the store
 * 
 * This makes it easier to initialize the store from outside components
 * without needing to first call getState(). It's a convenience function
 * that simplifies the hydration process.
 * 
 * @param data - Location data from the server to initialize the store with
 */
export const hydrateSEOLocationsStore = (data: LocationAndLanguage[]) => {
    // Simply delegate to the store's hydrate method which already has safeguards
    useSEOLocationsStore.getState().hydrate(data);
}

export default useSEOLocationsStore;
