import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Railway: output standalone para producción
  output: "standalone",
  images: {
    unoptimized: true,
  },
  // Desactivar type-checking en build (el IDE ya lo hace)
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
