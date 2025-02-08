import Redis from "ioredis";

const redis = new Redis();

export class RedisService {
  async set(key: string, value: any, ttl?: number): Promise<void> {
    if (ttl) {
      await redis.set(key, value, "EX", ttl);
    } else {
      await redis.set(key, value);
    }
  }

  async get(key: string): Promise<any | null> {
    return redis.get(key);
  }

  async del(key: string): Promise<void> {
    await redis.del(key);
  }
}
