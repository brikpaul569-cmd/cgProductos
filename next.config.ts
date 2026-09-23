import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Ignora errores de ESLint durante el build (ideal para pruebas)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignora errores de tipo durante el build en Vercel
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
