import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Transpile the workspace `@ambitiousyou/shared` package's TS source
  // directly, so the frontend doesn't depend on `pnpm --filter
  // @ambitiousyou/shared build` having run. The backend still needs the
  // built dist/ for its Node runtime — that's wired via its own prebuild.
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
