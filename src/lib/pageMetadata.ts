import type { Metadata } from "next";
import { defaultLocale, isLocale, locales, type Locale } from "@/i18n";
import { getDictionary, type Dictionary } from "@/content";

export const toLocale = (value: string): Locale => (isLocale(value) ? value : defaultLocale);

/**
 * Title, description, canonical and hreflang for an inner page.
 * `path` is the part after /{locale}; `pick` chooses the copy from the dictionary.
 */
export function pageMetadata(
  localeParam: string,
  path: string,
  pick: (t: Dictionary) => { title: string; description: string },
): Metadata {
  const locale = toLocale(localeParam);
  const { title, description } = pick(getDictionary(locale));
  const languages = Object.fromEntries(locales.map((l) => [l, `/${l}${path}`]));
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: { ...languages, "x-default": `/${defaultLocale}${path}` },
    },
    openGraph: { title, description, url: `/${locale}${path}` },
  };
}
