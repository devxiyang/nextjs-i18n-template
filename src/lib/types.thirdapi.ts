/**
 * Interface representing the available language information from DataForSEO
 * Contains language details and available sources for SEO data
 */
export interface AvailableLanguage {
    available_sources: string[]    // Sources providing data for this language
    language_name: string          // Full name of the language
    language_code: string          // ISO code for the language
    keywords: number               // Number of available keywords
    serps: number                  // Number of available search engine result pages
}

/**
 * Interface representing location and language data from DataForSEO
 * Contains detailed information about geographical locations and their supported languages
 */
export interface LocationAndLanguage {
    location_code: number           // Unique identifier for the location
    location_name: string           // Human-readable name of the location
    location_code_parent: number | null  // Parent location code if applicable
    country_iso_code: string        // ISO code for the country
    location_type: string           // Type of location (e.g., "Country", "City")
    available_languages: AvailableLanguage[]  // Languages supported in this location
}

/**
 * Common task response structure from DataForSEO APIs
 */
export interface DataForSEOBaseTask {
    id: string                     // Unique identifier for the task
    status_code: number            // HTTP status code of the response
    status_message: string         // Status message ("Ok." for successful requests)
    time: string                   // Execution time in seconds
    cost: number                   // Cost of the task in USD
    result_count?: number          // Number of elements in the result array
    path?: string[]                // URL path components
}

/**
 * Common keyword information structure
 */
export interface BaseKeywordInfo {
    se_type: string                // Search engine type
    last_updated_time: string      // Last time the data was updated
    search_volume: number          // Monthly search volume
}

/**
 * Monthly search volume history structure
 */
export interface MonthlySearch {
    year: number
    month: number
    search_volume: number
}

/**
 * Common normalized keyword information structure
 */
export interface NormalizedKeywordInfo {
    last_updated_time: string      // Last time the data was updated
    search_volume: number          // Search volume
    is_normalized: boolean         // Whether data is normalized
    monthly_searches: Array<{      // Monthly search volume history
        year: number
        month: number
        search_volume: number
    }>
}

/**
 * Common SERP information structure
 */
export interface SerpInfo {
    se_type: string                // Search engine type
    check_url: string              // URL used for checking
    serp_item_types: string[]      // Types of items in SERP
    se_results_count: number       // Number of search results
    last_updated_time: string      // Last time the data was updated
    previous_updated_time: string  // Previous update time
}

/**
 * Common search intent information structure
 */
export interface SearchIntentInfo {
    se_type: string                // Search engine type
    main_intent: string            // Main search intent
    foreign_intent: string[] | null // Foreign intent or null
    last_updated_time: string      // Last time the data was updated
}

/**
 * Common backlinks information structure
 */
export interface AvgBacklinksInfo {
    se_type: string                // Search engine type
    backlinks: number              // Number of backlinks
    dofollow: number               // Number of dofollow links
    referring_pages: number        // Number of referring pages
    referring_domains: number      // Number of referring domains
    referring_main_domains: number // Number of referring main domains
    rank: number                   // Rank
    main_domain_rank: number       // Main domain rank
    last_updated_time: string      // Last time the data was updated
}

/**
 * Common keyword properties structure
 */
export interface KeywordProperties {
    se_type: string                // Search engine type
    core_keyword: string | null    // Core keyword or null
    synonym_clustering_algorithm: string // Algorithm used for clustering
    keyword_difficulty: number     // Keyword difficulty score (0-100)
    detected_language: string      // Detected language of the keyword
    is_another_language: boolean   // Whether keyword is in another language
}

/**
 * Extended keyword information with competition metrics
 */
export interface KeywordInfo extends BaseKeywordInfo {
    competition: number            // Competition metric (0 to 1)
    competition_level: string      // Competition level descriptor (LOW, MEDIUM, HIGH)
    cpc: number                    // Average cost per click
    low_top_of_page_bid?: number   // Low top-of-page bid estimate
    high_top_of_page_bid?: number  // High top-of-page bid estimate
    categories?: number[]          // Product and service categories
    monthly_searches: Array<{      // Monthly search volume history
        year: number
        month: number
        search_volume: number
    }>
    search_volume_trend?: {        // Search volume trend metrics
        monthly: number            // Monthly trend
        quarterly: number          // Quarterly trend
        yearly: number             // Yearly trend
    }
}

/**
 * Impressions information structure
 */
export interface ImpressionInfo {
    se_type: string                // Search engine type
    last_updated_time: string | null // Last time the data was updated
    bid: number | null             // Bid amount
    match_type: string | null      // Match type (e.g., "exact")
    ad_position_min: number | null // Minimum ad position
    ad_position_max: number | null // Maximum ad position
    ad_position_average: number | null // Average ad position
    cpc_min: number | null         // Minimum cost per click
    cpc_max: number | null         // Maximum cost per click
    cpc_average: number | null     // Average cost per click
    daily_impressions_min: number | null // Minimum daily impressions
    daily_impressions_max: number | null // Maximum daily impressions
    daily_impressions_average: number | null // Average daily impressions
    daily_clicks_min: number | null // Minimum daily clicks
    daily_clicks_max: number | null // Maximum daily clicks
    daily_clicks_average: number | null // Average daily clicks
    daily_cost_min: number | null  // Minimum daily cost
    daily_cost_max: number | null  // Maximum daily cost
    daily_cost_average: number | null // Average daily cost
}

/**
 * Interface representing a task in the DataForSEO related keywords response
 * Contains the task metadata, data sent in the request, and the results
 */
export interface RelatedKeywordsTask extends DataForSEOBaseTask {
    data: {                        // Contains the parameters specified in the POST request
        api: string                // API name ("dataforseo_labs")
        function: string           // API function ("related_keywords")
        se_type: string            // Search engine type ("google")
        keyword: string            // The keyword specified in the request
        language_name: string      // Language name
        location_code: number      // Location code
        limit?: number             // Maximum number of results to return
        filters?: Array<any>       // Optional filters applied to the request
        depth?: number             // Optional search depth parameter
        offset?: number            // Optional offset for pagination
    }
    result: DataForSEORelatedKeywordsResult[]  // Array of result objects
}

/**
 * Interface representing the result of a related keywords query
 */
export interface DataForSEORelatedKeywordsResult {
    se_type: string                // Search engine type (e.g., "google")
    seed_keyword: string           // The original keyword used for the query
    seed_keyword_data: any         // Data about the seed keyword (can be null)
    location_code: number          // Location code for the search
    language_code: string          // Language code for the search
    total_count: number            // Total number of related keywords
    items_count: number            // Number of items in the current result
    items: DataForSEORelatedKeywordsItem[]   // Array of related keyword items
    offset?: number                // Offset for pagination if applicable
    offset_token?: string          // Token for pagination continuation if applicable
}

/**
 * Interface representing related keywords data from DataForSEO
 * Contains information about a keyword and its related keywords
 */
export interface DataForSEORelatedKeywordsItem {
    se_type: string                // Search engine type (e.g., "google")
    keyword_data: {                // Data about the keyword
        se_type: string            // Search engine type
        keyword: string            // The keyword
        location_code: number      // Location code for the search
        language_code: string      // Language code for the search
        keyword_info?: {           // Optional keyword information
            se_type: string        // Search engine type
            last_updated_time: string  // Last time the data was updated
            competition: number    // Competition metric (0 to 1)
            competition_level: string  // Competition level descriptor (LOW, MEDIUM, HIGH)
            cpc: number            // Average cost per click
            search_volume: number  // Monthly search volume
            low_top_of_page_bid?: number  // Low top-of-page bid estimate
            high_top_of_page_bid?: number // High top-of-page bid estimate
            categories: number[]   // Product and service categories
            monthly_searches: Array<{  // Monthly search volume history
                year: number
                month: number
                search_volume: number
            }>
            search_volume_trend: {  // Search volume trend metrics
                monthly: number    // Monthly trend
                quarterly: number  // Quarterly trend
                yearly: number     // Yearly trend
            }
        }
        clickstream_keyword_info?: any  // Clickstream keyword information
        keyword_properties?: KeywordProperties  // Additional keyword properties
        impressions_info?: ImpressionInfo  // Impressions information
        serp_info?: SerpInfo       // SERP information
        avg_backlinks_info?: AvgBacklinksInfo  // Average backlinks information
        search_intent_info?: SearchIntentInfo  // Search intent information
        keyword_info_normalized_with_bing?: NormalizedKeywordInfo  // Normalized keyword info with Bing
        keyword_info_normalized_with_clickstream?: NormalizedKeywordInfo  // Normalized keyword info with clickstream
    }
    depth: number                  // Depth level in the related keywords tree
    related_keywords: string[]     // List of related keywords
}

/**
 * Interface for keyword suggestions task
 */
export interface KeywordSuggestionsTask extends DataForSEOBaseTask {
    data: {
        api: string                // API name ("dataforseo_labs")
        function: string           // API function ("keyword_suggestions")
        se_type: string            // Search engine type ("google")
        keyword: string            // The keyword used for the request
        location_name: string      // Location name
        language_name: string      // Language name
        include_serp_info: boolean // Whether to include SERP info
        include_seed_keyword: boolean // Whether to include seed keyword
        limit: number              // Maximum number of results
    }
    result: KeywordSuggestionResult[] // Array of keyword suggestion results
}

/**
 * Interface for keyword suggestion result
 */
export interface KeywordSuggestionResult {
    se_type: string                // Search engine type
    seed_keyword: string           // The original seed keyword
    seed_keyword_data: {           // Data about the seed keyword
        se_type: string            // Search engine type
        keyword: string            // The keyword
        location_code: number      // Location code
        language_code: string      // Language code
        keyword_info?: KeywordInfo // Keyword information
        keyword_info_normalized_with_bing?: NormalizedKeywordInfo | null // Normalized keyword info with Bing
        keyword_info_normalized_with_clickstream?: NormalizedKeywordInfo | null // Normalized keyword info with clickstream
        clickstream_keyword_info?: any | null // Clickstream keyword information
        impressions_info?: ImpressionInfo // Impressions information
        serp_info?: SerpInfo       // SERP information
        keyword_properties?: KeywordProperties // Keyword properties
        search_intent_info?: SearchIntentInfo // Search intent information
        avg_backlinks_info?: AvgBacklinksInfo // Average backlinks information
    }
    location_code: number          // Location code for the search
    language_code: string          // Language code for the search
    total_count: number            // Total number of keyword suggestions
    items_count: number            // Number of items in the current result
    offset: number                 // Offset for pagination
    offset_token: string           // Token for pagination continuation
    items: KeywordSuggestionItem[] // Array of keyword suggestion items
}

/**
 * Interface for keyword suggestion item
 */
export interface KeywordSuggestionItem {
    se_type: string                // Search engine type
    keyword: string                // The suggested keyword
    location_code: number          // Location code
    language_code: string          // Language code
    keyword_info?: KeywordInfo     // Keyword information
    keyword_info_normalized_with_bing?: NormalizedKeywordInfo | null // Normalized keyword info with Bing
    keyword_info_normalized_with_clickstream?: NormalizedKeywordInfo | null // Normalized keyword info with clickstream
    clickstream_keyword_info?: any | null // Clickstream keyword information
    keyword_properties?: KeywordProperties // Keyword properties
    impressions_info?: ImpressionInfo // Impressions information
    serp_info?: SerpInfo           // SERP information
    avg_backlinks_info?: AvgBacklinksInfo // Average backlinks information
    search_intent_info?: SearchIntentInfo // Search intent information
}


/**
 * Interface for keyword ideas task
 */
export interface KeywordIdeasTask extends DataForSEOBaseTask {
    result: KeywordIdeasResult[];
}

/**
 * Interface for keyword ideas result
 */
export interface KeywordIdeasResult {
    se_type: string                // Search engine type
    seed_keywords: string[]        // The original seed keywords
    location_code: number          // Location code for the search
    language_code: string          // Language code for the search
    total_count: number            // Total number of keyword ideas
    items_count: number            // Number of items in the current result
    offset: number                 // Offset for pagination
    offset_token: string           // Token for pagination continuation
    items: KeywordIdeasItem[]      // Array of keyword ideas items
}

/**
 * Interface for keyword ideas item
 */
export interface KeywordIdeasItem {
    se_type: string                // Search engine type
    keyword: string                // The suggested keyword
    location_code: number          // Location code
    language_code: string          // Language code
    keyword_info?: KeywordInfo     // Keyword information
    keyword_info_normalized_with_bing?: NormalizedKeywordInfo | null // Normalized keyword info with Bing
    keyword_info_normalized_with_clickstream?: NormalizedKeywordInfo | null // Normalized keyword info with clickstream
    clickstream_keyword_info?: any | null // Clickstream keyword information
    keyword_properties?: KeywordProperties // Keyword properties
    impressions_info?: ImpressionInfo // Impressions information
    serp_info?: SerpInfo           // SERP information
    avg_backlinks_info?: AvgBacklinksInfo // Average backlinks information
    search_intent_info?: SearchIntentInfo // Search intent information
}
// End of Selection