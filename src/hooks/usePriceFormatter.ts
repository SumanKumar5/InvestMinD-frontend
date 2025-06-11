import { useCurrency } from "../contexts/CurrencyContext";

export const usePriceFormatter = () => {
  const { currency, exchangeRate } = useCurrency();

  const format = (price: number) => {
    const converted = currency === "INR" ? price * exchangeRate : price;
    const rounded = Math.round(converted * 100) / 100;

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(rounded);
  };

  return format;
};
