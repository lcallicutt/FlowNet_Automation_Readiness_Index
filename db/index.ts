import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let _db: NeonHttpDatabase<typeof schema> | null = null;

/**
 * Lazily construct the Drizzle client so the app can build and run
 * (minus persistence) before DATABASE_URL is provisioned. On Vercel,
 * DATABASE_URL is injected automatically by the Neon storage integration.
 */
export function getDb(): NeonHttpDatabase<typeof schema> {
  if (_db) return _db;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Create a Neon database in the Vercel Storage tab (or add it to .env.local for local dev)."
    );
  }
  _db = drizzle(neon(url), { schema });
  return _db;
}

export { schema };
