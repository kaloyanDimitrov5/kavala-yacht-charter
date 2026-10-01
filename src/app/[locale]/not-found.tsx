import { headers } from "next/headers";
import { defaultLocale, isLocale } from "@/i18n";
import { getDictionary } from "@/content";
import { NotFoundContent } from "@/components/NotFoundContent";

/** Localised 404 inside the locale layout (nav stays). Locale comes from the middleware header. */
export default function LocaleNotFound() {
  const header = headers().get("x-locale");
  const locale = isLocale(header) ? header : defaultLocale;
  return <NotFoundContent locale={locale} t={getDictionary(locale)} />;
}
