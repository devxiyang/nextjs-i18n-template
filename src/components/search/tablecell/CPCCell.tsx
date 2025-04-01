export default function CPCCell({ 
    cpc 
}: { 
    cpc?: number 
}) {
    return (
        <div>
            {cpc 
                ? `$${cpc.toFixed(2)}` 
                : "—"}
        </div>
    );
} 