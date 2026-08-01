import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/courses/aifoundations-concept2application',
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
