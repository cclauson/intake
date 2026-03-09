import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  redirects: async () => [
    {
      source: "/app",
      destination: "/",
      permanent: true,
    },
  ],
};

export default nextConfig;
