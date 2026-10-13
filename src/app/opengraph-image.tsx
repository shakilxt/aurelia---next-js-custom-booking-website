import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { site } from "@/data/site";
import { defaultSocialImage } from "@/lib/metadata";

export const alt = defaultSocialImage.alt;
export const size = { width: defaultSocialImage.width, height: defaultSocialImage.height };
export const contentType = "image/jpeg";

const asset = (path: string) => readFile(join(process.cwd(), "src/assets", path));

/**
 * Default social card, rendered once at build time. Static TTF instances live in
 * src/assets/fonts (DM Sans is bundled; Gambetta is fetched by `npm run fonts`) because
 * Satori cannot use next/font or WOFF2 files, and layout uses explicit offsets because
 * Satori ignores the `inset` shorthand.
 * Satori only emits PNG, which is heavy for a photograph, so the result is re-encoded
 * as JPEG to stay well under the size limits some chat apps apply to link previews.
 */
export default async function OpengraphImage() {
  const [serif, serifItalic, sans, photo] = await Promise.all([
    asset("fonts/Gambetta-Regular.ttf"),
    asset("fonts/Gambetta-Italic.ttf"),
    asset("fonts/DMSans-Medium.ttf"),
    asset("images/resort/hero-infinity-pool.jpg"),
  ]);
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  const png = new ImageResponse(
    <div style={{ position: "relative", display: "flex", width: "100%", height: "100%" }}>
      <img
        src={photoSrc}
        alt=""
        width={1200}
        height={630}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          backgroundImage:
            "linear-gradient(to right, rgba(16,44,37,0.92) 0%, rgba(16,44,37,0.7) 45%, rgba(16,44,37,0.15) 100%)",
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          width: "100%",
          color: "#f8f6f0",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "Gambetta", fontSize: 44, letterSpacing: "0.3em" }}>
            {site.name}
          </div>
          <div
            style={{
              fontFamily: "DM Sans",
              fontSize: 16,
              letterSpacing: "0.24em",
              color: "#b49a68",
              textTransform: "uppercase",
              marginTop: 6,
            }}
          >
            {site.tagline}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 720 }}>
          <div style={{ display: "flex", flexWrap: "wrap", fontSize: 92, lineHeight: 1 }}>
            <span style={{ fontFamily: "Gambetta" }}>Stillness, shaped&nbsp;</span>
            <span style={{ fontFamily: "Gambetta", fontStyle: "italic" }}>by the sea</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 32,
              fontFamily: "DM Sans",
              fontSize: 20,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(248,246,240,0.85)",
            }}
          >
            <div style={{ width: 48, height: 1, backgroundColor: "#b49a68", marginRight: 18 }} />
            Concept resort · South Pacific · Demo site
          </div>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Gambetta", data: serif, style: "normal", weight: 400 },
        { name: "Gambetta", data: serifItalic, style: "italic", weight: 400 },
        { name: "DM Sans", data: sans, style: "normal", weight: 500 },
      ],
    },
  );

  const jpeg = await sharp(Buffer.from(await png.arrayBuffer()))
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
  return new Response(new Uint8Array(jpeg), { headers: { "Content-Type": contentType } });
}
