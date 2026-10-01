import type { Metadata } from "next";
import { defaultLocale } from "@/i18n";
import { getDictionary } from "@/content";
import { NotFoundContent } from "@/components/NotFoundContent";
import { manrope } from "./fonts";

const t = getDictionary(defaultLocale);

export const metadata: Metadata = { title: t.notFound.metaTitle };

/** Fallback for paths the middleware does not localise. Renders its own document shell. */
export default function RootNotFound() {
  return (
    <html lang={defaultLocale} className={manrope.variable}>
      <body className="font-sans">
        <NotFoundContent locale={defaultLocale} t={t} />
      </body>
    </html>
  );
}
