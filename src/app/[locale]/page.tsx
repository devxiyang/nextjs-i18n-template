'use client'

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { FaTwitter, FaSearch, FaCode, FaRocket, FaChartLine } from 'react-icons/fa';

export default function Home() {
  const t = useTranslations();
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section - 简洁清晰的价值主张 */}
      <div className="relative pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 text-sm font-medium bg-blue-500/10 rounded-full border border-blue-500/20">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              {t('home.hero.beta')}
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              {t('home.hero.title')}
            </h1>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              {t('home.hero.subtitle')}
            </p>
            <Link
              href="/protected/keywords"
              className="px-8 py-4 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
            >
              {t('common.cta.start')}
            </Link>
          </div>
        </div>
      </div>

      {/* 开发者价值点 - 直接简明的价值 */}
      <div className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500/20 mb-4">
                <FaSearch className="text-blue-400 text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">找到利基市场</h3>
              <p className="text-gray-400">发现低竞争且有潜力的关键词，为您的项目找到最佳切入点</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500/20 mb-4">
                <FaCode className="text-blue-400 text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">开发者友好</h3>
              <p className="text-gray-400">专为开发者设计的界面和功能，与您的开发工作流程完美集成</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500/20 mb-4">
                <FaRocket className="text-blue-400 text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">按结果付费</h3>
              <p className="text-gray-400">无需订阅，只为获取的数据付费，让您的预算更加灵活</p>
            </div>
          </div>
        </div>
      </div>

      {/* 功能特性 */}
      <div id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 text-white">
                {t('home.features.title')}
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                {t('home.features.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {Object.entries(t.raw('home.features.items')).map(([key, feature]: [string, any]) => (
                <div
                  key={key}
                  className="bg-gray-800 rounded-lg p-6 border border-gray-700"
                >
                  <div className="w-12 h-12 mb-4 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <span className="text-2xl text-blue-500">
                      {feature.icon}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 定价部分 */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 text-white">
                {t('home.pricing.title')}
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                {t('home.pricing.subtitle')}
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <div className="text-center mb-8">
                <div className="text-4xl font-bold text-white mb-2">
                  {t('home.pricing.price')}
                </div>
                <p className="text-gray-400">
                  {t('home.pricing.subtitle')}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {t.raw('home.pricing.features').map((feature: string, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <Link
                  href="/pricing"
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  查看完整定价
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 数据统计 - 建立信任 */}
      <div className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">100M+</div>
              <p className="text-gray-400">已分析关键词</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">5,000+</div>
              <p className="text-gray-400">开发者用户</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">99.9%</div>
              <p className="text-gray-400">服务可用性</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA 部分 */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-white">
              {t('home.cta.title')}
            </h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              {t('home.cta.subtitle')}
            </p>
            <div className="flex justify-center">
              <Link
                href="/protected/keywords"
                className="px-8 py-4 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
              >
                {t('common.cta.start')}
              </Link>
            </div>
            <div className="mt-8 flex justify-center items-center">
              <a
                href="https://x.com/@devxiyang"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTwitter className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
