import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useLoading } from "../contexts/LoadingContext";
import {
  ArrowLeft,
  Brain,
  Download,
  Plus,
  MoreVertical,
  FolderPlus,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Header from "./Header";
import Footer from "./Footer";
import AnalyticsCards from "./portfolio/AnalyticsCards";
import PerformersCards from "./portfolio/PerformersCards";
import PerformanceChart from "./portfolio/PerformanceChart";
import DistributionChart from "./portfolio/DistributionChart";
import HoldingsTable from "./portfolio/HoldingsTable";
import AddHoldingModal from "./portfolio/AddHoldingModal";
import DeleteHoldingModal from "./portfolio/DeleteHoldingModal";
import AIInsightModal from "./portfolio/AIInsightModal";
import {
  getPortfolioSummary,
  getPortfolioAnalytics,
  getPortfolioPerformance,
  getPortfolioStocks,
  getBestWorstPerformers,
  addHolding,
  deleteHolding,
  exportPortfolio,
  getPortfolioInsight,
  getStockInsight,
} from "../services/api";
import { formatCurrency, formatPercentage } from "../utils/formatters";

type SortColumn =
  | "symbol"
  | "quantity"
  | "avgBuyPrice"
  | "currentPrice"
  | "gainLoss"
  | "gainLossPercent";
type SortOrder = "asc" | "desc";

const PortfolioDetails: React.FC = () => {
  const { portfolioId } = useParams<{ portfolioId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const portfolioName = location.state?.portfolioName || "Portfolio Details";
  const { startLoading, stopLoading } = useLoading();

  // State management
  const [holdings, setHoldings] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [bestWorst, setBestWorst] = useState(null);
  const [timeRange, setTimeRange] = useState("24h");
  const [isLoading, setIsLoading] = useState(true);
  const [isChartLoading, setIsChartLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [holdingToDelete, setHoldingToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState("buy");
  const [newHolding, setNewHolding] = useState({
    symbol: "",
    quantity: "",
    buyPrice: "",
    notes: "",
    companyName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiInsight, setAiInsight] = useState("");

  // Holdings sorting state
  const [sortColumn, setSortColumn] = useState<SortColumn>("symbol");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Data fetching
  useEffect(() => {
    fetchPortfolioData();
  }, [portfolioId]);

  useEffect(() => {
    if (portfolioId) {
      fetchChartData();
    }
  }, [timeRange]);

  const fetchChartData = async () => {
    setIsChartLoading(true);
    try {
      const performanceData = await getPortfolioPerformance(
        portfolioId,
        timeRange
      );
      setPerformance(performanceData);
    } catch (err) {
      toast.error("Failed to update chart data");
    } finally {
      setIsChartLoading(false);
    }
  };

  const fetchPortfolioData = async () => {
    if (!portfolioId) return;

    startLoading();
    try {
      const [
        summaryData,
        analyticsData,
        performanceData,
        stocksData,
        bestWorstData,
      ] = await Promise.all([
        getPortfolioSummary(portfolioId),
        getPortfolioAnalytics(portfolioId),
        getPortfolioPerformance(portfolioId, timeRange),
        getPortfolioStocks(portfolioId),
        getBestWorstPerformers(portfolioId),
      ]);

      setHoldings(summaryData);
      setAnalytics(analyticsData);
      setPerformance(performanceData);
      setDistribution(stocksData);
      setBestWorst(bestWorstData);
    } catch (err) {
      toast.error("Failed to fetch portfolio data");
    } finally {
      setIsLoading(false);
      stopLoading();
    }
  };

  // Holdings sorting logic
  const sortedHoldings = React.useMemo(() => {
    const sorted = [...holdings].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortColumn) {
        case "symbol":
          aValue = a.symbol.toLowerCase();
          bValue = b.symbol.toLowerCase();
          break;
        case "quantity":
          aValue = a.quantity;
          bValue = b.quantity;
          break;
        case "avgBuyPrice":
          aValue = a.avgBuyPrice;
          bValue = b.avgBuyPrice;
          break;
        case "currentPrice":
          aValue = a.currentPrice;
          bValue = b.currentPrice;
          break;
        case "gainLoss":
          aValue = a.gainLoss;
          bValue = b.gainLoss;
          break;
        case "gainLossPercent":
          aValue = a.gainLossPercent;
          bValue = b.gainLossPercent;
          break;
        default:
          return 0;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortOrder === "asc"
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      }
    });

    return sorted;
  }, [holdings, sortColumn, sortOrder]);

  // Handle mobile dropdown sort - simplified toggle logic
  const handleMobileSort = (column: SortColumn) => {
    if (sortColumn === column) {
      // Toggle order if same column
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set new column with default order
      setSortColumn(column);
      setSortOrder(column === "symbol" ? "asc" : "desc"); // A-Z for symbol, High-Low for numbers
    }
  };

  // Get current sort label for mobile dropdown
  const getCurrentSortLabel = () => {
    const labels = {
      symbol: "Symbol",
      quantity: "Quantity",
      avgBuyPrice: "Avg. Buy Price",
      currentPrice: "Current Price",
      gainLoss: "P/L Amount",
      gainLossPercent: "P/L %",
    };
    const orderSymbol = sortOrder === "asc" ? "↑" : "↓";
    return `${labels[sortColumn]} ${orderSymbol}`;
  };

  // Get sort icon for mobile dropdown
  const getMobileSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="w-4 h-4 text-gray-500" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="w-4 h-4 text-blue-400" />
    ) : (
      <ArrowDown className="w-4 h-4 text-blue-400" />
    );
  };

  // Mobile sort options - simplified
  const mobileSortOptions = [
    { column: "symbol" as SortColumn, label: "Symbol" },
    { column: "quantity" as SortColumn, label: "Quantity" },
    { column: "avgBuyPrice" as SortColumn, label: "Avg. Buy Price" },
    { column: "currentPrice" as SortColumn, label: "Current Price" },
    { column: "gainLoss" as SortColumn, label: "P/L Amount" },
    { column: "gainLossPercent" as SortColumn, label: "P/L %" },
  ];


  // Event handlers
  const handleAddHolding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portfolioId || !validateForm()) return;

    setIsSubmitting(true);
    try {
      await addHolding(portfolioId, { ...newHolding, type: activeTab });
      await fetchPortfolioData();
      setIsAddModalOpen(false);
      setNewHolding({ symbol: "", quantity: "", buyPrice: "", notes: "", companyName: "" });
      toast.success("Transaction successful!");
    } catch (err) {
      toast.error("Failed to process transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteHolding = async () => {
    if (!holdingToDelete) return;

    setIsSubmitting(true);
    try {
      await deleteHolding(holdingToDelete);
      await fetchPortfolioData();
      setIsDeleteModalOpen(false);
      setHoldingToDelete(null);
      toast.success("Holding deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete holding");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExport = async () => {
    if (!portfolioId) return;

    try {
      const blob = await exportPortfolio(portfolioId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `portfolio-${portfolioId}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      toast.error("Failed to export portfolio");
    }
  };

  const handlePortfolioInsight = async () => {
    if (!portfolioId) return;
    setIsLoadingAI(true);
    setIsAIModalOpen(true);

    try {
      const response = await getPortfolioInsight(portfolioId);
      setAiInsight(response.insight);
    } catch (err) {
      toast.error("Failed to get AI insight");
      setIsAIModalOpen(false);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleStockInsight = async (symbol: string) => {
    if (!portfolioId || !symbol) return;
    setIsLoadingAI(true);
    setIsAIModalOpen(true);

    try {
      const response = await getStockInsight(portfolioId, symbol);
      setAiInsight(response.insight);
    } catch (err) {
      toast.error("Failed to get stock insight");
      setIsAIModalOpen(false);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const validateForm = () => {
    if (!newHolding.symbol || !newHolding.quantity || !newHolding.buyPrice) {
      toast.error("Please fill in all required fields");
      return false;
    }

    const quantity = Number(newHolding.quantity);
    const price = Number(newHolding.buyPrice);

    if (isNaN(quantity) || quantity <= 0) {
      toast.error("Quantity must be a positive number");
      return false;
    }

    if (isNaN(price) || price <= 0) {
      toast.error("Price must be a positive number");
      return false;
    }

    return true;
  };

  const EmptyState = () => (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center p-4 sm:p-6">
      <div className="text-center max-w-md mx-auto">
        <div className="bg-gray-800/50 rounded-full p-4 sm:p-6 w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 sm:mb-8 flex items-center justify-center">
          <FolderPlus className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
        </div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6">
          This portfolio is empty
        </h2>
        <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed">
          Add your first holding to get started with insights and analytics.
        </p>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Add Holding</span>
        </button>
      </div>
    </div>
  );

  // Enhanced Mobile Holdings Card Component
  const MobileHoldingCard = ({ holding }: { holding: any }) => (
    <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] group">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-base sm:text-lg text-white group-hover:text-blue-400 transition-colors truncate">
            {holding.symbol}
          </h4>
          <p className="text-xs sm:text-sm text-gray-400 truncate">
            {holding.companyName}
          </p>
        </div>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors flex-shrink-0">
              <MoreVertical className="h-4 w-4" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="min-w-[180px] bg-gray-800/95 backdrop-blur-sm rounded-lg p-1 shadow-xl border border-gray-700/50 z-50"
              sideOffset={5}
              align="end"
            >
              <DropdownMenu.Item
                className="flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-md cursor-pointer transition-colors"
                onSelect={() => navigate(`/holding/${holding._id}`)}
              >
                View Transactions
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-md cursor-pointer transition-colors"
                onSelect={() => handleStockInsight(holding.symbol)}
              >
                Get AI Insight
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="h-px bg-gray-700/50 my-1" />
              <DropdownMenu.Item
                className="flex items-center px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-gray-700/50 rounded-md cursor-pointer transition-colors"
                onSelect={() => {
                  setHoldingToDelete(holding._id);
                  setIsDeleteModalOpen(true);
                }}
              >
                Delete
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-3">
          <div>
            <span className="text-xs text-gray-400 block mb-1">Quantity</span>
            <span className="text-sm sm:text-base font-medium text-white">
              {holding.quantity}
            </span>
          </div>
          <div>
            <span className="text-xs text-gray-400 block mb-1">
              Avg. Buy Price
            </span>
            <span className="text-sm sm:text-base font-mono font-medium text-white">
              {formatCurrency(holding.avgBuyPrice)}
            </span>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <span className="text-xs text-gray-400 block mb-1">
              Current Price
            </span>
            <span className="text-sm sm:text-base font-mono font-medium text-white">
              {formatCurrency(holding.currentPrice)}
            </span>
          </div>
          <div>
            <span className="text-xs text-gray-400 block mb-1">P/L</span>
            <div
              className={`text-sm sm:text-base font-semibold ${
                holding.gainLoss >= 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              <div className="font-mono">
                {formatCurrency(holding.gainLoss)}
              </div>
              <div className="text-xs">
                ({formatPercentage(holding.gainLossPercent)})
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      <Toaster position="top-right" />

      <main className="flex-grow container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto">
          {/* Portfolio Header */}
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 lg:mb-10">
            <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800/50 flex-shrink-0"
                title="Back"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-white truncate">
                {portfolioName}
              </h1>
            </div>
            {holdings.length > 0 && (
              <button
                onClick={handlePortfolioInsight}
                disabled={isLoadingAI}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 text-sm sm:text-base"
              >
                <Brain className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Get AI Insight</span>
              </button>
            )}
          </div>

          {holdings.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-6 sm:space-y-8">
              {/* Analytics Cards */}
              <AnalyticsCards analytics={analytics} />

              {/* Best/Worst Performers */}
              {holdings.length >= 2 && bestWorst && (
                <PerformersCards bestWorst={bestWorst} />
              )}

              {/* Charts Section */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
                <PerformanceChart
                  performance={performance}
                  timeRange={timeRange}
                  setTimeRange={setTimeRange}
                  isLoading={isChartLoading}
                />
                <DistributionChart distribution={distribution} />
              </div>

              {/* Holdings Section */}
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-700/50">
                  <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center justify-between">
                    <h3 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
                      Holdings ({holdings.length})
                    </h3>
                    <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:space-x-3">
                      <button
                        onClick={handleExport}
                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-700/50 backdrop-blur-sm rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
                      >
                        <Download className="h-4 w-4" />
                        <span>Export</span>
                      </button>
                      <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Holding</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3 sm:p-4 lg:p-6">
                  {/* Mobile Sort Dropdown - Simplified */}
                  {holdings.length > 1 && (
                    <div className="xl:hidden mb-4">
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                          <button className="flex items-center justify-between w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:border-gray-600 transition-all duration-300">
                            <div className="flex items-center space-x-2">
                              <Filter className="w-4 h-4" />
                              <span>Sort by: {getCurrentSortLabel()}</span>
                            </div>
                            <ArrowUpDown className="w-4 h-4" />
                          </button>
                        </DropdownMenu.Trigger>

                        <DropdownMenu.Portal>
                          <DropdownMenu.Content
                            className="w-[280px] bg-gray-800/95 backdrop-blur-sm rounded-lg p-1 shadow-xl border border-gray-700/50 z-50"
                            sideOffset={5}
                            align="start"
                          >
                            <DropdownMenu.Label className="px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                              Sort Holdings
                            </DropdownMenu.Label>

                            {mobileSortOptions.map((option) => (
                              <DropdownMenu.Item
                                key={option.column}
                                className={`flex items-center justify-between px-3 py-2 text-sm rounded-md cursor-pointer transition-colors ${
                                  sortColumn === option.column
                                    ? "text-blue-400 bg-blue-500/10"
                                    : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                                }`}
                                onSelect={() => handleMobileSort(option.column)}
                              >
                                <span>{option.label}</span>
                                {getMobileSortIcon(option.column)}
                              </DropdownMenu.Item>
                            ))}
                          </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                      </DropdownMenu.Root>
                    </div>
                  )}

                  {/* Mobile/Tablet Card View */}
                  <div className="xl:hidden">
                    <div className="space-y-4">
                      {sortedHoldings.map((holding) => (
                        <MobileHoldingCard
                          key={holding._id}
                          holding={holding}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden xl:block">
                    <HoldingsTable
                      holdings={sortedHoldings}
                      sortColumn={sortColumn}
                      sortOrder={sortOrder}
                      onSort={(column) => {
                        if (sortColumn === column) {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortColumn(column);
                          setSortOrder("asc");
                        }
                      }}
                      onViewTransactions={(id) => navigate(`/holding/${id}`)}
                      onGetInsight={handleStockInsight}
                      onDelete={(id) => {
                        setHoldingToDelete(id);
                        setIsDeleteModalOpen(true);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <AddHoldingModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        newHolding={newHolding}
        setNewHolding={setNewHolding}
        onSubmit={handleAddHolding}
        isSubmitting={isSubmitting}
      />

      <DeleteHoldingModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setHoldingToDelete(null);
        }}
        onConfirm={handleDeleteHolding}
        isSubmitting={isSubmitting}
      />

      <AIInsightModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        isLoading={isLoadingAI}
        insight={aiInsight}
      />

      <Footer />
    </div>
  );
};

export default PortfolioDetails;
