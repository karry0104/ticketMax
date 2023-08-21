import { Redis } from "ioredis";
import dotenv from "dotenv";
dotenv.config();

export const cache = new Redis({
  port: Number(process.env.REDIS_PORT) || 6379,
  host: process.env.REDIS_HOST,
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
