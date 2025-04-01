"use client";

import { SearchableSelect } from "@/components/search/SearchableSelect";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AvailableLanguage, LocationAndLanguage } from "@/lib/types.thirdapi";
import { Search, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

export interface KeywordIdeaFormData {
  keywords: string[];
  location: string;
  language: string;
  include_serp_info: boolean;
  limit: number;
}

export interface KeywordIdeaFormProps {
  locations: LocationAndLanguage[];
  isLoading?: boolean;
  error?: string | null;
  onSubmit: (data: KeywordIdeaFormData) => void;
  initialValues?: Partial<KeywordIdeaFormData>;
  className?: string;
}

export default function KeywordIdeaForm({
  locations = [],
  isLoading = false,
  error = null,
  onSubmit,
  initialValues = {},
  className = "",
}: KeywordIdeaFormProps) {
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
  
  // Limit options
  const limitItems = useMemo(() => [
    { value: "20", label: "20 results" },
    { value: "50", label: "50 results" },
    { value: "100", label: "100 results" }
  ], []);
  
  // Form state with initial values
  const [keyword, setKeyword] = useState<string>("");
  const [keywords, setKeywords] = useState<string[]>(initialValues.keywords || []);
  const [selectedLocation, setSelectedLocation] = useState<string>(
    initialValues.location || defaultLocationId
  );
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    initialValues.language || ""
  );
  const [includeSerp, setIncludeSerp] = useState<boolean>(
    initialValues.include_serp_info !== undefined ? initialValues.include_serp_info : true
  );
  const [selectedLimit, setSelectedLimit] = useState<number>(() => {
    const initialLimit = initialValues.limit;
    if (initialLimit !== undefined) return initialLimit;
    return 20;
  });
  
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

  // Handle keyword input
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && keyword.trim()) {
      e.preventDefault();
      if (!keywords.includes(keyword.trim())) {
        setKeywords([...keywords, keyword.trim()]);
      }
      setKeyword("");
    }
  }, [keyword, keywords]);

  // Handle keyword removal
  const removeKeyword = useCallback((keywordToRemove: string) => {
    setKeywords(keywords.filter(k => k !== keywordToRemove));
  }, [keywords]);
  
  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      keywords,
      location: selectedLocation,
      language: selectedLanguage,
      include_serp_info: includeSerp,
      limit: selectedLimit
    });
  }, [keywords, selectedLocation, selectedLanguage, includeSerp, selectedLimit, onSubmit]);
  
  return (
    <form onSubmit={handleSubmit} className={`space-y-3 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 ${className}`}>
      {/* 关键词输入区域 */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex flex-wrap gap-1 p-1 pl-10 border rounded-md min-h-[40px] bg-background">
              {keywords.map((k) => (
                <Badge key={k} variant="secondary" className="flex items-center gap-1">
                  {k}
                  <button
                    type="button"
                    onClick={() => removeKeyword(k)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <Input 
                type="text" 
                placeholder={keywords.length === 0 ? "Enter keywords and press Enter..." : ""}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 min-w-[200px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
              />
            </div>
          </div>
          <Button 
            type="submit" 
            className="whitespace-nowrap"
            disabled={keywords.length === 0 || !selectedLocation || !selectedLanguage}
          >
            Search Keywords
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {/* Location selector */}
        <div>
          <Label>Location</Label>
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
          <Label>Language</Label>
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
          <Label>Results Limit</Label>
          <SearchableSelect 
            value={selectedLimit.toString()}
            onValueChange={(value) => setSelectedLimit(parseInt(value, 10))}
            items={limitItems}
            placeholder="Select limit"
          />
        </div>
        
        {/* Options */}
        <div>
          <Label>Options</Label>
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
          </div>
        </div>
      </div>
      
      {/* Display selected values for debugging - more compact */}
      {(selectedLocation || selectedLanguage) && (
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
        </div>
      )}
    </form>
  );
} 