import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This app lives in a nested project directory; keep deployment tracing scoped here.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
