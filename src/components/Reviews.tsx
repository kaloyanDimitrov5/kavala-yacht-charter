import type { Dictionary } from "@/content";
import { site } from "@/config/site";
import { SectionHeading } from "./SectionHeading";

/** Renders nothing until real reviews are added to site.reviews. */
export function Reviews({ t, locale }: { t: Dictionary; locale: string }) {
  if (site.reviews.length === 0) return null;
  const date = new Intl.DateTimeFormat(locale === "bg" ? "bg-BG" : "en-GB", { month: "long", year: "numeric" });

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading id="reviews-title" title={t.reviews.title} />
        <ul className="mt-12 grid gap-8 lg:grid-cols-2">
          {site.reviews.map((r) => (
            <li key={`${r.name}-${r.date}`}>
              <figure className="rounded-2xl bg-white p-6">
                <blockquote className="text-lg text-aegean">{r.text}</blockquote>
                <figcaption className="mt-4 text-sm text-aegean-soft">
                  <span className="font-semibold text-aegean">{r.name}</span>, {r.from}, {date.format(new Date(r.date))}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
