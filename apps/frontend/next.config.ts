import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Transpile the workspace `@ambitiousyou/shared` package's TS source
  // directly. NOTE: this only handles transpilation — module resolution
  // still follows the package's `exports` map, which points at `dist/`.
  // So `next build`'s type-check needs `@ambitiousyou/shared` built first.
  // That's wired via this app's `prebuild` script (see package.json), and
  // Vercel triggers it by running `pnpm build` (see vercel.json) rather
  // than bare `next build`.
  transpilePackages: ["@ambitiousyou/shared"],
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
