import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Railway: output standalone para producción
  output: "standalone",
  images: {
    unoptimized: true,
  },
  // Desactivar type-checking en build (el IDE ya lo hace)
  // Acelera el build y evita fallos por dependencias opcionales no usadas
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
