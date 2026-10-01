import { getDictionary } from "@/content";
import { site } from "@/config/site";
import { pageMetadata, toLocale } from "@/lib/pageMetadata";
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
      <PageHeader title={site.boat.name || t.pages.boat.heading} lead={t.pages.boat.lead} />
      <Boat t={t} showHeading={false} />
      <Gallery t={t} />
    </main>
  );
}
