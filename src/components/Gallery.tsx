import type { Dictionary } from "@/content";
import { media } from "@/config/media";
import { resolveMedia } from "@/lib/media.server";
import { MediaSlot } from "./MediaSlot";
import { GalleryVideo } from "./GalleryVideo";
import { SectionHeading } from "./SectionHeading";

/** Flat placeholder tints so empty slots read as separate photos. */
const tints = ["bg-shoal", "bg-aegean/70", "bg-teak/60", "bg-shoal/70", "bg-aegean/50", "bg-shoal/50"];

/** One large lead photo and four smaller ones. Still, no hover effects. */
export function Gallery({ t }: { t: Dictionary }) {
  return (
    <section id="gallery" aria-labelledby="gallery-title" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading id="gallery-title" title={t.gallery.title} />
        <ul className="mt-12 grid grid-cols-2 gap-3 lg:mt-16 lg:grid-cols-4 lg:gap-4">
          {media.gallery.map((item, i) => (
            <li
              key={item.key}
              className={`relative overflow-hidden rounded-2xl ${
                i === 0 ? "col-span-2 aspect-[4/3] lg:row-span-2 lg:aspect-auto" : "aspect-square"
              }`}
            >
              {(() => {
                const sizes = i === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw";
                const poster = resolveMedia(item.file);
                const video = "video" in item && item.video ? resolveMedia(item.video) : null;
                return poster && video ? (
                  <GalleryVideo
                    poster={poster}
                    src={video}
                    alt={t.gallery.alts[item.key]}
                    sizes={sizes}
                    labels={{ play: t.gallery.playVideo, pause: t.gallery.pauseVideo }}
                  />
                ) : (
                  <MediaSlot
                    src={poster}
                    alt={t.gallery.alts[item.key]}
                    file={item.file}
                    placeholder={tints[i % tints.length]}
                    sizes={sizes}
                  />
                );
              })()}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
