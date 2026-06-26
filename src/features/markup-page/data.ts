export type RuleStatus = "Active" | "Inactive" | "Scheduled";
export type TripType = "One-way" | "Round-trip" | "Multi-city" | "All";
export type MarkupType = "Flat" | "Percentage" | "PerPax" | "FlatPct";
export type AppliesToKind = "All" | "Specific" | "Tier";

export interface FlightMarkupRule {
  id: string;
  priority: number;
  name: string;
  appliesToLabel: string;
  appliesToKind: AppliesToKind;
  specificAgent?: string;
  tiers?: string[];
  tripTypes: TripType[];
  routeLabel: string;
  routeMode: "any" | "origin" | "destination" | "pair";
  origins?: string[];
  destinations?: string[];
  pairs?: { from: string; to: string }[];
  sector: "Domestic" | "International" | "Both";
  cabin: "Economy" | "Business" | "First Class" | "All";
  airlines: string[];
  markupType: MarkupType;
  flatAmount?: number;
  pctAmount?: number;
  perPax?: { adult: number; child: number; infant: number };
  applyMode: "booking" | "sector";
  maxCap?: number;
  minMarkup?: number;
  maxMarkup?: number;
  maxPerPax?: number;
  allowAgentTopUp: boolean;
  allowAgentWaive: boolean;
  valueLabel: string;
  status: RuleStatus;
  scheduledStart?: string;
  scheduledEnd?: string;
}

export const AGENTS = [
  "Sharma Travels",
  "Kapoor Holidays",
  "Delhi Star Tours",
  "Mehta Corporate Travel",
  "Gupta Air Services",
];

export const AIRLINES = [
  { code: "ALL", name: "All Airlines" },
  { code: "6E", name: "IndiGo" },
  { code: "AI", name: "Air India" },
  { code: "SG", name: "SpiceJet" },
  { code: "UK", name: "Vistara" },
  { code: "QP", name: "Akasa Air" },
  { code: "EK", name: "Emirates" },
  { code: "QR", name: "Qatar Airways" },
  { code: "G9", name: "Air Arabia" },
];

export const DOMESTIC_CITIES = ["DEL", "BOM", "BLR", "HYD", "CCU", "MAA", "AMD", "PNQ", "COK"];
export const INTL_CITIES = ["DXB", "SIN", "LHR", "JFK", "BKK", "SYD", "KUL"];
export const ALL_CITIES = [...DOMESTIC_CITIES, ...INTL_CITIES];

export const fmtINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export const initialRules: FlightMarkupRule[] = [
  {
    id: "R1", priority: 1, name: "DEL–DXB IndiGo Special",
    appliesToLabel: "All Agents", appliesToKind: "All",
    tripTypes: ["One-way"], routeLabel: "DEL → DXB", routeMode: "pair",
    pairs: [{ from: "DEL", to: "DXB" }],
    sector: "International", cabin: "Economy", airlines: ["6E"],
    markupType: "Flat", flatAmount: 350, applyMode: "booking",
    allowAgentTopUp: true, allowAgentWaive: false,
    valueLabel: "₹350 flat/booking", status: "Active",
  },
  {
    id: "R2", priority: 2, name: "International Long Haul",
    appliesToLabel: "All Agents", appliesToKind: "All",
    tripTypes: ["One-way", "Round-trip"], routeLabel: "Any → LHR, JFK, SYD", routeMode: "destination",
    destinations: ["LHR", "JFK", "SYD"],
    sector: "International", cabin: "All", airlines: ["ALL"],
    markupType: "Percentage", pctAmount: 4, applyMode: "booking",
    allowAgentTopUp: true, allowAgentWaive: false,
    valueLabel: "4% of net fare", status: "Active",
  },
  {
    id: "R3", priority: 3, name: "Domestic Economy Peak Season",
    appliesToLabel: "All Agents", appliesToKind: "All",
    tripTypes: ["One-way", "Round-trip"], routeLabel: "Any domestic", routeMode: "any",
    sector: "Domestic", cabin: "Economy", airlines: ["ALL"],
    markupType: "Flat", flatAmount: 250, applyMode: "sector",
    allowAgentTopUp: true, allowAgentWaive: false,
    valueLabel: "₹250 flat/sector", status: "Scheduled",
    scheduledStart: "2024-12-01", scheduledEnd: "2025-01-31",
  },
  {
    id: "R4", priority: 4, name: "Multi-city International",
    appliesToLabel: "Master Agent tier", appliesToKind: "Tier", tiers: ["Master Agent"],
    tripTypes: ["Multi-city"], routeLabel: "Any international", routeMode: "any",
    sector: "International", cabin: "All", airlines: ["ALL"],
    markupType: "Flat", flatAmount: 400, applyMode: "sector", maxCap: 1000,
    allowAgentTopUp: true, allowAgentWaive: false,
    valueLabel: "₹400/sector, max ₹1,000/booking", status: "Active",
  },
  {
    id: "R5", priority: 5, name: "BOM Origin Blanket",
    appliesToLabel: "Specific Agent — Sharma Travels", appliesToKind: "Specific",
    specificAgent: "Sharma Travels",
    tripTypes: ["All"], routeLabel: "BOM → Any", routeMode: "origin", origins: ["BOM"],
    sector: "Both", cabin: "All", airlines: ["ALL"],
    markupType: "FlatPct", flatAmount: 200, pctAmount: 1.5, applyMode: "booking",
    allowAgentTopUp: true, allowAgentWaive: true,
    valueLabel: "₹200 flat + 1.5%", status: "Active",
  },
  {
    id: "R6", priority: 6, name: "Default Domestic Fallback",
    appliesToLabel: "All Agents", appliesToKind: "All",
    tripTypes: ["All"], routeLabel: "Any domestic", routeMode: "any",
    sector: "Domestic", cabin: "All", airlines: ["ALL"],
    markupType: "Flat", flatAmount: 180, applyMode: "booking",
    allowAgentTopUp: true, allowAgentWaive: false,
    valueLabel: "₹180 flat/booking", status: "Active",
  },
];

export const emptyDraft: FlightMarkupRule = {
  id: "",
  priority: 7,
  name: "",
  appliesToLabel: "All Agents",
  appliesToKind: "All",
  tripTypes: ["One-way"],
  routeLabel: "Any route",
  routeMode: "any",
  sector: "Both",
  cabin: "Economy",
  airlines: ["ALL"],
  markupType: "Flat",
  flatAmount: 250,
  applyMode: "booking",
  allowAgentTopUp: true,
  allowAgentWaive: false,
  valueLabel: "₹250 flat/booking",
  status: "Active",
};
