import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { staticRoutes } from "./routes";

const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

async function expectNoViolations(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(tags).analyze();
  expect(
    results.violations.map(({ id, nodes }) => ({ id, targets: nodes.map((n) => n.target) })),
  ).toEqual([]);
}

const routes = [
  ...staticRoutes,
  "/missing-page",
  "/stays?type=bungalow&guests=5",
  "/stays/lagoon-pool-villa",
  "/stays/aurelia-residence",
  "/book?adults=4&stay=unknown-stay",
  "/book?stay=reef-edge-suite",
  "/stays?guests=2&checkIn=2030-01-10&checkOut=2030-01-14",
];

for (const route of routes) {
  test(`${route} has no detectable WCAG A/AA violations`, async ({ page }) => {
    await page.goto(route);
    await expectNoViolations(page);
  });
}

test("the open date picker has no detectable WCAG A/AA violations", async ({ page }) => {
  await page.goto("/stays/overwater-lagoon-suite");
  await page
    .locator("#booking")
    .getByRole("button", { name: /Check-in/ })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expectNoViolations(page);
});

test("the booking form with errors has no detectable WCAG A/AA violations", async ({ page }) => {
  await page.goto("/book?stay=reef-edge-suite");
  await page.getByRole("button", { name: "Submit demo booking" }).click();
  await expect(page.getByText("Some details need attention")).toBeVisible();
  await expectNoViolations(page);
});

test("the demo confirmation has no detectable WCAG A/AA violations", async ({ page }) => {
  const date = new Date();
  date.setDate(date.getDate() + 20);
  const iso = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const checkIn = iso(date);
  date.setDate(date.getDate() + 3);
  await page.goto(`/book?stay=reef-edge-suite&checkIn=${checkIn}&checkOut=${iso(date)}`);
  await page.getByLabel("Full name").fill("Kai Moana");
  await page.getByLabel("Email").fill("kai@example.com");
  await page.getByRole("button", { name: "Submit demo booking" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Thank you, Kai" })).toBeVisible();
  await expectNoViolations(page);
});
