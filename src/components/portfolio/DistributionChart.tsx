import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Sector,
} from "recharts";

interface StockDistribution {
  symbol: string;
  companyName: string;
  percentage: number;
}

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#6366F1",
  "#EC4899",
  "#F59E0B",
  "#6B7280",
];
const OTHERS_COLOR = "#9CA3AF"; // Gray for "Others"

const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
  } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 5}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <text
        x={cx}
        y={cy - 10}
        textAnchor="middle"
        fill="#fff"
        className="text-lg font-semibold"
      >
        {payload.symbol.replace(/\.NS|-USD/g, '')}
      </text>
      <text x={cx} y={cy + 15} textAnchor="middle" fill="#9CA3AF">
        {`${(percent * 100).toFixed(2)}%`}
      </text>
    </g>
  );
};

interface DistributionChartProps {
  distribution: StockDistribution[];
}

const DistributionChart: React.FC<DistributionChartProps> = ({
  distribution,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(-1);
  };

  // Sort by percentage
  const sorted = [...distribution].sort((a, b) => b.percentage - a.percentage);

  // Group bottom into "Others" if more than 5
  const TOP_N = 5;
  const topHoldings = sorted.slice(0, TOP_N);
  const othersHoldings = sorted.slice(TOP_N);

  const othersPercentage = othersHoldings.reduce(
    (sum, item) => sum + item.percentage,
    0
  );
  const othersSymbols = othersHoldings.map((h) => h.symbol);

  const finalData =
    othersHoldings.length > 0
      ? [
          ...topHoldings,
          {
            symbol: "Others",
            companyName: "Other Assets",
            percentage: othersPercentage,
            groupedSymbols: othersSymbols, // Pass for tooltip
          },
        ]
      : topHoldings;

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]">
      <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent mb-6">
        Holdings Distribution
      </h3>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Chart */}
        <div className="w-full md:w-2/3 h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {finalData.map((item, index) => (
                  <linearGradient
                    key={`gradient-${index}`}
                    id={`gradient-${index}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={
                        item.symbol === "Others"
                          ? OTHERS_COLOR
                          : COLORS[index % COLORS.length]
                      }
                      stopOpacity={1}
                    />
                    <stop
                      offset="100%"
                      stopColor={
                        item.symbol === "Others"
                          ? OTHERS_COLOR
                          : COLORS[index % COLORS.length]
                      }
                      stopOpacity={0.7}
                    />
                  </linearGradient>
                ))}
              </defs>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={finalData}
                dataKey="percentage"
                nameKey="symbol"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={105}
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
              >
                {finalData.map((item, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#gradient-${index})`}
                    stroke={
                      item.symbol === "Others"
                        ? OTHERS_COLOR
                        : COLORS[index % COLORS.length]
                    }
                    strokeWidth={1}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const symbols = data.groupedSymbols || [];
                    const displayed = symbols.slice(0, 5).join(", ");
                    const moreCount =
                      symbols.length > 5 ? ` +${symbols.length - 5} more` : "";

                    return (
                      <div className="bg-gray-900/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-700">
                        <p className="font-semibold text-white">
                          {data.symbol}
                        </p>
                        <p className="text-gray-400">{data.companyName}</p>
                        <p className="text-blue-400 font-medium mt-1">
                          {data.percentage.toFixed(2)}%
                        </p>
                        {data.symbol === "Others" && symbols.length > 0 && (
                          <p className="text-xs text-gray-500 mt-1">
                            Includes: {displayed}
                            {moreCount}
                          </p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="w-full md:w-1/3 flex flex-col justify-center gap-3 pl-2">
          {finalData.map((item, index) => (
            <div
              key={item.symbol}
              className={`flex items-center cursor-pointer transition-all duration-150 ${
                activeIndex === index
                  ? "opacity-100 scale-[1.03]"
                  : "opacity-60 hover:opacity-90"
              }`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(-1)}
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0" // Added flex-shrink-0 here
                style={{
                  backgroundColor:
                    item.symbol === "Others"
                      ? OTHERS_COLOR
                      : COLORS[index % COLORS.length],
                }}
              />
              {/* This is the new wrapper */}
              <div className="flex justify-between items-center w-full ml-3">
                <span className="text-sm text-white font-medium truncate pr-2">
                  {item.symbol.replace(/\.NS|-USD/g, '')}
                </span>
                <span className="text-sm text-gray-400">
                  {item.percentage.toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DistributionChart;
