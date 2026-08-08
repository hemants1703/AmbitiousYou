/**
 * Generates PNG favicons and PWA / iOS home-screen icons from the brand SVG.
 * Run via `pnpm generate:icons` (wired into prebuild).
 *
 * The source mark is taller than it is wide. Stretching it edge-to-edge in a
 * square makes iOS round-rect masks look cramped — every app icon here is
 * composed onto an opaque white canvas with intentional safe-zone padding.
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
const publicDir = path.join(frontendRoot, "public");

const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

/**
 * @param {number} size
 * @param {{ padRatio?: number; background?: { r: number; g: number; b: number; alpha: number } }} [options]
 */
async function renderIcon(size, { padRatio = 0.16, background = WHITE } = {}) {
  const inset = Math.max(1, Math.round(size * padRatio));
  const inner = Math.max(1, size - inset * 2);

  const logo = await sharp(svgSource)
    .resize(inner, inner, { fit: "contain", background: TRANSPARENT })
    .png()
    .toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background,
    },
  })
    .composite([{ input: logo, gravity: "centre" }])
    .png()
    .toBuffer();
}

await mkdir(pngDir, { recursive: true });

/** Favicons stay a bit tighter so the mark remains readable at 16–32px. */
const faviconPad = 0.08;
/** Home-screen / PWA icons need breathing room under iOS continuous corners. */
const appIconPad = 0.22;
/** Maskable icons keep content inside the center ~80% safe zone. */
const maskablePad = 0.26;

const outputs = [
  { file: path.join(pngDir, "favicon_16px.png"), size: 16, padRatio: faviconPad },
  { file: path.join(pngDir, "favicon_32px.png"), size: 32, padRatio: faviconPad },
  { file: path.join(pngDir, "logo_150px.png"), size: 150, padRatio: appIconPad },
  { file: path.join(pngDir, "logo_250px.png"), size: 250, padRatio: appIconPad },
  { file: path.join(pngDir, "icon_192.png"), size: 192, padRatio: appIconPad },
  { file: path.join(pngDir, "icon_512.png"), size: 512, padRatio: appIconPad },
  { file: path.join(pngDir, "icon_192_maskable.png"), size: 192, padRatio: maskablePad },
  { file: path.join(pngDir, "icon_512_maskable.png"), size: 512, padRatio: maskablePad },
  // iOS looks for this at the site root when adding to Home Screen.
  { file: path.join(publicDir, "apple-touch-icon.png"), size: 180, padRatio: appIconPad },
  { file: path.join(pngDir, "apple-touch-icon.png"), size: 180, padRatio: appIconPad },
];

for (const { file, size, padRatio } of outputs) {
  const buffer = await renderIcon(size, { padRatio });
  await writeFile(file, buffer);
}

const favicon32 = await renderIcon(32, { padRatio: faviconPad });
await writeFile(path.join(publicDir, "favicon.ico"), favicon32);
await writeFile(path.join(appDir, "favicon.ico"), favicon32);

console.log(`Generated ${outputs.length} PNG icons + favicon.ico (padded for iOS home screen)`);
