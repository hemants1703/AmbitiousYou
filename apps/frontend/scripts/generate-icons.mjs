/**
 * Generates PNG favicons and PWA icons from the brand SVG at build time.
 * Run via `pnpm generate:icons` (wired into prebuild).
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendRoot = path.join(__dirname, "..");
const svgSource = path.join(frontendRoot, "public/svg_logos/logo_150px.svg");
const pngDir = path.join(frontendRoot, "public/png_logos");
const appDir = path.join(frontendRoot, "src/app");

const sizes = [
  { name: "favicon_16px.png", size: 16 },
  { name: "favicon_32px.png", size: 32 },
  { name: "logo_150px.png", size: 150 },
  { name: "logo_250px.png", size: 250 },
  { name: "icon_192.png", size: 192 },
  { name: "icon_512.png", size: 512 },
];

await mkdir(pngDir, { recursive: true });

for (const { name, size } of sizes) {
  const buffer = await sharp(svgSource)
    .resize(size, size, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toBuffer();
  await writeFile(path.join(pngDir, name), buffer);
}

// favicon.ico for legacy browsers — 32px PNG wrapped as ICO-compatible asset
const favicon32 = await sharp(svgSource).resize(32, 32, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } }).png().toBuffer();
await writeFile(path.join(frontendRoot, "public/favicon.ico"), favicon32);
await writeFile(path.join(appDir, "favicon.ico"), favicon32);

console.log("Generated PNG icons and favicon.ico");
