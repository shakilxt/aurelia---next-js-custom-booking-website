import { expect, test, type Page } from "@playwright/test";

const stays = [
  ["lagoon-pool-villa", "Lagoon Pool Villa"],
  ["palm-grove-villa", "Palm Grove Pool Villa"],
  ["aurelia-residence", "The Aurelia Residence"],
  ["overwater-lagoon-suite", "Overwater Lagoon Suite"],
  ["reef-edge-suite", "Reef Edge Suite"],
  ["horizon-ocean-suite", "Horizon Ocean Suite"],
  ["garden-bungalow", "Garden Bungalow"],
  ["beach-bungalow", "Beach Bungalow"],
] as const;

const results = (page: Page) => page.getByRole("main").getByRole("article");
const status = (page: Page) => page.getByRole("status").filter({ hasText: /residences/ });

test.describe("stays listing", () => {
  test("filters by residence type and mirrors it in the URL", async ({ page }) => {
    await page.goto("/stays");
    await expect(status(page)).toHaveText("Showing 8 of 8 residences");
    await expect(results(page)).toHaveCount(8);

    await page.getByText("Suites", { exact: true }).click();
    await expect(page).toHaveURL("/stays?type=suite");
    await expect(status(page)).toHaveText("Showing 3 of 8 residences");
    await expect(results(page)).toHaveCount(3);
    await expect(page.getByRole("radio", { name: "Suites" })).toBeChecked();
  });

  test("combines guests and rate filters, shows an empty state and resets", async ({ page }) => {
    await page.goto("/stays");
    await page.getByLabel("Guests").selectOption("4");
    await expect(page).toHaveURL("/stays?guests=4");
    await expect(results(page)).toHaveCount(2);

    await page.getByLabel("Nightly rate").selectOption("1250");
    await expect(page).toHaveURL("/stays?guests=4&maxRate=1250");
    await expect(page.getByRole("heading", { name: "No residences match" })).toBeVisible();
    await expect(results(page)).toHaveCount(0);

    await page.getByRole("button", { name: "Reset filters" }).click();
    await expect(page).toHaveURL("/stays");
    await expect(results(page)).toHaveCount(8);
  });

  test("the empty state's reset link restores every residence", async ({ page }) => {
    await page.goto("/stays?type=bungalow&guests=5");
    await page.getByRole("link", { name: "Reset filters" }).click();
    await expect(page).toHaveURL("/stays");
    await expect(results(page)).toHaveCount(8);
  });

  test("sorts by nightly rate", async ({ page }) => {
    await page.goto("/stays");
    await page.getByLabel("Sort by").selectOption("price-asc");
    await expect(page).toHaveURL("/stays?sort=price-asc");
    await expect(results(page).first().getByRole("heading")).toHaveText("Garden Bungalow");
    await expect(results(page).last().getByRole("heading")).toHaveText("The Aurelia Residence");
  });

  test("filter state survives reload and returning from a residence", async ({ page }) => {
    await page.goto("/stays?type=villa&sort=price-desc");
    await page.reload();
    await expect(results(page).first().getByRole("heading")).toHaveText("The Aurelia Residence");

    await page.getByRole("link", { name: "Palm Grove Pool Villa" }).click();
    await expect(page).toHaveURL("/stays/palm-grove-villa");
    await page.goBack();
    await expect(page).toHaveURL("/stays?type=villa&sort=price-desc");
    await expect(page.getByRole("radio", { name: "Villas" })).toBeChecked();
    await expect(results(page)).toHaveCount(3);
  });

  test("ignores malformed query parameters", async ({ page }) => {
    const response = await page.goto("/stays?type=castle&guests=abc&maxRate=-1&sort=random");
    expect(response?.status()).toBe(200);
    await expect(results(page)).toHaveCount(8);
  });
});

test.describe("stay detail pages", () => {
  for (const [slug, name] of stays) {
    test(`/stays/${slug} renders`, async ({ page }) => {
      const response = await page.goto(`/stays/${slug}`);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(name);
      await expect(page).toHaveTitle(`${name} · AURELIA`);
      await expect(page.getByText("Availability is illustrative.", { exact: false })).toBeVisible();
      await expect(page.getByRole("heading", { name: "You may also like" })).toBeVisible();
    });
  }

  test("unknown slugs return the 404 page", async ({ page }) => {
    const response = await page.goto("/stays/not-a-residence");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("This path leads out to sea");
  });
});
