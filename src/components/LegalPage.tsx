import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import type { Locale } from "@/i18n";
import type { Dictionary } from "@/content";

export function LegalPage({ locale, t, page }: { locale: Locale; t: Dictionary; page: "privacy" | "terms" }) {
  const content = t.legal[page];
  return (
    <main id="main" tabIndex={-1} className="px-4 pb-24 pt-24 outline-none sm:px-6 lg:px-8">
      <article className="mx-auto mt-12 max-w-7xl">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-shoal-deep underline decoration-shoal-deep/30 underline-offset-4 hover:decoration-shoal-deep"
        >
          <ArrowLeft size={16} aria-hidden />
          {t.legal.back}
        </Link>
        <h1 className="text-hero-gradient mt-8 w-fit max-w-measure pb-3 text-4xl font-medium tracking-tight sm:text-5xl">
          {content.title}
        </h1>
        <div className="mt-8 flex max-w-measure flex-col gap-4 text-lg text-aegean-soft">
          {content.body.map((para) => (
            <p key={para}>{para}</p>
          ))}
        </div>
      </article>
    </main>
  );
}
