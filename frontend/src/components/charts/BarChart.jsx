import React from 'react';

const BarChart = ({ data, title, xAxisLabel, yAxisLabel, color = '#06b6d4', height = 300 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-400">No data available</p>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item.value));
  const chartHeight = height - 100; // Reserve space for labels
  const chartWidth = 800;
  const barWidth = Math.min(60, (chartWidth - 100) / data.length - 10);
  const barSpacing = (chartWidth - 100) / data.length;

  return (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-colors">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center">
        📊 {title}
      </h3>
      
      <div className="overflow-x-auto">
        <svg width={chartWidth} height={height} className="mx-auto">
          {/* Y-axis */}
          <line 
            x1="50" 
            y1="20" 
            x2="50" 
            y2={chartHeight + 20} 
            stroke="#475569" 
            strokeWidth="2"
          />
          
          {/* X-axis */}
          <line 
            x1="50" 
            y1={chartHeight + 20} 
            x2={chartWidth - 50} 
            y2={chartHeight + 20} 
            stroke="#475569" 
            strokeWidth="2"
          />

          {/* Y-axis labels */}
          {[0, 1, 2, 3, 4].map(i => {
            const value = Math.round((maxValue / 4) * i);
            const y = chartHeight + 20 - (i * chartHeight / 4);
            return (
              <g key={i}>
                <line 
                  x1="45" 
                  y1={y} 
                  x2="50" 
                  y2={y} 
                  stroke="#475569" 
                  strokeWidth="1"
                />
                <text 
                  x="40" 
                  y={y + 4} 
                  fill="#94a3b8" 
                  fontSize="12" 
                  textAnchor="end"
                >
                  {value}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {data.map((item, index) => {
            const barHeight = maxValue > 0 ? (item.value / maxValue) * chartHeight : 0;
            const x = 60 + index * barSpacing;
            const y = chartHeight + 20 - barHeight;
            
            return (
              <g key={index}>
                {/* Bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={color}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                  rx="4"
                >
                  <title>{`${item.label}: ${item.value}`}</title>
                </rect>
                
                {/* Value label on top of bar */}
                {item.value > 0 && (
                  <text
                    x={x + barWidth / 2}
                    y={y - 5}
                    fill="#e2e8f0"
                    fontSize="12"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    {item.value}
                  </text>
                )}
                
                {/* X-axis label */}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + 40}
                  fill="#94a3b8"
                  fontSize="11"
                  textAnchor="middle"
                  transform={data.length > 8 ? `rotate(-45, ${x + barWidth / 2}, ${chartHeight + 40})` : ''}
                >
                  {item.label.length > 10 ? item.label.substring(0, 10) + '...' : item.label}
                </text>
              </g>
            );
          })}

          {/* Chart title */}
          <text
            x={chartWidth / 2}
            y={height - 10}
            fill="#94a3b8"
            fontSize="14"
            textAnchor="middle"
            fontWeight="bold"
          >
            {xAxisLabel}
          </text>

          {/* Y-axis title */}
          <text
            x="20"
            y={chartHeight / 2}
            fill="#94a3b8"
            fontSize="14"
            textAnchor="middle"
            transform={`rotate(-90, 20, ${chartHeight / 2})`}
            fontWeight="bold"
          >
            {yAxisLabel}
          </text>
        </svg>
      </div>
    </div>
  );
};

export default BarChart;
