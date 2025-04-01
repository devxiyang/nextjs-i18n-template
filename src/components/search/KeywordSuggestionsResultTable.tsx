"use client";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { KeywordSuggestionsTask } from "@/lib/types.thirdapi";
import { Download } from "lucide-react";
import { useCallback, useMemo } from "react";

// Import cell components
import BacklinksCell from "./tablecell/BacklinksCell";
import CPCCell from "./tablecell/CPCCell";
import CompetitionCell from "./tablecell/CompetitionCell";
import KeywordCell from "./tablecell/KeywordCell";
import KeywordDifficultyCell from "./tablecell/KeywordDifficultyCell";
import SearchIntentCell from "./tablecell/SearchIntentCell";
import SearchVolumeCell from "./tablecell/SearchVolumeCell";

interface KeywordSuggestionsResultTableProps {
  data: KeywordSuggestionsTask | null;
  isLoading: boolean;
  error?: string | null;
}

export default function KeywordSuggestionsResultTable({ 
  data, 
  isLoading, 
  error 
}: KeywordSuggestionsResultTableProps) {
  // Get keyword suggestions items
  const suggestions = useMemo(() => {
    if (!data || !data.result || data.result.length === 0) {
      return [];
    }
    return data.result[0].items || [];
  }, [data]);
  
  // Export to CSV
  const exportToCSV = useCallback(() => {
    if (!suggestions.length) return;
    
    const headers = ["Keyword", "Search Volume", "KD", "CPC", "Competition", "Search Intent", "Backlinks"];
    const csvContent = [
      headers.join(","),
      ...suggestions.map(item => {
        const keywordInfo = item.keyword_info;
        return [
          `"${item.keyword}"`, 
          keywordInfo?.search_volume || 0,
          item.keyword_properties?.keyword_difficulty || 0,
          keywordInfo?.cpc || 0, 
          keywordInfo?.competition_level || "N/A",
          item.search_intent_info?.main_intent || "N/A",
          item.avg_backlinks_info?.backlinks || 0
        ].join(",");
      })
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const fileName = `keyword-suggestions-${new Date().toISOString().slice(0,10)}.csv`;
    
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up the created URL object
  }, [suggestions]);
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="rounded-lg border bg-white dark:bg-gray-900 shadow-sm p-4">
        <div className="flex items-center justify-center h-40">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading keyword suggestions...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="rounded-lg border bg-white dark:bg-gray-900 shadow-sm p-4">
        <div className="flex items-center justify-center h-40">
          <div className="text-center text-red-500 dark:text-red-400">
            <p className="mb-2 font-semibold">Error loading keyword suggestions</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Render empty state
  if (!data || !data.result || !data.result.length || !suggestions.length) {
    return (
      <div className="rounded-lg border bg-white dark:bg-gray-900 shadow-sm p-4">
        <div className="flex items-center justify-center h-40">
          <div className="text-center text-muted-foreground">
            <p>No keyword suggestions found. Try a different search.</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Render table
  return (
    <div className="rounded-lg border bg-white dark:bg-gray-900 shadow-sm">
      {/* Table toolbar */}
      <div className="p-4 flex justify-between items-center border-b">
        {/* Count and export */}
        <div className="text-sm text-muted-foreground">
          {data.result[0].total_count} keywords found (showing {suggestions.length})
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={exportToCSV}
          className="whitespace-nowrap"
          disabled={suggestions.length === 0}
        >
          <Download className="h-4 w-4 mr-2" /> Export CSV
        </Button>
      </div>
      
      {/* Keywords table */}
      <div className="relative overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-100 dark:bg-gray-800">
            <TableRow>
              {/* Table headers */}
              <TableHead className="w-[20%] font-bold text-gray-700 dark:text-gray-200">Keyword</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-200">Search Volume</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-200">KD</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-200">CPC</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-200">Competition</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-200">Search Intent</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-200">Backlinks</TableHead>
            </TableRow>
          </TableHeader>
          
          {/* Table content */}
          <TableBody className="bg-white dark:bg-gray-900">
            {suggestions.map((item, index) => {
              const keywordInfo = item.keyword_info;
              
              return (
                <TableRow key={index} className="bg-white dark:bg-gray-900">
                  {/* Use abstracted cell components */}
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
