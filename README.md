# Reddit Runner

A lightweight **Playwright** based micro‑service that exposes a simple HTTP API to post to Reddit. It is written in **Node.js + TypeScript** and is ready to be containerised and deployed on **EasyPanel**.

## Features
- ✅ Health check endpoint (`GET /health`)
- ✅ Manual login endpoint (`POST /reddit/login`) – opens a headful browser so you can log in once and store the session in `/data/storageState.json`.
- ✅ Post endpoint (`POST /reddit/post`) – creates a text post using the stored session.
- 🛡️ API‑key protection via the `x-api-key` header.
- 📦 Docker image based on the official Playwright image (Chromium + dependencies).
- 📁 Persistent volume (`/data`) for session storage and logs.
- 🎨 TypeScript codebase with strict typing.

## Repository structure
```
reddit-runner/
├─ Dockerfile                # Build image for EasyPanel
├─ package.json
├─ tsconfig.json
├─ playwright.config.js
├─ server.ts                # Express server (TS)
├─ reddit/
│  ├─ browser.ts            # Singleton Playwright browser
│  ├─ login.ts              # Manual login flow
│  └─ post.ts               # Create Reddit post
├─ utils/
│  ├─ human.ts              # Human‑like random delays
│  └─ logger.ts             # Timestamped logger
└─ README.md                # This file
```

## Getting started (local)
```bash
# Clone the repo
git clone https://github.com/your‑org/reddit-runner.git
cd reddit-runner

# Install dependencies
npm install

# Build TypeScript
npm run build

# Run the service (will listen on port 3000)
npm start
```

### First‑time login
```bash
# Call the login endpoint (you can use curl or Postman)
curl -X POST http://localhost:3000/reddit/login -H "x-api-key: YOUR_API_KEY"
```
A Chromium window will open – log in to Reddit manually. After a successful login the session is saved to `./data/storageState.json`.

### Posting a text post
```bash
curl -X POST http://localhost:3000/reddit/post \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{"subreddit":"test","title":"Hello from Playwright","body":"This is an automated post.","mode":"post"}'
```
The response contains `ok`, `postUrl` and the `subreddit`.

## Deploying to EasyPanel
1. **Create a new app** → select *Docker* runtime.
2. **Repository URL** – point to this repo (GitHub).
3. **Port** – `3000`.
4. **Mount a volume** → map a host folder to `/data` (for the session file).
5. **Environment variables** – at minimum:
   - `RUNNER_API_KEY` – a secret string.
   - `HEADLESS=false` (or `true` for headless mode).
   - `SLOW_MO=80`
   - `DATA_DIR=/data`
6. Deploy – EasyPanel will build the Docker image using the provided `Dockerfile`.

## Customisation
- **Change the user‑agent** – set `USER_AGENT` env var and use it in the Playwright launch options.
- **Add more endpoints** – e.g., comment, upvote, etc., by re‑using the `browser.ts` singleton.
- **Add a database** – mount a Postgres container and store post logs.

## License
MIT – feel free to fork and adapt.
