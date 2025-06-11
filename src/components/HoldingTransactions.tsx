import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Calendar, DollarSign, Hash, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRequireAuth } from '../hooks/useAuth';
import { getTransactions, getHoldingDetails } from '../services/api';
import { useCurrency } from "../contexts/CurrencyContext";
import { usePriceFormatter } from "../hooks/usePriceFormatter";
import { useLoading } from '../contexts/LoadingContext';
import Header from './Header';
import Footer from './Footer';

interface Transaction {
  _id: string;
  type: 'buy' | 'sell';
  price: number;
  quantity: number;
  date: string;
  executedAt: string;
  notes?: string;
}

interface HoldingSummary {
  symbol: string;
  companyName: string;
  currentPrice: number;
}

const HoldingTransactions: React.FC = () => {
  useRequireAuth();
  const { holdingId } = useParams<{ holdingId: string }>();
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoading();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { currency, exchangeRate } = useCurrency();
  const formatPrice = usePriceFormatter();
  const [holding, setHolding] = useState<HoldingSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      if (!holdingId) return;

      startLoading();
      try {
        const [transactionsData, holdingData] = await Promise.all([
          getTransactions(holdingId),
          getHoldingDetails(holdingId)
        ]);

        setTransactions(transactionsData);
        setHolding(holdingData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
        stopLoading();
      }
    };

    fetchData();
  }, [holdingId]);

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDateTimeMobile = (dateString: string) => {
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    return { dateStr, timeStr };
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedTransactions = transactions.slice(startIndex, endIndex);
  const totalPages = Math.ceil(transactions.length / rowsPerPage);

  // Enhanced Mobile Transaction Card Component
  const TransactionCard = ({ transaction }: { transaction: Transaction }) => {
    const { dateStr, timeStr } = formatDateTimeMobile(transaction.executedAt);
    
    return (
      <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] group">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${
              transaction.type === 'buy' 
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                : 'bg-red-500/15 text-red-400 border-red-500/30'
            }`}>
              {transaction.type.toUpperCase()}
            </span>
          </div>
          <div className="text-right">
            <div className="text-xs sm:text-sm font-medium text-gray-300">{dateStr}</div>
            <div className="text-xs text-gray-500">{timeStr}</div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {/* Left Column */}
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-xs text-gray-400 mb-0.5">Price</div>
                <div className="font-mono text-sm sm:text-base font-medium text-white truncate">
                  {formatPrice(transaction.price)}
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Hash className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-xs text-gray-400 mb-0.5">Quantity</div>
                <div className={`text-sm sm:text-base font-semibold ${
                  transaction.type === 'buy' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {transaction.type === 'buy' ? '+' : '–'}{transaction.quantity}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-3">
            <div className="min-w-0">
              <div className="text-xs text-gray-400 mb-0.5">Total Value</div>
              <div className="font-mono text-sm sm:text-base font-semibold text-white truncate">
                {formatPrice(transaction.price * transaction.quantity)}
              </div>
            </div>

            {transaction.notes && (
              <div className="flex items-start space-x-2">
                <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-gray-400 mb-0.5">Notes</div>
                  <div className="text-xs sm:text-sm text-gray-300 break-words line-clamp-2">
                    {transaction.notes}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Enhanced Pagination Component
  const PaginationControls = () => (
    <div className="flex flex-col space-y-4 pt-4 sm:pt-6 border-t border-gray-700/50">
      {/* Results Info */}
      <div className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
        Showing {startIndex + 1} to {Math.min(endIndex, transactions.length)} of {transactions.length} results
      </div>
      
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Rows per page */}
        <div className="flex items-center space-x-2 order-2 sm:order-1">
          <label className="text-xs sm:text-sm text-gray-400 whitespace-nowrap">Rows:</label>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-gray-700/80 border border-gray-600/50 rounded-lg px-2 sm:px-3 py-1.5 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
          >
            {[10, 25, 50, 100].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        
        {/* Page Navigation */}
        <div className="flex items-center space-x-1 order-1 sm:order-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-1.5 sm:p-2 rounded-lg bg-gray-700/80 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600/80 transition-colors"
            title="Previous page"
          >
            <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-colors ${
                    currentPage === pageNum
                      ? 'bg-blue-600/90 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-gray-700/80 text-gray-300 hover:bg-gray-600/80'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 sm:p-2 rounded-lg bg-gray-700/80 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600/80 transition-colors"
            title="Next page"
          >
            <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-3 sm:px-4 py-16 sm:py-20 lg:py-24">
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center space-x-3">
              <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-blue-500" />
              <span className="text-sm sm:text-base text-gray-400">Loading transactions...</span>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-3 sm:px-4 py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-400 hover:text-white mb-4 sm:mb-6 lg:mb-8 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm sm:text-base">Back to Portfolio</span>
          </button>

          {/* Asset Info Header */}
          {holding && (
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 lg:mb-8 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                    {holding.symbol}
                  </h1>
                  <p className="text-sm sm:text-base text-gray-400">{holding.companyName}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs sm:text-sm text-gray-400 mb-1">Current Price</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                    {formatPrice(holding.currentPrice)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Transactions Section */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-700/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
                  Transaction History
                </h2>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>{transactions.length} transaction{transactions.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>

            {transactions.length === 0 ? (
              <div className="p-6 sm:p-8 lg:p-12 text-center">
                <div className="bg-gray-700/50 rounded-full p-3 sm:p-4 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 flex items-center justify-center">
                  <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                </div>
                <h3 className="text-base sm:text-lg font-medium mb-2">No transactions yet</h3>
                <p className="text-gray-400 text-sm sm:text-base">
                  Transactions will appear here once you start trading this asset.
                </p>
              </div>
            ) : (
              <div className="p-3 sm:p-4 lg:p-6">
                {/* Desktop Table View */}
                <div className="hidden lg:block">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-gray-400 border-b border-gray-700/50">
                          <th className="pb-4 font-medium text-sm">Type</th>
                          <th className="pb-4 font-medium text-sm">Price</th>
                          <th className="pb-4 font-medium text-sm">Quantity</th>
                          <th className="pb-4 font-medium text-sm">Total Value</th>
                          <th className="pb-4 font-medium text-sm">Date & Time</th>
                          <th className="pb-4 font-medium text-sm">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700/50">
                        {paginatedTransactions.map((transaction) => (
                          <tr key={transaction._id} className="hover:bg-gray-750/30 transition-colors">
                            <td className="py-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                                transaction.type === 'buy' 
                                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                                  : 'bg-red-500/15 text-red-400 border-red-500/30'
                              }`}>
                                {transaction.type.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-4 font-mono text-sm text-white">
                              {formatPrice(transaction.price)}
                            </td>
                            <td className="py-4">
                              <span className={`font-semibold ${
                                transaction.type === 'buy' ? 'text-emerald-400' : 'text-red-400'
                              }`}>
                                {transaction.type === 'buy' ? '+' : '–'}{transaction.quantity}
                              </span>
                            </td>
                            <td className="py-4 font-mono text-sm font-semibold text-white">
                              {formatPrice(transaction.price * transaction.quantity)}
                            </td>
                            <td className="py-4 text-sm text-gray-300">
                              {formatDateTime(transaction.executedAt)}
                            </td>
                            <td className="py-4 text-gray-400 text-sm max-w-xs">
                              <div className="truncate" title={transaction.notes}>
                                {transaction.notes || '—'}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile/Tablet Card View */}
                <div className="lg:hidden space-y-3 sm:space-y-4">
                  {paginatedTransactions.map((transaction) => (
                    <TransactionCard key={transaction._id} transaction={transaction} />
                  ))}
                </div>

                {/* Pagination */}
                {transactions.length > rowsPerPage && <PaginationControls />}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HoldingTransactions;