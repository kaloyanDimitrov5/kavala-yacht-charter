import { defaultLocale, isLocale } from "@/i18n";
import { getDictionary } from "@/content";
import { media } from "@/config/media";
import { resolveMedia } from "@/lib/media.server";
import { Hero } from "@/components/Hero";
import { TaglineReveal } from "@/components/TaglineReveal";
import { SectionHeading } from "@/components/SectionHeading";
import { Comparison } from "@/components/Comparison";
import { GuestGallery } from "@/components/GuestGallery";
import { Reviews } from "@/components/Reviews";
import { ExploreIndex } from "@/components/ExploreIndex";

export default function Home({ params }: { params: { locale: string } }) {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const t = getDictionary(locale);
  const c = t.compare;

  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <Hero t={t} />
      <TaglineReveal
        lines={t.tagline}
        chips={{
          beach: { kind: "icon" as const, label: t.taglineFrame.beach.label },
          cove: { kind: "image" as const, src: resolveMedia(media.tagline.cove), ...t.taglineFrame.cove },
          // Keep the diver inside the wide pill
          swim: { kind: "image" as const, src: resolveMedia(media.tagline.swim), position: "50% 58%", ...t.taglineFrame.swim },
          bay: { kind: "image" as const, src: resolveMedia(media.tagline.bay), ...t.taglineFrame.bay },
        }}
      />

      <section id="compare" aria-labelledby="compare-title" className="pt-24">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading id="compare-title" title={c.title} lead={c.lead} />
          </div>
        </div>
        <Comparison
          labels={{ beach: c.beachLabel, yacht: c.yachtLabel, beachChip: c.beachChip, progress: c.progressLabel }}
          beach={{ src: resolveMedia(media.compare.beach), alt: c.beachAlt, file: media.compare.beach }}
          moments={media.compare.moments.map((m) => ({
            id: m.key,
            chip: c.moments[m.key].chip,
            alt: c.moments[m.key].alt,
            src: resolveMedia(m.file),
            file: m.file,
            position: "position" in m ? m.position : undefined,
          }))}
          beachPoints={c.beachPoints}
          yachtPoints={c.yachtPoints}
        />
      </section>

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
          caption: t.guests.items[g.key].caption,
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
