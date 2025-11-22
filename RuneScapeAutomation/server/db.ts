import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Strip quotes from DATABASE_URL if present
let databaseUrl = process.env.DATABASE_URL;
if (databaseUrl) {
  databaseUrl = databaseUrl.replace(/^["']|["']$/g, '');
}

if (!databaseUrl) {
  console.warn("WARNING: DATABASE_URL not set. Using in-memory storage fallback.");
}

export const pool = databaseUrl 
  ? new Pool({ connectionString: databaseUrl })
  : null;

export const db = databaseUrl && pool 
  ? drizzle({ client: pool, schema })
  : null;
