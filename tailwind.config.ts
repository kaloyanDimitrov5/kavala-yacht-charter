import type { Config } from "tailwindcss";

/**
 * Spacing is locked to the DESIGN.md table (0, 2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96 px).
 * Anything else fails to compile as a class, which keeps later phases honest.
 */
const spacing = {
  0: "0px",
  px: "1px",
  0.5: "0.125rem",
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
};

const config: Config = {
  content: ["./src/components/**/*.{ts,tsx}", "./src/app/**/*.{ts,tsx}"],
  theme: {
    spacing,
    fontWeight: {
      normal: "400",
      medium: "500",
      semibold: "600",
    },
    extend: {
      colors: {
        aegean: {
          DEFAULT: "rgb(var(--aegean) / <alpha-value>)",
          soft: "rgb(var(--aegean-soft) / <alpha-value>)",
        },
        limestone: "rgb(var(--limestone) / <alpha-value>)",
        night: "rgb(var(--night) / <alpha-value>)",
        driftwood: "rgb(var(--driftwood) / <alpha-value>)",
        shoal: {
          DEFAULT: "rgb(var(--shoal) / <alpha-value>)",
          deep: "rgb(var(--shoal-deep) / <alpha-value>)",
          light: "rgb(var(--shoal-light) / <alpha-value>)",
        },
        mist: "rgb(var(--mist) / <alpha-value>)",
        teak: {
          DEFAULT: "rgb(var(--teak) / <alpha-value>)",
          deep: "rgb(var(--teak-deep) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        measure: "680px",
      },
      width: {
        5: "1.25rem",
        // Guest gallery cards (portrait 9:16)
        story: "15rem",
        "story-lg": "18rem",
        // Thumbnail in the home "Plan your trip" rows
        thumb: "12rem",
        // Background line drawings in the cruises showcase
        "decor-sm": "10rem",
        decor: "13rem",
        "decor-lg": "16rem",
      },
      height: {
        5: "1.25rem",
        // Footer yacht on phones (the SVG slices to this height and keeps the yacht centred)
        yacht: "10rem",
      },
      transitionTimingFunction: {
        // B7 fluid curve, also the iOS drawer curve
        fluid: "cubic-bezier(0.32, 0.72, 0, 1)",
        // Strong ease out for press feedback
        press: "cubic-bezier(0.23, 1, 0.32, 1)",
      },
      transitionDuration: {
        160: "160ms",
      },
    },
  },
  future: {
    // Gate hover styles behind (hover: hover) so touch taps do not stick
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
};
export default config;
