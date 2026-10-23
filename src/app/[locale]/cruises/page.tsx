import { getDictionary } from "@/content";
import { site } from "@/config/site";
import { cruises, courses, cruiseKinds, cruiseGalleries, courseGalleries, islandCruise } from "@/config/catalogue";
import { cover } from "@/lib/photos";
import { durationWithPrice } from "@/lib/price";
import { pageMetadata, toLocale } from "@/lib/pageMetadata";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbs, itemList } from "@/lib/structuredData";
import { PageHeader } from "@/components/PageHeader";
import { LinkRows } from "@/components/LinkRows";
import { SectionHeading } from "@/components/SectionHeading";
import { Routes } from "@/components/Routes";
import { Compass } from "@phosphor-icons/react/dist/ssr";

type Params = { params: { locale: string } };

export const generateMetadata = ({ params }: Params) =>
  pageMetadata(params.locale, "/cruises", (t) => t.catalogue.index);

export default function CruisesPage({ params }: Params) {
  const locale = toLocale(params.locale);
  const t = getDictionary(locale);
  const c = t.catalogue;
  const r = t.routes;

  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <JsonLd
        data={[
          breadcrumbs(t, locale, [{ name: t.nav.links.cruises, path: "/cruises" }]),
          itemList(locale, cruises.map((cr) => ({ name: c.cruises[cr.slug].title, path: `/cruises/${cr.slug}` }))),
        ]}
      />
      <PageHeader title={c.index.heading} lead={c.index.lead} />

      {/* We plan it: the proposal note sits right under the promise */}
      <div className="px-4 sm:px-6 lg:px-8">
        <aside className="mx-auto flex max-w-7xl items-start gap-3 rounded-2xl bg-white p-6">
          <Compass size={24} aria-hidden className="shrink-0 text-shoal-deep" />
          <p className="max-w-measure text-base text-aegean-soft">
            <span className="font-semibold text-aegean">{c.common.proposalTitle}.</span> {c.common.proposalBody}
          </p>
        </aside>
      </div>

      {cruiseKinds.map((kind) => (
        <section key={kind} aria-labelledby={`kind-${kind}`} className="px-4 pt-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading id={`kind-${kind}`} title={c.index.kinds[kind].title} lead={c.index.kinds[kind].lead} />
            <div className="mt-8 lg:mt-12">
              <LinkRows
                size="md"
                rows={cruises
                  .filter((cr) => cr.kind === kind)
                  .map((cr) => ({
                    href: `/${locale}/cruises/${cr.slug}`,
                    meta: durationWithPrice(locale, cr.slug, c.cruises[cr.slug].duration, c.common.fromPrice),
                    label: c.cruises[cr.slug].title,
                    detail: c.cruises[cr.slug].card,
                    ...cover(cruiseGalleries[cr.slug], t),
                  }))}
              />
            </div>
          </div>
        </section>
      ))}

      <section aria-labelledby="courses-teaser" className="px-4 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading id="courses-teaser" title={c.index.coursesTitle} lead={c.index.coursesLead} />
          <div className="mt-8 lg:mt-12">
            <LinkRows
              size="md"
              rows={courses.map((co) => ({
                href: `/${locale}/courses/${co.slug}`,
                label: c.courses[co.slug].title,
                detail: c.courses[co.slug].card,
                ...cover(courseGalleries[co.slug], t),
              }))}
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="waters-title" className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading id="waters-title" title={c.index.mapTitle} lead={c.index.mapLead} />
          <div className="mt-12 lg:mt-16">
            <Routes
              locale={locale}
              routes={site.routes}
              cruiseFor={islandCruise}
              labels={{
                mapLabel: r.mapLabel,
                mapNote: r.mapNote,
                kavala: r.kavala,
                names: r.names,
                notes: r.notes,
                ask: c.index.seeCruise,
                customTitle: r.customTitle,
                customBody: r.customBody,
                customCta: r.customCta,
              }}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
