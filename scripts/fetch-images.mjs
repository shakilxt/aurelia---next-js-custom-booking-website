/**
 * Downloads the photographs listed in images.manifest.json, applies one shared colour
 * grade so images from different photographers sit together, and writes optimised
 * JPEGs to src/assets/images. Existing files are skipped unless --force is passed.
 * An entry's `rotate` (degrees) levels a tilted horizon before grading.
 *
 *   npm run images            # fetch missing images
 *   npm run images -- --force # re-fetch and re-grade everything
 *
 * Behind an HTTP proxy, run with NODE_USE_ENV_PROXY=1 so fetch honours HTTPS_PROXY.
 */
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "src/assets/images");
const force = process.argv.includes("--force");

const manifest = JSON.parse(
  await readFile(path.join(root, "scripts/images.manifest.json"), "utf8"),
);

async function exists(file) {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
}

/** A gentle warm, slightly desaturated grade shared by every image. */
function grade(image) {
  return image
    .modulate({ saturation: 0.9 })
    .recomb([
      [1.03, 0, 0],
      [0, 1.0, 0],
      [0, 0, 0.95],
    ])
    .gamma(1.04);
}

/**
 * Rotates by `degrees` (clockwise; negative is counter-clockwise) to level a tilted
 * horizon, then crops the largest centred rectangle with the original aspect ratio so
 * no blank corners remain.
 */
async function level(source, degrees) {
  const { width: w, height: h } = await sharp(source).rotate().metadata();
  const rad = (Math.abs(degrees) * Math.PI) / 180;
  const scale = Math.min(
    h / (h * Math.cos(rad) + w * Math.sin(rad)),
    w / (w * Math.cos(rad) + h * Math.sin(rad)),
  );
  const rotated = await sharp(source)
    .rotate()
    .rotate(degrees)
    .toBuffer({ resolveWithObject: true });
  const cropW = Math.floor(w * scale);
  const cropH = Math.floor(h * scale);
  return sharp(rotated.data)
    .extract({
      left: Math.floor((rotated.info.width - cropW) / 2),
      top: Math.floor((rotated.info.height - cropH) / 2),
      width: cropW,
      height: cropH,
    })
    .toBuffer();
}

let fetched = 0;
for (const entry of manifest.images) {
  const target = path.join(outDir, `${entry.file}.jpg`);
  if (!force && (await exists(target))) continue;

  const width = entry.width ?? manifest.defaults.width;
  // Levelled images lose a little to the crop, so fetch them slightly larger.
  const fetchWidth = entry.rotate ? Math.ceil(width * 1.1) : width;
  const url = `https://images.unsplash.com/photo-${entry.unsplash}?w=${fetchWidth}&q=92&fm=jpg&fit=max`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${entry.file} (${response.status})`);

  let source = Buffer.from(await response.arrayBuffer());
  if (entry.rotate) source = await level(source, entry.rotate);
  const output = await grade(sharp(source).rotate())
    .resize({ width, withoutEnlargement: true })
    .jpeg({ quality: 72, mozjpeg: true, progressive: true })
    .toBuffer();

  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, output);
  fetched += 1;
  console.log(`✓ ${entry.file} (${Math.round(output.length / 1024)} kB)`);
}

console.log(`${fetched} image(s) written, ${manifest.images.length - fetched} unchanged.`);
