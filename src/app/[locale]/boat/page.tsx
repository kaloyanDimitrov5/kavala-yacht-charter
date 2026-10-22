import { getDictionary } from "@/content";
import { site } from "@/config/site";
import { pageMetadata, toLocale } from "@/lib/pageMetadata";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbs } from "@/lib/structuredData";
import { PageHeader } from "@/components/PageHeader";
import { Boat } from "@/components/Boat";
import { Gallery } from "@/components/Gallery";

type Params = { params: { locale: string } };

export const generateMetadata = ({ params }: Params) =>
  pageMetadata(params.locale, "/boat", (t) => t.pages.boat);

export default function BoatPage({ params }: Params) {
  const t = getDictionary(toLocale(params.locale));

  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <JsonLd data={breadcrumbs(t, toLocale(params.locale), [{ name: t.nav.links.boat, path: "/boat" }])} />
      <PageHeader title={site.boat.name || t.pages.boat.heading} lead={t.pages.boat.lead} />
      <Boat t={t} showHeading={false} />
      <Gallery t={t} />
    </main>
  );
}
