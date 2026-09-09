/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "cdn.getmerlin.in",
      },
    ],
  },

  typescript: {
    ignoreBuildErrors: true,
  },
  // No favicon rewrite: the tab icon is base_sdk's generated /brand-icon
  // letter tile, drawn from delivery_sdk's registered site metadata.
};

export default nextConfig;
