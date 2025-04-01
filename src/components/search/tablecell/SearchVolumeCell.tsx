import MonthlyTrendsLine from "@/components/search/tablecell/MonthlyTrendsLine";

export default function SearchVolumeCell({ 
    searchVolume,
    monthly_searches
}: { 
    searchVolume?: number,
    monthly_searches?: Array<{ year: number, month: number, search_volume: number }>
}) {
    return (
        <div className="flex items-center">
            <div className="mr-2">
                {searchVolume 
                    ? searchVolume.toLocaleString() 
                    : "—"}
            </div>
            {monthly_searches && monthly_searches.length > 0 && (
                <div className="ml-2">
                    <MonthlyTrendsLine 
                        monthly_searches={monthly_searches} 
                        width={50} 
                        height={15}
                    />
                </div>
            )}
        </div>
    );
} 