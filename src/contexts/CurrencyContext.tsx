import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

type CurrencyType = "USD" | "INR";

const CurrencyContext = createContext<{
  currency: CurrencyType;
  setCurrency: (c: CurrencyType) => void;
  exchangeRate: number;
}>({
  currency: "USD",
  setCurrency: () => {},
  exchangeRate: 1,
});

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrency] = useState<CurrencyType>(() => {
    const stored = localStorage.getItem("currency");
    return stored === "INR" || stored === "USD" ? stored : "USD";
  });

  const [exchangeRate, setExchangeRate] = useState<number>(() => {
    const cached = localStorage.getItem("exchangeRate");
    return cached ? Number(cached) : 1;
  });

  // Save currency to localStorage on change
  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

  // Load exchange rate (on startup or currency change)
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const now = Date.now();
        const lastFetched = Number(localStorage.getItem("exchangeRateTimestamp")) || 0;

        // If last fetch was within 12 hours, use cache
        if (currency === "INR" && now - lastFetched < 12 * 60 * 60 * 1000) {
          const cachedRate = Number(localStorage.getItem("exchangeRate"));
          if (cachedRate) {
            setExchangeRate(cachedRate);
            return;
          }
        }

        // Fetch new rate if stale or USD selected
        if (currency === "INR") {
          const res = await axios.get("https://api.currencyapi.com/v3/latest", {
            params: {
              apikey: import.meta.env.VITE_CURRENCY_API_KEY,
              base_currency: "USD",
              currencies: "INR",
            },
          });

          const rate = res.data.data?.INR?.value || 1;
          setExchangeRate(rate);

          // Save to localStorage
          localStorage.setItem("exchangeRate", rate.toString());
          localStorage.setItem("exchangeRateTimestamp", now.toString());
        } else {
          setExchangeRate(1);
        }
      } catch {
        setExchangeRate(1);
      }
    };

    fetchRate();
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, exchangeRate }}>
      {children}
    </CurrencyContext.Provider>
  );
};
