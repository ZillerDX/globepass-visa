import type { NextConfig } from "next";

const isExport = process.env.STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  output: isExport ? "export" : undefined,
  basePath: isExport ? "/globepass-visa" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
