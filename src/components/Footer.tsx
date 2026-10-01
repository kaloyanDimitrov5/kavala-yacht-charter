import Link from "next/link";
import {
  EnvelopeSimple,
  InstagramLogo,
  WhatsappLogo,
} from "@phosphor-icons/react/dist/ssr";
import type { Dictionary } from "@/content";
import type { Locale } from "@/i18n";
import { site } from "@/config/site";
import { pages } from "@/config/pages";
import { whatsappHref } from "@/lib/whatsapp";
import { FooterYacht } from "./FooterYacht";
import { WhatsAppButton } from "./WhatsAppButton";

const link =
  "inline-flex items-center gap-2 rounded-lg text-base text-mist transition-colors duration-160 ease-press hover:text-shoal-light";

/**
 * Footer on every page (owner request: bigger, dark blue, with a yacht).
 * aegean surface (recorded exception to the dark background list, see DESIGN.md §13).
 * Order: closing CTA, four columns, the yacht on its swells, copyright.
 */
export function Footer({ t, locale }: { t: Dictionary; locale: Locale }) {
  const brand = site.brandName || t.nav.brandFallback;
  const owner = site.legal.companyName || brand;
  const wa = whatsappHref(t.whatsapp.message);
  const { email, instagram } = site.contact;
  const heading = "mb-4 text-base font-semibold text-white";

  return (
    <footer data-surface="night" className="bg-aegean text-white">
      <div className="px-4 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Closing CTA: every page ends on the primary action */}
          <h2 className="max-w-measure text-4xl font-semibold tracking-tight text-white lg:text-6xl">
            {t.finalCta.title}
          </h2>
          <p className="mt-6 max-w-measure text-lg text-mist">
            {t.finalCta.body}
          </p>
          <WhatsAppButton
            className="mt-8"
            tone="light"
            href={wa}
            labels={t.whatsapp}
          />

          <div className="mt-20 grid gap-12 sm:grid-cols-2 lg:mt-24 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Link
                href={`/${locale}`}
                className="rounded-lg text-xl font-semibold text-white transition-colors duration-160 ease-press hover:text-shoal-light"
              >
                {brand}
              </Link>
              <p className="mt-3 max-w-xs text-base text-mist">
                {t.footer.tagline}
              </p>
            </div>

            <nav aria-label={t.footer.pagesTitle} className="lg:col-span-3">
              <h2 className={heading}>{t.footer.pagesTitle}</h2>
              <ul className="flex flex-col gap-3">
                {pages.map((page) => (
                  <li key={page.key}>
                    <Link href={`/${locale}${page.path}`} className={link}>
                      {t.nav.links[page.key]}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Hidden until there is a way to reach the owner (WhatsApp number, email or Instagram) */}
            {(wa || email || instagram) && (
              <div className="lg:col-span-3">
                <h2 className={heading}>{t.footer.contactTitle}</h2>
                <ul className="flex flex-col gap-3">
                  {wa && (
                    <li>
                      <a
                        href={wa}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={link}
                      >
                        <WhatsappLogo size={20} aria-hidden />
                        {t.footer.whatsapp}
                      </a>
                    </li>
                  )}
                  {email && (
                    <li>
                      <a href={`mailto:${email}`} className={link}>
                        <EnvelopeSimple size={20} aria-hidden />
                        {email}
                      </a>
                    </li>
                  )}
                  {instagram && (
                    <li>
                      <a
                        href={`https://instagram.com/${instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={link}
                      >
                        <InstagramLogo size={20} aria-hidden />@{instagram}
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            )}

            <nav aria-label={t.footer.legalNav} className="lg:col-span-2">
              <h2 className={heading}>{t.footer.legalTitle}</h2>
              <ul className="flex flex-col gap-3">
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
          </div>
        </div>
      </div>

      {/* Phones: fixed height, sliced around the yacht. From sm: natural height, nothing cropped. */}
      <FooterYacht className="mt-16 block h-yacht w-full sm:h-auto lg:mt-20" />

      <div className="px-4 pb-8 pt-6 sm:px-6 lg:px-8">
        <p className="mx-auto max-w-7xl text-sm text-mist">
          {t.footer.rights(new Date().getFullYear(), owner)}
        </p>
      </div>
    </footer>
  );
}
