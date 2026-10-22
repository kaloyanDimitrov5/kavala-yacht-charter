import Link from "next/link";
import type { ComponentType } from "react";
import type { IconProps } from "@phosphor-icons/react";
import { Check } from "@phosphor-icons/react/dist/ssr";

type Icon = ComponentType<IconProps>;
import { PhotoCollage, type CollagePhoto } from "./PhotoCollage";
import { WhatsAppButton, type WhatsAppLabels } from "./WhatsAppButton";

type Props = {
  id: string;
  icon: Icon;
  badge: string;
  title: string;
  body: string;
  points: string[];
  /** Optional short sequence (e.g. the yoga morning), shown as numbered steps */
  steps?: { label: string; items: string[] };
  main: CollagePhoto;
  inset: CollagePhoto;
  /** Photos on the left on desktop when true */
  flip?: boolean;
  videoLabels: { play: string; pause: string };
  whatsapp: { href: string | null; labels: WhatsAppLabels };
  book: { href: string; label: string };
  /** The first feature on the page: its main photo is the largest content on first screen */
  priority?: boolean;
};

/**
 * Experiences page: one experience as a white panel, photos on one side and text on the other,
 * alternating sides down the page. Stacks on phones with the photos first.
 */
export function ExperienceFeature(props: Props) {
  const { id, icon: Icon, badge, title, body, points, steps, main, inset, flip, videoLabels, whatsapp, book, priority } = props;
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="relative px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
      <div className="mx-auto grid max-w-7xl items-center gap-10 rounded-3xl bg-white p-6 sm:p-10 lg:grid-cols-12 lg:gap-16 lg:p-12">
        <div className={`lg:col-span-6 ${flip ? "lg:order-2" : ""}`}>
          <PhotoCollage main={main} inset={inset} side={flip ? "left" : "right"} shape="portrait" labels={videoLabels} priority={priority} />
        </div>

        <div className={`lg:col-span-6 ${flip ? "lg:order-1" : ""}`}>
          <p className="inline-flex w-fit items-center gap-2 rounded-full bg-limestone px-3 py-1 text-sm font-semibold text-shoal-deep">
            <Icon size={20} aria-hidden />
            {badge}
          </p>
          <h2 id={`${id}-title`} className="mt-4 text-4xl font-semibold tracking-tight text-aegean lg:text-5xl">
            {title}
          </h2>
          <p className="mt-6 max-w-measure text-lg text-aegean-soft">{body}</p>

          {steps && (
            <ol aria-label={steps.label} className="mt-8 grid gap-3 sm:grid-cols-3">
              {steps.items.map((step, i) => (
                <li key={step} className="rounded-2xl bg-limestone p-4">
                  <span className="text-sm font-semibold text-shoal-deep">{i + 1}</span>
                  <span className="mt-1 block text-base font-medium text-aegean">{step}</span>
                </li>
              ))}
            </ol>
          )}

          <ul className="mt-8 flex flex-col gap-3">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-base font-medium text-aegean">
                <Check size={20} weight="bold" aria-hidden className="mt-0.5 shrink-0 text-shoal-deep" />
                {point}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-start gap-x-6 gap-y-4">
            <WhatsAppButton href={whatsapp.href} labels={whatsapp.labels} />
            <Link
              href={book.href}
              className="inline-flex items-center rounded-lg py-2 text-base font-semibold text-shoal-deep underline decoration-shoal-deep/30 underline-offset-4 transition-colors duration-160 ease-press hover:decoration-shoal-deep"
            >
              {book.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
