import type { Metadata } from "next";
import { defaultLocale, isLocale, locales, type Locale } from "@/i18n";
import { getDictionary, type Dictionary } from "@/content";
import { site } from "@/config/site";
import { media } from "@/config/media";
import { resolveMedia } from "./media.server";

export const toLocale = (value: string): Locale => (isLocale(value) ? value : defaultLocale);

/**
 * Title, description, canonical, hreflang, Open Graph and Twitter tags for an inner page.
 * `path` is the part after /{locale}; `pick` chooses the copy; `image` is a /media/... path
 * for the share preview (defaults to the site's og.jpg).
 * Open Graph is rebuilt in full here because Next replaces, not merges, the layout's object.
 */
export function pageMetadata(
  localeParam: string,
  path: string,
  pick: (t: Dictionary) => { title: string; description: string },
  image?: { src: string | null; alt: string },
): Metadata {
  const locale = toLocale(localeParam);
  const t = getDictionary(locale);
  const { title, description } = pick(t);
  const languages = Object.fromEntries(locales.map((l) => [l, `/${l}${path}`]));
  const ogSrc = image?.src ?? resolveMedia(media.og.file);
  const images = ogSrc ? [{ url: ogSrc, alt: image?.alt ?? t.hero.mediaAlt }] : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: { ...languages, "x-default": `/${defaultLocale}${path}` },
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: `/${locale}${path}`,
      siteName: site.brandName || t.nav.brandFallback,
      locale: t.meta.ogLocale,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => getDictionary(l).meta.ogLocale),
      ...(images ? { images } : {}),
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title,
      description,
      ...(images ? { images: images.map((i) => i.url) } : {}),
    },
  };
}
