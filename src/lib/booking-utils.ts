import type { Booking } from "./mock-data";

export const profit = (b: { sellPrice: number; netPrice: number }) => b.sellPrice - b.netPrice;

export const applyMarkup = (net: number, pct: number) => Math.round(net * (1 + pct / 100));

export const generatePNR = () =>
  "PNR" + Math.random().toString(36).slice(2, 9).toUpperCase();

export const generateInvoiceNo = (prefix = "INV") =>
  `${prefix}/2026/${Math.floor(Math.random() * 9000 + 1000)}`;

export const filterBookings = (
  rows: Booking[],
  filters: { type?: string; status?: string; agentId?: string },
) =>
  rows.filter(
    (b) =>
      (!filters.agentId || b.agentId === filters.agentId) &&
      (!filters.type || filters.type === "all" || b.type === filters.type) &&
      (!filters.status || filters.status === "all" || b.status === filters.status),
  );

export const cancellationPenalty = (sell: number) => Math.round(sell * 0.25);
export const refundAmount = (sell: number) => sell - cancellationPenalty(sell);

export const nightsBetween = (checkIn: string, checkOut: string) => {
  const a = new Date(checkIn).getTime();
  const b = new Date(checkOut).getTime();
  return Math.max(1, Math.round((b - a) / 86400000));
};
