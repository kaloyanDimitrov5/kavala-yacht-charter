import Image from "next/image";

type Props = {
  src: string | null;
  alt: string;
  /** Tailwind background class for the flat placeholder */
  placeholder?: string;
  sizes: string;
  /** Filename, shown only in development so the owner knows what to drop in */
  file?: string;
  className?: string;
  priority?: boolean;
};

/**
 * Fills its positioned parent with the photo, or a flat placeholder with the same
 * alt text when the file is not in /public/media yet.
 */
export function MediaSlot({ src, alt, placeholder = "bg-shoal", sizes, file, className = "", priority }: Props) {
  if (!src) {
    return (
      <div role="img" aria-label={alt} className={`absolute inset-0 ${placeholder} ${className}`}>
        {process.env.NODE_ENV === "development" && file && (
          <span className="absolute left-3 top-3 rounded-lg bg-white px-2 py-1 text-xs font-medium text-aegean">
            {file}
          </span>
        )}
      </div>
    );
  }
  return (
    <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={`object-cover ${placeholder} ${className}`} />
  );
}
