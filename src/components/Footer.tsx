import Link from "next/link";
import { EnvelopeSimple, InstagramLogo } from "@phosphor-icons/react/dist/ssr";
import type { Dictionary } from "@/content";
import type { Locale } from "@/i18n";
import { site } from "@/config/site";

const link =
  "rounded-lg text-sm font-medium text-aegean-soft underline decoration-aegean/20 underline-offset-4 transition-colors duration-160 ease-press hover:text-aegean hover:decoration-aegean";

export function Footer({ t, locale }: { t: Dictionary; locale: Locale }) {
  const name = site.legal.companyName || site.brandName || t.nav.brandFallback;
  const { email, instagram } = site.contact;

  return (
    <footer className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-base font-semibold text-aegean">{site.brandName || t.nav.brandFallback}</p>
          <p className="mt-2 text-sm text-aegean-soft">{t.footer.tagline}</p>
          {(email || instagram) && (
            <ul className="mt-4 flex flex-wrap gap-4">
              {email && (
                <li>
                  <a href={`mailto:${email}`} className={`${link} inline-flex items-center gap-2`}>
                    <EnvelopeSimple size={20} aria-hidden />
                    {email}
                  </a>
                </li>
              )}
              {instagram && (
                <li>
                  <a href={`https://instagram.com/${instagram}`} target="_blank" rel="noopener noreferrer" className={`${link} inline-flex items-center gap-2`}>
                    <InstagramLogo size={20} aria-hidden />@{instagram}
                  </a>
                </li>
              )}
            </ul>
          )}
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <nav aria-label={t.footer.legalNav}>
            <ul className="flex gap-6">
              <li>
                <Link href={`/${locale}/privacy`} className={link}>
                  {t.footer.privacy}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/terms`} className={link}>
                  {t.footer.terms}
                </Link>
              </li>
            </ul>
          </nav>
          <p className="text-sm text-aegean-soft">{t.footer.rights(new Date().getFullYear(), name)}</p>
        </div>
      </div>
    </footer>
  );
}
