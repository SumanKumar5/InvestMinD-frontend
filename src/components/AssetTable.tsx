import React, { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import {
  formatLargeNumber,
  formatPercentage,
} from "../utils/formatters";
import { mockAssets } from "../data/mockAssets";
import { Asset } from "../types/asset";
import SearchBar from "./SearchBar";
import FilterTabs from "./FilterTabs";
import { useCurrency } from "../contexts/CurrencyContext";
import { usePriceFormatter } from "../hooks/usePriceFormatter";


type SortField =
  | "rank"
  | "name"
  | "price"
  | "priceChange24h"
  | "marketCap"
  | "volume";
type SortDirection = "asc" | "desc";

const AssetTable: React.FC = () => {
  const { currency, exchangeRate } = useCurrency();
const formatPrice = usePriceFormatter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "stocks" | "crypto" | "funds"
  >("all");
  const [sortField, setSortField] = useState<SortField>("rank");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredAssets = useMemo(() => {
    return mockAssets
      .filter((asset) => {
        const matchesSearch =
          asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          asset.symbol.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType =
          activeFilter === "all" ||
          (activeFilter === "stocks" && asset.type === "stock") ||
          (activeFilter === "crypto" && asset.type === "crypto") ||
          (activeFilter === "funds" && asset.type === "fund");
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        if (sortField === "name") {
          return sortDirection === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        } else {
          const aValue = a[sortField];
          const bValue = b[sortField];
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }
      });
  }, [searchQuery, activeFilter, sortField, sortDirection]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  // Enhanced Mobile card view component
  const AssetCard = ({ asset }: { asset: Asset }) => (
    <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] group">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className="text-xs sm:text-sm text-gray-400 font-medium">
            #{asset.rank}
          </span>
          <div className="bg-gray-700/80 rounded-lg py-1.5 px-2.5">
            <span className="text-sm font-bold text-gray-200">
              {asset.symbol}
            </span>
          </div>
        </div>
        <span
          className={`font-mono text-sm sm:text-base font-semibold ${
            asset.priceChange24h >= 0 ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {formatPercentage(asset.priceChange24h)}
        </span>
      </div>

      {/* Asset Name */}
      <h3 className="text-base sm:text-lg font-semibold text-gray-200 mb-4 group-hover:text-blue-400 transition-colors line-clamp-1">
        {asset.name}
      </h3>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-3">
          <div>
            <span className="text-xs text-gray-400 block mb-1">Price</span>
            <span className="font-mono text-sm sm:text-base font-semibold text-white">
              {formatPrice(asset.price)}
            </span>
          </div>
          <div>
            <span className="text-xs text-gray-400 block mb-1">Market Cap</span>
            <span className="font-mono text-sm font-medium text-gray-300">
              {formatPrice(asset.marketCap).split(".")[0]}
            </span>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <span className="text-xs text-gray-400 block mb-1">Volume</span>
            <span className="font-mono text-sm font-medium text-gray-300">
              {formatLargeNumber(asset.volume)}
            </span>
          </div>
          <div>
            <span className="text-xs text-gray-400 block mb-1">Type</span>
            <span className="text-sm font-medium text-blue-400 capitalize">
              {asset.type}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-12 sm:py-16 lg:py-20 container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl mx-auto">
        <div className="mb-8 sm:mb-12">
          {/* Section Title */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-center sm:text-left bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
            Top Global Assets
          </h2>

          {/* Controls */}
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-6 mb-6 sm:mb-8">
            {/* Search Bar */}
            <div className="w-full lg:w-1/3">
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2 text-gray-400">
                <SlidersHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm font-medium">Filter:</span>
              </div>
              <FilterTabs
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
              />
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block bg-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-800/90 backdrop-blur-sm border-b border-gray-700/50">
                    {[
                      { field: "rank" as SortField, label: "Rank" },
                      { field: null, label: "Symbol" },
                      { field: "name" as SortField, label: "Asset Name" },
                      { field: "price" as SortField, label: "Price (USD)" },
                      {
                        field: "priceChange24h" as SortField,
                        label: "24h Change",
                      },
                      { field: "marketCap" as SortField, label: "Market Cap" },
                      { field: "volume" as SortField, label: "Volume" },
                    ].map((column) => (
                      <th
                        key={column.label}
                        className={`px-4 xl:px-6 py-4 ${
                          column.label === "Symbol" ||
                          column.label === "Asset Name"
                            ? "text-left"
                            : "text-right"
                        } text-xs font-medium text-gray-400 uppercase tracking-wider ${
                          column.field
                            ? "cursor-pointer hover:text-white transition-colors"
                            : ""
                        }`}
                        onClick={() => column.field && handleSort(column.field)}
                      >
                        <div
                          className={`flex items-center ${
                            column.label === "Symbol" ||
                            column.label === "Asset Name"
                              ? "justify-start"
                              : "justify-end"
                          } space-x-1`}
                        >
                          <span>{column.label}</span>
                          {column.field && <SortIcon field={column.field} />}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {filteredAssets.map((asset) => (
                    <tr
                      key={asset.id}
                      className="hover:bg-gray-750/30 group cursor-pointer transition-colors duration-200"
                    >
                      <td className="px-4 xl:px-6 py-4 text-sm font-medium text-gray-300">
                        {asset.rank}
                      </td>
                      <td className="px-4 xl:px-6 py-4">
                        <div className="bg-gray-700/80 rounded-lg py-1.5 px-2.5 inline-block">
                          <span className="text-sm font-bold text-gray-200">
                            {asset.symbol}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 xl:px-6 py-4 text-sm text-gray-300 font-medium">
                        {asset.name}
                      </td>
                      <td className="px-4 xl:px-6 py-4 text-sm text-right text-gray-300 font-mono font-semibold">
                        {formatPrice(asset.price)}
                      </td>
                      <td className="px-4 xl:px-6 py-4 text-sm text-right font-semibold">
                        <span
                          className={`${
                            asset.priceChange24h >= 0
                              ? "text-emerald-400"
                              : "text-red-400"
                          } font-mono`}
                        >
                          {formatPercentage(asset.priceChange24h)}
                        </span>
                      </td>
                      <td className="px-4 xl:px-6 py-4 text-sm text-right text-gray-300 font-mono">
                        {formatPrice(asset.marketCap).split(".")[0]}
                      </td>
                      <td className="px-4 xl:px-6 py-4 text-sm text-right text-gray-300 font-mono">
                        {formatLargeNumber(asset.volume)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile/Tablet Card View */}
          <div className="lg:hidden space-y-4">
            {filteredAssets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>

          {/* No Results State */}
          {filteredAssets.length === 0 && (
            <div className="text-center py-12 sm:py-16 text-gray-400">
              <div className="bg-gray-700/50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <SlidersHorizontal className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium mb-2">No assets found</h3>
              <p className="text-sm sm:text-base">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AssetTable;
