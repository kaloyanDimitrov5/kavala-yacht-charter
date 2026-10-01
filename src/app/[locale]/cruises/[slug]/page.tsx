import { notFound } from "next/navigation";
import { getDictionary } from "@/content";
import { locales } from "@/i18n";
import { cruises, cruiseGallery, isCruise } from "@/config/catalogue";
import { resolveMedia } from "@/lib/media.server";
import { whatsappHref } from "@/lib/whatsapp";
import { pageMetadata, toLocale } from "@/lib/pageMetadata";
import { PageHeader } from "@/components/PageHeader";
import { FactsStrip } from "@/components/FactsStrip";
import { Timeline } from "@/components/Timeline";
import { PhotoGrid } from "@/components/PhotoGrid";
import { LinkRows } from "@/components/LinkRows";
import { SectionHeading } from "@/components/SectionHeading";

type Params = { params: { locale: string; slug: string } };

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => cruises.map((c) => ({ locale, slug: c.slug })));
}

export function generateMetadata({ params }: Params) {
  if (!isCruise(params.slug)) return {};
  const slug = params.slug;
  return pageMetadata(params.locale, `/cruises/${slug}`, (t) => ({
    title: t.catalogue.cruises[slug].title,
    description: t.catalogue.cruises[slug].lead,
  }));
}

export default function CruisePage({ params }: Params) {
  if (!isCruise(params.slug)) notFound();
  const slug = params.slug;
  const locale = toLocale(params.locale);
  const t = getDictionary(locale);
  const c = t.catalogue;
  const cruise = c.cruises[slug];
  const kind = cruises.find((x) => x.slug === slug)!.kind;

  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <PageHeader title={cruise.title} lead={cruise.lead} />

      <FactsStrip
        label={c.common.factsLabel}
        facts={[
          { label: c.common.duration, value: cruise.duration },
          { label: c.common.departs, value: c.common.departsValue },
          { label: c.common.guests, value: c.common.guestsValue },
          { label: c.common.skipper, value: c.common.skipperValue },
        ]}
        whatsapp={{
          href: whatsappHref(c.common.askMessage(cruise.title)),
          labels: { ...t.whatsapp, cta: c.common.ask },
        }}
        book={{ href: `/${locale}/book?cruise=${slug}#request`, label: c.common.book }}
      />

      <Timeline
        id="plan-title"
        title={kind === "day" ? c.common.stepsTitle : c.common.timelineTitle}
        steps={cruise.timeline}
        proposal={{ title: c.common.proposalTitle, body: c.common.proposalBody }}
      />

      <div className="bg-white">
        <PhotoGrid
          id="photos-title"
          title={c.common.galleryTitle}
          items={cruiseGallery(slug).map((file, i) => ({ file, alt: c.common.galleryAlt(cruise.title, i + 1) }))}
        />
      </div>

      <section aria-labelledby="other-cruises" className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading id="other-cruises" title={c.common.otherCruises} />
          <div className="mt-8 lg:mt-12">
            <LinkRows
              size="md"
              rows={cruises
                .filter((x) => x.slug !== slug)
                .map((x) => ({
                  href: `/${locale}/cruises/${x.slug}`,
                  meta: c.cruises[x.slug].duration,
                  label: c.cruises[x.slug].title,
                  detail: c.cruises[x.slug].card,
                  image: resolveMedia(cruiseGallery(x.slug)[0]),
                  alt: c.common.galleryAlt(c.cruises[x.slug].title, 1),
                }))}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
