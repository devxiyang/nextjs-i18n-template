import { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { navigation, siteConfig } from '@/config/site.config'
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''
  
  // 定义所有需要生成站点地图的路径
  // 根据配置的语言定义路由
  const routes = navigation.map((item: any) => item.href)

  // 为每个语言生成对应的 URL
  const sitemapEntries = routing.locales.flatMap(locale => 
    routes.map(route => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: route === '' ? 1 : route === '/templates' ? 0.8 : 0.6,
    }))
  )

  // 添加根路径，它会重定向到默认语言
  sitemapEntries.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  })

  return sitemapEntries
} 