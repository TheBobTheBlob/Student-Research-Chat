import { test as base, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

export const test = base.extend({
    context: async ({ context }, use) => {
        await use(context);

        for (const page of context.pages()) {
            const coverage = await page.evaluate(() => (window as any).__coverage__);
            if (coverage) {
                const coverageDir = path.join(__dirname, "../.nyc_output");
                if (!fs.existsSync(coverageDir)) {
                    fs.mkdirSync(coverageDir, { recursive: true });
                }

                const coveragePath = path.join(coverageDir, `coverage-${Date.now()}-${Math.random()}.json`);
                fs.writeFileSync(coveragePath, JSON.stringify(coverage));
            } else {
                console.log("No coverage found on page. Ensure the app is built with instrumentation.");
            }
        }
    },
});

export { expect };
