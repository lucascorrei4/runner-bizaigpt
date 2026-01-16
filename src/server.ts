import express, { Request, Response, NextFunction } from 'express';
import { login } from '../reddit/login.js';
import { createPost } from '../reddit/post.js';
import { logInfo, logError } from '../utils/logger.js';

const app = express();
app.use(express.json());

const API_KEY = process.env.RUNNER_API_KEY ?? '';

app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.headers['x-api-key'] !== API_KEY) {
        logError('Unauthorized request');
        return res.status(401).json({ error: 'unauthorized' });
    }
    next();
});

app.get('/health', (_req: Request, res: Response) => {
    res.json({ ok: true });
});

app.post('/reddit/login', async (_req: Request, res: Response) => {
    try {
        await login();
        res.json({ ok: true });
    } catch (e) {
        logError(`Login failed: ${(e as Error).message}`);
        res.status(500).json({ error: 'login_failed' });
    }
});

app.post('/reddit/post', async (req: Request, res: Response) => {
    const { subreddit, title, body } = req.body as {
        subreddit: string;
        title: string;
        body: string;
    };
    try {
        const result = await createPost({ subreddit, title, body });
        res.json(result);
    } catch (e) {
        logError(`Post failed: ${(e as Error).message}`);
        res.status(500).json({ error: 'post_failed' });
    }
});

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
    logInfo(`🚀 Reddit Runner listening on port ${PORT}`);
});
