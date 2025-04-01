// 获取搜索意图标签的颜色
const getIntentColor = (intent?: string): string => {
    switch (intent) {
        case "informational": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
        case "commercial": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
        case "transactional": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
        case "navigational": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
        default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
};

export default function SearchIntentCell({ 
    searchIntent 
}: { 
    searchIntent?: string 
}) {
    return (
        <>
            {searchIntent ? (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getIntentColor(searchIntent)}`}>
                    {searchIntent}
                </span>
            ) : "—"}
        </>
    );
} 