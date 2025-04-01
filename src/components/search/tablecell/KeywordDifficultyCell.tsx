// 获取关键词难度条的宽度
const getKDWidth = (kd?: number): string => {
    if (kd === undefined) return "0%";
    return `${Math.min(100, Math.max(0, kd))}%`;
};

// 获取关键词难度级别
const getKDLevel = (kd?: number): string => {
    if (kd === undefined) return "N/A";
    if (kd >= 85) return "Very Hard";
    if (kd >= 70) return "Hard";
    if (kd >= 50) return "Moderate";
    if (kd >= 30) return "Easy";
    return "Very Easy";
};

export default function KeywordDifficultyCell({ 
    keywordDifficulty 
}: { 
    keywordDifficulty?: number 
}) {
    return (
        <div className="flex items-center">
            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: getKDWidth(keywordDifficulty) }}
                />
            </div>
            {keywordDifficulty !== undefined 
                ? `${keywordDifficulty} (${getKDLevel(keywordDifficulty)})` 
                : "N/A"}
        </div>
    );
} 