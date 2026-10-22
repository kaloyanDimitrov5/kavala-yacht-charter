import Link from "next/link";
import { ArrowRight, Champagne, FlowerLotus } from "@phosphor-icons/react/dist/ssr";
import { PhotoCollage, type CollagePhoto } from "./PhotoCollage";
import { WhatsAppButton, type WhatsAppLabels } from "./WhatsAppButton";
import { ExperienceDecor } from "./ExperienceDecor";

export type ExperienceCard = {
  key: "bachelor" | "yoga";
  badge: string;
  title: string;
  line: string;
  /** Link text naming the destination (Google flags generic "Learn more") */
  more: string;
  href: string;
  main: CollagePhoto;
  inset: CollagePhoto;
  whatsapp: { href: string | null; labels: WhatsAppLabels };
};

type Props = {
  title: string;
  lead: string;
  cards: ExperienceCard[];
  videoLabels: { play: string; pause: string };
};

/**
 * Home: bachelor parties and yoga / pilates, after the accents.
 * Two columns, each a photo collage, a badge, a title, one line, then "Learn more" (to the
 * experiences page section, named in the link text) and WhatsApp. Only motion: the collages settle in once.
 */
export function ExperiencesHome({ title, lead, cards, videoLabels }: Props) {
  return (
    <section aria-labelledby="experiences-home" className="relative overflow-hidden px-4 pb-24 pt-12 sm:px-6 lg:px-8">
      <ExperienceDecor />
      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-measure">
          <h2 id="experiences-home" className="text-4xl font-semibold tracking-tight text-aegean lg:text-6xl">
            {title}
          </h2>
          <p className="mt-6 text-lg text-aegean-soft lg:text-xl">{lead}</p>
        </div>

        <div className="mt-12 grid gap-16 lg:mt-16 lg:grid-cols-2 lg:gap-12">
          {cards.map((card, i) => {
            const Icon = card.key === "bachelor" ? Champagne : FlowerLotus;
            return (
              <article key={card.key} aria-labelledby={`exp-${card.key}`} className="flex flex-col">
                <PhotoCollage
                  main={card.main}
                  inset={card.inset}
                  side={i === 0 ? "right" : "left"}
                  shape="landscape"
                  labels={videoLabels}
                />
                <p className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-semibold text-shoal-deep">
                  <Icon size={20} aria-hidden />
                  {card.badge}
                </p>
                <h3 id={`exp-${card.key}`} className="mt-4 text-3xl font-semibold tracking-tight text-aegean lg:text-4xl">
                  {card.title}
                </h3>
                <p className="mt-3 max-w-measure text-lg text-aegean-soft">{card.line}</p>
                <div className="mt-8 flex flex-wrap items-start gap-3">
                  <Link
                    href={card.href}
                    className="inline-flex items-center gap-2 rounded-xl bg-aegean px-3 py-2 text-base font-semibold text-white transition-[background-color,transform] duration-160 ease-press hover:bg-aegean/90 active:scale-[0.98]"
                  >
                    {card.more}
                    <ArrowRight size={20} aria-hidden />
                  </Link>
                  <WhatsAppButton tone="outline" href={card.whatsapp.href} labels={card.whatsapp.labels} />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
