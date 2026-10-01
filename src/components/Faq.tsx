import { Plus } from "@phosphor-icons/react/dist/ssr";
import type { Dictionary } from "@/content";
import { SectionHeading } from "./SectionHeading";

/**
 * Native details/summary: keyboard and screen reader support for free, opens instantly
 * (motion is reserved for other sections). FAQPage JSON-LD mirrors the visible text.
 */
/** showHeading: false on the /faq page, where the page header carries the h1 */
export function Faq({ t, showHeading = true }: { t: Dictionary; showHeading?: boolean }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <section id="faq" aria-labelledby={showHeading ? "faq-title" : undefined} className={`px-4 sm:px-6 lg:px-8 ${showHeading ? "py-24" : "pb-24"}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12">
        {showHeading && <SectionHeading id="faq-title" title={t.faq.title} className="lg:col-span-5" />}
        <ul className={`flex flex-col gap-2 ${showHeading ? "lg:col-span-7" : "lg:col-span-8"}`}>
          {t.faq.items.map((item) => (
            <li key={item.q}>
              <details className="group rounded-2xl bg-white">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-4 py-4 text-lg font-semibold text-aegean transition-colors duration-160 ease-press hover:bg-aegean/5 active:bg-aegean/10 [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <Plus
                    size={20}
                    aria-hidden
                    className="shrink-0 text-aegean-soft transition-transform duration-200 ease-press group-open:rotate-45"
                  />
                </summary>
                <p className="px-4 pb-4 text-base text-aegean-soft">{item.a}</p>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
