/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Smallest modern formats first; browsers that support neither get the original
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    // "Routes" became "Cruises" (owner request); keep old links working
    return [{ source: "/:locale(en|bg)/routes", destination: "/:locale/cruises", permanent: true }];
  },
};

export default nextConfig;
