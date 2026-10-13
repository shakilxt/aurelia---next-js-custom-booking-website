import { expect, test } from "@playwright/test";
import { staticRoutes } from "./routes";

const stays = [
  "lagoon-pool-villa",
  "palm-grove-villa",
  "aurelia-residence",
  "overwater-lagoon-suite",
  "reef-edge-suite",
  "horizon-ocean-suite",
  "garden-bungalow",
  "beach-bungalow",
];

test.describe("metadata", () => {
  for (const route of staticRoutes) {
    test(`${route} has complete page and social metadata`, async ({ page }) => {
      await page.goto(route);
      const meta = (selector: string) => page.locator(selector).first();
      await expect(meta('meta[name="description"]')).toHaveAttribute("content", /.{40,}/);
      // Next.js writes the root canonical as the bare origin.
      const canonical = route === "/" ? /^https?:\/\/[^/]+\/?$/ : new RegExp(`${route}$`);
      await expect(meta('link[rel="canonical"]')).toHaveAttribute("href", canonical);
      await expect(meta('meta[property="og:site_name"]')).toHaveAttribute("content", "AURELIA");
      await expect(meta('meta[property="og:type"]')).toHaveAttribute("content", "website");
      await expect(meta('meta[property="og:image"]')).toHaveAttribute("content", /opengraph-image/);
      await expect(meta('meta[property="og:image:alt"]')).toHaveAttribute("content", /AURELIA/);
      await expect(meta('meta[name="twitter:card"]')).toHaveAttribute(
        "content",
        "summary_large_image",
      );
    });
  }

  test("residence pages share their own photograph", async ({ page }) => {
    await page.goto("/stays/beach-bungalow");
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      /beach-bungalow-pergola/,
    );
    await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
      "content",
      "AURELIA",
    );
  });

  test("the 404 page has no canonical URL", async ({ page }) => {
    await page.goto("/missing-page");
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  });
});

test.describe("discovery files", () => {
  test("the social card is a compact 1200×630 JPEG", async ({ request }) => {
    const response = await request.get("/opengraph-image");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toBe("image/jpeg");
    const body = await response.body();
    expect(body.length).toBeLessThan(300_000);
    // JPEG SOF0/SOF2 marker holds the dimensions: height then width, big-endian.
    const sof = body.findIndex((byte, i) => byte === 0xff && [0xc0, 0xc2].includes(body[i + 1]!));
    expect(body.readUInt16BE(sof + 7)).toBe(1200);
    expect(body.readUInt16BE(sof + 5)).toBe(630);
  });

  test("the sitemap lists every page and residence", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    for (const route of staticRoutes) expect(xml).toContain(`${route === "/" ? "/" : route}</loc>`);
    for (const slug of stays) expect(xml).toContain(`/stays/${slug}</loc>`);
  });

  test("robots.txt allows crawling and points to the sitemap", async ({ request }) => {
    const text = await (await request.get("/robots.txt")).text();
    expect(text).toContain("Allow: /");
    expect(text).toMatch(/Sitemap: .*\/sitemap\.xml/);
  });

  test("icons and the web manifest are served", async ({ request }) => {
    for (const path of ["/favicon.ico", "/icon.svg", "/apple-icon.png"]) {
      expect((await request.get(path)).status(), path).toBe(200);
    }
    const manifest = await (await request.get("/manifest.webmanifest")).json();
    expect(manifest).toMatchObject({ short_name: "AURELIA", theme_color: "#183d32" });
  });
});

test("responses carry baseline security headers", async ({ request }) => {
  const headers = (await request.get("/")).headers();
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(headers["x-powered-by"]).toBeUndefined();
});

test.describe("runtime health", () => {
  const routes = [...staticRoutes, ...stays.map((slug) => `/stays/${slug}`)];

  for (const route of routes) {
    test(`${route} loads without console errors or failed requests`, async ({ page }) => {
      const problems: string[] = [];
      page.on("console", (message) => {
        if (message.type() === "error" || message.type() === "warning") {
          problems.push(`${message.type()}: ${message.text()}`);
        }
      });
      page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));
      page.on("response", (response) => {
        if (response.status() >= 400) problems.push(`${response.status()} ${response.url()}`);
      });
      await page.goto(route, { waitUntil: "networkidle" });
      expect(problems).toEqual([]);
    });
  }
});
