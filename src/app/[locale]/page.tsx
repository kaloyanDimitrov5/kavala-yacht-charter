import { defaultLocale, isLocale } from "@/i18n";
import { getDictionary } from "@/content";
import { media } from "@/config/media";
import { resolveMedia } from "@/lib/media.server";
import { Hero } from "@/components/Hero";
import { CruiseShowcase } from "@/components/CruiseShowcase";
import { Accents } from "@/components/Accents";
import { ExperiencesHome } from "@/components/ExperiencesHome";
import { whatsappHref } from "@/lib/whatsapp";
import { cruises, cruiseGalleries } from "@/config/catalogue";
import { priceFrom } from "@/lib/price";
import { photoLibrary, type PhotoKey } from "@/config/photos";
import { cover } from "@/lib/photos";
import { GuestGallery } from "@/components/GuestGallery";
import { Reviews } from "@/components/Reviews";
import { ExploreIndex } from "@/components/ExploreIndex";

export default function Home({ params }: { params: { locale: string } }) {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const t = getDictionary(locale);
  const sh = t.showcase;
  const cat = t.catalogue;
  /** Photos for the accent fans: back left, back right, then the front print */
  const photo = (key: PhotoKey, withVideo = false) => {
    const p: { file: string; video?: string } = photoLibrary[key];
    return {
      src: resolveMedia(p.file),
      alt: t.photos[key],
      file: p.file,
      ...(withVideo ? { video: p.video ? resolveMedia(p.video) : null } : {}),
    };
  };
  const photos = (keys: PhotoKey[]) =>
    keys.map((k) => ({ src: resolveMedia(photoLibrary[k].file), alt: t.photos[k] }));

  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <Hero t={t} />
      <CruiseShowcase
        titleA={sh.titleA}
        titleB={sh.titleB}
        lead={sh.lead}
        filterLabel={sh.filterLabel}
        filters={sh.filters}
        allHref={`/${locale}/cruises`}
        allLabel={sh.all}
        experienceLabel={sh.experienceLabel}
        experience={sh.experience}
        cruises={cruises.map((cr) => ({
          href: `/${locale}/cruises/${cr.slug}`,
          kind: cr.kind,
          title: cat.cruises[cr.slug].title,
          duration: cat.cruises[cr.slug].duration,
          line: cat.cruises[cr.slug].card,
          price: priceFrom(locale, cr.slug) && cat.common.fromPrice(priceFrom(locale, cr.slug)!),
          ...cover(cruiseGalleries[cr.slug], t),
        }))}
      />

      <Accents
        captain={{
          ...t.accents.captain,
          href: `/${locale}/courses`,
          photos: photos(["train-flag", "train-heel", "train-heeling"]),
        }}
        fishing={{
          ...t.accents.fishing,
          href: `/${locale}/cruises/tuna-fishing-trip`,
          photos: photos(["pic-tuna-deck", "pic-open-sea-deck", "pic-tuna-catch"]),
        }}
      />

      <ExperiencesHome
        title={t.experiencesHome.title}
        lead={t.experiencesHome.lead}
        videoLabels={{ play: t.bachelor.playVideo, pause: t.bachelor.pauseVideo }}
        cards={[
          {
            key: "bachelor",
            ...t.experiencesHome.bachelor,
            href: `/${locale}/experiences#bachelor`,
            main: photo("bachelor", true),
            inset: photo("pic-island-taverna"),
            whatsapp: {
              href: whatsappHref(t.bachelor.message),
              labels: { ...t.whatsapp, cta: t.experiencesHome.whatsapp },
            },
          },
          {
            key: "yoga",
            ...t.experiencesHome.yoga,
            href: `/${locale}/experiences#yoga`,
            main: photo("pic-pilates"),
            inset: photo("pic-yoga"),
            whatsapp: {
              href: whatsappHref(t.pilates.message),
              labels: { ...t.whatsapp, cta: t.experiencesHome.whatsapp },
            },
          },
        ]}
      />

      <GuestGallery
        title={t.guests.title}
        lead={t.guests.lead}
        labels={{
          region: t.guests.regionLabel,
          prev: t.guests.prev,
          next: t.guests.next,
          play: t.guests.playVideo,
          pause: t.guests.pauseVideo,
        }}
        items={media.guests.map((g) => ({
          id: g.key,
          alt: t.guests.items[g.key].alt,
          image: resolveMedia(g.file),
          video: "video" in g && g.video ? resolveMedia(g.video) : null,
          file: g.file,
        }))}
      />

      <ExploreIndex
        title={t.explore.title}
        rows={(["cruises", "courses", "boat", "experiences"] as const).map((key) => ({
          href: `/${locale}/${key}`,
          label: t.explore.items[key].label,
          detail: t.explore.items[key].detail,
          image: resolveMedia(media.explore[key]),
          alt: t.explore.alts[key],
        }))}
      />

      <Reviews t={t} locale={locale} />
    </main>
  );
}
