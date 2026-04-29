import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

// User storage table - keyed by Clerk user ID
export const users = pgTable("users", {
  id: varchar("id").primaryKey(), // Clerk user ID (e.g. "user_2abc...")
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
