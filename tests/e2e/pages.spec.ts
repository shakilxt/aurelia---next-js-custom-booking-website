import { expect, test } from "@playwright/test";

test.describe("experiences", () => {
  test("lists every experience with imagery and an enquiry link", async ({ page }) => {
    await page.goto("/experiences");
    await expect(
      page.getByText("Enquiries aren’t connected to any booking service."),
    ).toBeVisible();
    const items = page.locator("main ol").first().locator("> li");
    await expect(items).toHaveCount(6);
    for (const item of await items.all()) {
      await expect(item.getByRole("heading", { level: 2 })).toBeVisible();
      await expect(item.getByRole("img")).toHaveAttribute("alt", /.{20,}/);
    }
  });

  test("an enquiry link prefills the contact message", async ({ page }) => {
    await page.goto("/experiences");
    await page
      .getByRole("link", { name: /^Ask about this experience\s*– Sunset sailing$/ })
      .click();
    await expect(page).toHaveURL("/contact?experience=sunset-sail");
    await expect(page.getByLabel("Message")).toHaveValue(
      "I’d like to arrange sunset sailing during my stay.",
    );
  });

  test("unknown experiences leave the message empty", async ({ page }) => {
    await page.goto("/contact?experience=constructor");
    await expect(page.getByLabel("Message")).toHaveValue("");
  });
});

test.describe("gallery", () => {
  test("filters photographs by category", async ({ page }) => {
    await page.goto("/gallery");
    const tiles = page.getByRole("button", { name: /^View larger:/ });
    await expect(tiles).toHaveCount(20);
    await page.getByText("Dining & wellness", { exact: true }).click();
    await expect(page.getByRole("status")).toHaveText("4 photographs");
    await expect(tiles).toHaveCount(4);
  });

  test("the lightbox is keyboard operable and returns focus", async ({ page }) => {
    await page.goto("/gallery");
    const tile = page.getByRole("button", { name: /^View larger:/ }).nth(1);
    const alt = (await tile.getAttribute("aria-label"))!.replace("View larger: ", "");
    await tile.focus();
    await page.keyboard.press("Enter");

    const viewer = page.getByRole("dialog", { name: "Photo viewer" });
    await expect(viewer).toBeVisible();
    await expect(viewer.getByRole("img")).toHaveAttribute("alt", alt);
    await expect(viewer.getByText("2 / 20")).toBeVisible();

    await page.keyboard.press("ArrowRight");
    await expect(viewer.getByText("3 / 20")).toBeVisible();
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await expect(viewer.getByText("1 / 20")).toBeVisible();
    // Wraps around from the first photograph to the last.
    await viewer.getByRole("button", { name: "Previous photo" }).click();
    await expect(viewer.getByText("20 / 20")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(viewer).toBeHidden();
    await expect(tile).toBeFocused();
  });

  test("the lightbox pages through the current filter only", async ({ page }) => {
    await page.goto("/gallery");
    await page.getByText("Island life", { exact: true }).click();
    await page
      .getByRole("button", { name: /^View larger:/ })
      .first()
      .click();
    const viewer = page.getByRole("dialog", { name: "Photo viewer" });
    await expect(viewer.getByText("1 / 4")).toBeVisible();
    await viewer.getByRole("button", { name: "Close photo viewer" }).click();
    await expect(viewer).toBeHidden();
  });
});

test.describe("about", () => {
  test("covers story, philosophy, design and highlights as concept copy", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByText(/Concept copy\. AURELIA is fictional/)).toBeVisible();
    await expect(page.getByText(/No environmental certification/)).toBeVisible();
    for (const name of [
      "Designed around the quiet",
      "Our philosophy",
      "Made to belong to the island",
      "At a glance",
    ]) {
      await expect(page.getByRole("heading", { level: 2, name })).toBeVisible();
    }
  });
});

test.describe("contact", () => {
  test("lists fictional contact details", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator("main").getByText("reservations@aurelia.example")).toBeVisible();
    await expect(page.getByText("These are fictional demonstration details.")).toBeVisible();
  });

  test("validates, summarises errors and links to each field", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: "Send demo enquiry" }).click();
    const summary = page.getByRole("region", { name: "Some details need attention" });
    await expect(summary).toBeFocused();
    await expect(summary.getByRole("link")).toHaveText([
      "Enter your full name.",
      "Enter your email address.",
      "Write a message of at least 10 characters.",
    ]);
    await summary.getByRole("link", { name: "Write a message of at least 10 characters." }).click();
    await expect(page.getByLabel("Message")).toBeFocused();
    await expect(page.getByLabel("Message")).toHaveAttribute("aria-invalid", "true");
  });

  test("acknowledges a valid enquiry without sending or storing it", async ({ page }) => {
    const requests: string[] = [];
    page.on("request", (request) => {
      if (request.method() !== "GET") requests.push(`${request.method()} ${request.url()}`);
    });
    await page.goto("/contact");
    await page.getByLabel("Full name").fill("Kai Moana");
    await page.getByLabel("Email").fill("kai@example.com");
    await page.getByLabel("Message").fill("Could we arrange a sunrise breakfast on the jetty?");
    await page.getByRole("button", { name: "Send demo enquiry" }).click();

    await expect(page.getByRole("heading", { name: "Thank you, Kai" })).toBeFocused();
    await expect(page.getByText(/it was not sent, and nothing was stored/)).toBeVisible();
    await expect(
      page.getByText("Could we arrange a sunrise breakfast on the jetty?"),
    ).toBeVisible();
    await expect(page).toHaveURL("/contact");
    expect(requests).toEqual([]);
    expect(await page.evaluate(() => localStorage.length + sessionStorage.length)).toBe(0);

    await page.getByRole("button", { name: "Write another message" }).click();
    await expect(page.getByLabel("Full name")).toBeFocused();
    await expect(page.getByLabel("Full name")).toHaveValue("");
  });
});

test.describe("contact without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("cannot be submitted natively, so details never reach a URL", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByRole("button", { name: "Send demo enquiry" })).toBeDisabled();
  });
});
