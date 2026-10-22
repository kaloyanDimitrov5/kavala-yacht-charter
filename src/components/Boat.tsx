import Image from "next/image";
import { Bed, Shower, Sailboat, Waves } from "@phosphor-icons/react/dist/ssr";
import type { Dictionary } from "@/content";
import { site } from "@/config/site";
import { media } from "@/config/media";
import { resolveMedia } from "@/lib/media.server";
import { SectionHeading } from "./SectionHeading";

/** showHeading: false on the /boat page, where the page header carries the h1 and the section sits on the page ground */
export function Boat({ t, showHeading = true }: { t: Dictionary; showHeading?: boolean }) {
  const { facts, boat } = site;
  const b = t.boat;
  const plan = resolveMedia(media.deckPlan.file);
  // Without its own h2, the section's feature titles are the h2s under the page h1
  const Heading = showHeading ? "h3" : "h2";

  const features = [
    { icon: Bed, title: b.features.cabins.title(facts.cabins), body: b.features.cabins.body(facts.berthsPerCabin, facts.maxGuests) },
    { icon: Shower, title: b.features.bathrooms.title(facts.bathrooms), body: b.features.bathrooms.body },
    { icon: Waves, title: b.features.sup.title, body: b.features.sup.body },
    { icon: Sailboat, title: b.features.skipper.title, body: b.features.skipper.body },
  ];

  // Optional specs: only rows the owner has filled in
  const specs = [
    boat.model && { label: b.specs.model, value: boat.model },
    boat.lengthMeters && { label: b.specs.length, value: b.specs.meters(boat.lengthMeters) },
    boat.year && { label: b.specs.year, value: String(boat.year) },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <section id="boat" aria-labelledby={showHeading ? "boat-title" : undefined} className={`px-4 sm:px-6 lg:px-8 ${showHeading ? "bg-white py-24" : "pb-24"}`}>
      <div className="mx-auto max-w-7xl">
        {showHeading && <SectionHeading id="boat-title" title={boat.name || b.title} lead={b.lead} />}

        {plan && (
          <figure className={showHeading ? "mt-12 lg:mt-16" : ""}>
            {/* The owner's real deck plan, on white so the drawing's own white ground blends in */}
            <div className="rounded-3xl bg-white p-4 ring-1 ring-inset ring-aegean/10 sm:p-8">
              <Image
                src={plan}
                alt={b.diagramLabel}
                width={media.deckPlan.width}
                height={media.deckPlan.height}
                sizes="(min-width: 768px) 672px, 100vw"
                className="mx-auto h-auto w-full max-w-2xl"
              />
              <p className="mt-4 flex justify-between gap-4 text-sm text-aegean-soft sm:mt-6" aria-hidden>
                <span>← {b.stern}</span>
                <span>{b.bow} →</span>
              </p>
            </div>
            <figcaption className="mt-3 text-sm text-aegean-soft">{b.diagramNote}</figcaption>
          </figure>
        )}

        <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, body }) => (
            <li key={title}>
              <Icon size={24} aria-hidden className="text-aegean" />
              <Heading className="mt-4 text-xl font-semibold tracking-tight text-aegean">{title}</Heading>
              <p className="mt-2 text-base text-aegean-soft">{body}</p>
            </li>
          ))}
        </ul>

        {specs.length > 0 && (
          <dl className="mt-12 flex flex-wrap gap-x-12 gap-y-4">
            {specs.map((s) => (
              <div key={s.label}>
                <dt className="text-sm text-aegean-soft">{s.label}</dt>
                <dd className="text-lg font-semibold text-aegean">{s.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
