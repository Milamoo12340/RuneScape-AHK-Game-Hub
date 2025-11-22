import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users Schema
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  passwordHash: true,
}).extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// AutoHotkey Script Schema (Updated with userId and privacy)
export const scripts = pgTable("scripts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // fishing, combat, skilling, magic, agility, etc.
  code: text("code").notNull(),
  author: text("author").default("User"),
  userId: varchar("user_id").references(() => users.id), // Foreign key to users
  isPublic: boolean("is_public").default(true), // Privacy field
  isFavorite: integer("is_favorite").default(0), // 0 or 1 for boolean
  executionCount: integer("execution_count").default(0),
  lastExecuted: timestamp("last_executed"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertScriptSchema = createInsertSchema(scripts).omit({
  id: true,
  createdAt: true,
});

export type InsertScript = z.infer<typeof insertScriptSchema>;
export type Script = typeof scripts.$inferSelect;

// OSRS News Article Schema
export const newsArticles = pgTable("news_articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  summary: text("summary").notNull(),
  imageUrl: text("image_url"),
  source: text("source").notNull(), // wiki, update page, community
  category: text("category").notNull(), // update, event, leak, patch
  publishedAt: timestamp("published_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertNewsArticleSchema = createInsertSchema(newsArticles).omit({
  id: true,
  createdAt: true,
});

export type InsertNewsArticle = z.infer<typeof insertNewsArticleSchema>;
export type NewsArticle = typeof newsArticles.$inferSelect;

// System Stats Schema (for monitoring)
export const systemStats = pgTable("system_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cpuUsage: integer("cpu_usage").notNull(), // percentage
  gpuUsage: integer("gpu_usage").notNull(), // percentage
  ramUsage: integer("ram_usage").notNull(), // percentage
  fps: integer("fps").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertSystemStatsSchema = createInsertSchema(systemStats).omit({
  id: true,
  timestamp: true,
});

export type InsertSystemStats = z.infer<typeof insertSystemStatsSchema>;
export type SystemStats = typeof systemStats.$inferSelect;

// Script Categories
export const SCRIPT_CATEGORIES = [
  { id: "combat", name: "Combat", icon: "Sword", color: "from-red-500 to-orange-500" },
  { id: "fishing", name: "Fishing", icon: "Fish", color: "from-blue-500 to-cyan-500" },
  { id: "mining", name: "Mining", icon: "Pickaxe", color: "from-gray-500 to-slate-600" },
  { id: "magic", name: "Magic", icon: "Wand2", color: "from-purple-500 to-pink-500" },
  { id: "agility", name: "Agility", icon: "Zap", color: "from-green-500 to-emerald-500" },
  { id: "crafting", name: "Crafting", icon: "Hammer", color: "from-amber-500 to-yellow-500" },
  { id: "cooking", name: "Cooking", icon: "ChefHat", color: "from-orange-500 to-red-500" },
  { id: "woodcutting", name: "Woodcutting", icon: "Axe", color: "from-green-600 to-lime-600" },
  { id: "smithing", name: "Smithing", icon: "Hammer", color: "from-orange-600 to-amber-600" },
  { id: "fletching", name: "Fletching", icon: "ArrowUp", color: "from-teal-500 to-cyan-600" },
  { id: "herblore", name: "Herblore", icon: "Flask", color: "from-lime-500 to-green-600" },
  { id: "farming", name: "Farming", icon: "Flower", color: "from-green-400 to-emerald-500" },
  { id: "construction", name: "Construction", icon: "Home", color: "from-yellow-600 to-orange-600" },
  { id: "runecrafting", name: "Runecrafting", icon: "Circle", color: "from-indigo-500 to-purple-600" },
  { id: "thieving", name: "Thieving", icon: "Hand", color: "from-purple-600 to-pink-600" },
  { id: "hunter", name: "Hunter", icon: "Target", color: "from-amber-600 to-orange-700" },
  { id: "firemaking", name: "Firemaking", icon: "Flame", color: "from-red-600 to-orange-600" },
  { id: "minigames", name: "Minigames", icon: "Trophy", color: "from-yellow-500 to-amber-500" },
  { id: "pvp", name: "PvP", icon: "Swords", color: "from-red-600 to-rose-600" },
  { id: "banking", name: "Banking", icon: "Building", color: "from-blue-600 to-indigo-600" },
  { id: "utility", name: "Utility", icon: "Settings", color: "from-slate-500 to-gray-500" },
] as const;

export type ScriptCategory = typeof SCRIPT_CATEGORIES[number]["id"];
