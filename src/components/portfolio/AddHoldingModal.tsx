import React, { useState, useEffect, useRef } from "react";
import { X, Plus, Loader2 } from "lucide-react";
import Fuse from "fuse.js";

interface AddHoldingModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: "buy" | "sell";
  setActiveTab: (tab: "buy" | "sell") => void;
  newHolding: {
    symbol: string;
    quantity: string;
    buyPrice: string;
    notes: string;
  };
  setNewHolding: React.Dispatch<
  React.SetStateAction<{
    symbol: string;
    quantity: string;
    buyPrice: string;
    notes: string;
    companyName: string;
  }>
>;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

const AddHoldingModal: React.FC<AddHoldingModalProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  newHolding,
  setNewHolding,
  onSubmit,
  isSubmitting,
}) => {
  const [symbolsData, setSymbolsData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [symbolValid, setSymbolValid] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const fuse = new Fuse(symbolsData, {
    keys: ["symbol", "name"],
    threshold: 0.3,
    ignoreLocation: true,
  });

  useEffect(() => {
    fetch("/symbols_database.json")
      .then((res) => res.json())
      .then((data) => setSymbolsData(data));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (!searchQuery) {
        const recents = localStorage.getItem("recentSymbols");
        setSuggestions(recents ? JSON.parse(recents) : []);
      } else {
        const results = fuse
          .search(searchQuery)
          .map((r) => r.item)
          .slice(0, 15);
        setSuggestions(results);
      }
    }, 150);
  }, [searchQuery, fuse]);

  const selectSymbol = (item: any) => {
    const formatted = `${item.name} (${item.symbol})`;
    setNewHolding({ ...newHolding, symbol: item.symbol, companyName: item.name });
    setSearchQuery(formatted);
    setShowDropdown(false);
    setSymbolValid(true);
    const recents = JSON.parse(localStorage.getItem("recentSymbols") || "[]");
    const updated = [
      item,
      ...recents.filter((i: any) => i.symbol !== item.symbol),
    ].slice(0, 5);
    localStorage.setItem("recentSymbols", JSON.stringify(updated));
  };

  const highlightMatch = (text: string) => {
    const index = text.toLowerCase().indexOf(searchQuery.toLowerCase());
    if (index === -1) return text;
    return (
      <>
        {text.substring(0, index)}
        <span className="text-blue-400 font-medium">
          {text.substring(index, index + searchQuery.length)}
        </span>
        {text.substring(index + searchQuery.length)}
      </>
    );
  };

  const groupedSuggestions = suggestions.reduce(
    (groups: Record<string, any[]>, item) => {
      const type = item.type || "Others";
      if (!groups[type]) groups[type] = [];
      groups[type].push(item);
      return groups;
    },
    {}
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 sm:p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
            Add Transaction
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-700/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex space-x-1 bg-gray-700/50 p-1 rounded-lg mb-4 sm:mb-6">
          <button
            onClick={() => setActiveTab("buy")}
            className={`flex-1 py-2 sm:py-2.5 rounded-md transition-all text-sm sm:text-base font-medium ${
              activeTab === "buy"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-gray-600/50"
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setActiveTab("sell")}
            className={`flex-1 py-2 sm:py-2.5 rounded-md transition-all text-sm sm:text-base font-medium ${
              activeTab === "sell"
                ? "bg-red-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-gray-600/50"
            }`}
          >
            Sell
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5">
          <div ref={dropdownRef} className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Name or Symbol <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
                setHighlightedIndex(-1);
              }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => {
                const match = symbolsData.find((item) => {
                  const formatted = `${item.name} (${item.symbol})`;
                  return formatted.toLowerCase() === searchQuery.toLowerCase();
                });
                if (!match) {
                  setSymbolValid(false);
                  setNewHolding((prev) => ({ ...prev, symbol: "" }));
                }
              }}
              onKeyDown={(e) => {
                if (!showDropdown) return;
                const flat = Object.values(groupedSuggestions).flat();
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setHighlightedIndex((prev) =>
                    Math.min(prev + 1, flat.length - 1)
                  );
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setHighlightedIndex((prev) => Math.max(prev - 1, 0));
                } else if (e.key === "Enter" && highlightedIndex >= 0) {
                  e.preventDefault();
                  selectSymbol(flat[highlightedIndex]);
                } else if (e.key === "Escape") {
                  setShowDropdown(false);
                }
              }}
              placeholder="e.g., Bitcoin, AAPL"
              className="w-full px-3 py-2 sm:py-3 bg-gray-700/80 border border-gray-600/50 rounded-lg text-sm sm:text-base text-white focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
              autoComplete="off"
              disabled={isSubmitting}
            />
            {!symbolValid && (
              <p className="text-red-400 text-xs mt-1">
                ❗Please select a asset from the
                dropdown.
              </p>
            )}

            {showDropdown && suggestions.length > 0 && (
              <div className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto bg-gray-800 border border-gray-600 rounded-lg shadow-lg">
                {Object.entries(groupedSuggestions).map(
                  ([type, items], groupIndex) => (
                    <div key={groupIndex}>
                      <div className="px-4 py-1 text-xs font-semibold text-gray-400 bg-gray-700/60 sticky top-0 z-10">
                        {type}
                      </div>
                      <ul>
                        {items.map((item, idx) => {
                          const flatIndex = Object.values(groupedSuggestions)
                            .flat()
                            .findIndex((i) => i.symbol === item.symbol);
                          return (
                            <li
                              key={item.symbol}
                              className={`px-4 py-2 cursor-pointer flex justify-between text-sm ${
                                flatIndex === highlightedIndex
                                  ? "bg-gray-700 text-white"
                                  : "text-gray-300 hover:bg-gray-700"
                              }`}
                              onClick={() => selectSymbol(item)}
                              onMouseEnter={() =>
                                setHighlightedIndex(flatIndex)
                              }
                            >
                              <span>{highlightMatch(item.name)}</span>
                              <span className="text-gray-400 ml-2">
                                {highlightMatch(item.symbol)}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Quantity, Price, Notes, and Action buttons remain unchanged */}
          {/* Keep your existing inputs and submit button code here exactly as you already had */}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Quantity <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              value={newHolding.quantity}
              onChange={(e) =>
                setNewHolding((prev) => ({ ...prev, quantity: e.target.value }))
              }
              className="w-full px-3 py-2 sm:py-3 bg-gray-700/80 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all text-sm sm:text-base"
              placeholder="Number of shares"
              required
              min="0"
              step="any"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Price per Unit <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base">
                $
              </span>
              <input
                type="number"
                value={newHolding.buyPrice}
                onChange={(e) =>
                  setNewHolding((prev) => ({ ...prev, buyPrice: e.target.value }))
                }
                className="w-full pl-8 pr-3 sm:pr-4 py-2 sm:py-3 bg-gray-700/80 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all text-sm sm:text-base"
                placeholder="0.00"
                required
                min="0"
                step="any"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={newHolding.notes}
              onChange={(e) =>
                setNewHolding((prev) => ({ ...prev, notes: e.target.value }))
              }
              className="w-full px-3 py-2 sm:py-3 bg-gray-700/80 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all text-sm sm:text-base resize-none"
              rows={3}
              placeholder="Add any notes about this transaction..."
              disabled={isSubmitting}
            />
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 sm:py-3 text-gray-300 hover:text-white transition-colors text-sm sm:text-base font-medium rounded-lg hover:bg-gray-700/50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                isSubmitting ||
                !newHolding.symbol ||
                !newHolding.quantity ||
                !newHolding.buyPrice
              }
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 sm:py-3 rounded-lg transition-all duration-300 text-sm sm:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                activeTab === "buy"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
              ) : (
                <>
                  <span>{activeTab === "buy" ? "Buy" : "Sell"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHoldingModal;
