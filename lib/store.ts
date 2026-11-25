import { randomInt } from "node:crypto";
import sql from "mssql";
import { DefaultAzureCredential } from "@azure/identity";
import { applyAction, buildRoom, type Mode, type Room } from "./game";

const credential = new DefaultAzureCredential();
const memory = new Map<string, Room>();
let pool: sql.ConnectionPool | undefined;
let expires = 0;
let connecting: Promise<sql.ConnectionPool> | undefined;
const clone = (room: Room): Room => structuredClone(room);
const code = () => Array.from({ length: 5 }, () => "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[randomInt(36)]).join("");

async function db(): Promise<sql.ConnectionPool> {
  const server = process.env.SQL_SERVER;
  if (!server) throw new Error("SQL_SERVER is not configured.");
  if (pool?.connected && Date.now() < expires) return pool;
  if (connecting) return connecting;
  connecting = (async () => {
    const token = await credential.getToken("https://database.windows.net/.default");
    if (!token) throw new Error("Unable to authenticate to Azure SQL.");
    const next = new sql.ConnectionPool({ server, database: process.env.SQL_DATABASE || "pont-game", options: { encrypt: true, trustServerCertificate: false }, authentication: { type: "azure-active-directory-access-token", options: { token: token.token } } });
    await next.connect();
    const previous = pool;
    pool = next;
    expires = Math.min(token.expiresOnTimestamp - 5 * 60_000, Date.now() + 45 * 60_000);
    if (previous) void previous.close().catch(() => {});
    return next;
  })();
  try { return await connecting; } finally { connecting = undefined; }
}

function useMemory() {
  if (process.env.SQL_SERVER) return false;
  if (process.env.NODE_ENV === "production") throw new Error("Persistent game storage is not configured.");
  return true;
}

export async function createRoom(name: string, playerId: string, mode: Mode): Promise<Room> {
  const local = useMemory();
  for (let attempt = 0; attempt < 10; attempt++) {
    const room = buildRoom(code(), name, playerId, mode);
    if (local) {
      if (memory.has(room.code)) continue;
      memory.set(room.code, clone(room));
      return clone(room);
    }
    try {
      const p = await db();
      await p.request().input("code", sql.NVarChar(5), room.code).input("state", sql.NVarChar(sql.MAX), JSON.stringify(room)).query("INSERT dbo.OverratedRooms (roomCode, stateJson) VALUES (@code, @state)");
      return room;
    } catch (error) {
      const number = (error as { number?: number }).number;
      if (number !== 2627 && number !== 2601) throw error;
    }
  }
  throw new Error("Unable to allocate a room code. Please try again.");
}

export async function getRoom(roomCode: string): Promise<Room> {
  if (useMemory()) {
    const room = memory.get(roomCode);
    if (!room) throw new Error("That room no longer exists.");
    return clone(room);
  }
  const result = await (await db()).request().input("code", sql.NVarChar(5), roomCode).query("SELECT stateJson FROM dbo.OverratedRooms WHERE roomCode = @code");
  if (!result.recordset.length) throw new Error("That room no longer exists.");
  return JSON.parse(result.recordset[0].stateJson) as Room;
}

export async function changeRoom(roomCode: string, playerId: string, action: string, payload: { name?: string; rating?: number; topic?: string }): Promise<Room> {
  if (useMemory()) {
    const existing = memory.get(roomCode);
    if (!existing) throw new Error("That room no longer exists.");
    const result = applyAction(clone(existing), playerId, action, payload);
    memory.set(roomCode, clone(result));
    return result;
  }
  const tx = new sql.Transaction(await db());
  await tx.begin(sql.ISOLATION_LEVEL.SERIALIZABLE);
  try {
    const found = await new sql.Request(tx).input("code", sql.NVarChar(5), roomCode).query("SELECT stateJson FROM dbo.OverratedRooms WITH (UPDLOCK, HOLDLOCK) WHERE roomCode = @code");
    if (!found.recordset.length) throw new Error("That room no longer exists.");
    const result = applyAction(JSON.parse(found.recordset[0].stateJson) as Room, playerId, action, payload);
    await new sql.Request(tx).input("code", sql.NVarChar(5), roomCode).input("state", sql.NVarChar(sql.MAX), JSON.stringify(result)).query("UPDATE dbo.OverratedRooms SET stateJson = @state, updatedAt = SYSUTCDATETIME() WHERE roomCode = @code");
    await tx.commit();
    return result;
  } catch (error) {
    await tx.rollback().catch(() => {});
    throw error;
  }
}
