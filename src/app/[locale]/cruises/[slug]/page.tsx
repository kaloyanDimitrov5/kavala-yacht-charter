import { notFound } from "next/navigation";
import { getDictionary } from "@/content";
import { locales } from "@/i18n";
import { cruises, cruiseGalleries, isCruise } from "@/config/catalogue";
import { cover, photoItems } from "@/lib/photos";
import { whatsappHref } from "@/lib/whatsapp";
import { pageMetadata, toLocale } from "@/lib/pageMetadata";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbs, touristTrip } from "@/lib/structuredData";
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
  const t = getDictionary(toLocale(params.locale));
  const { image, alt } = cover(cruiseGalleries[slug], t);
  return pageMetadata(
    params.locale,
    `/cruises/${slug}`,
    (d) => ({ title: d.catalogue.cruises[slug].title, description: d.catalogue.cruises[slug].lead }),
    { src: image, alt },
  );
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
      <JsonLd
        data={[
          breadcrumbs(t, locale, [
            { name: t.nav.links.cruises, path: "/cruises" },
            { name: cruise.title, path: `/cruises/${slug}` },
          ]),
          touristTrip({
            locale,
            path: `/cruises/${slug}`,
            name: cruise.title,
            description: cruise.lead,
            image: cover(cruiseGalleries[slug], t).image,
            steps: cruise.timeline,
          }),
        ]}
      />
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
          items={photoItems(cruiseGalleries[slug], t)}
          videoLabels={{ play: t.gallery.playVideo, pause: t.gallery.pauseVideo }}
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
                  ...cover(cruiseGalleries[x.slug], t),
                }))}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
