"use client";

import { SearchableSelect, SelectItem } from "@/components/search/SearchableSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useMemo, useCallback, useEffect } from "react";
import { LocationAndLanguage, AvailableLanguage } from "@/lib/types.thirdapi";
import { Search } from "lucide-react";

export interface SuggestionsFormData {
  keyword: string;
  location: string;
  language: string;
  include_serp_info: boolean;
  include_seed_keyword: boolean;
  limit: string;
}

export interface SuggestionsFormProps {
  locations: LocationAndLanguage[];
  isLoading?: boolean;
  error?: string | null;
  onSubmit: (data: SuggestionsFormData) => void;
  initialValues?: Partial<SuggestionsFormData>;
  className?: string;
}

export default function KeywordSuggestionsForm({
  locations = [],
  isLoading = false,
  error = null,
  onSubmit,
  initialValues = {},
  className = "",
}: SuggestionsFormProps) {
  // Check if locations are available
  const hasLocations = useMemo(() => 
    Array.isArray(locations) && locations.length > 0, 
    [locations]
  );
  
  // Find default location (United States)
  const defaultLocationId = useMemo(() => {
    if (!hasLocations) return "";
    
    // Look for United States in the locations
    const usLocation = locations.find(
      loc => loc.location_name.toLowerCase() === "united states"
    );
    
    return usLocation ? usLocation.location_name : "";
  }, [locations, hasLocations]);
  
  // Form state with initial values
  const [keyword, setKeyword] = useState(initialValues.keyword || "");
  const [selectedLocation, setSelectedLocation] = useState<string>(
    initialValues.location || defaultLocationId
  );
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    initialValues.language || ""
  );
  const [includeSerp, setIncludeSerp] = useState<boolean>(
    initialValues.include_serp_info !== undefined ? initialValues.include_serp_info : true
  );
  const [includeSeedKeyword, setIncludeSeedKeyword] = useState<boolean>(
    initialValues.include_seed_keyword !== undefined ? initialValues.include_seed_keyword : true
  );
  const [selectedLimit, setSelectedLimit] = useState<string>(
    initialValues.limit || "20"
  );
  
  // Set default location when locations are loaded
  useEffect(() => {
    if (defaultLocationId && !selectedLocation) {
      setSelectedLocation(defaultLocationId);
    }
  }, [defaultLocationId, selectedLocation]);
  
  // Get languages for selected location
  const languageItems = useMemo(() => {
    if (!selectedLocation || !hasLocations) return [];
    
    const selectedLoc = locations.find(
      (loc: LocationAndLanguage) => loc.location_name === selectedLocation
    );
    
    if (!selectedLoc || !selectedLoc.available_languages || !selectedLoc.available_languages.length) {
      return [];
    }
    
    return selectedLoc.available_languages.map((lang: AvailableLanguage) => ({
      value: lang.language_name,
      label: lang.language_name
    }));
  }, [selectedLocation, locations, hasLocations]);
  
  // Find default language (English) when languages are available
  useEffect(() => {
    if (languageItems.length > 0 && !selectedLanguage) {
      // Look for English in the available languages
      const englishLang = languageItems.find(
        lang => lang.label.toLowerCase() === "english"
      );
      
      if (englishLang) {
        setSelectedLanguage(englishLang.value);
      }
    }
  }, [languageItems, selectedLanguage]);
  
  // Convert locations to the format needed by SearchableSelect
  const locationItems = useMemo(() => {
    if (!hasLocations) return [];
    
    return locations.map((location: LocationAndLanguage) => ({
      value: location.location_name,
      label: location.location_name
    }));
  }, [locations, hasLocations]);
  
  // Limit options
  const limitItems = useMemo(() => [
    { value: "10", label: "10 results" },
    { value: "20", label: "20 results" },
    { value: "50", label: "50 results" },
    { value: "100", label: "100 results" }
  ], []);
  
  // Handle location selection
  const handleLocationChange = useCallback((value: string) => {
    setSelectedLocation(value);
    // Reset language when location changes
    setSelectedLanguage("");
  }, []);
  
  // Handle language selection
  const handleLanguageChange = useCallback((value: string) => {
    setSelectedLanguage(value);
  }, []);
  
  // Handle limit selection
  const handleLimitChange = useCallback((value: string) => {
    setSelectedLimit(value);
  }, []);
  
  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      keyword,
      location: selectedLocation,
      language: selectedLanguage,
      include_serp_info: includeSerp,
      include_seed_keyword: includeSeedKeyword,
      limit: selectedLimit
    });
  }, [keyword, selectedLocation, selectedLanguage, includeSerp, includeSeedKeyword, selectedLimit, onSubmit]);
  
  return (
    <form onSubmit={handleSubmit} className={`space-y-3 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 ${className}`}>
      {/* Keyword search input and button in one row */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input 
            type="text" 
            placeholder="Enter keywords to get suggestions..." 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        <Button 
          type="submit" 
          className="whitespace-nowrap"
          disabled={!keyword || !selectedLocation || !selectedLanguage}
        >
          Get Suggestions
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {/* Location selector */}
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          {isLoading ? (
            <div className="flex items-center justify-center py-2 text-sm text-muted-foreground">
              Loading locations...
            </div>
          ) : !hasLocations ? (
            <div className="flex items-center justify-center py-2 text-sm text-muted-foreground">
              {error || 'No locations available'}
            </div>
          ) : (
            <SearchableSelect 
              value={selectedLocation}
              onValueChange={handleLocationChange}
              items={locationItems}
              placeholder="Select a location"
              searchPlaceholder="Search locations..."
              notFoundText="No matching locations found"
            />
          )}
        </div>
        
        {/* Language selector */}
        <div>
          <label className="block text-sm font-medium mb-1">Language</label>
          <SearchableSelect 
            value={selectedLanguage}
            onValueChange={handleLanguageChange}
            items={languageItems}
            placeholder="Select a language"
            searchPlaceholder="Search languages..."
            notFoundText="No languages available for this location"
            disabled={!selectedLocation || languageItems.length === 0}
          />
        </div>
        
        {/* Limit selector */}
        <div>
          <label className="block text-sm font-medium mb-1">Results Limit</label>
          <SearchableSelect 
            value={selectedLimit}
            onValueChange={handleLimitChange}
            items={limitItems}
            placeholder="Select limit"
          />
        </div>
        
        {/* Options */}
        <div>
          <label className="block text-sm font-medium mb-1">Options</label>
          <div className="space-y-2 pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeSerp" 
                checked={includeSerp} 
                onCheckedChange={(checked: boolean | "indeterminate") => setIncludeSerp(checked === true)}
              />
              <label 
                htmlFor="includeSerp" 
                className="text-sm cursor-pointer"
              >
                Include SERP info
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeSeedKeyword" 
                checked={includeSeedKeyword} 
                onCheckedChange={(checked: boolean | "indeterminate") => setIncludeSeedKeyword(checked === true)}
              />
              <label 
                htmlFor="includeSeedKeyword" 
                className="text-sm cursor-pointer"
              >
                Include seed keyword
              </label>
            </div>
          </div>
        </div>
      </div>
      
      {/* Display current form values */}
      <div className="text-xs text-muted-foreground mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded flex flex-wrap gap-2">
        {selectedLocation && (
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
            Location: {selectedLocation}
          </span>
        )}
        {selectedLanguage && (
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
            Language: {selectedLanguage}
          </span>
        )}
        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
          Limit: {selectedLimit}
        </span>
        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
          Include SERP: {includeSerp ? "Yes" : "No"}
        </span>
        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
          Include Seed: {includeSeedKeyword ? "Yes" : "No"}
        </span>
      </div>
    </form>
  );
}
