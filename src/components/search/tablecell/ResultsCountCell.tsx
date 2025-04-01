export default function ResultsCountCell({ 
    resultsCount 
}: { 
    resultsCount?: number 
}) {
    return (
        <div>
            {resultsCount 
                ? resultsCount.toLocaleString() 
                : "—"}
        </div>
    );
} 