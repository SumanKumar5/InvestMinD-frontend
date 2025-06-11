import React from "react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Loader2 } from "lucide-react";
import { useCurrency } from "../../contexts/CurrencyContext";

interface Performance {
  timestamp: string;
  value: number;
}

interface PerformanceChartProps {
  performance: Performance[];
  timeRange: "24h" | "7d" | "30d" | "all";
  setTimeRange: (range: "24h" | "7d" | "30d" | "all") => void;
  isLoading?: boolean;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({
  performance,
  timeRange,
  setTimeRange,
  isLoading = false,
}) => {
  const timeRanges = [
    { value: "24h", label: "24H" },
    { value: "7d", label: "7D" },
    { value: "30d", label: "30D" },
    { value: "all", label: "ALL" },
  ];

  const { currency, exchangeRate } = useCurrency();

  // Add virtual point if only one data point
  const chartData =
    performance.length === 1
      ? [
          {
            timestamp: new Date(
              new Date(performance[0].timestamp).getTime() - 60000
            ).toISOString(),
            value: performance[0].value,
          },
          ...performance,
        ]
      : performance;

  // Adaptive formatter for x-axis
  const getTickFormatter = () => {
    switch (timeRange) {
      case "24h":
        return (tick: string) =>
          new Date(tick).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          });
      case "7d":
      case "30d":
        return (tick: string) =>
          new Date(tick).toLocaleDateString([], {
            weekday: "short",
            month: "short",
            day: "numeric",
          });
      case "all":
        return (tick: string) =>
          new Date(tick).toLocaleDateString([], {
            month: "short",
            year: "numeric",
          });
      default:
        return (tick: string) => tick;
    }
  };

  const getTickValuesForRange = () => {
    const total = chartData.length;
    if (total === 0) return [];

    switch (timeRange) {
      case "24h":
        return chartData
          .filter((_, i) => i % Math.ceil(total / 6) === 0)
          .map((d) => d.timestamp);

      case "7d":
        return chartData
          .filter((_, i) => i % Math.ceil(total / 7) === 0)
          .map((d) => d.timestamp);

      case "30d":
        return chartData
          .filter((_, i) => i % Math.ceil(total / 9) === 0)
          .map((d) => d.timestamp);

      case "all":
        return chartData
          .filter((_, i) => i % Math.ceil(total / 5) === 0)
          .map((d) => d.timestamp);

      default:
        return chartData.map((d) => d.timestamp);
    }
  };

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] w-full">
      <div className="px-3 sm:px-6 pt-4 sm:pt-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h3 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
            Portfolio Performance
          </h3>
          <div className="flex space-x-1 bg-gray-900/50 backdrop-blur-sm p-1 rounded-lg border border-gray-700/50 w-full sm:w-auto">
            {timeRanges.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setTimeRange(value)}
                disabled={isLoading}
                className={`flex-1 sm:flex-none px-2 sm:px-4 py-1.5 rounded-md transition-all duration-300 text-xs sm:text-sm font-medium ${
                  timeRange === value
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-[280px] sm:h-[350px] lg:h-[400px] p-2 sm:p-4 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/20 backdrop-blur-sm z-10 rounded-lg">
            <div className="flex items-center space-x-2 bg-gray-900/90 px-3 sm:px-4 py-2 rounded-full">
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 animate-spin" />
              <span className="text-xs sm:text-sm text-gray-200">
                Loading data...
              </span>
            </div>
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: 5,
              bottom: 10,
            }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <filter id="shadow" height="200%">
                <feGaussianBlur
                  in="SourceAlpha"
                  stdDeviation="3"
                  result="blur"
                />
                <feOffset in="blur" dx="0" dy="4" result="offsetBlur" />
                <feMerge>
                  <feMergeNode in="offsetBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#374151"
              vertical={false}
            />

            <XAxis
              dataKey="timestamp"
              stroke="#9CA3AF"
              tick={{
                fill: "#9CA3AF",
                fontSize: window.innerWidth < 640 ? 10 : 12,
              }}
              axisLine={{ stroke: "#374151" }}
              dy={5}
              tickFormatter={getTickFormatter()}
              ticks={getTickValuesForRange()}
              interval="preserveStartEnd"
              minTickGap={window.innerWidth < 640 ? 30 : 50}
            />

            <YAxis
              stroke="#9CA3AF"
              tick={{
                fill: "#9CA3AF",
                fontSize: window.innerWidth < 640 ? 10 : 12,
              }}
              tickFormatter={(value) => {
                const converted =
                  currency === "INR" ? value * exchangeRate : value;
                const prefix = currency === "INR" ? "₹" : "$";

                if (currency === "INR") {
                  if (converted >= 1_00_00_000)
                    return `${prefix}${(converted / 1_00_00_000).toFixed(1)}Cr`;
                  if (converted >= 1_00_000)
                    return `${prefix}${(converted / 1_00_000).toFixed(1)}L`;
                  if (converted >= 1_000)
                    return `${prefix}${(converted / 1_000).toFixed(1)}K`;
                  return `${prefix}${converted.toFixed(0)}`;
                }

                // For USD, just shorten using K/M if needed
                if (converted >= 1_000_000)
                  return `${prefix}${(converted / 1_000_000).toFixed(1)}M`;
                if (converted >= 1_000)
                  return `${prefix}${(converted / 1_000).toFixed(1)}K`;

                return `${prefix}${converted.toFixed(0)}`;
              }}
              axisLine={{ stroke: "#374151" }}
              dx={-5}
              width={window.innerWidth < 640 ? 45 : 60}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl p-2 sm:p-3 max-w-[200px] sm:max-w-none">
                      <p className="text-gray-400 text-xs sm:text-sm">
                        {new Date(payload[0].payload.timestamp).toLocaleString(
                          [],
                          {
                            month: "short",
                            day: "numeric",
                            hour:
                              window.innerWidth < 640 ? "numeric" : "2-digit",
                            minute:
                              window.innerWidth < 640 ? undefined : "2-digit",
                          }
                        )}
                      </p>
                      <p className="text-sm sm:text-lg font-semibold text-white">
                        {currency === "INR"
                          ? `₹${(
                              payload[0].value * exchangeRate
                            ).toLocaleString()}`
                          : `$${payload[0].value.toLocaleString()}`}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              strokeWidth={window.innerWidth < 640 ? 1.5 : 2}
              fill="url(#colorValue)"
              fillOpacity={1}
              animationDuration={750}
              animationEasing="ease-in-out"
              dot={false}
              activeDot={{
                r: window.innerWidth < 640 ? 4 : 6,
                fill: "#3B82F6",
                stroke: "#fff",
                strokeWidth: window.innerWidth < 640 ? 1 : 2,
                filter: "url(#shadow)",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;
