import type { CSSProperties } from "react";
import Image from "next/image";

type Props = {
  title: string;
  lead: string;
  /** Optional cover photo: the page opens on it, with the title set over it */
  image?: { src: string | null; alt: string };
};

/**
 * Opening of every inner page: the one h1 plus a lead.
 * With a photo: an inset frame (8px gutter, like the nav pill) about three quarters of the screen
 * tall, a flat aegean veil, and the words bottom left in the dark theme heading gradient.
 * The frame opens and the photo settles once on load (the page's signature moment).
 * Without a photo: large type on the page ground, clearing the floating nav pill.
 */
export function PageHeader({ title, lead, image }: Props) {
  if (image?.src) {
    return (
      <header className="p-2 sm:p-3">
        <div
          data-surface="night"
          className="photo-unveil relative flex h-[72svh] min-h-[420px] items-end overflow-hidden rounded-2xl [--frame-radius:16px] sm:rounded-3xl sm:[--frame-radius:24px]"
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            sizes="100vw"
            className="photo-settle object-cover"
          />
          <div aria-hidden className="absolute inset-0 bg-aegean/40" />
          <div className="relative w-full px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
            <div className="mx-auto max-w-7xl">
              <h1 className="hero-rise text-hero-gradient-dark w-fit max-w-measure pb-3 text-5xl font-medium tracking-tight sm:text-6xl lg:text-8xl">
                {title}
              </h1>
              <p style={{ "--i": 1 } as CSSProperties} className="hero-rise mt-6 max-w-measure text-lg text-white lg:text-xl">
                {lead}
              </p>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="px-4 pb-16 pt-24 sm:px-6 lg:px-8 lg:pb-20">
      <div className="mx-auto mt-16 max-w-7xl lg:mt-24">
        <h1 className="hero-rise text-hero-gradient w-fit max-w-measure pb-3 text-5xl font-medium tracking-tight sm:text-6xl lg:text-8xl">
          {title}
        </h1>
        <p style={{ "--i": 1 } as CSSProperties} className="hero-rise mt-8 max-w-measure text-lg text-aegean-soft lg:text-xl">
          {lead}
        </p>
      </div>
    </header>
  );
}
