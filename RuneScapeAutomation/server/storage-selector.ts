import { MemStorage } from "./storage";
import { DatabaseStorage } from "./storage";
import type { IStorage } from "./storage";

export function getStorage(): IStorage {
  // Use database storage if DATABASE_URL is available, otherwise fall back to in-memory
  if (process.env.DATABASE_URL) {
    console.log("Using DatabaseStorage with PostgreSQL");
    return new DatabaseStorage();
  } else {
    console.log("Using MemStorage (in-memory). For production, set DATABASE_URL environment variable.");
    return new MemStorage();
  }
}
