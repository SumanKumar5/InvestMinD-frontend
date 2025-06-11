import { utils, writeFileXLSX } from "xlsx-js-style";
import { Holding } from "../types";
import { formatPriceRaw } from "./formatters"; // optional, for fallback

interface ExportOptions {
  holdings: Holding[];
  currency: "USD" | "INR";
  exchangeRate: number;
  fileName?: string;
}

export const exportHoldingsToExcel = ({
  holdings,
  currency,
  exchangeRate,
  fileName = "portfolio-export.xlsx",
}: ExportOptions) => {
  const data = holdings.map((h) => {
    const symbol = h.symbol.replace(/[-.]?(USD|NS|BSE)$/i, "");
    const qty = h.quantity;
    const avg = currency === "INR" ? h.avgBuyPrice * exchangeRate : h.avgBuyPrice;
    const curr = currency === "INR" ? h.currentPrice * exchangeRate : h.currentPrice;
    const value = qty * curr;
    const gain = currency === "INR" ? h.gainLoss * exchangeRate : h.gainLoss;
    const plPercent = h.gainLossPercent;

    return [
      symbol,
      h.companyName,
      qty,
      avg,
      curr,
      value,
      gain,
      plPercent / 100, // Excel expects 0.12 for 12%
    ];
  });

  const headers = [
    "Symbol",
    "Company Name",
    "Quantity",
    "Avg. Buy Price",
    "Current Price",
    "Total Value",
    "Profit/Loss",
    "P/L %",
  ];

  const wsData = [headers, ...data];
  const ws = utils.aoa_to_sheet(wsData);

  // Apply styles
  const currencyFmt = currency === "INR" ? "₹#,##0.00" : "$#,##0.00";
  const percentFmt = "0.00%";

  const range = utils.decode_range(ws["!ref"]!);
  for (let R = range.s.r + 1; R <= range.e.r; ++R) {
    ws[`D${R + 1}`].z = currencyFmt;
    ws[`E${R + 1}`].z = currencyFmt;
    ws[`F${R + 1}`].z = currencyFmt;
    ws[`G${R + 1}`].z = currencyFmt;
    ws[`H${R + 1}`].z = percentFmt;
  }

  for (let C = range.s.c; C <= range.e.c; ++C) {
    const cell = ws[utils.encode_cell({ r: 0, c: C })];
    if (cell) {
      cell.s = {
        font: { bold: true },
        border: {
          top: { style: "thin", color: { rgb: "888888" } },
          bottom: { style: "thin", color: { rgb: "888888" } },
        },
      };
    }
  }

  ws["!cols"] = [
    { wch: 14 },
    { wch: 30 },
    { wch: 12 },
    { wch: 16 },
    { wch: 16 },
    { wch: 16 },
    { wch: 14 },
    { wch: 10 },
  ];

  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, "Holdings");

  writeFileXLSX(wb, fileName);
};
