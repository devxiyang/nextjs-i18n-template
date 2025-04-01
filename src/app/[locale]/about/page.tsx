'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation';
import { FaTwitter } from 'react-icons/fa';

export default function About() {
    const t = useTranslations()
    
    return (
        <div className="min-h-screen bg-gray-900 text-white py-24">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold mb-4 text-white">
                            {t('about.title')}
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            {t('about.subtitle')}
                        </p>
                    </div>

                    <div className="space-y-12">
                        {/* 使命部分 */}
                        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
                            <h2 className="text-2xl font-bold mb-4 text-white">
                                {t('about.mission.title')}
                            </h2>
                            <p className="text-gray-300 leading-relaxed">
                                {t('about.mission.content')}
                            </p>
                        </div>

                        {/* 当前状态部分 */}
                        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
                            <h2 className="text-2xl font-bold mb-4 text-white">
                                {t('about.team.title')}
                            </h2>
                            <p className="text-gray-300 leading-relaxed">
                                {t('about.team.content')}
                            </p>
                        </div>

                        {/* 核心原则部分 */}
                        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
                            <h2 className="text-2xl font-bold mb-6 text-white">
                                {t('about.values.title')}
                            </h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                {Object.entries(t.raw('about.values.items')).map(([key, value]: [string, any]) => (
                                    <div key={key} className="p-6 bg-gray-700/30 rounded-lg">
                                        <h3 className="text-xl font-semibold mb-3 text-white">
                                            {value.title}
                                        </h3>
                                        <p className="text-gray-400">
                                            {value.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 联系部分 */}
                        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center">
                            <h2 className="text-2xl font-bold mb-4 text-white">联系我们</h2>
                            <p className="text-gray-300 mb-6">
                                有任何问题或建议？我们期待您的反馈！
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Link
                                    href="/protected/keywords"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    开始使用
                                </Link>
                                <a
                                    href="https://x.com/@devxiyang"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-gray-800 text-white font-medium rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
                                >
                                    <FaTwitter className="w-5 h-5" />
                                    <span>在 X 上关注我们</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}