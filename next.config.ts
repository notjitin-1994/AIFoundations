import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sets the prefix for static assets (CSS, JS) so they resolve correctly behind the proxy
  assetPrefix: process.env.NODE_ENV === 'production' ? '/courses/aifoundations-concept2application' : undefined,
};

export default nextConfig;
