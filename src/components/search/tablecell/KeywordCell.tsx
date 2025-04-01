export default function KeywordCell({ 
    keyword 
}: { 
    keyword: string 
}) {
    return (
        <div className="font-medium">
            {keyword}
        </div>
    );
} 