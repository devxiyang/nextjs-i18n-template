import { siteConfig, navigation } from "@/config/site.config";
import { MetadataRoute } from 'next';

// 定义频率类型
type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

/**
 * Next.js 15 标准 Sitemap 生成方法
 * 使用 site.config.ts 中的 navigation 数组自动生成路由
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  // 从 navigation 配置生成页面列表
  const pages = [
    // 首页特殊处理
    {
      path: '',
      priority: 1.0,
      changeFrequency: 'daily' as ChangeFrequency
    },
    // 从导航配置中提取其他页面
    ...navigation.map(item => ({
      path: item.href.startsWith('/') ? item.href.slice(1) : item.href, // 移除开头的斜杠
      priority: item.href === '/' ? 1.0 : 0.8, // 主页更高优先级
      changeFrequency: (item.href === '/' ? 'daily' : 'weekly') as ChangeFrequency
    }))
  ];
  
  // 根据配置的语言和页面生成所有国际化路由
  const routes: MetadataRoute.Sitemap = siteConfig.locales.flatMap(locale => {
    return pages.map(page => ({
      url: `${baseUrl}/${locale}${page.path ? `/${page.path}` : ''}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    }));
  });
  
  // 添加根路径（默认会重定向到默认语言）
  routes.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'daily' as ChangeFrequency,
    priority: 0.8,
  });
  
  return routes;
} 