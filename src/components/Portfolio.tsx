import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Plus,
  Trash2,
  ExternalLink,
  Loader2,
  X,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Header from "./Header";
import Footer from "./Footer";
import { useRequireAuth } from "../hooks/useAuth";
import { useLoading } from "../contexts/LoadingContext";
import {
  getPortfolios,
  createPortfolio,
  deletePortfolio,
  getPortfolioAnalytics,
} from "../services/api";
import toast, { Toaster } from "react-hot-toast";
import { usePriceFormatter } from "../hooks/usePriceFormatter";

interface Portfolio {
  _id: string;
  name: string;
  createdAt: string;
}

interface PortfolioAnalytics {
  totalInvestment: number;
  profitLossPercentage: number;
}

interface PortfolioWithAnalytics extends Portfolio {
  analytics?: PortfolioAnalytics;
}

type SortBy = "date" | "investment" | "pl";
type SortOrder = "asc" | "desc";

const Portfolio: React.FC = () => {
  useRequireAuth();
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoading();
  const [searchParams, setSearchParams] = useSearchParams();

  const [portfolios, setPortfolios] = useState<PortfolioWithAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [portfolioToDelete, setPortfolioToDelete] = useState<string | null>(
    null
  );
  const [newPortfolioName, setNewPortfolioName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sorting state with URL sync
  const [sortBy, setSortBy] = useState<SortBy>(() => {
    const urlSortBy = searchParams.get("sortBy") as SortBy;
    return ["date", "investment", "pl"].includes(urlSortBy)
      ? urlSortBy
      : "date";
  });

  const formatPrice = usePriceFormatter();

  const [sortOrder, setSortOrder] = useState<SortOrder>(() => {
    const urlOrder = searchParams.get("order") as SortOrder;
    return ["asc", "desc"].includes(urlOrder) ? urlOrder : "desc";
  });

  // Update URL when sorting changes
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("sortBy", sortBy);
    newSearchParams.set("order", sortOrder);
    setSearchParams(newSearchParams, { replace: true });
  }, [sortBy, sortOrder, searchParams, setSearchParams]);

  const fetchPortfolioAnalytics = async (portfolioId: string) => {
    try {
      const analytics = await getPortfolioAnalytics(portfolioId);
      return analytics;
    } catch {
      return null;
    }
  };

  const fetchPortfolios = async () => {
    startLoading();
    try {
      const data = await getPortfolios();
      const portfoliosWithAnalytics = await Promise.all(
        data.map(async (portfolio: Portfolio) => {
          const analytics = await fetchPortfolioAnalytics(portfolio._id);
          return { ...portfolio, analytics };
        })
      );
      setPortfolios(portfoliosWithAnalytics);
      setError(null);
    } catch (err) {
      setError("Failed to fetch portfolios");
      toast.error("Failed to load portfolios");
    } finally {
      setIsLoading(false);
      stopLoading();
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  // Sorting logic
  const sortedPortfolios = useMemo(() => {
    const sorted = [...portfolios].sort((a, b) => {
      let aValue: number;
      let bValue: number;

      switch (sortBy) {
        case "date":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case "investment":
          aValue = a.analytics?.totalInvestment || 0;
          bValue = b.analytics?.totalInvestment || 0;
          break;
        case "pl":
          aValue = a.analytics?.profitLossPercentage || 0;
          bValue = b.analytics?.profitLossPercentage || 0;
          break;
        default:
          return 0;
      }

      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });

    return sorted;
  }, [portfolios, sortBy, sortOrder]);

  const handleSortChange = (newSortBy: SortBy) => {
    if (sortBy === newSortBy) {
      // Toggle order if same field
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set new field with default order
      setSortBy(newSortBy);
      setSortOrder(newSortBy === "date" ? "desc" : "desc"); // Newest first for date, highest first for others
    }
  };

  const getSortIcon = (field: SortBy) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="w-4 h-4 text-gray-500" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="w-4 h-4 text-blue-400" />
    ) : (
      <ArrowDown className="w-4 h-4 text-blue-400" />
    );
  };

  const getSortLabel = () => {
    const labels = {
      date: "Created Date",
      investment: "Investment Amount",
      pl: "Profit/Loss %",
    };
    const orderLabel = sortOrder === "asc" ? "↑" : "↓";
    return `${labels[sortBy]} ${orderLabel}`;
  };

  const handleCreatePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPortfolioName.trim()) return;

    setIsSubmitting(true);
    startLoading();
    try {
      await createPortfolio(newPortfolioName);
      await fetchPortfolios();
      setIsCreateModalOpen(false);
      setNewPortfolioName("");
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } toast-success max-w-md w-full bg-gray-800/95 shadow-lg rounded-lg pointer-events-auto flex items-center p-4`}
          >
            <div className="flex-shrink-0 text-green-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-100">
                Portfolio created successfully!
              </p>
            </div>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ),
        { duration: 1000 }
      );
    } catch (err) {
      toast.error("Failed to create portfolio");
    } finally {
      setIsSubmitting(false);
      stopLoading();
    }
  };

  const confirmDelete = (portfolioId: string) => {
    setPortfolioToDelete(portfolioId);
    setIsDeleteModalOpen(true);
  };

  const handleDeletePortfolio = async () => {
    if (!portfolioToDelete) return;

    setIsSubmitting(true);
    startLoading();
    try {
      await deletePortfolio(portfolioToDelete);
      await fetchPortfolios();
      setIsDeleteModalOpen(false);
      setPortfolioToDelete(null);
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } toast-success max-w-md w-full bg-gray-800/95 shadow-lg rounded-lg pointer-events-auto flex items-center p-4`}
          >
            <div className="flex-shrink-0 text-green-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-100">
                Portfolio deleted successfully!
              </p>
            </div>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ),
        { duration: 1000 }
      );
    } catch (err) {
      toast.error("Failed to delete portfolio");
    } finally {
      setIsSubmitting(false);
      stopLoading();
    }
  };

  // Skeleton loader component
  const PortfolioSkeleton = () => (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 animate-pulse">
      <div className="p-4 sm:p-6">
        <div className="h-6 w-2/3 bg-gray-700 rounded mb-2"></div>
        <div className="h-4 w-1/3 bg-gray-700 rounded mb-4"></div>
        <div className="space-y-2 mb-4">
          <div className="h-4 w-1/2 bg-gray-700 rounded"></div>
          <div className="h-4 w-1/3 bg-gray-700 rounded"></div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="h-8 w-24 bg-gray-700 rounded"></div>
          <div className="h-8 w-20 bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );

  // Enhanced Portfolio Card Component
  const PortfolioCard = ({
    portfolio,
  }: {
    portfolio: PortfolioWithAnalytics;
  }) => (
    <div className="group relative rounded-2xl border border-gray-700/40 bg-gradient-to-br from-gray-800/80 to-gray-900/90 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] hover:shadow-[0_0_50px_rgba(59,130,246,0.15)] transition-all duration-300 hover:border-blue-500/50 backdrop-blur-md p-6 sm:p-7 w-full max-w-md mx-auto text-center">
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-xl font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
          {portfolio.name}
        </h3>
        <p className="text-sm text-gray-400 mt-1">
          Created on{" "}
          {new Date(portfolio.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Stats */}
      <div className="space-y-4 mb-6">
        {/* Investment */}
        <div>
          <div className="text-sm text-gray-400">Investment</div>
          <div className="text-base font-mono font-semibold text-white">
            {formatPrice(portfolio.analytics?.totalInvestment || 0)}
          </div>
        </div>

        {/* Profit/Loss */}
        <div>
          <div className="text-sm text-gray-400">P/L</div>
          {portfolio.analytics?.profitLossPercentage != null &&
          !isNaN(portfolio.analytics.profitLossPercentage) ? (
            <div
              className={`flex justify-center items-center space-x-1 ${
                portfolio.analytics.profitLossPercentage >= 0
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}
            >
              {portfolio.analytics.profitLossPercentage >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-base font-mono font-semibold">
                {portfolio.analytics.profitLossPercentage >= 0 ? "+" : ""}
                {parseFloat(portfolio.analytics.profitLossPercentage).toFixed(
                  2
                )}
                %
              </span>
            </div>
          ) : (
            <span className="text-sm text-gray-500">--</span>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-gray-700/40 mb-4" />

      {/* Actions */}
      <div className="flex justify-center items-center space-x-14">
        <button
          onClick={() =>
            navigate(`/portfolio/${portfolio._id}`, {
              state: { portfolioName: portfolio.name },
            })
          }
          className="flex items-center space-x-1 text-sm text-blue-500 hover:text-blue-400 transition-colors group"
        >
          <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>View Details</span>
        </button>
        <button
          onClick={() => confirmDelete(portfolio._id)}
          className="flex items-center space-x-1 text-sm text-red-500 hover:text-red-400 transition-colors group"
        >
          <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 1000,
          className: "bg-transparent border-0 shadow-none p-0 m-0",
        }}
      />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center justify-between mb-6 sm:mb-8 lg:mb-10">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
                Your Portfolios
              </h1>
              <p className="text-sm sm:text-base text-gray-400">
                {portfolios.length} portfolio
                {portfolios.length !== 1 ? "s" : ""} • Manage and track your
                investments
              </p>
            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 lg:items-center">
              {/* Sort Dropdown */}
              {portfolios.length > 1 && (
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button className="flex items-center justify-between space-x-2 px-4 py-2.5 bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-lg hover:border-gray-600/50 transition-all duration-300 text-sm font-medium text-gray-300 hover:text-white min-w-[180px] sm:min-w-[200px]">
                      <div className="flex items-center space-x-2">
                        <Filter className="w-4 h-4" />
                        <span className="truncate">{getSortLabel()}</span>
                      </div>
                      <ArrowUpDown className="w-4 h-4 flex-shrink-0" />
                    </button>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      className="min-w-[220px] bg-gray-800/95 backdrop-blur-sm rounded-lg p-1 shadow-xl border border-gray-700/50 z-50"
                      sideOffset={5}
                      align="end"
                    >
                      <DropdownMenu.Label className="px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Sort by
                      </DropdownMenu.Label>

                      <DropdownMenu.Item
                        className="flex items-center justify-between px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-md cursor-pointer transition-colors"
                        onSelect={() => handleSortChange("date")}
                      >
                        <span>Created Date</span>
                        {getSortIcon("date")}
                      </DropdownMenu.Item>

                      <DropdownMenu.Item
                        className="flex items-center justify-between px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-md cursor-pointer transition-colors"
                        onSelect={() => handleSortChange("investment")}
                      >
                        <span>Investment Amount</span>
                        {getSortIcon("investment")}
                      </DropdownMenu.Item>

                      <DropdownMenu.Item
                        className="flex items-center justify-between px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-md cursor-pointer transition-colors"
                        onSelect={() => handleSortChange("pl")}
                      >
                        <span>Profit/Loss %</span>
                        {getSortIcon("pl")}
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              )}

              {/* Create Portfolio Button */}
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 font-medium shadow-lg hover:shadow-blue-500/25 text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Create Portfolio</span>
              </button>
            </div>
          </div>

          {/* Content Section */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(3)].map((_, i) => (
                <PortfolioSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-6 py-4 rounded-lg">
              {error}
            </div>
          ) : portfolios.length === 0 ? (
            <div className="text-center py-12 sm:py-16 lg:py-20">
              <div className="bg-gray-800/50 rounded-full p-6 sm:p-8 w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 sm:mb-8 flex items-center justify-center">
                <Plus className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6">
                No portfolios yet
              </h2>
              <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                Create your first portfolio to start tracking your investments
                and get AI-powered insights.
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 font-medium"
              >
                <Plus className="w-5 h-5" />
                <span>Create your first portfolio</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {sortedPortfolios.map((portfolio) => (
                <PortfolioCard key={portfolio._id} portfolio={portfolio} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Portfolio Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 sm:p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
                Create New Portfolio
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-700/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleCreatePortfolio}
              className="space-y-4 sm:space-y-6"
            >
              <div>
                <label
                  htmlFor="portfolioName"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Portfolio Name <span className="text-red-400">*</span>
                </label>
                <input
                  id="portfolioName"
                  type="text"
                  value={newPortfolioName}
                  onChange={(e) => setNewPortfolioName(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700/80 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all text-sm sm:text-base"
                  placeholder="Enter portfolio name"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 px-4 py-2 sm:py-3 text-gray-300 hover:text-white transition-colors text-sm sm:text-base font-medium rounded-lg hover:bg-gray-700/50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newPortfolioName.trim()}
                  className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:py-3 rounded-lg transition-all duration-300 text-sm sm:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Create</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 sm:p-6 w-full max-w-md mx-4">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-2">
                Delete Portfolio?
              </h2>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                Are you sure you want to delete this portfolio? This action
                cannot be undone and will permanently remove all associated
                data.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setPortfolioToDelete(null);
                }}
                className="flex-1 px-4 py-2 sm:py-3 text-gray-300 hover:text-white transition-colors text-sm sm:text-base font-medium rounded-lg hover:bg-gray-700/50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePortfolio}
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 sm:py-3 rounded-lg transition-all duration-300 text-sm sm:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Portfolio;
