import { expect, test, type Page } from "@playwright/test";

const search = (page: Page) => page.getByRole("search", { name: "Find a residence" });

/** Picks a range in the open calendar: `from` and `to` index enabled days. */
async function pickDates(page: Page, from: number, to: number) {
  await search(page)
    .getByRole("button", { name: /Check-in/ })
    .click();
  const dialog = page.getByRole("dialog", { name: "Select your dates" });
  const days = dialog.locator('[role="grid"] button:not([disabled])');
  await days.nth(from).click();
  await days.nth(to).click();
  await dialog.getByRole("button", { name: "Done" }).click();
  await expect(dialog).toBeHidden();
}

test.describe("homepage", () => {
  test("hero shortcuts open the stays listing filtered by type", async ({ page, isMobile }) => {
    test.skip(isMobile, "the shortcuts are desktop only");
    await page.goto("/");
    const shortcuts = page.getByRole("navigation", { name: "Stays by type" });
    await shortcuts.getByRole("link", { name: "Ocean suites" }).click();
    await expect(page).toHaveURL("/stays?type=suite");
    await expect(page.getByRole("radio", { name: "Suites" })).toBeChecked();
  });

  test("presents every section in order", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("main").getByRole("heading", { level: 2 })).toHaveText([
      "Find your residence",
      "A private island, kept deliberately quiet",
      "Residences for every kind of stillness",
      "Everything close, nothing crowded",
      "Days shaped by the water",
      "Lagoon, reef and rainforest",
      "Remembered slowly",
      "Slow down, by the lagoon",
    ]);
  });

  test("features the curated residences", async ({ page }) => {
    await page.goto("/");
    const featured = page.locator("section", {
      has: page.getByRole("heading", { name: "Residences for every kind of stillness" }),
    });
    await expect(featured.getByRole("heading", { level: 3 })).toHaveText([
      "Lagoon Pool Villa",
      "The Aurelia Residence",
      "Overwater Lagoon Suite",
      "Beach Bungalow",
    ]);
    await featured.getByRole("link", { name: "Beach Bungalow" }).click();
    await expect(page).toHaveURL("/stays/beach-bungalow");
  });

  test("labels every guest note as fictional", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Fictional notes written for this demonstration")).toBeVisible();
    const notes = page.locator("figure").filter({ has: page.locator("blockquote") });
    await expect(notes).toHaveCount(3);
    for (const note of await notes.all()) {
      await expect(note.getByText("Demo content")).toBeVisible();
    }
  });
});

test.describe("booking search", () => {
  test("filters stays by guests and residence type", async ({ page }) => {
    await page.goto("/");
    await search(page).getByLabel("Guests").selectOption("4");
    await search(page).getByLabel("Residence").selectOption("villa");
    await search(page).getByRole("button", { name: "Search stays" }).click();

    await expect(page).toHaveURL("/stays?type=villa&guests=4");
    await expect(page.getByText("Showing 2 of 8 residences")).toBeVisible();
  });

  test("carries dates through the listing to a residence's booking panel", async ({ page }) => {
    await page.goto("/");
    await pickDates(page, 5, 8);
    await search(page).getByLabel("Guests").selectOption("2");
    await search(page).getByRole("button", { name: "Search stays" }).click();

    await expect(page).toHaveURL(/\/stays\?guests=2&checkIn=\d{4}-\d{2}-\d{2}&checkOut=/);
    await expect(page.getByText(/· 3 nights$/)).toBeVisible();
    await expect(page.getByText("Availability isn’t checked in this demonstration.")).toBeVisible();

    // Changing a filter keeps the dates.
    await page.getByText("Suites", { exact: true }).click();
    await expect(page).toHaveURL(/type=suite&guests=2&checkIn=/);

    await page.getByRole("link", { name: "Reef Edge Suite" }).click();
    await expect(page).toHaveURL(/\/stays\/reef-edge-suite\?checkIn=.*&checkOut=.*&adults=2$/);
    const panel = page.locator("#booking");
    // $1,120 × 3 nights = $3,360; 10% = $336; transfer $180 × 2 = $360.
    await expect(panel.getByText("$1,120 × 3 nights")).toBeVisible();
    await expect(panel.getByText("$4,056")).toBeVisible();
  });

  test("dates can be cleared from the listing", async ({ page }) => {
    await page.goto("/");
    await pickDates(page, 2, 4);
    await search(page).getByRole("button", { name: "Search stays" }).click();
    await page.getByRole("link", { name: "Clear dates" }).click();
    await expect(page).toHaveURL("/stays?guests=2");
    await expect(page.getByRole("link", { name: "Clear dates" })).toHaveCount(0);
  });

  test("asks for a check-out date when only check-in is chosen", async ({ page }) => {
    await page.goto("/");
    await search(page)
      .getByRole("button", { name: /Check-in/ })
      .click();
    const dialog = page.getByRole("dialog", { name: "Select your dates" });
    await dialog.locator('[role="grid"] button:not([disabled])').nth(2).click();
    await dialog.getByRole("button", { name: "Done" }).click();

    await search(page).getByRole("button", { name: "Search stays" }).click();
    await expect(page).toHaveURL("/");
    await expect(page.getByText("Choose a check-out date, or clear the dates.")).toBeVisible();
    await expect(search(page).getByRole("button", { name: /Check-out/ })).toBeFocused();
  });

  test("ignores malformed or reversed dates in a listing URL", async ({ page }) => {
    await page.goto("/stays?checkIn=2030-01-10&checkOut=2030-01-02");
    await expect(page.getByRole("link", { name: "Clear dates" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Lagoon Pool Villa" })).toHaveAttribute(
      "href",
      "/stays/lagoon-pool-villa",
    );
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the search still submits guests and type to the listing", async ({ page }) => {
    await page.goto("/");
    await search(page).getByLabel("Guests").selectOption("3");
    await search(page).getByLabel("Residence").selectOption("suite");
    await search(page).getByRole("button", { name: "Search stays" }).click();
    await expect(page).toHaveURL("/stays?guests=3&type=suite");
    await expect(page.getByRole("link", { name: "Reef Edge Suite" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Garden Bungalow" })).toHaveCount(0);
  });
});
