// reddit/post.ts
import { getBrowser, getStorageState } from './browser.js';
import { randomDelay } from '../utils/human.js';
import { logInfo } from '../utils/logger.js';

interface PostParams {
    subreddit: string;
    title: string;
    body: string;
}

export async function createPost({ subreddit, title, body }: PostParams) {
    const browser = await getBrowser();

    const context = await browser.newContext({
        storageState: getStorageState(),
    });
    const page = await context.newPage();

    await page.goto(`https://www.reddit.com/r/${subreddit}/submit`, {
        waitUntil: 'networkidle',
    });

    // Fill title and body
    await page.fill('textarea[name="title"]', title);
    const bodySelector = 'div[data-testid="post-content"] textarea';
    await page.fill(bodySelector, body);

    // Simulate human pause
    await randomDelay(800, 2000);

    // Click the post button
    await page.click('button:has-text("Post")');

    // Wait for navigation to the post page
    await page.waitForURL('**/comments/**', { timeout: 60000 });

    const postUrl = page.url();
    logInfo(`📝 Post created: ${postUrl}`);

    return {
        ok: true,
        postUrl,
        subreddit,
    };
}
