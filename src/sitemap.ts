import { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  
  // 定义所有需要生成站点地图的路径
  const routes = [
    '',  // 首页
    '/templates', // 模板页
    '/builder', // 简历构建器页面
  ]

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