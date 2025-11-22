import { defineConfig } from "drizzle-kit";
import type { Config } from "drizzle-kit";

const config: Config = process.env.DATABASE_URL ? {
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
} : {
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://localhost/runescapeapp",
  },
};

export default defineConfig(config);
