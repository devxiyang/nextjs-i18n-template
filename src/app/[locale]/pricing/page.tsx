'use client'

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function Pricing() {
  const t = useTranslations();
  
  return (
    <div className="min-h-screen bg-gray-900 text-white py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4 text-white">
              {t('pricing.title')}
            </h1>
            <p className="text-gray-400 max-w-xl mx-auto text-lg">
              {t('pricing.subtitle')}
            </p>
          </div>

          {/* 按结果付费模型 */}
          <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 mb-12">
            <div className="p-8">              
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 pb-8 border-b border-gray-700">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    按结果条数付费
                  </h2>
                  <p className="text-gray-400">
                    灵活、透明，无最低消费
                  </p>
                </div>
                <div className="mt-6 md:mt-0">
                  <div className="text-3xl font-bold text-blue-400">
                    $0.02<span className="text-gray-400 text-lg font-normal"> / 结果条目</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-300">
                    无最低消费限制，只需为实际使用的部分付费
                  </span>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-300">
                    提供便捷的在线工具，轻松获取关键词数据
                  </span>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-300">
                    没有订阅费用，完全按使用量计费
                  </span>
                </div>
              </div>

              <div>
                <Link
                  href="/protected/keywords"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {t('common.cta.tryFree')}
                </Link>
              </div>
            </div>
          </div>

          {/* 价格示例 */}
          <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 p-8">
            <h2 className="text-xl font-bold text-white mb-6">价格示例</h2>
            
            <div className="space-y-6">
              <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">100 个结果条目</span>
                  <span className="font-medium text-white">$2.00</span>
                </div>
                <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">1,000 个结果条目</span>
                  <span className="font-medium text-white">$20.00</span>
                </div>
                <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">10,000 个结果条目</span>
                  <span className="font-medium text-white">$200.00</span>
                </div>
                <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p>无需信用卡，Beta 期间免费使用</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 