// 获取竞争程度条的宽度
const getCompetitionWidth = (level?: string): string => {
    switch (level) {
        case "HIGH": return "100%";
        case "MEDIUM": return "66%";
        case "LOW": return "33%";
        default: return "0%";
    }
};

export default function CompetitionCell({ 
    competitionLevel 
}: { 
    competitionLevel?: string 
}) {
    return (
        <div className="flex items-center">
            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: getCompetitionWidth(competitionLevel) }}
                />
            </div>
            {competitionLevel || "N/A"}
        </div>
    );
} 