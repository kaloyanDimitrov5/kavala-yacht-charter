import "server-only";
import fs from "node:fs";
import path from "node:path";

const mediaDir = path.join(process.cwd(), "public", "media");

/** Returns the public URL if the file exists in /public/media, otherwise null. */
export function resolveMedia(file: string): string | null {
  if (!file) return null;
  return fs.existsSync(path.join(mediaDir, file)) ? `/media/${file}` : null;
}
