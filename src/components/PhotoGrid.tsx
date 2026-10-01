import { resolveMedia } from "@/lib/media.server";
import { GalleryVideo } from "./GalleryVideo";
import { MediaSlot } from "./MediaSlot";
import { SectionHeading } from "./SectionHeading";

export type PhotoItem = { file: string; alt: string; video?: string };

type Props = {
  id: string;
  title: string;
  items: PhotoItem[];
  /** Video tile labels, needed only when an item has a video */
  videoLabels?: { play: string; pause: string };
};

/** Flat placeholder tints so empty slots read as separate photos. */
const tints = ["bg-shoal", "bg-aegean/70", "bg-teak/60", "bg-shoal/70", "bg-aegean/50"];

/**
 * Five slot photo grid: one large lead photo and four smaller ones. Still, no hover effects.
 * Missing files show flat placeholders (filename visible in development only).
 */
export function PhotoGrid({ id, title, items, videoLabels }: Props) {
  return (
    <section aria-labelledby={id} className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading id={id} title={title} />
        <ul className="mt-12 grid grid-cols-2 gap-3 lg:mt-16 lg:grid-cols-4 lg:gap-4">
          {items.map((item, i) => {
            const sizes = i === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw";
            const poster = resolveMedia(item.file);
            const video = item.video ? resolveMedia(item.video) : null;
            return (
              <li
                key={item.file}
                className={`relative overflow-hidden rounded-2xl ${
                  i === 0 ? "col-span-2 aspect-[4/3] lg:row-span-2 lg:aspect-auto" : "aspect-square"
                }`}
              >
                {poster && video && videoLabels ? (
                  <GalleryVideo poster={poster} src={video} alt={item.alt} sizes={sizes} labels={videoLabels} />
                ) : (
                  <MediaSlot src={poster} alt={item.alt} file={item.file} placeholder={tints[i % tints.length]} sizes={sizes} />
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
