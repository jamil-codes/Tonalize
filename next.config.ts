import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/Tonalize",
  assetPrefix: "/Tonalize/",
  images: {
        unoptimized: true,
  }
};

export default nextConfig;
