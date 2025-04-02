import { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { navigation } from '@/config/site.config'
import { siteConfig } from "@/config/site.config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  // Define all paths that need to be included in the sitemap
  // Create routes based on configured languages
  const routes = siteConfig.locales.flatMap(locale => {
    
    // Generate URLs for each language
    return [
      {
        url: `${baseUrl}/${locale}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1.0,
      },
      // Add more routes as needed for each language
    ];
  });
  
  // Add root path which redirects to default language
  routes.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  });
  
  return routes;
} 