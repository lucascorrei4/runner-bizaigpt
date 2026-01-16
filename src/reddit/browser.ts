// src/reddit/browser.ts
import { chromium, Browser, BrowserContext } from 'playwright';
import fs from 'fs';
import path from 'path';

const DATA_DIR = process.env.DATA_DIR || '/data';
const STORAGE_PATH = path.join(DATA_DIR, 'storageState.json');

let browser: Browser | undefined;

export async function getBrowser(): Promise<Browser> {
    if (!browser) {
        browser = await chromium.launch({
            headless: process.env.HEADLESS === 'true',
            slowMo: Number(process.env.SLOW_MO) || 0,
        });
    }
    return browser;
}

export function getStorageState(): string | undefined {
    return fs.existsSync(STORAGE_PATH) ? STORAGE_PATH : undefined;
}

export async function saveStorageState(context: BrowserContext): Promise<void> {
    await context.storageState({ path: STORAGE_PATH });
    console.log('✅ Storage state saved to', STORAGE_PATH);
}
