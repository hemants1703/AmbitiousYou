import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {
    root: path.join(__dirname, "../.."),
  },
  images: {
    qualities: [75, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dej4ks4wd/**",
      },
      {
        protocol: "https",
        hostname: "peerlist.io",
        pathname: "/api/v1/projects/embed/**",
      },
    ],
  },
};

export default nextConfig;
