import { promises as fs } from 'fs';
import path from 'path';
import { Redis } from '@upstash/redis';
import type { PizzaStore } from './types';

const REDIS_KEY = 'formanka:pizza-store';

function hasRedis(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

function getRedis(): Redis {
  return new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  });
}

function fileStorePath(): string {
  const dir = process.env.VERCEL
    ? path.join('/tmp', 'formanka')
    : path.join(process.cwd(), 'data');
  return path.join(dir, 'pizza-orders.json');
}

async function loadFromFile(): Promise<PizzaStore | null> {
  try {
    const raw = await fs.readFile(fileStorePath(), 'utf-8');
    return JSON.parse(raw) as PizzaStore;
  } catch {
    return null;
  }
}

async function saveToFile(store: PizzaStore): Promise<void> {
  const file = fileStorePath();
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(store, null, 2), 'utf-8');
}

export async function loadStore(): Promise<PizzaStore | null> {
  if (hasRedis()) {
    const redis = getRedis();
    return (await redis.get<PizzaStore>(REDIS_KEY)) ?? null;
  }
  return loadFromFile();
}

export async function saveStoreData(store: PizzaStore): Promise<void> {
  if (hasRedis()) {
    const redis = getRedis();
    await redis.set(REDIS_KEY, store);
    return;
  }
  await saveToFile(store);
}

export function persistenceMode(): 'redis' | 'file' {
  return hasRedis() ? 'redis' : 'file';
}
