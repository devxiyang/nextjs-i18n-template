"use client";

import { useState, useEffect } from "react";
import useSEOLocationsStore from "@/store/seodata.init";
import KeywordSearchForm, { SearchFormData } from "@/components/search/KeywordRelatedForm";
import KeywordsResultTable from "@/components/search/KeywordRelatedResultTable";
import { fetchRelatedKeywords } from "@/server/seodata.actions";
import { RelatedKeywordsTask, LocationAndLanguage, AvailableLanguage } from "@/lib/types.thirdapi";

export default function KeywordsSearch() {
    // Use local state instead of directly accessing Zustand store
    const [storeData, setStoreData] = useState<{
        locations: LocationAndLanguage[];
        isLoading: boolean;
        error: string | null;
    }>({
        locations: [],
        isLoading: false,
        error: null
    });
    
    // Search results state
    const [searchResults, setSearchResults] = useState<{
        data: RelatedKeywordsTask | null;
        isLoading: boolean;
        error: string | null;
    }>({
        data: null,
        isLoading: false,
        error: null
    });
    
    // Subscribe to store changes using useEffect to avoid React 18 automatic effects
    useEffect(() => {
        // Get initial state
        const initialState = useSEOLocationsStore.getState();
        setStoreData({
            locations: initialState.locations,
            isLoading: initialState.isLoading,
            error: initialState.error
        });
        
        // Subscribe to changes
        const unsubscribe = useSEOLocationsStore.subscribe((state) => {
            setStoreData({
                locations: state.locations,
                isLoading: state.isLoading,
                error: state.error
            });
        });
        
        // Cleanup subscription
        return () => unsubscribe();
    }, []);

    // Handle form submission
    const handleSubmit = async (data: SearchFormData) => {
        // Validate location and language
        if (!data.keyword || !data.location || !data.language) {
            setSearchResults(prev => ({
                ...prev,
                error: "Please provide keyword, location and language for search"
            }));
            return;
        }
        
        try {
            // Start loading
            setSearchResults({
                data: null,
                isLoading: true,
                error: null
            });
            
            // Verify the location exists
            const locationObj = storeData.locations.find(
                (loc: LocationAndLanguage) => loc.location_name === data.location
            );
            
            if (!locationObj) {
                throw new Error(`Invalid location selection: ${data.location}`);
            }
            
            // Verify the language is valid for this location
            const isLanguageValid = locationObj.available_languages.some(
                (lang: AvailableLanguage) => lang.language_name === data.language
            );
            
            if (!isLanguageValid) {
                throw new Error(`Invalid language selection for location ${data.location}: ${data.language}`);
            }
            
            console.log(`Calling API with: keyword=${data.keyword}, location_name=${data.location}, language_name=${data.language}, depth=${data.depth}, limit=${data.limit}`);
            
            // Call API to fetch related keywords - all parameters use names not codes
            const result = await fetchRelatedKeywords(
                data.keyword,
                data.location, // This is location_name (not location_code)
                data.language, // This is language_name (not language_code)
                parseInt(data.depth),
                parseInt(data.limit)
            );
            
            if (!result) {
                throw new Error("No results returned from API");
            }
            
            // Update state with results
            setSearchResults({
                data: result,
                isLoading: false,
                error: null
            });
            
        } catch (error) {
            // Handle error
            setSearchResults({
                data: null,
                isLoading: false,
                error: error instanceof Error ? error.message : "An unknown error occurred"
            });
            console.error("Keywords search error:", error);
        }
    };
    
    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Keywords Research</h1>
            
            <KeywordSearchForm
                locations={storeData.locations}
                isLoading={storeData.isLoading}
                error={storeData.error}
                onSubmit={handleSubmit}
                initialValues={{
                    depth: "3",
                    limit: "20"
                }}
                className="mb-6"
            />
            
            {/* Display results */}
            <KeywordsResultTable
                data={searchResults.data}
                isLoading={searchResults.isLoading}
                error={searchResults.error}
            />
        </div>
    );
}