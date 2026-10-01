import { LinkRows, type LinkRow } from "./LinkRows";
import { SectionHeading } from "./SectionHeading";

/** Home "Plan your trip": hands off to the inner pages. */
export function ExploreIndex({ title, rows }: { title: string; rows: LinkRow[] }) {
  return (
    <section aria-labelledby="explore-title" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading id="explore-title" title={title} />
        <div className="mt-12 lg:mt-16">
          <LinkRows rows={rows} />
        </div>
      </div>
    </section>
  );
}
