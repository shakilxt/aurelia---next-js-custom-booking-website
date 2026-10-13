/**
 * Downloads the Gambetta heading font from Fontshare into src/assets/fonts.
 *
 * Gambetta is free for commercial use and may be self-hosted, but its licence (ITF Free
 * Font License, FFL-Gambetta.txt) forbids redistributing the font files, which includes
 * committing them to a public repository. The files are therefore gitignored and fetched
 * here, unmodified, before `dev` and `build`. Existing files are skipped unless --force
 * is passed.
 *
 *   npm run fonts            # fetch missing files
 *   npm run fonts -- --force # re-fetch everything
 *
 * Behind an HTTP proxy, run with NODE_USE_ENV_PROXY=1 so fetch honours HTTPS_PROXY.
 */
import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "src/assets/fonts");
const force = process.argv.includes("--force");

// The site uses WOFF2 (next/font/local); the social card needs TTF, because Satori
// cannot read WOFF2.
const files = [
  { style: "normal", format: "woff2", name: "Gambetta-Regular.woff2" },
  { style: "italic", format: "woff2", name: "Gambetta-Italic.woff2" },
  { style: "normal", format: "ttf", name: "Gambetta-Regular.ttf" },
  { style: "italic", format: "ttf", name: "Gambetta-Italic.ttf" },
];

async function exists(file) {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
}

const missing = [];
for (const file of files) {
  if (force || !(await exists(path.join(outDir, file.name)))) missing.push(file);
}
if (missing.length === 0) process.exit(0);

const cssResponse = await fetch("https://api.fontshare.com/v2/css?f[]=gambetta@400,401");
if (!cssResponse.ok) throw new Error(`Failed to fetch the Gambetta CSS (${cssResponse.status})`);
const css = await cssResponse.text();

/** Font file URLs by style and format, read from the @font-face rules. */
const urls = {};
for (const [, rule] of css.matchAll(/@font-face\s*{([^}]*)}/g)) {
  const style = /font-style:\s*(\w+)/.exec(rule)?.[1];
  if (!style) continue;
  for (const [, url, format] of rule.matchAll(/url\('([^']+\.(woff2|ttf))'\)/g)) {
    urls[`${style}.${format}`] = url.startsWith("//") ? `https:${url}` : url;
  }
}

await mkdir(outDir, { recursive: true });
for (const file of missing) {
  const url = urls[`${file.style}.${file.format}`];
  if (!url) throw new Error(`No ${file.style} ${file.format} file in the Gambetta CSS`);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${file.name} (${response.status})`);
  const data = Buffer.from(await response.arrayBuffer());
  await writeFile(path.join(outDir, file.name), data);
  console.log(`✓ ${file.name} (${Math.round(data.length / 1024)} kB)`);
}
