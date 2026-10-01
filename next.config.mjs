/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    // "Routes" became "Cruises" (owner request); keep old links working
    return [{ source: "/:locale(en|bg)/routes", destination: "/:locale/cruises", permanent: true }];
  },
};

export default nextConfig;
