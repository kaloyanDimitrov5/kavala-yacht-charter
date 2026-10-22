import type { Metadata, Viewport } from "next";
import { defaultLocale, isLocale, locales, type Locale } from "@/i18n";
import { getDictionary } from "@/content";
import { site } from "@/config/site";
import { media } from "@/config/media";
import { resolveMedia } from "@/lib/media.server";
import { whatsappHref } from "@/lib/whatsapp";
import { IslandNav } from "@/components/IslandNav";
import { Footer } from "@/components/Footer";
import { FloatingContact } from "@/components/FloatingContact";
import { JsonLd } from "@/components/JsonLd";
import { organization, website } from "@/lib/structuredData";
import { manrope } from "../fonts";

type Params = { params: { locale: string } };

const toLocale = (value: string): Locale => (isLocale(value) ? value : defaultLocale);

/** Only /en and /bg exist; anything else under the root is a 404 (not a copy of the home page). */
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#E8EDEF",
  width: "device-width",
  initialScale: 1,
};

export function generateMetadata({ params }: Params): Metadata {
  const locale = toLocale(params.locale);
  const t = getDictionary(locale);
  const brand = site.brandName || t.nav.brandFallback;
  const title = site.brandName ? `${t.meta.title} | ${site.brandName}` : t.meta.title;
  const ogImage = resolveMedia(media.og.file);

  return {
    metadataBase: new URL(site.url || "http://localhost:3000"),
    // Inner pages set their own title; the template appends the brand
    title: { default: title, template: `%s | ${brand}` },
    description: t.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", bg: "/bg", "x-default": `/${defaultLocale}` },
    },
    openGraph: {
      type: "website",
      title,
      description: t.meta.description,
      url: `/${locale}`,
      siteName: site.brandName || t.nav.brandFallback,
      locale: t.meta.ogLocale,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => getDictionary(l).meta.ogLocale),
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: t.hero.mediaAlt }] } : {}),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description: t.meta.description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export default function LocaleLayout({ children, params }: Params & { children: React.ReactNode }) {
  const locale = toLocale(params.locale);
  const t = getDictionary(locale);

  return (
    <html lang={locale} className={manrope.variable}>
      <body className="font-sans">
        <JsonLd data={[organization(t, locale), website(t, locale)]} />
        <a
          href="#main"
          className="sr-only rounded-xl bg-aegean text-base font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:px-3 focus:py-2"
        >
          {t.a11y.skipToContent}
        </a>
        <IslandNav
          locale={locale}
          brand={site.brandName || t.nav.brandFallback}
          labels={{
            ...t.nav,
            mainNav: t.a11y.mainNav,
            languageNav: t.a11y.languageNav,
          }}
          whatsapp={{ href: whatsappHref(t.whatsapp.message), labels: t.whatsapp }}
        />
        {children}
        <Footer t={t} locale={locale} />
        <FloatingContact locale={locale} whatsapp={whatsappHref(t.whatsapp.message)} labels={t.floating} />
      </body>
    </html>
  );
}
