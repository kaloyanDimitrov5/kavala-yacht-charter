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
import { CruisePrices } from "@/components/CruisePrices";
import { PlacesMap } from "@/components/PlacesMap";
import { cruisePlaces, thasosPlaces } from "@/config/places";
import { cruisePrices, highestPrice, lowestPrice } from "@/config/pricing";
import { durationWithPrice, priceView } from "@/lib/price";

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
  const price = cruisePrices[slug];
  const prices = priceView(locale, slug);
  const pl = c.common.prices;
  const places = cruisePlaces[slug];
  const ask = whatsappHref(c.common.askMessage(cruise.title));

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
            price: price && { low: lowestPrice(price), high: highestPrice(price) },
          }),
        ]}
      />
      <PageHeader
        title={cruise.title}
        lead={cruise.lead}
        image={{ src: cover(cruiseGalleries[slug], t).image, alt: cover(cruiseGalleries[slug], t).alt }}
      />

      <FactsStrip
        label={c.common.factsLabel}
        facts={[
          ...(prices ? [{ label: c.common.priceFact, value: prices.from }] : []),
          { label: c.common.duration, value: cruise.duration },
          { label: c.common.departs, value: c.common.departsValue },
          { label: c.common.guests, value: c.common.guestsValue },
          { label: c.common.skipper, value: c.common.skipperValue },
        ]}
        whatsapp={{
          href: ask,
          labels: { ...t.whatsapp, cta: c.common.ask },
        }}
        book={{ href: `/${locale}/book?cruise=${slug}#request`, label: c.common.book }}
      />

      {prices && (
        <CruisePrices
          view={prices}
          labels={{
            title: pl.title,
            lead: pl.lead,
            from: pl.from,
            seasonsLabel: pl.seasonsLabel,
            seasons: pl.seasons,
            includedTitle: pl.includedTitle,
            included: [pl.included.skipper, pl.included.linen, ...(prices.insurance ? [pl.included.insurance] : [])],
            excludedTitle: pl.excludedTitle,
            excluded: pl.excluded,
            cleaning: pl.cleaning(prices.cleaning),
          }}
          whatsapp={{ href: ask, labels: t.whatsapp }}
        />
      )}

      <Timeline
        id="plan-title"
        title={kind === "day" ? c.common.stepsTitle : c.common.timelineTitle}
        steps={cruise.timeline}
        proposal={{ title: c.common.proposalTitle, body: cruise.proposal ?? c.common.proposalBody }}
      />

      {places && (
        <PlacesMap
          places={thasosPlaces.filter((p) => places.includes(p.key)).map((p) => ({ ...p, name: c.common.places.names[p.key] }))}
          labels={c.common.places}
        />
      )}

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
                  meta: durationWithPrice(locale, x.slug, c.cruises[x.slug].duration, c.common.fromPrice),
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
