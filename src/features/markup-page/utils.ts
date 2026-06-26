import type { FlightMarkupRule, TripType } from "./data";
import { DOMESTIC_CITIES } from "./data";

export interface PreviewInput {
  netFare: number;
  tripType: "One-way" | "Round-trip" | "Multi-city";
  sectors: number;
  adult: number;
  child: number;
  infant: number;
}

export function computeMarkup(rule: FlightMarkupRule | null, input: PreviewInput): number {
  if (!rule) return 0;
  const pax = input.adult + input.child + input.infant;
  let base = 0;
  switch (rule.markupType) {
    case "Flat":
      base = rule.flatAmount ?? 0; break;
    case "Percentage":
      base = Math.round(input.netFare * ((rule.pctAmount ?? 0) / 100)); break;
    case "FlatPct":
      base = (rule.flatAmount ?? 0) + Math.round(input.netFare * ((rule.pctAmount ?? 0) / 100)); break;
    case "PerPax": {
      const a = (rule.perPax?.adult ?? 0) * input.adult;
      const c = (rule.perPax?.child ?? 0) * input.child;
      const i = (rule.perPax?.infant ?? 0) * input.infant;
      base = a + c + i; break;
    }
  }
  let sectors = 1;
  if (input.tripType === "Round-trip") sectors = 2;
  if (input.tripType === "Multi-city") sectors = Math.max(1, input.sectors);
  let total = rule.applyMode === "sector" ? base * sectors : base;
  if (rule.maxCap) total = Math.min(total, rule.maxCap);
  if (rule.minMarkup) total = Math.max(total, rule.minMarkup);
  if (rule.maxMarkup) total = Math.min(total, rule.maxMarkup);
  if (rule.maxPerPax) total = Math.min(total, rule.maxPerPax * Math.max(1, pax));
  return total;
}

export interface ConflictScenario {
  origin: string;
  destination: string;
  tripType: "One-way" | "Round-trip" | "Multi-city";
  airline: string;
  cabin: string;
  travelDate: string;
  agent: string;
}

const isDomestic = (city: string) => DOMESTIC_CITIES.includes(city);

export function findMatchingRules(rules: FlightMarkupRule[], s: ConflictScenario): FlightMarkupRule[] {
  return rules
    .filter((r) => r.status !== "Inactive")
    .filter((r) => {
      // trip type
      if (!r.tripTypes.includes("All") && !r.tripTypes.includes(s.tripType as TripType)) return false;
      // sector
      const dom = isDomestic(s.origin) && isDomestic(s.destination);
      if (r.sector === "Domestic" && !dom) return false;
      if (r.sector === "International" && dom) return false;
      // airline
      if (!r.airlines.includes("ALL") && !r.airlines.includes(s.airline)) return false;
      // cabin
      if (r.cabin !== "All" && r.cabin !== s.cabin) return false;
      // agent
      if (r.appliesToKind === "Specific" && r.specificAgent !== s.agent) return false;
      // route
      if (r.routeMode === "origin" && !(r.origins ?? []).includes(s.origin)) return false;
      if (r.routeMode === "destination" && !(r.destinations ?? []).includes(s.destination)) return false;
      if (r.routeMode === "pair") {
        const ok = (r.pairs ?? []).some((p) => p.from === s.origin && p.to === s.destination);
        if (!ok) return false;
      }
      return true;
    })
    .sort((a, b) => a.priority - b.priority);
}
