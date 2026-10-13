import { expect, test, type Page } from "@playwright/test";

/** Local calendar date `days` from today, matching how the app computes "today". */
function isoFromToday(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

const checkIn = isoFromToday(10);
const checkOut = isoFromToday(14);
const selection = `checkIn=${checkIn}&checkOut=${checkOut}&adults=2&children=0`;
const flowUrl = `/book?stay=lagoon-pool-villa&${selection}`;

const submit = (page: Page) => page.getByRole("button", { name: "Submit demo booking" });
const summary = (page: Page) => page.getByRole("complementary", { name: "Booking summary" });

async function fillValidDetails(page: Page) {
  await page.getByLabel("Full name").fill("Amara Okafor");
  await page.getByLabel("Email").fill("amara@example.com");
  await page.getByLabel(/Phone/).fill("+1 555 010 0199");
  await page.getByLabel(/Special requests/).fill("Celebrating an anniversary.");
}

test.describe("residence step", () => {
  test("lists residences and carries the selection into the flow", async ({ page }) => {
    await page.goto(`/book?${selection}`);
    await expect(page.getByRole("heading", { level: 1, name: "Plan your stay" })).toBeVisible();
    await expect(page.getByText(/Keeping your selection: .* · 2 adults/)).toBeVisible();
    const step = page
      .getByRole("list", { name: "Booking progress" })
      .locator('[aria-current="step"]');
    await expect(step).toContainText("Residence");

    await page.getByRole("link", { name: "Lagoon Pool Villa" }).click();
    await expect(page).toHaveURL(flowUrl);
    await expect(summary(page).getByRole("heading", { name: "Lagoon Pool Villa" })).toBeVisible();
  });

  test("flags residences too small for the party", async ({ page }) => {
    await page.goto("/book?adults=3&children=1");
    const card = page.getByRole("listitem").filter({ hasText: "Garden Bungalow" });
    await expect(card.getByText("Smaller than your party of 4")).toBeVisible();
    const roomy = page.getByRole("listitem").filter({ hasText: "Palm Grove Pool Villa" });
    await expect(roomy.getByText(/Smaller than/)).toHaveCount(0);
  });

  test("explains an unknown residence and offers the list", async ({ page }) => {
    await page.goto("/book?stay=not-a-real-villa");
    await expect(page.getByRole("status")).toContainText("We couldn’t find that residence");
    await expect(page.getByRole("link", { name: "Beach Bungalow" })).toBeVisible();
  });
});

test.describe("details step", () => {
  test("prices the selection with the shared rules", async ({ page }) => {
    await page.goto(flowUrl);
    // $1,250 × 4 nights = $5,000; 10% service = $500; transfer $180 × 2 = $360.
    await expect(summary(page).getByText("$1,250 × 4 nights")).toBeVisible();
    await expect(summary(page).getByText("$5,860")).toBeVisible();
    await expect(page.getByText("Estimated total for 4 nights")).toBeVisible();

    await page.getByRole("button", { name: "More children" }).click();
    await expect(summary(page).getByText("$180 × 3 guests")).toBeVisible();
    await expect(summary(page).getByText("$6,040")).toBeVisible();
    // Only non-personal selections are mirrored to the address bar.
    await expect(page).toHaveURL(
      `/book?stay=lagoon-pool-villa&${selection.replace("children=0", "children=1")}`,
    );
  });

  test("summarises every problem, focuses the summary and links to each field", async ({
    page,
  }) => {
    await page.goto("/book?stay=lagoon-pool-villa");
    await submit(page).click();

    const errorSummary = page.getByRole("region", { name: "Some details need attention" });
    await expect(errorSummary).toBeFocused();
    const links = errorSummary.getByRole("link");
    await expect(links).toHaveText([
      "Choose a check-in date.",
      "Choose a check-out date.",
      "Enter your full name.",
      "Enter your email address.",
    ]);

    await links.filter({ hasText: "Enter your email address." }).click();
    const email = page.getByLabel("Email");
    await expect(email).toBeFocused();
    await expect(email).toHaveAttribute("aria-invalid", "true");
    await expect(email).toHaveAccessibleDescription("Error: Enter your email address.");

    await links.filter({ hasText: "Choose a check-in date." }).click();
    await expect(page.getByRole("button", { name: /Check-in/ })).toBeFocused();
  });

  test("updates errors as fields are corrected and refocuses on resubmit", async ({ page }) => {
    await page.goto(flowUrl);
    await submit(page).click();
    await page.getByLabel("Full name").fill("Amara Okafor");
    await page.getByLabel("Email").fill("amara@");
    await expect(page.getByText("Enter your full name.")).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: "Enter a valid email address, like name@example.com." }),
    ).toBeVisible();

    await page.getByLabel(/Phone/).fill("call me");
    await submit(page).click();
    await expect(page.getByRole("region", { name: "Some details need attention" })).toBeFocused();
    await expect(
      page.getByRole("link", { name: "Enter a valid phone number, or leave this field blank." }),
    ).toBeVisible();
  });

  test("reports an oversized party from a link instead of silently changing it", async ({
    page,
  }) => {
    await page.goto(
      `/book?stay=overwater-lagoon-suite&checkIn=${checkIn}&checkOut=${checkOut}&adults=3`,
    );
    await expect(page.getByText("This residence sleeps up to 2 guests.")).toBeVisible();
    await expect(summary(page).getByText("Choose valid dates and guests")).toBeVisible();

    await page.getByRole("button", { name: "Fewer adults" }).click();
    await expect(page.getByText("This residence sleeps up to 2 guests.")).toHaveCount(0);
    await expect(summary(page).getByText("Estimated total")).toBeVisible();
  });

  test("rejects past dates carried in a link", async ({ page }) => {
    await page.goto(
      `/book?stay=lagoon-pool-villa&checkIn=${isoFromToday(-3)}&checkOut=${isoFromToday(-1)}`,
    );
    await expect(page.getByText("Check-in can’t be in the past.")).toBeVisible();
  });

  test("never asks for payment details", async ({ page }) => {
    await page.goto(flowUrl);
    await expect(page.locator('[autocomplete^="cc-"]')).toHaveCount(0);
    await expect(page.getByLabel(/card|cvc|cvv|expiry/i)).toHaveCount(0);
  });
});

test.describe("confirmation", () => {
  test("shows a clearly labelled simulation without storing personal data", async ({ page }) => {
    await page.goto(flowUrl);
    await fillValidDetails(page);
    await submit(page).click();

    const heading = page.getByRole("heading", { level: 1, name: "Thank you, Amara" });
    await expect(heading).toBeFocused();
    await expect(page.getByText("no reservation has been made")).toBeVisible();
    await expect(page.getByText(/^AUR-DEMO-[A-HJ-NP-Z2-9]{6}$/)).toBeVisible();
    await expect(page.getByText("It is not a booking number")).toBeVisible();

    const entered = page.locator("dl").filter({ hasText: "Residence" }).first();
    await expect(entered).toContainText("Lagoon Pool Villa");
    await expect(entered).toContainText("4 nights");
    await expect(entered).toContainText("2 adults");
    await expect(entered).toContainText("amara@example.com");
    await expect(summary(page).getByText("$5,860")).toBeVisible();

    // Personal details never reach the URL or browser storage.
    expect(page.url()).not.toMatch(/amara|okafor|anniversary/i);
    const stored = await page.evaluate(() => ({
      local: localStorage.length,
      session: sessionStorage.length,
      cookie: document.cookie,
    }));
    expect(stored).toEqual({ local: 0, session: 0, cookie: "" });

    // Refreshing clears the simulation and the form, but keeps the stay selection.
    await page.reload();
    await expect(page.getByRole("heading", { level: 1, name: "Plan your stay" })).toBeVisible();
    await expect(page.getByLabel("Full name")).toHaveValue("");
    await expect(summary(page).getByText("$5,860")).toBeVisible();
  });

  test("generates a fresh reference for each simulation", async ({ page }) => {
    const references: string[] = [];
    for (let run = 0; run < 2; run += 1) {
      await page.goto(flowUrl);
      await fillValidDetails(page);
      await submit(page).click();
      references.push(await page.getByText(/^AUR-DEMO-/).innerText());
    }
    expect(references[0]).not.toBe(references[1]);
  });

  test("offers a way to start again", async ({ page }) => {
    await page.goto(flowUrl);
    await fillValidDetails(page);
    await submit(page).click();
    await page.getByRole("link", { name: "Plan another stay" }).click();
    await expect(page).toHaveURL("/book");
    await expect(page.getByRole("heading", { name: "Choose a residence" })).toBeVisible();
  });
});
