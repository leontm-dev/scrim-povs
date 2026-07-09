import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  compress: true,
  turbopack: {
    root: "./",
  },
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
    incomingRequests: true,
    serverFunctions: true,
    browserToTerminal: false,
  },
};

export default nextConfig;
