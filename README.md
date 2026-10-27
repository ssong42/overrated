# Over / Under

A four-player social guessing game: the picker gets a topic card (with one optional skip), secretly rates it from **−5 (underrated)** to **+5 (overrated)**, and the closest guess wins a card. Casual mode never ends; competitive mode crowns the first player to 10 cards. Exact ties are settled by the randomly selected **Hype Reel**.

## Run locally

```bash
npm install
npm run dev
```

## Deploy to Vercel

Import this repository into Vercel; it detects Next.js automatically and uses `npm run build`.

> The included room store is process memory, which makes the project immediately playable locally and in a single server process. Vercel Serverless Functions do not guarantee a shared, durable process, so use a shared store (such as Vercel KV/Redis) before public production deployment. Replace the `Map` in `lib/game.ts` with that store; the API surface is already isolated there.
