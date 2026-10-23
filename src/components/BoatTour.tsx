import Image from "next/image";
import { SectionHeading } from "./SectionHeading";

export type TourPhoto = { src: string | null; alt: string };
export type TourGroup = {
  key: string;
  title: string;
  line: string;
  /** Optional wide photo across the top of the group */
  lead?: TourPhoto;
  /** The rest, in equal columns */
  photos: TourPhoto[];
  /** Tile shape for the columns, e.g. "aspect-[3/4]" for the portrait cabin photos */
  aspect: string;
  /** Column count from small screens up */
  cols: string;
};

/**
 * The boat page: the owner's photos of the yacht, grouped by space (saloon, cabins, galley and
 * bathrooms, deck). Editorial rows: the name and one line on the left, the photos on the right.
 * Still photos, no motion: the page's one moment is the photo header.
 */
export function BoatTour({ id, title, lead, groups }: { id: string; title: string; lead: string; groups: TourGroup[] }) {
  const tile = (p: TourPhoto, cls: string, sizes: string) => (
    <figure className={`relative overflow-hidden rounded-2xl bg-shoal/20 ${cls}`}>
      {p.src && <Image src={p.src} alt={p.alt} fill sizes={sizes} className="object-cover" />}
    </figure>
  );

  return (
    <section aria-labelledby={id} className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading id={id} title={title} lead={lead} />

        <div className="mt-16 flex flex-col divide-y divide-aegean/10 border-t border-aegean/10">
          {groups.map((g) => (
            <article
              key={g.key}
              aria-labelledby={`${id}-${g.key}`}
              className="grid gap-8 py-12 lg:grid-cols-12 lg:gap-12 lg:py-16"
            >
              <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-24">
                  <h3 id={`${id}-${g.key}`} className="text-3xl font-medium tracking-tight text-aegean lg:text-4xl">
                    {g.title}
                  </h3>
                  <p className="mt-4 max-w-measure text-lg text-aegean-soft">{g.line}</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 lg:col-span-8 lg:gap-4">
                {g.lead && tile(g.lead, "aspect-[16/9]", "(min-width: 1024px) 800px, 100vw")}
                <div className={`grid gap-3 lg:gap-4 ${g.cols}`}>
                  {g.photos.map((p) => (
                    <div key={p.alt}>{tile(p, g.aspect, "(min-width: 1024px) 400px, 50vw")}</div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
