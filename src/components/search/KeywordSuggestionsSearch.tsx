"use client";

import { useState, useEffect } from "react";
import useSEOLocationsStore from "@/store/seodata.init";
import KeywordSuggestionsForm, { SuggestionsFormData } from "@/components/search/KeywordSuggestionsForm";
import KeywordSuggestionsResultTable from "@/components/search/KeywordSuggestionsResultTable";
import { keywordSuggestions } from "@/server/seodata.actions";
import { KeywordSuggestionsTask, LocationAndLanguage, AvailableLanguage } from "@/lib/types.thirdapi";

export default function KeywordSuggestionsSearch() {
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
        data: KeywordSuggestionsTask | null;
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
    const handleSubmit = async (data: SuggestionsFormData) => {
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
            
            console.log(`Calling API with: keyword=${data.keyword}, location_name=${data.location}, language_name=${data.language}, include_serp_info=${data.include_serp_info}, include_seed_keyword=${data.include_seed_keyword}, limit=${data.limit}`);
            
            // Call API to fetch keyword suggestions - all parameters use names not codes
            const result = await keywordSuggestions(
                data.keyword,
                data.location, // This is location_name (not location_code)
                data.language, // This is language_name (not language_code)
                data.include_serp_info,
                data.include_seed_keyword,
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
            console.error("Keyword suggestions search error:", error);
        }
    };
    
    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Keyword Suggestions</h1>
            
            <KeywordSuggestionsForm
                locations={storeData.locations}
                isLoading={storeData.isLoading}
                error={storeData.error}
                onSubmit={handleSubmit}
                initialValues={{
                    include_serp_info: true,
                    include_seed_keyword: true,
                    limit: "20"
                }}
                className="mb-6"
            />
            
            {/* Display results */}
            <KeywordSuggestionsResultTable
                data={searchResults.data}
                isLoading={searchResults.isLoading}
                error={searchResults.error}
            />
        </div>
    );
}
