"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { KeywordIdeasTask } from "@/lib/types.thirdapi";
import { useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

// 引入单元格组件
import KeywordCell from "./tablecell/KeywordCell";
import SearchVolumeCell from "./tablecell/SearchVolumeCell";
import KeywordDifficultyCell from "./tablecell/KeywordDifficultyCell";
import CPCCell from "./tablecell/CPCCell";
import CompetitionCell from "./tablecell/CompetitionCell";
import SearchIntentCell from "./tablecell/SearchIntentCell";
import BacklinksCell from "./tablecell/BacklinksCell";

interface KeywordIdeasResultTableProps {
  data: KeywordIdeasTask | null;
  isLoading: boolean;
  error?: string | null;
}

export default function KeywordIdeasResultTable({ 
  data, 
  isLoading, 
  error 
}: KeywordIdeasResultTableProps) {
  // 获取关键词数据
  const keywords = useMemo(() => 
    data?.result?.[0]?.items || [], 
    [data]
  );
  
  // 导出CSV
  const exportToCSV = useCallback(() => {
    if (!keywords.length) return;
    
    const headers = ["Keyword", "Search Volume", "KD", "CPC", "Competition", "Search Intent", "Backlinks"];
    const csvContent = [
      headers.join(","),
      ...keywords.map(item => 
        [
          `"${item.keyword}"`, 
          item.keyword_info?.search_volume || 0,
          item.keyword_properties?.keyword_difficulty || 0,
          item.keyword_info?.cpc || 0, 
          item.keyword_info?.competition_level || "N/A",
          item.search_intent_info?.main_intent || "N/A",
          item.avg_backlinks_info?.backlinks || 0
        ].join(",")
      )
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const fileName = `keyword-ideas-${new Date().toISOString().slice(0,10)}.csv`;
    
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // 清理创建的URL对象
  }, [keywords]);
  
  // 渲染加载状态
  if (isLoading) {
    return (
      <div className="rounded-lg border bg-white dark:bg-gray-900 shadow-sm p-4">
        <div className="flex items-center justify-center h-40">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading keyword ideas...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // 渲染错误状态
  if (error) {
    return (
      <div className="rounded-lg border bg-white dark:bg-gray-900 shadow-sm p-4">
        <div className="flex items-center justify-center h-40">
          <div className="text-center text-red-500 dark:text-red-400">
            <p className="mb-2 font-semibold">Error loading keyword ideas</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }
  
  // 渲染空状态
  if (!data || !keywords.length) {
    return (
      <div className="rounded-lg border bg-white dark:bg-gray-900 shadow-sm p-4">
        <div className="flex items-center justify-center h-40">
          <div className="text-center text-muted-foreground">
            <p>No keyword ideas found. Try different keywords.</p>
          </div>
        </div>
      </div>
    );
  }
  
  // 渲染表格
  return (
    <div className="rounded-lg border bg-white dark:bg-gray-900 shadow-sm">
      {/* 表格工具栏 */}
      <div className="p-4 flex justify-between items-center border-b">
        {/* 计数和导出 */}
        <div className="text-sm text-muted-foreground">
          {keywords.length} keyword ideas
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={exportToCSV}
          className="whitespace-nowrap"
          disabled={keywords.length === 0}
        >
          <Download className="h-4 w-4 mr-2" /> Export CSV
        </Button>
      </div>
      
      {/* 关键词表格 */}
      <div className="relative overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-100 dark:bg-gray-800">
            <TableRow>
              {/* 表头 */}
              <TableHead className="w-[20%] font-bold text-gray-700 dark:text-gray-200">Keyword</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-200">Search Volume</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-200">KD</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-200">CPC</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-200">Competition</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-200">Search Intent</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-200">Backlinks</TableHead>
            </TableRow>
          </TableHeader>
          
          {/* 表格内容 */}
          <TableBody className="bg-white dark:bg-gray-900">
            {keywords.map((item, index) => {
              const keywordInfo = item.keyword_info;
              
              return (
                <TableRow key={index} className="bg-white dark:bg-gray-900">
                  {/* 使用抽象的单元格组件 */}
                  <TableCell>
                    <KeywordCell keyword={item.keyword} />
                  </TableCell>
                  
                  <TableCell>
                    <SearchVolumeCell 
                      searchVolume={keywordInfo?.search_volume} 
                      monthly_searches={keywordInfo?.monthly_searches || []}
                    />
                  </TableCell>
                  
                  <TableCell>
                    <KeywordDifficultyCell 
                      keywordDifficulty={item.keyword_properties?.keyword_difficulty} 
                    />
                  </TableCell>
                  
                  <TableCell>
                    <CPCCell cpc={keywordInfo?.cpc} />
                  </TableCell>
                  
                  <TableCell>
                    <CompetitionCell competitionLevel={keywordInfo?.competition_level} />
                  </TableCell>

                  <TableCell>
                    <SearchIntentCell searchIntent={item.search_intent_info?.main_intent} />
                  </TableCell>

                  <TableCell>
                    <BacklinksCell backlinksInfo={item.avg_backlinks_info} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 