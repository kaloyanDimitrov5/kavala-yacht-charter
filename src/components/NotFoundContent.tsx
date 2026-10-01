import Link from "next/link";
import { Compass } from "@phosphor-icons/react/dist/ssr";
import type { Locale } from "@/i18n";
import type { Dictionary } from "@/content";

/** Branded 404 body, shared by the localised and the root not found pages. */
export function NotFoundContent({ locale, t }: { locale: Locale; t: Dictionary }) {
  return (
    <main id="main" tabIndex={-1} className="flex min-h-screen items-center px-4 py-24 outline-none sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <Compass size={48} aria-hidden className="text-shoal" />
        <h1 className="text-hero-gradient mt-8 w-fit max-w-measure pb-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          {t.notFound.title}
        </h1>
        <p className="mt-6 max-w-measure text-lg text-aegean-soft">{t.notFound.body}</p>
        <Link
          href={`/${locale}`}
          className="mt-8 inline-flex items-center rounded-xl bg-aegean px-3 py-2 text-base font-semibold text-white transition-[background-color,transform] duration-160 ease-press hover:bg-aegean/90 active:scale-[0.98]"
        >
          {t.notFound.back}
        </Link>
      </div>
    </main>
  );
}
