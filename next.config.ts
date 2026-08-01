import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/courses/aifoundations-concept2application',
  experimental: {
    serverActions: {
      // The Orbit reverse proxy forwards Host=aifoundations.smartslate.io while
      // the browser Origin=orbit.smartslate.io, which aborts Next's Server Action
      // CSRF check. Whitelist the proxy origin (verified against Next 16.2.10
      // config-schema.d.ts + v16 serverActions docs).
      allowedOrigins: ['orbit.smartslate.io'],
    },
  },
};

export default nextConfig;
