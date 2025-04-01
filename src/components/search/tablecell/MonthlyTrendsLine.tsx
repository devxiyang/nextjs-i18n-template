export default function MonthlyTrendsLine({ 
    monthly_searches, 
    width = 200, 
    height = 60
}: { 
    monthly_searches: Array<{ year: number, month: number, search_volume: number }>,
    width?: number,
    height?: number
}) {
    // 检查是否有有效数据
    if (!monthly_searches?.length) {
        return (
            <div style={{ width, height }} className="flex items-center justify-center h-full text-gray-500">
                No trend data
            </div>
        );
    }

    // Sort by year and month
    const sortedData = [...monthly_searches].sort((a, b) => 
        a.year !== b.year ? a.year - b.year : a.month - b.month
    );

    // 如果只有一个数据点，直接显示该数据
    if (sortedData.length === 1) {
        const { year, month, search_volume } = sortedData[0];
        return (
            <div style={{ width, height }} className="flex items-center justify-center h-full text-gray-500">
                {`${year}-${month.toString().padStart(2, '0')}: ${search_volume.toLocaleString()}`}
            </div>
        );
    }

    // Calculate padding and chart dimensions
    const padding = Math.max(Math.min(width, height) * 0.1, 5);
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    // Find min and max values for scaling
    const volumes = sortedData.map(item => item.search_volume);
    const maxVolume = Math.max(...volumes);
    const minVolume = Math.min(...volumes);
    
    // 计算均值
    const avgVolume = volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length;
    
    // 检查是否所有值都相同（避免除以零的情况）
    const allSameValues = maxVolume === minVolume;
    
    // Calculate point coordinates
    const points = sortedData.map((point, index) => {
        // X 坐标计算 - 基于数据点在时间序列中的位置（均匀分布）
        // 根据数据点的数量（sortedData.length）计算间隔
        // 例如：12个月的数据有11个间隔，每个间隔宽度为 chartWidth/11
        const x = padding + (index / (sortedData.length - 1)) * chartWidth;
        
        // Y 坐标计算 - 基于归一化的搜索量值
        // 与数据点数量无关，只与值的相对大小有关
        // 归一化公式：(value - min) / (max - min)，结果在0-1之间
        // 注意：SVG的Y轴从上到下增长，所以需要用height减去计算结果
        const y = allSameValues
            ? height - padding - (chartHeight / 2) // 所有值相同时，居中显示
            : height - padding - ((point.search_volume - minVolume) / (maxVolume - minVolume)) * chartHeight;
            
        return { x, y, ...point };
    });
    
    // 计算均值线的位置 - 使用与数据点相同的归一化方式
    const baselineY = allSameValues
        ? height - padding - (chartHeight / 2)
        : height - padding - ((avgVolume - minVolume) / (maxVolume - minVolume)) * chartHeight;
    
    // 使用折线而不是平滑曲线，以更准确地反映数据变化
    const generateLinePath = (points: Array<{x: number, y: number}>) => {
        if (points.length < 2) return '';
        
        let path = `M ${points[0].x},${points[0].y}`;
        
        for (let i = 1; i < points.length; i++) {
            path += ` L ${points[i].x},${points[i].y}`;
        }
        
        return path;
    };

    const linePath = generateLinePath(points);

    return (
        <div style={{ width, height }} className="relative">
            <svg width={width} height={height}>
                {/* 绘制折线图 */}
                <path
                    d={linePath}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
}