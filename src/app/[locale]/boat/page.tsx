import { getDictionary } from "@/content";
import { site } from "@/config/site";
import { pageMetadata, toLocale } from "@/lib/pageMetadata";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbs } from "@/lib/structuredData";
import { PageHeader } from "@/components/PageHeader";
import { Boat } from "@/components/Boat";
import { Gallery } from "@/components/Gallery";
import { BoatTour } from "@/components/BoatTour";
import { photoLibrary, type PhotoKey } from "@/config/photos";
import { resolveMedia } from "@/lib/media.server";

type Params = { params: { locale: string } };

export const generateMetadata = ({ params }: Params) =>
  pageMetadata(params.locale, "/boat", (t) => t.pages.boat);

export default function BoatPage({ params }: Params) {
  const t = getDictionary(toLocale(params.locale));
  const photo = (key: PhotoKey) => ({ src: resolveMedia(photoLibrary[key].file), alt: t.photos[key] });
  const g = t.boat.tour.groups;

  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <JsonLd data={breadcrumbs(t, toLocale(params.locale), [{ name: t.nav.links.boat, path: "/boat" }])} />
      <PageHeader
        title={site.boat.name || t.pages.boat.heading}
        lead={t.pages.boat.lead}
        image={photo("boat-moored")}
      />
      <Boat t={t} showHeading={false} />
      <BoatTour
        id="tour-title"
        title={t.boat.tour.title}
        lead={t.boat.tour.lead}
        groups={[
          {
            key: "saloon",
            ...g.saloon,
            lead: photo("boat-saloon"),
            photos: [photo("boat-saloon-wide"), photo("boat-saloon-table")],
            aspect: "aspect-[4/3]",
            cols: "grid-cols-2",
          },
          {
            key: "cabins",
            ...g.cabins,
            photos: ["boat-cabin-forward", "boat-cabin-double", "boat-cabin-bunks", "boat-cabin-bunks-2"].map((k) =>
              photo(k as PhotoKey),
            ),
            aspect: "aspect-[3/4]",
            cols: "grid-cols-2 sm:grid-cols-4",
          },
          {
            key: "galley",
            ...g.galley,
            lead: photo("boat-galley"),
            photos: [photo("boat-bathroom"), photo("boat-bathroom-2")],
            aspect: "aspect-[3/4]",
            cols: "grid-cols-2",
          },
          {
            key: "deck",
            ...g.deck,
            lead: photo("boat-marina"),
            photos: [photo("boat-stern"), photo("boat-deck")],
            aspect: "aspect-[4/5]",
            cols: "grid-cols-2",
          },
        ]}
      />
      <Gallery t={t} />
    </main>
  );
}
