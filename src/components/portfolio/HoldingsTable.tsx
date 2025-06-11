import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  MoreVertical,
  Eye,
  Brain,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { usePriceFormatter } from "../../hooks/usePriceFormatter";
import { formatPercentage } from "../../utils/formatters";

interface Holding {
  _id: string;
  symbol: string;
  companyName: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  marketValue: number;
  gainLoss: number;
  gainLossPercent: number;
}

interface HoldingsTableProps {
  holdings: Holding[];
  sortColumn: string;
  sortOrder: "asc" | "desc";
  onSort: (column: string) => void;
  onViewTransactions: (holdingId: string) => void;
  onGetInsight: (symbol: string) => void;
  onDelete: (holdingId: string) => void;
}

type SortColumn =
  | "symbol"
  | "quantity"
  | "avgBuyPrice"
  | "currentPrice"
  | "gainLoss"
  | "gainLossPercent";

const HoldingsTable: React.FC<HoldingsTableProps> = ({
  holdings,
  sortColumn,
  sortOrder,
  onSort,
  onViewTransactions,
  onGetInsight,
  onDelete,
}) => {
  const formatPrice = usePriceFormatter();

  const cleanSymbol = (symbol: string) =>
    symbol.replace(/[-.]?(USD|NS|BSE)$/i, "");

  const getSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) {
      return (
        <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      );
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
    ) : (
      <ArrowDown className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
    );
  };

  const columns = [
    { key: "symbol" as SortColumn, label: "Symbol", sortable: true },
    {
      key: "currentPrice" as SortColumn,
      label: "Current Price",
      sortable: true,
    },
    { key: "quantity" as SortColumn, label: "Holdings", sortable: true },
    {
      key: "avgBuyPrice" as SortColumn,
      label: "Avg. Buy Price",
      sortable: true,
    },
    { key: "gainLoss" as SortColumn, label: "Profit/Loss", sortable: true },
    { key: null, label: "Actions", sortable: false },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-400 border-b border-gray-700/50">
            {columns.map((column) => (
              <th
                key={column.label}
                className={`pb-3 sm:pb-4 font-medium text-xs sm:text-sm ${
                  column.sortable
                    ? "cursor-pointer hover:text-blue-400 transition-colors group select-none"
                    : ""
                } ${
                  column.key === sortColumn ? "text-blue-400 font-semibold" : ""
                }`}
                onClick={() =>
                  column.sortable && column.key && onSort(column.key)
                }
              >
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <span>{column.label}</span>
                  {column.sortable && column.key && (
                    <div className="flex items-center">
                      {getSortIcon(column.key)}
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-700/50">
          {holdings.map((holding) => (
            <tr
              key={holding._id}
              className="hover:bg-gray-750/30 transition-colors group/row"
            >
              {/* Symbol Column */}
              <td className="py-3 sm:py-4">
                <div>
                  <p className="font-medium text-sm sm:text-base text-white group-hover/row:text-blue-400 transition-colors">
                    {holding.symbol}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 truncate max-w-[120px] sm:max-w-[200px]">
                    {holding.companyName}
                  </p>
                </div>
              </td>

              {/* Current Price Column */}
              <td className="py-3 sm:py-4 text-sm sm:text-base text-gray-300 font-mono">
                {formatPrice(holding.currentPrice)}
              </td>

              {/* Holdings Column */}
              <td className="py-3 sm:py-4 text-sm sm:text-base text-gray-300 font-medium">
                <div className="flex flex-col">
                  <span className="font-mono">
                    {formatPrice(holding.currentPrice * holding.quantity)}
                  </span>
                  <span className="text-xs text-gray-400">
                    {holding.quantity.toLocaleString()}{" "}
                    {cleanSymbol(holding.symbol)}
                  </span>
                </div>
              </td>

              {/* Avg Buy Price Column */}
              <td className="py-3 sm:py-4 text-sm sm:text-base text-gray-300 font-mono">
                {formatPrice(holding.avgBuyPrice)}
              </td>

              {/* Profit/Loss Column */}
              <td className="py-3 sm:py-4">
                <div
                  className={`${
                    holding.gainLoss >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  <div className="text-sm sm:text-base font-semibold font-mono">
                    {formatPrice(holding.gainLoss)}
                  </div>
                  <div className="text-xs sm:text-sm font-mono">
                    ({formatPercentage(holding.gainLossPercent)})
                  </div>
                </div>
              </td>

              {/* Actions Column */}
              <td className="py-3 sm:py-4">
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors outline-none focus:ring-2 focus:ring-blue-500/50">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      className="min-w-[200px] bg-gray-800/95 backdrop-blur-sm rounded-lg p-1 shadow-xl border border-gray-700/50 z-50"
                      sideOffset={5}
                      align="end"
                      alignOffset={-5}
                    >
                      <DropdownMenu.Item
                        className="flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-md outline-none cursor-pointer transition-colors"
                        onSelect={() => onViewTransactions(holding._id)}
                      >
                        <Eye className="h-4 w-4 mr-3" />
                        View Transactions
                      </DropdownMenu.Item>

                      <DropdownMenu.Item
                        className="flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-md outline-none cursor-pointer transition-colors"
                        onSelect={() => onGetInsight(holding.symbol)}
                      >
                        <Brain className="h-4 w-4 mr-3" />
                        AI Insight
                      </DropdownMenu.Item>

                      <DropdownMenu.Separator className="h-px bg-gray-700/50 my-1" />

                      <DropdownMenu.Item
                        className="flex items-center px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-gray-700/50 rounded-md outline-none cursor-pointer transition-colors"
                        onSelect={() => onDelete(holding._id)}
                      >
                        <Trash2 className="h-4 w-4 mr-3" />
                        Delete
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Empty State */}
      {holdings.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-400 text-sm sm:text-base">
            No holdings found
          </p>
        </div>
      )}
    </div>
  );
};

export default HoldingsTable;
