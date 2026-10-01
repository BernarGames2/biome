import { chromium } from "@playwright/test";
const out = process.argv[2] || "screenshots";
const widths = (process.argv[3] || "1440,390").split(",").map(Number);
const reduced = process.argv[4] === "reduced";
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
for (const w of widths) {
  const h = w < 800 ? 844 : w < 1100 ? 1024 : 900;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: reduced ? "reduce" : "no-preference", hasTouch: w < 800 });
  const page = await ctx.newPage();
  const errs = [];
  page.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  page.on("pageerror", (e) => errs.push(String(e)));
  await page.goto("http://localhost:4173/", { waitUntil: "networkidle" });
  await page.waitForTimeout(3200);
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  const ow = await page.evaluate(() => document.documentElement.scrollWidth);
  console.log(w, "height", total, "scrollWidth", ow, errs.length ? errs : "");
  let i = 0;
  for (let y = 0; y < total; y += Math.round(h * 0.85)) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(1300);
    await page.screenshot({ path: `${out}/${w}-${String(i++).padStart(2, "0")}.png` });
    if (i > 60) break;
  }
  await ctx.close();
}
await browser.close();
