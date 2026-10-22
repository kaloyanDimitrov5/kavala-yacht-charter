import { site } from "@/config/site";
import type { Dictionary } from "@/content";
import type { Locale } from "@/i18n";
import { absolute } from "./siteUrl";

/*
 * schema.org builders. Only facts the site already states: no prices, ratings,
 * street address or opening hours (none were provided).
 */

export const orgId = absolute("/#organization");

/** The business, on every page (layout). */
export function organization(t: Dictionary, locale: Locale) {
  const name = site.brandName || t.nav.brandFallback;
  const sameAs = site.contact.instagram ? [`https://instagram.com/${site.contact.instagram}`] : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": orgId,
    name,
    description: t.meta.description,
    url: absolute(`/${locale}`),
    logo: absolute("/icon.svg"),
    image: absolute("/media/og.jpg"),
    address: { "@type": "PostalAddress", addressLocality: "Kavala", addressCountry: "GR" },
    areaServed: ["Kavala", "Thasos", "Samothraki", "Northern Sporades", "Halkidiki"].map((n) => ({ "@type": "Place", name: n })),
    knowsLanguage: ["en", "bg"],
    ...(site.whatsappNumber ? { telephone: `+${site.whatsappNumber}` } : {}),
    ...(site.contact.email ? { email: site.contact.email } : {}),
    ...(sameAs ? { sameAs } : {}),
  };
}

/** The website, on every page (layout). */
export function website(t: Dictionary, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absolute("/#website"),
    name: site.brandName || t.nav.brandFallback,
    url: absolute(`/${locale}`),
    inLanguage: locale,
    publisher: { "@id": orgId },
  };
}

/** Breadcrumb trail; the first crumb is always the home page. */
export function breadcrumbs(t: Dictionary, locale: Locale, trail: { name: string; path: string }[]) {
  const all = [{ name: t.nav.links.home, path: "" }, ...trail];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absolute(`/${locale}${c.path}`),
    })),
  };
}

/** A cruise as a TouristTrip, with the day by day plan as its itinerary. */
export function touristTrip(opts: {
  locale: Locale;
  path: string;
  name: string;
  description: string;
  image: string | null;
  steps: { label: string; title: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: opts.name,
    description: opts.description,
    url: absolute(`/${opts.locale}${opts.path}`),
    inLanguage: opts.locale,
    ...(opts.image ? { image: absolute(opts.image) } : {}),
    provider: { "@id": orgId },
    itinerary: {
      "@type": "ItemList",
      numberOfItems: opts.steps.length,
      itemListElement: opts.steps.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${s.label}: ${s.title}`,
      })),
    },
  };
}

/** A course. */
export function course(opts: { locale: Locale; path: string; name: string; description: string; image: string | null }) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: opts.name,
    description: opts.description,
    url: absolute(`/${opts.locale}${opts.path}`),
    inLanguage: opts.locale,
    ...(opts.image ? { image: absolute(opts.image) } : {}),
    provider: { "@id": orgId },
  };
}

/** A list of links (e.g. the cruises on /cruises). */
export function itemList(locale: Locale, items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: absolute(`/${locale}${it.path}`),
    })),
  };
}
