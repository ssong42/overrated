# Over / Under

A four-player social guessing game: the picker gets a topic card (with one optional skip), secretly rates it from **−5 (underrated)** to **+5 (overrated)**, and the closest guess wins a card. Casual mode never ends; competitive mode crowns the first player to 10 cards. Exact ties use a sudden-death round where only tied players guess a fresh topic.

## Run locally

```bash
npm install
npm run dev
```

## Persistent rooms on Azure

The Azure-hosted app stores room snapshots in `dbo.OverratedRooms` in the existing `pont-game` Azure SQL database. Set `SQL_SERVER` and `SQL_DATABASE` in the App Service environment and grant its managed identity `SELECT`, `INSERT`, and `UPDATE` on that table. Run `deploy/schema.sql` as a database administrator to create the table. SQL updates use transactions to avoid losing simultaneous player actions.

For local development without SQL configuration, rooms are kept in memory. Production requires SQL and reports an error if the database is unavailable; it does not silently use temporary storage. Azure SQL's free allowance is shared with Pont, so both games contribute to the same usage and either may be unavailable if the database auto-pauses after the free allowance is exhausted.

## Existing Vercel Link

https://overrated-eight.vercel.app/

This deployment is not configured for the Azure SQL database; it needs its own supported SQL credentials and environment configuration before using persistent rooms.
