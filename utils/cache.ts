import { Redis } from "ioredis";
import fs from "fs";
export const cache = new Redis(6379);

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

export async function del(key: string) {
  try {
    const result = await cache.del(key);
    return result;
  } catch (err) {
    return null;
  }
}

const secKillScript = fs.readFileSync(
  "/Users/liyizhen/Desktop/ticket/dist/secKill.lua"
);

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

  const data = (await cache.brpop("orderList", 0)) as [string, string] | null;
  if (data !== null) {
    const values = data[1].split(":");
    const value1 = values[0];
    const value2 = values[1];

    console.log(`showSeatId: ${value1}`);
    console.log(`userId: ${value2}`);
  }

  const results = { showSeatId, result };
  //console.log(results);

  return results;
}
