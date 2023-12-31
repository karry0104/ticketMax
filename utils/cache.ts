import { Redis } from "ioredis";
import fs from "fs";
import path from "path";

const __dirname = path.resolve();

const luaScriptPath = path.join(__dirname, "secKill.lua");
const secKillScript = fs.readFileSync(luaScriptPath, "utf8");

export const cache = new Redis({
  port: 6379,
  host: "ticket-2.f8lhxs.ng.0001.apne1.cache.amazonaws.com", 
});

export async function get(key: string) {
  try {
    const result = await cache.get(key);
    return result;
  } catch (err) {
    return null;
  }
}

export async function set(key: string, value: string) {
  try {
    const result = await cache.set(key, value);
    return result;
  } catch (err) {
    return null;
  }
}

export async function prepare(showSeatId: number) {
  await cache.hset(`${showSeatId}`, { Total: 1, Booked: 0 });
}

export async function secKill(showSeatId: number, userId: number) {
  const sha1 = await cache.script("LOAD", secKillScript);

  const result = await cache.evalsha(
    String(sha1),
    1,
    showSeatId,
    "orderList",
    userId
  );

  const results = { showSeatId, result };

  return results;
}
