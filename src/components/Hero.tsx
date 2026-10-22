import type { CSSProperties } from "react";
import { Anchor, Bed, Sailboat, Shower } from "@phosphor-icons/react/dist/ssr";
import type { Dictionary } from "@/content";
import { media } from "@/config/media";
import { site } from "@/config/site";
import { resolveMedia } from "@/lib/media.server";
import { whatsappHref } from "@/lib/whatsapp";
import { HeroMedia } from "./HeroMedia";
import { WhatsAppButton } from "./WhatsAppButton";

type Props = { t: Dictionary };

/** Stagger index for the CSS entrance (.hero-rise reads --i). */
const step = (i: number) => ({ "--i": i }) as CSSProperties;

export function Hero({ t }: Props) {
  const { facts } = site;
  const factItems = [
    { icon: Bed, label: t.hero.facts.cabins(facts.cabins, facts.cabins * facts.berthsPerCabin) },
    { icon: Shower, label: t.hero.facts.bathrooms(facts.bathrooms) },
    { icon: Sailboat, label: t.hero.facts.skipper },
    { icon: Anchor, label: t.hero.facts.port },
  ];

  const frameStyle = {
    "--ar-m": media.hero.image.aspect.mobile,
    "--ar-d": media.hero.image.aspect.desktop,
  } as CSSProperties;

  return (
    <section aria-labelledby="hero-title" className="px-4 pt-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-12 lg:items-end lg:gap-12">
          <h1
            id="hero-title"
            style={step(0)}
            className="hero-rise text-hero-gradient w-fit max-w-measure pb-3 text-4xl font-semibold tracking-tight sm:text-5xl lg:col-span-7 lg:text-6xl xl:text-7xl"
          >
            {t.hero.headline.map((line, i) => (
              <span key={line} className="lg:block">
                {line}
                {i < t.hero.headline.length - 1 ? " " : ""}
              </span>
            ))}
          </h1>

          <div className="max-w-measure lg:col-span-5 lg:pb-2">
            <p style={step(1)} className="hero-rise text-lg text-aegean-soft lg:text-xl">
              {t.hero.lead}
            </p>

            {/* data-sticky-source: the floating contact button flies out from here (FloatingContact) */}
            <div style={step(2)} className="hero-rise mt-6" data-sticky-source>
              <WhatsAppButton href={whatsappHref(t.whatsapp.message)} labels={t.whatsapp} />
            </div>

            <ul
              aria-label={t.hero.factsLabel}
              style={step(3)}
              className="hero-rise mt-8 grid grid-cols-1 gap-x-6 gap-y-3 text-sm font-medium text-aegean min-[400px]:grid-cols-2"
            >
              {factItems.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2">
                  <Icon size={20} aria-hidden className="shrink-0 text-aegean-soft" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          style={frameStyle}
          className="hero-unveil relative mt-12 overflow-hidden rounded-2xl [--frame-radius:16px] [aspect-ratio:var(--ar-m)] md:[aspect-ratio:var(--ar-d)] lg:mt-16 lg:rounded-3xl lg:[--frame-radius:24px]"
        >
          <HeroMedia
            image={resolveMedia(media.hero.image.file)}
            video={{
              mp4: resolveMedia(media.hero.video.mp4),
              webm: resolveMedia(media.hero.video.webm),
            }}
            alt={t.hero.mediaAlt}
            caption={t.hero.mediaCaption}
            placeholderNote={t.hero.placeholderNote}
            labels={{ pause: t.hero.videoPause, play: t.hero.videoPlay }}
          />
        </div>
      </div>
    </section>
  );
}
