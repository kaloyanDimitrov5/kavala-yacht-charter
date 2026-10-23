/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Smallest modern formats first; browsers that support neither get the original
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    // "Routes" became "Cruises" (owner request); keep old links working
    return [{ source: "/:locale(en|bg)/routes", destination: "/:locale/cruises", permanent: true },
      // Day cruises were withdrawn: send old links to the cruise list
      {
        source: "/:locale(en|bg)/cruises/:slug(thasos-bays-day-cruise|kavala-day-cruise)",
        destination: "/:locale/cruises",
        permanent: true,
      }];
  },
};

export default nextConfig;
