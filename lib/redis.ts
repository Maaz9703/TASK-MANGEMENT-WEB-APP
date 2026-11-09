import { Redis } from "@upstash/redis";
import { MongoClient, type Collection } from "mongodb";

/**
 * The app talks to a small Redis-style API (get/set/mget/del, sets, pipelines).
 * It is backed by MongoDB when MONGODB_URI is set, otherwise by Upstash Redis.
 */
export interface KV {
  get<T = unknown>(key: string): Promise<T | null>;
  set(key: string, value: unknown): Promise<unknown>;
  mget<T extends unknown[]>(...keys: string[]): Promise<T>;
  del(key: string): Promise<unknown>;
  sadd(key: string, ...members: string[]): Promise<unknown>;
  srem(key: string, ...members: string[]): Promise<unknown>;
  smembers(key: string): Promise<string[]>;
  pipeline(): Pipeline;
}

interface Pipeline {
  set(key: string, value: unknown): Pipeline;
  sadd(key: string, ...members: string[]): Pipeline;
  exec(): Promise<unknown[]>;
}

type Doc = { _id: string; value?: unknown; members?: string[] };

class MongoKV implements KV {
  private collection: Promise<Collection<Doc>>;

  constructor(uri: string) {
    const g = globalThis as unknown as { __motionMongo?: Promise<MongoClient> };
    g.__motionMongo ??= new MongoClient(uri, { serverSelectionTimeoutMS: 8000 }).connect();
    this.collection = g.__motionMongo.then((c) => c.db().collection<Doc>("kv"));
  }

  async get<T>(key: string) {
    const doc = await (await this.collection).findOne({ _id: key });
    return (doc?.value as T) ?? null;
  }
  async set(key: string, value: unknown) {
    await (await this.collection).updateOne({ _id: key }, { $set: { value } }, { upsert: true });
    return "OK";
  }
  async mget<T extends unknown[]>(...keys: string[]) {
    const docs = await (await this.collection).find({ _id: { $in: keys } }).toArray();
    const byId = new Map(docs.map((d) => [d._id, d.value ?? null]));
    return keys.map((k) => byId.get(k) ?? null) as T;
  }
  async del(key: string) {
    return (await (await this.collection).deleteOne({ _id: key })).deletedCount;
  }
  async sadd(key: string, ...members: string[]) {
    await (await this.collection).updateOne({ _id: key }, { $addToSet: { members: { $each: members } } }, { upsert: true });
    return members.length;
  }
  async srem(key: string, ...members: string[]) {
    await (await this.collection).updateOne({ _id: key }, { $pull: { members: { $in: members } } });
    return members.length;
  }
  async smembers(key: string) {
    return (await (await this.collection).findOne({ _id: key }))?.members ?? [];
  }
  pipeline(): Pipeline {
    const ops: (() => Promise<unknown>)[] = [];
    const p: Pipeline = {
      set: (key, value) => { ops.push(() => this.set(key, value)); return p; },
      sadd: (key, ...members) => { ops.push(() => this.sadd(key, ...members)); return p; },
      exec: async () => { const out = []; for (const op of ops) out.push(await op()); return out; },
    };
    return p;
  }
}

let client: KV | null = null;

function getClient(): KV {
  if (client) return client;
  const mongoUri = process.env.MONGODB_URI?.trim();
  if (mongoUri) {
    client = new MongoKV(mongoUri);
    return client;
  }
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) {
    throw new Error("Set MONGODB_URI, or UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN");
  }
  client = new Redis({ url, token }) as unknown as KV;
  return client;
}

// Created on first use so the app can build without credentials.
export const redis = new Proxy({} as KV, {
  get(_target, prop) {
    const c = getClient();
    const value = Reflect.get(c, prop);
    return typeof value === "function" ? value.bind(c) : value;
  },
});
