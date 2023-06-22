import { Redis } from "ioredis";

export const cache = new Redis({
  port: 6379, // Redis port
  host: "ticket-2.f8lhxs.ng.0001.apne1.cache.amazonaws.com", // Redis host',
});

// export const cache = new Redis({
//   url: "redis://ticket-2.f8lhxs.ng.0001.apne1.cache.amazonaws.com:6379", // Redis host',
// });

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
