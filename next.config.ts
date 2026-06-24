import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Railway: output standalone para producción
  output: "standalone",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
