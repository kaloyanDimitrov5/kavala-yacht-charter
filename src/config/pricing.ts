import type { CruiseSlug } from "./catalogue";

/**
 * Owner's charter prices, in euro, for the whole yacht (up to 8 guests).
 * Season dates are the same for every priced cruise. Cruises without an entry show no price.
 */
export type Season = "pre" | "low" | "high";

/** Month-day ranges, in calendar order across the sailing year. */
export const seasonBands: { season: Season; from: string; to: string }[] = [
  { season: "pre", from: "05-02", to: "06-02" },
  { season: "low", from: "06-03", to: "06-30" },
  { season: "high", from: "07-01", to: "09-18" },
  { season: "low", from: "09-19", to: "10-02" },
  { season: "pre", from: "10-03", to: "10-31" },
];

/** Cleaning when the yacht is returned, not included in the price */
export const cleaningFee = 100;

export type CruisePrice = Record<Season, number> & {
  /** The owner lists insurance as included for the Thasos cruises only */
  insurance: boolean;
};

export const cruisePrices: Partial<Record<CruiseSlug, CruisePrice>> = {
  "thasos-weekend-cruise": { pre: 1580, low: 1720, high: 1850, insurance: true },
  "thasos-cruise": { pre: 1760, low: 1880, high: 2050, insurance: true },
  // TODO(owner): confirm insurance is included on the week long cruises too.
  "sporades-cruise": { pre: 3100, low: 3450, high: 3750, insurance: false },
  "halkidiki-cruise": { pre: 3100, low: 3450, high: 3750, insurance: false },
};

export const lowestPrice = (p: CruisePrice) => Math.min(p.pre, p.low, p.high);
export const highestPrice = (p: CruisePrice) => Math.max(p.pre, p.low, p.high);
