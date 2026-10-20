import {
  pgTable,
  pgEnum,
  text,
  varchar,
  boolean,
  integer,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const projectStatusEnum = pgEnum("project_status", [
  "in_progress",
  "shipped",
  "paused",
  "concept",
]);

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  stack: text("stack").array().notNull(),
  status: projectStatusEnum("status").notNull().default("in_progress"),
  liveUrl: text("live_url"),
  githubUrl: text("github_url"),
  imageUrl: text("image_url"),
  featured: boolean("featured").notNull().default(false),
  priority: integer("priority").notNull().default(0),
  startedAt: timestamp("started_at", { mode: "date" }),
  shippedAt: timestamp("shipped_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

