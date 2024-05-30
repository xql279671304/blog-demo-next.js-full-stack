import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const blog = pgTable("blog", {
  id: varchar("id", { length: 191 }).notNull().primaryKey(),
  userId: varchar("user_id", { length: 191 }).notNull(),
  name: varchar("name", { length: 191 }).notNull(),
  image: text("image"),
  brief: text("brief"),
  content: text("content"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
