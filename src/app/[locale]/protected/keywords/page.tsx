import { Suspense } from "react";
import KeywordsSearch from "@/components/search/KeywordRelatedSearch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KeywordSuggestions from "@/components/search/KeywordSuggestionsSearch";
import KeywordIdeaSearch from "@/components/search/KeywordIdeaSearch";
import { useTranslations } from "next-intl";

// 加载状态组件
function KeywordsLoading() {
  const t = useTranslations('keywords');
  
  return (
    <div className="flex items-center justify-center py-8">
      <div className="animate-pulse text-lg">{t('loading')}</div>
    </div>
  );
}

export default function KeywordsPage() {
    const t = useTranslations('keywords');
    
    // 由于 layout.tsx 已经处理了数据获取和 store 水合，这里无需再重复
    return (
        <div className="container mx-auto p-4">
            <Tabs defaultValue="related" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="related">{t('tabs.related')}</TabsTrigger>
                    <TabsTrigger value="suggestions">{t('tabs.suggestions')}</TabsTrigger>
                    <TabsTrigger value="ideas">{t('tabs.ideas')}</TabsTrigger>
                </TabsList>
                <TabsContent value="related">
                    {/* 使用 Suspense 包裹客户端组件，提供加载状态 */}
                    <Suspense fallback={<KeywordsLoading />}>
                        <KeywordsSearch />
                    </Suspense>
                </TabsContent>
                <TabsContent value="suggestions">
                    <Suspense fallback={<KeywordsLoading />}>
                        <KeywordSuggestions />
                    </Suspense>
                </TabsContent>
                <TabsContent value="ideas">
                    <Suspense fallback={<KeywordsLoading />}>
                        <KeywordIdeaSearch />   
                    </Suspense>
                </TabsContent>
            </Tabs>
        </div>
    );
}