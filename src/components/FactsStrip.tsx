import Link from "next/link";
import { WhatsAppButton, type WhatsAppLabels } from "./WhatsAppButton";

type Fact = { label: string; value: string };

type Props = {
  label: string;
  facts: Fact[];
  whatsapp: { href: string | null; labels: WhatsAppLabels };
  /** Secondary action: the booking form with this item preselected */
  book?: { href: string; label: string };
};

/** Detail page opener: key facts and the two ways to ask. White panel on the page ground. */
export function FactsStrip({ label, facts, whatsapp, book }: Props) {
  return (
    <section aria-label={label} className="px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-3xl bg-white p-6 lg:p-8">
        <dl className={`grid grid-cols-2 gap-6 ${facts.length > 4 ? "lg:grid-cols-5" : "lg:grid-cols-4"}`}>
          {facts.map((f) => (
            <div key={f.label}>
              <dt className="text-sm text-aegean-soft">{f.label}</dt>
              <dd className="mt-1 text-lg font-semibold text-aegean lg:text-xl">{f.value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-8 flex flex-wrap items-start gap-x-6 gap-y-4">
          <WhatsAppButton href={whatsapp.href} labels={whatsapp.labels} />
          {book && (
            <Link
              href={book.href}
              className="inline-flex items-center rounded-lg py-2 text-base font-semibold text-shoal-deep underline decoration-shoal-deep/30 underline-offset-4 transition-colors duration-160 ease-press hover:decoration-shoal-deep"
            >
              {book.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
