import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { staticRoutes } from "./routes";

for (const route of [...staticRoutes, "/missing-page"]) {
  test(`${route} has no detectable WCAG A/AA violations`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      results.violations.map(({ id, nodes }) => ({ id, targets: nodes.map((n) => n.target) })),
    ).toEqual([]);
  });
}
