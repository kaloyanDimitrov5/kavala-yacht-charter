import { defaultLocale, isLocale } from "@/i18n";
import { getDictionary } from "@/content";
import { site } from "@/config/site";
import { media } from "@/config/media";
import { resolveMedia } from "@/lib/media.server";
import { Hero } from "@/components/Hero";
import { TaglineReveal } from "@/components/TaglineReveal";
import { SectionHeading } from "@/components/SectionHeading";
import { Comparison } from "@/components/Comparison";
import { Routes } from "@/components/Routes";
import { GuestGallery } from "@/components/GuestGallery";
import { Boat } from "@/components/Boat";
import { Bachelor } from "@/components/Bachelor";
import { Pilates } from "@/components/Pilates";
import { whatsappHref } from "@/lib/whatsapp";
import { HowItWorks } from "@/components/HowItWorks";
import { Gallery } from "@/components/Gallery";
import { Reviews } from "@/components/Reviews";
import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";

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

      <section id="routes" aria-labelledby="routes-title" className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading id="routes-title" title={t.routes.title} lead={t.routes.lead} />
          <div className="mt-12 lg:mt-16">
            <Routes
              routes={site.routes}
              labels={{
                mapLabel: t.routes.mapLabel,
                mapNote: t.routes.mapNote,
                kavala: t.routes.kavala,
                names: t.routes.names,
                notes: t.routes.notes,
                ask: t.routes.ask,
                customTitle: t.routes.customTitle,
                customBody: t.routes.customBody,
                customCta: t.routes.customCta,
              }}
            />
          </div>
        </div>
      </section>

      <Boat t={t} />

      <Bachelor
        title={t.bachelor.title}
        body={t.bachelor.body}
        points={t.bachelor.points}
        banner={t.bachelor.banner}
        media={{
          image: resolveMedia(media.bachelor.file),
          video: resolveMedia(media.bachelor.video),
          alt: t.bachelor.alt,
          file: media.bachelor.file,
        }}
        labels={{ play: t.bachelor.playVideo, pause: t.bachelor.pauseVideo }}
        whatsapp={{ href: whatsappHref(t.bachelor.message), labels: { ...t.whatsapp, cta: t.bachelor.cta } }}
      />

      <Pilates
        title={t.pilates.title}
        body={t.pilates.body}
        stepsLabel={t.pilates.stepsLabel}
        steps={t.pilates.steps}
        points={t.pilates.points}
        media={{
          image: resolveMedia(media.pilates.file),
          video: resolveMedia(media.pilates.video),
          alt: t.pilates.alt,
          file: media.pilates.file,
        }}
        labels={{ play: t.bachelor.playVideo, pause: t.bachelor.pauseVideo }}
        whatsapp={{ href: whatsappHref(t.pilates.message), labels: { ...t.whatsapp, cta: t.pilates.cta } }}
      />
      <HowItWorks t={t} locale={locale} />
      <Gallery t={t} />
      <Reviews t={t} locale={locale} />
      <Faq t={t} />
      <FinalCta t={t} />
    </main>
  );
}
