import { pgTable, text, varchar, timestamp, uuid } from "drizzle-orm/pg-core";
import { projects } from "./projects.js";

export const pageViews = pgTable("page_views", {
  id: uuid("id").defaultRandom().primaryKey(),
  date: timestamp("date", { mode: "date" }).notNull().defaultNow(),
  ipHash: varchar("ip_hash", { length: 64 }).notNull(),
  userAgent: text("user_agent"),
  referrer: text("referrer"),
  projectClicked: uuid("project_clicked").references(() => projects.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export type PageView = typeof pageViews.$inferSelect;
export type NewPageView = typeof pageViews.$inferInsert;
