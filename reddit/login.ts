// reddit/login.ts
import { getBrowser, saveStorageState } from './browser.js';

export async function login(): Promise<void> {
    const browser = await getBrowser();
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log('🔓 Opening Reddit login page – please sign in manually.');
    await page.goto('https://www.reddit.com/login', { waitUntil: 'networkidle' });

    // Wait until we land on any logged‑in Reddit page (URL changes)
    await page.waitForURL('https://www.reddit.com/**', { timeout: 0 });

    await saveStorageState(context);
    console.log('✅ Session stored successfully.');
}
