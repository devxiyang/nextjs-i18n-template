"use server";

import { KeywordIdeasTask, KeywordSuggestionsTask, LocationAndLanguage, RelatedKeywordsTask } from '@/lib/types.thirdapi';

/**
 * Fetches available locations and languages from DataForSEO API
 * @returns List of locations and languages
 */
export async function fetchLocations(): Promise<LocationAndLanguage[]> {
    try {
        const response = await fetch('https://api.dataforseo.com/v3/dataforseo_labs/locations_and_languages', {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${process.env.DATAFORSEO_AUTH_TOKEN}`,
                'Content-Type': 'application/json'
            },
            next: { revalidate: 86400 } // Revalidate every 24 hours
        });

        if (!response.ok) {
            throw new Error(`Error fetching locations: ${response.status}`);
        }

        const data = await response.json();
        if (data.status_code !== 20000) {
            throw new Error(`DataForSEO API Error: ${data.status_message} (${data.status_code})`);
        }
        if (data.tasks.length === 0) {
            throw new Error(`No tasks returned from DataForSEO API`);
        }

        return data.tasks[0].result || [];
    } catch (error) {
        console.error('Error fetching DataForSEO locations:', error);
        return [];
    }
}

/**
 * Fetches related keywords for a given keyword and location
 * @param keyword - The keyword to fetch related keywords for
 * @param locationName - The location name to fetch related keywords for
 * @param languageName - The language name to fetch related keywords for
 * @param depth - The depth of the related keywords to fetch (defaults to 3)
 * @param limit - Maximum number of results to return (defaults to 20)
 * @returns List of related keywords
 */
export async function fetchRelatedKeywords(
    keyword: string,
    locationName: string,
    languageName: string,
    depth: number = 3,
    limit: number = 20
): Promise<RelatedKeywordsTask | null> {
    try {
        console.log(`API call params: location_name=${locationName}, language_name=${languageName}`);

        const response = await fetch(`https://api.dataforseo.com/v3/dataforseo_labs/google/related_keywords/live`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${process.env.DATAFORSEO_AUTH_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([
                {
                    keyword: keyword,
                    location_name: locationName,
                    language_name: languageName,
                    depth: depth,
                    limit: limit
                }
            ])
        });

        if (!response.ok) {
            throw new Error(`Error fetching related keywords: ${response.status}`);
        }

        const data = await response.json();

        if (data.status_code !== 20000) {
            throw new Error(`DataForSEO API Error: ${data.status_message} (${data.status_code})`);
        }

        if (data.tasks.length === 0) {
            throw new Error(`No tasks returned from DataForSEO API`);
        }

        return data.tasks[0] || null;
    } catch (error) {
        console.error('Error fetching DataForSEO related keywords:', error);
        return null;
    }
}

/**
 * Fetches keyword suggestions for a given keyword and location
 * @param keyword - The keyword to fetch suggestions for
 * @param locationName - The location name to fetch suggestions for
 * @param languageName - The language name to fetch suggestions for
 * @param include_serp_info - Whether to include SERP information
 * @param include_seed_keyword - Whether to include seed keyword information
 * @param limit - Maximum number of results to return (defaults to 20)
 * @returns Keyword suggestions task with results
 */
export async function keywordSuggestions(
    keyword: string,
    locationName: string, 
    languageName: string, 
    include_serp_info: boolean = true,
    include_seed_keyword: boolean = true,
    limit: number = 20
): Promise<KeywordSuggestionsTask | null> {
    try {
        console.log(`API call params: keyword=${keyword}, location_name=${locationName}, language_name=${languageName}, include_serp_info=${include_serp_info}, include_seed_keyword=${include_seed_keyword}, limit=${limit}`);

        const response = await fetch(`https://api.dataforseo.com/v3/dataforseo_labs/google/keyword_suggestions/live`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${process.env.DATAFORSEO_AUTH_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([
                {
                    keyword: keyword,
                    location_name: locationName,
                    language_name: languageName,
                    include_serp_info: include_serp_info,
                    include_seed_keyword: include_seed_keyword,
                    limit: limit
                }
            ])
        });

        if (!response.ok) {
            throw new Error(`Error fetching keyword suggestions: ${response.status}`);
        }

        const data = await response.json();

        console.log(`DataForSEO keyword suggestions response:`, data);

        if (data.status_code !== 20000) {
            throw new Error(`DataForSEO API Error: ${data.status_message} (${data.status_code})`);
        }

        if (data.tasks.length === 0) {
            throw new Error(`No tasks returned from DataForSEO API`);
        }

        return data.tasks[0] || null;
    } catch (error) {
        console.error('Error fetching DataForSEO keyword suggestions:', error);
        return null;
    }
}

export async function fetchKeywordIdeas(
    keywords: string[],
    locationName: string,
    languageName: string,
    include_serp_info: boolean = true,
    limit: number = 20
): Promise<KeywordIdeasTask | null> {
    try {
        console.log(`Keyword Ideas API call params: keywords=${keywords.join(',')}, location_name=${locationName}, language_name=${languageName}, include_serp_info=${include_serp_info}, limit=${limit}`);

        const response = await fetch(`https://api.dataforseo.com/v3/dataforseo_labs/google/keyword_ideas/live`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${process.env.DATAFORSEO_AUTH_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([
                {
                    keywords: keywords,
                    location_name: locationName,
                    language_name: languageName,
                    include_serp_info: include_serp_info,
                    limit: limit
                }
            ])
        });

        if (!response.ok) {
            throw new Error(`Error fetching keyword ideas: ${response.status}`);
        }

        const data = await response.json();

        console.log(`DataForSEO keyword ideas response:`, data);

        if (data.status_code !== 20000) {
            throw new Error(`DataForSEO API Error: ${data.status_message} (${data.status_code})`);
        }

        if (data.tasks.length === 0) {
            throw new Error(`No tasks returned from DataForSEO API`);
        }

        return data.tasks[0] || null;
    } catch (error) {
        console.error('Error fetching DataForSEO keyword ideas:', error);
        return null;
    }
}
