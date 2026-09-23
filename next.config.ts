import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Ignora errores de tipo durante el build en Vercel
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
