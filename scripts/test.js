import { browser } from "k6/browser";
import { check } from "k6";

export const options = {
  scenarios: {
    ui: {
      executor: "shared-iterations",
      options: {
        browser: {
          type: "chromium",
          headless: false,
        },
      },
    },
  },
  thresholds: {
    //checks: ['rate==1.0'],
  },
};

export default async function () {
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto("https://qa-11x-staging.brinqa.net/");
    await page.screenshot({ path: "/home/k6/output/screenshot1.png" });
    await page.locator('input[data-testid="input-username"]').type("sysadmin");
    await page.locator('input[data-testid="input-password"]').type("sysadmin");
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "/home/k6/output/screenshot2.png" });
    await Promise.all([
      page.waitForNavigation(),
      page.locator('button[data-testid="button-login"]').click(),
    ]);
    await page.waitForTimeout(5000);
    await page.screenshot({ path: "/home/k6/output/screenshot3.png" });
  } finally {
    await page.close();
  }
}
