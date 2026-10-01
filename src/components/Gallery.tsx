import type { Dictionary } from "@/content";
import { media } from "@/config/media";
import { PhotoGrid } from "./PhotoGrid";

/** "On board and at anchor" on the boat page. */
export function Gallery({ t }: { t: Dictionary }) {
  return (
    <PhotoGrid
      id="gallery-title"
      title={t.gallery.title}
      items={media.gallery.map((item) => ({
        file: item.file,
        alt: t.gallery.alts[item.key],
        video: "video" in item ? item.video : undefined,
      }))}
      videoLabels={{ play: t.gallery.playVideo, pause: t.gallery.pauseVideo }}
    />
  );
}
