import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, numeric, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const equipment = pgTable("equipment", {
  id: serial("id").primaryKey(),
  equipmentId: varchar("equipment_id", { length: 20 }).notNull().unique(),
  make: varchar("make", { length: 50 }).notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  year: integer("year"),
  meter: integer("meter"),
  price: varchar("price", { length: 50 }),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 10 }),
  category: varchar("category", { length: 50 }).notNull(),
  imageUrl: text("image_url"),
});

export const parts = pgTable("parts", {
  id: serial("id").primaryKey(),
  partNumber: varchar("part_number", { length: 50 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  subcategory: varchar("subcategory", { length: 100 }),
  price: varchar("price", { length: 50 }),
  compatibility: text("compatibility"),
  engineModel: text("engine_model"),
  gasket: varchar("gasket", { length: 50 }),
  equipment: text("equipment"),
  imageUrl: text("image_url"),
});

export const quoteRequests = pgTable("quote_requests", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 200 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  shipTo: text("ship_to"),
  notes: text("notes"),
  items: text("items"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contactInquiries = pgTable("contact_inquiries", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 200 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertEquipmentSchema = createInsertSchema(equipment).omit({ id: true });
export const insertPartSchema = createInsertSchema(parts).omit({ id: true });
export const insertQuoteRequestSchema = createInsertSchema(quoteRequests).omit({ id: true, createdAt: true });
export const insertContactInquirySchema = createInsertSchema(contactInquiries).omit({ id: true, createdAt: true });

export type Equipment = typeof equipment.$inferSelect;
export type InsertEquipment = z.infer<typeof insertEquipmentSchema>;
export type Part = typeof parts.$inferSelect;
export type InsertPart = z.infer<typeof insertPartSchema>;
export type QuoteRequest = typeof quoteRequests.$inferSelect;
export type InsertQuoteRequest = z.infer<typeof insertQuoteRequestSchema>;
export type ContactInquiry = typeof contactInquiries.$inferSelect;
export type InsertContactInquiry = z.infer<typeof insertContactInquirySchema>;

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const projectEstimates = pgTable("project_estimates", {
  id: serial("id").primaryKey(),
  projectName: varchar("project_name", { length: 200 }).notNull(),
  projectType: varchar("project_type", { length: 100 }).notNull(),
  location: varchar("location", { length: 200 }).notNull(),
  terrain: varchar("terrain", { length: 100 }).notNull(),
  projectSize: varchar("project_size", { length: 100 }).notNull(),
  duration: varchar("duration", { length: 100 }).notNull(),
  additionalDetails: text("additional_details"),
  estimateResult: text("estimate_result").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProjectEstimateSchema = createInsertSchema(projectEstimates).omit({ id: true, createdAt: true });
export type ProjectEstimate = typeof projectEstimates.$inferSelect;
export type InsertProjectEstimate = z.infer<typeof insertProjectEstimateSchema>;

export * from "./models/chat";
