import type { Metadata } from "next";
import { defaultLocale, isLocale } from "@/i18n";
import { getDictionary } from "@/content";
import { LegalPage } from "@/components/LegalPage";

type Params = { params: { locale: string } };
const toLocale = (l: string) => (isLocale(l) ? l : defaultLocale);

export function generateMetadata({ params }: Params): Metadata {
  const locale = toLocale(params.locale);
  const t = getDictionary(locale).legal.privacy;
  return {
    title: t.title,
    description: t.metaDescription,
    alternates: { canonical: `/${locale}/privacy`, languages: { en: "/en/privacy", bg: "/bg/privacy", "x-default": "/en/privacy" } },
  };
}

export default function Page({ params }: Params) {
  const locale = toLocale(params.locale);
  return <LegalPage locale={locale} t={getDictionary(locale)} page="privacy" />;
}
