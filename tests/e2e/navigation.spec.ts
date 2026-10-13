import { expect, test } from "@playwright/test";
import { staticRoutes } from "./routes";

test.describe("routes", () => {
  for (const route of staticRoutes) {
    test(`${route} renders with a single h1 and a title`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page).toHaveTitle(/AURELIA/);
    });
  }

  test("unknown routes return the branded 404", async ({ page }) => {
    const response = await page.goto("/this-route-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("This path leads out to sea");
    await page.getByRole("link", { name: "Browse stays" }).click();
    await expect(page).toHaveURL("/stays");
  });

  test("every footer link resolves", async ({ page, request }) => {
    await page.goto("/");
    const hrefs = await page
      .getByRole("contentinfo")
      .getByRole("link")
      .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
    // External links (the photography credit) are not ours to health-check.
    const internal = hrefs.filter((href) => href?.startsWith("/"));
    expect(internal.length).toBeGreaterThan(0);
    for (const href of new Set(internal)) {
      const response = await request.get(href ?? "");
      expect(response.status(), href ?? "").toBe(200);
    }
  });
});

test.describe("desktop navigation", () => {
  test.skip(({ isMobile }) => isMobile, "desktop only");

  test("primary links navigate and mark the current page", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    for (const label of ["Stays", "Experiences", "Gallery", "About", "Contact"]) {
      await nav.getByRole("link", { name: label }).click();
      await expect(page).toHaveURL(`/${label.toLowerCase()}`);
      await expect(nav.getByRole("link", { name: label })).toHaveAttribute("aria-current", "page");
    }
  });

  test("header overlays the home hero until the page scrolls", async ({ page }) => {
    await page.goto("/");
    const header = page.locator("[data-site-header]");
    const bar = header.locator("> div");
    await expect(bar).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await page.mouse.wheel(0, 600);
    await expect(header).toHaveAttribute("data-scrolled", "");
    await expect(bar).toHaveCSS("background-color", "rgb(248, 246, 240)");
  });

  test("header is solid on pages without a hero", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator("[data-site-header] > div")).toHaveCSS(
      "background-color",
      "rgb(248, 246, 240)",
    );
  });
});

test.describe("mobile navigation", () => {
  test.skip(({ isMobile }) => !isMobile, "mobile only");

  test("menu opens as a modal, traps focus and restores it on Escape", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Open menu" });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await trigger.click();

    const dialog = page.getByRole("dialog", { name: "Site menu" });
    await expect(dialog).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(dialog.getByRole("button", { name: "Close menu" })).toBeFocused();

    // The page behind a modal dialog is inert. Tabbing past the last control may move
    // focus to the browser UI (activeElement is <body>), but never to page content.
    for (let i = 0; i < 12; i += 1) {
      await page.keyboard.press("Tab");
      const focusEscapedToPage = await page.evaluate(() => {
        const active = document.activeElement;
        return active !== null && active !== document.body && active.closest("dialog") === null;
      });
      expect(focusEscapedToPage).toBe(false);
    }

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("menu links navigate and close the menu", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Site menu" });
    await dialog.getByRole("link", { name: "Experiences" }).click();
    await expect(page).toHaveURL("/experiences");
    await expect(dialog).toBeHidden();

    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(dialog.getByRole("link", { name: "Experiences" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await dialog.getByRole("button", { name: "Close menu" }).click();
    await expect(dialog).toBeHidden();
  });

  test("page cannot scroll while the menu is open", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.locator("html")).toHaveCSS("overflow", "hidden");
  });
});

test("no route scrolls horizontally at common widths", async ({ page }) => {
  for (const width of [375, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [...staticRoutes, "/missing-page", "/stays/aurelia-residence"]) {
      await page.goto(route);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `${route} at ${width}px`).toBeLessThanOrEqual(0);
    }
  }
});

test("skip link moves focus to the main content", async ({ page }) => {
  await page.goto("/about");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
});
