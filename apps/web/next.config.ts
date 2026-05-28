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
    remotePatterns: [new URL("https://peerlist.io/api/v1/projects/embed/PRJHMQ6R6ERP8ADAR2DRGOM6RQ9RP6?showUpvote=true&theme=dark")],
  },
};

export default nextConfig;
