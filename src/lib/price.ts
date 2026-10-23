import type { Locale } from "@/i18n";
import type { CruiseSlug } from "@/config/catalogue";
import { cleaningFee, cruisePrices, lowestPrice, seasonBands, type Season } from "@/config/pricing";

/*
 * Price formatting, done on the server so the client never re-formats (no hydration drift).
 * en: "€1,580", bg: "1580 €". Dates: en "2 May", bg "2 май", "3 окт.".
 */

const intlLocale = (l: Locale) => (l === "bg" ? "bg-BG" : "en-GB");

export const formatEuro = (locale: Locale, n: number) =>
  new Intl.NumberFormat(intlLocale(locale), { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

const YEAR = 2026; // any non leap year; only month and day are shown
const toUtc = (md: string) => {
  const [m, d] = md.split("-").map(Number);
  return Date.UTC(YEAR, m - 1, d);
};
const DAY = 86_400_000;

/** Short month name. Bulgarian "short" months come out as digits, so abbreviate the long name: "окт." */
const monthName = (locale: Locale, t: number) => {
  if (locale !== "bg") return new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: "UTC" }).format(t);
  const long = new Intl.DateTimeFormat("bg-BG", { month: "long", timeZone: "UTC" }).format(t);
  return long.length > 4 ? `${long.slice(0, 3)}.` : long;
};

const formatDay = (locale: Locale, md: string) => `${Number(md.split("-")[1])} ${monthName(locale, toUtc(md))}`;

/** "From €1,580" style price for cards and lists, or undefined when the owner set no price. */
export function priceFrom(locale: Locale, slug: CruiseSlug) {
  const p = cruisePrices[slug];
  return p ? formatEuro(locale, lowestPrice(p)) : undefined;
}

export type PriceSeasonRow = { season: Season; price: string; ranges: string[] };
export type PriceBand = { season: Season; days: number };
export type PriceTick = { label: string; at: number };

/** Everything the prices section needs, as display strings. Null when the cruise has no price. */
export function priceView(locale: Locale, slug: CruiseSlug) {
  const p = cruisePrices[slug];
  if (!p) return null;

  const start = toUtc(seasonBands[0].from);
  const end = toUtc(seasonBands[seasonBands.length - 1].to) + DAY;
  const total = (end - start) / DAY;

  const bands: PriceBand[] = seasonBands.map((b) => ({
    season: b.season,
    days: (toUtc(b.to) - toUtc(b.from)) / DAY + 1,
  }));

  // Month starts from May to October, as a share of the bar (May 1 sits at the very start)
  const ticks: PriceTick[] = [5, 6, 7, 8, 9, 10].map((m) => {
    const t = Date.UTC(YEAR, m - 1, 1);
    return { label: monthName(locale, t), at: Math.max(0, (t - start) / DAY / total) };
  });

  const order: Season[] = ["pre", "low", "high"];
  const rows: PriceSeasonRow[] = order
    .map((season) => ({
      season,
      price: formatEuro(locale, p[season]),
      ranges: seasonBands
        .filter((b) => b.season === season)
        .map((b) => `${formatDay(locale, b.from)} – ${formatDay(locale, b.to)}`),
    }))
    .sort((a, b) => p[a.season] - p[b.season]);

  return {
    from: formatEuro(locale, lowestPrice(p)),
    insurance: p.insurance,
    cleaning: formatEuro(locale, cleaningFee),
    bands,
    ticks,
    rows,
  };
}

export type PriceView = NonNullable<ReturnType<typeof priceView>>;

/** List meta line: "4 days · From €1,760", or the duration alone when there is no price. */
export function durationWithPrice(locale: Locale, slug: CruiseSlug, duration: string, from: (p: string) => string) {
  const p = priceFrom(locale, slug);
  return p ? `${duration} · ${from(p)}` : duration;
}
