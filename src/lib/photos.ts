import { photoLibrary, type PhotoKey } from "@/config/photos";
import type { Dictionary } from "@/content";
import type { PhotoItem } from "@/components/PhotoGrid";
import { resolveMedia } from "./media.server";

/** Gallery items for a list of library keys, with the alt text in the current language. */
export function photoItems(keys: PhotoKey[], t: Dictionary): PhotoItem[] {
  return keys.map((key) => {
    const photo: { file: string; video?: string } = photoLibrary[key];
    return { file: photo.file, video: photo.video, alt: t.photos[key] };
  });
}

/** Cover of a gallery (its first photo): for list thumbnails. */
export function cover(keys: PhotoKey[], t: Dictionary) {
  const key = keys[0];
  return { image: resolveMedia(photoLibrary[key].file), alt: t.photos[key] };
}
