import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  serverExternalPackages: ["pdfkit", "fontkit"],
  experimental: {
    proxyClientMaxBodySize: "50mb",
  },
};

export default nextConfig;
