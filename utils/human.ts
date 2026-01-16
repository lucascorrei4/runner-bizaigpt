// utils/human.ts
/**
 * Simple utilities to simulate human-like delays.
 */
export async function randomDelay(minMs: number = 500, maxMs: number = 1500): Promise<void> {
    const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
    return new Promise((resolve) => setTimeout(resolve, delay));
}
