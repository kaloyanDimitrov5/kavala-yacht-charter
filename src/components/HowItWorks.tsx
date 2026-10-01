import type { Dictionary } from "@/content";
import type { Locale } from "@/i18n";
import { site } from "@/config/site";
import { RequestPanel } from "./RequestPanel";
import { SectionHeading } from "./SectionHeading";

/** Three real steps, so numbering is meaningful here. The request panel sits beside step one. */
export function HowItWorks({ t, locale }: { t: Dictionary; locale: Locale }) {
  return (
    <section id="how" aria-labelledby="how-title" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading id="how-title" title={t.how.title} />
          <ol className="mt-12 flex flex-col gap-8">
            {t.how.steps.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span
                  aria-hidden
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-base font-semibold text-aegean ring-1 ring-inset ring-aegean/10"
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-aegean">{step.title}</h3>
                  <p className="mt-2 text-base text-aegean-soft">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="lg:col-span-7">
          <RequestPanel locale={locale} number={site.whatsappNumber} maxGuests={site.facts.maxGuests} />
        </div>
      </div>
    </section>
  );
}
