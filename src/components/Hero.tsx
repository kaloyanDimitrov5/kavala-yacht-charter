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

  return (
    // Full screen: the video fills an inset frame (8px gutter, like the floating nav pill) and the
    // words sit over it, bottom left. A flat aegean veil keeps white text readable (no gradients).
    <section aria-labelledby="hero-title" className="relative h-svh p-2 sm:p-3">
      <div className="hero-unveil relative h-full overflow-hidden rounded-2xl [--frame-radius:16px] sm:rounded-3xl sm:[--frame-radius:24px]">
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
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-aegean/40" />

        <div
          data-surface="night"
          className="absolute inset-x-0 bottom-0 px-4 pb-20 sm:px-6 sm:pb-16 lg:px-8"
        >
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
            <h1
              id="hero-title"
              style={step(0)}
              className="hero-rise text-hero-gradient-dark w-fit max-w-measure pb-3 text-5xl font-medium tracking-tight sm:text-6xl lg:col-span-7 lg:max-w-none lg:text-7xl"
            >
              {t.hero.headline.map((line, i) => (
                <span key={line} className="lg:block">
                  {line}
                  {i < t.hero.headline.length - 1 ? " " : ""}
                </span>
              ))}
            </h1>

            <div className="max-w-measure lg:col-span-5 lg:pb-4">
              <p style={step(1)} className="hero-rise text-lg text-white lg:text-xl">
                {t.hero.lead}
              </p>

              {/* data-sticky-source: the floating contact button flies out from here (FloatingContact) */}
              <div style={step(2)} className="hero-rise mt-8" data-sticky-source>
                <WhatsAppButton href={whatsappHref(t.whatsapp.message)} labels={t.whatsapp} tone="light" />
              </div>

              <ul
                aria-label={t.hero.factsLabel}
                style={step(3)}
                className="hero-rise mt-8 hidden grid-cols-2 gap-x-6 gap-y-3 border-t border-white/20 pt-6 text-sm font-medium text-white sm:grid"
              >
                {factItems.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-2">
                    <Icon size={20} aria-hidden className="shrink-0 text-white/70" />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
