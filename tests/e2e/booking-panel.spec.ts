import { expect, test, type Page } from "@playwright/test";

/** Local calendar date `days` from today, matching how the app computes "today". */
function isoFromToday(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

const panel = (page: Page) => page.locator("#booking");

test.describe("booking panel", () => {
  test("requires dates before continuing and moves focus to the first problem", async ({
    page,
  }) => {
    await page.goto("/stays/lagoon-pool-villa");
    await panel(page).getByRole("button", { name: "Continue to booking" }).click();
    await expect(panel(page).getByText("Choose a check-in date.")).toBeVisible();
    await expect(panel(page).getByText("Choose a check-out date.")).toBeVisible();
    await expect(panel(page).getByRole("button", { name: /Check-in/ })).toBeFocused();
    await expect(page).toHaveURL("/stays/lagoon-pool-villa");
  });

  test("prefills from the URL and prices the stay with the shared pricing rules", async ({
    page,
  }) => {
    const checkIn = isoFromToday(10);
    const checkOut = isoFromToday(14);
    await page.goto(`/stays/lagoon-pool-villa?checkIn=${checkIn}&checkOut=${checkOut}&adults=2`);

    // $1,250 × 4 nights = $5,000; 10% service = $500; transfer $180 × 2 = $360.
    const summary = panel(page).locator("dl");
    await expect(summary.getByText("$5,000")).toBeVisible();
    await expect(summary.getByText("$1,250 × 4 nights")).toBeVisible();
    await expect(summary.getByText("$500", { exact: true })).toBeVisible();
    await expect(summary.getByText("$180 × 2 guests")).toBeVisible();
    await expect(summary.getByText("$5,860")).toBeVisible();

    await panel(page).getByRole("button", { name: "Continue to booking" }).click();
    await expect(page).toHaveURL(
      `/book?stay=lagoon-pool-villa&checkIn=${checkIn}&checkOut=${checkOut}&adults=2&children=0`,
    );
    // /book re-derives the same estimate from the selection rather than from the URL.
    await expect(
      page.getByRole("complementary", { name: "Booking summary" }).getByText("$5,860"),
    ).toBeVisible();
  });

  test("selects a range in the calendar", async ({ page }) => {
    await page.goto("/stays/garden-bungalow");
    await panel(page)
      .getByRole("button", { name: /Check-in/ })
      .click();
    const dialog = page.getByRole("dialog", { name: "Select your dates" });
    await expect(dialog).toBeVisible();

    const days = dialog.locator('[role="grid"] button:not([disabled])');
    await days.nth(3).click();
    await expect(dialog.getByText(/Now select check-out, up to 30 nights later\./)).toBeVisible();
    await days.nth(6).click();
    await expect(dialog.getByText(/^3 nights · /)).toBeVisible();
    await dialog.getByRole("button", { name: "Done" }).click();
    await expect(dialog).toBeHidden();

    await expect(panel(page).getByRole("button", { name: /Check-in/ })).not.toContainText(
      "Add date",
    );
    await expect(panel(page).getByRole("button", { name: /Check-out/ })).not.toContainText(
      "Add date",
    );
    await expect(panel(page).getByText("$540 × 3 nights")).toBeVisible();
  });

  test("highlights the check-in and limits check-out to the longest stay", async ({ page }) => {
    await page.goto("/stays/garden-bungalow");
    await panel(page)
      .getByRole("button", { name: /Check-in/ })
      .click();
    const dialog = page.getByRole("dialog", { name: "Select your dates" });
    const day = (offset: number) => dialog.locator(`td[data-day="${isoFromToday(offset)}"] button`);
    // The phone layout shows one month at a time, so page forward until a day is shown.
    const show = async (offset: number) => {
      while (!(await day(offset).isVisible())) {
        await dialog.getByRole("button", { name: /next month/i }).click();
      }
    };

    // The calendar loads on demand; wait for it before paging.
    await expect(dialog.getByRole("grid").first()).toBeVisible();
    await show(2);
    await day(2).click();
    await page.mouse.move(0, 0);
    await expect(day(2)).toHaveCSS("background-color", "rgb(24, 61, 50)");

    await show(32);
    await expect(day(32)).toBeEnabled();
    await show(33);
    await expect(day(33)).toBeDisabled();
  });

  test("closes the calendar with Escape and returns focus", async ({ page }) => {
    await page.goto("/stays/garden-bungalow");
    const trigger = panel(page).getByRole("button", { name: /Check-out/ });
    await trigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("limits guests to the residence's capacity", async ({ page }) => {
    await page.goto("/stays/lagoon-pool-villa"); // sleeps 3
    const moreChildren = panel(page).getByRole("button", { name: "More children" });
    await moreChildren.click();
    await expect(moreChildren).toHaveAttribute("aria-disabled", "true");
    // Playwright treats aria-disabled as non-actionable; force the click to prove it is a no-op.
    await moreChildren.click({ force: true });
    await expect(panel(page).getByRole("group", { name: "Children" }).locator("output")).toHaveText(
      "1",
    );
    await expect(panel(page).getByRole("button", { name: "More adults" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await expect(moreChildren).toBeFocused();
  });

  test("flags past dates arriving from a shared link", async ({ page }) => {
    await page.goto(
      `/stays/beach-bungalow?checkIn=${isoFromToday(-3)}&checkOut=${isoFromToday(-1)}&adults=1`,
    );
    await expect(panel(page).getByText("Check-in can’t be in the past.")).toBeVisible();
  });
});
