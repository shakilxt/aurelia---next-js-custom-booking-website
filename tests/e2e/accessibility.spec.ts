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
