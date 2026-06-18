import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";
import { Pool } from "pg";
import * as schema from "@/db/schema";

const globalForDb = globalThis as typeof globalThis & {
  pgPool?: Pool;
};

function createPool() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  return new Pool({ connectionString: url });
}

export function getDb() {
  const pool = globalForDb.pgPool ?? createPool();
  if (!pool) return null;
  if (!globalForDb.pgPool) globalForDb.pgPool = pool;
  return drizzle(pool, { schema });
}

export async function isDbAvailable() {
  const db = getDb();
  if (!db) return false;
  try {
    await db.execute(sql`select 1`);
    return true;
  } catch {
    return false;
  }
}
