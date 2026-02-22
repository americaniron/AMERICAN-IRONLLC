import {
  type Equipment,
  type InsertEquipment,
  type Part,
  type InsertPart,
  type QuoteRequest,
  type InsertQuoteRequest,
  type ContactInquiry,
  type InsertContactInquiry,
  type User,
  type InsertUser,
  equipment,
  parts,
  quoteRequests,
  contactInquiries,
  users,
} from "@shared/schema";
import { db } from "./db";
import { eq, ilike, or, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getEquipment(filters?: { category?: string; search?: string; page?: number; limit?: number }): Promise<{ items: Equipment[]; total: number }>;
  getEquipmentById(equipmentId: string): Promise<Equipment | undefined>;
  createEquipment(data: InsertEquipment): Promise<Equipment>;
  getEquipmentCategoryCounts(): Promise<Record<string, number>>;

  getParts(filters?: { category?: string; search?: string }): Promise<Part[]>;
  createPart(data: InsertPart): Promise<Part>;

  createQuoteRequest(data: InsertQuoteRequest): Promise<QuoteRequest>;
  createContactInquiry(data: InsertContactInquiry): Promise<ContactInquiry>;

  getEquipmentCount(): Promise<number>;
  getPartsCount(): Promise<number>;
  getPartsCategoryCounts(): Promise<Record<string, number>>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getEquipment(filters?: { category?: string; search?: string; page?: number; limit?: number }): Promise<{ items: Equipment[]; total: number }> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 24;
    const offset = (page - 1) * limit;

    const conditions = [];

    if (filters?.category) {
      conditions.push(eq(equipment.category, filters.category));
    }

    if (filters?.search) {
      const searchTerm = `%${filters.search}%`;
      conditions.push(
        or(
          ilike(equipment.make, searchTerm),
          ilike(equipment.model, searchTerm),
          ilike(equipment.equipmentId, searchTerm),
          ilike(equipment.city, searchTerm),
          ilike(equipment.state, searchTerm),
          sql`CONCAT(${equipment.make}, ' ', ${equipment.model}) ILIKE ${searchTerm}`,
        )!
      );
    }

    let whereClause: any = undefined;
    if (conditions.length > 0) {
      let combined = conditions[0]!;
      for (let i = 1; i < conditions.length; i++) {
        combined = sql`${combined} AND ${conditions[i]}`;
      }
      whereClause = combined;
    }

    const countQuery = db.select({ count: sql<number>`count(*)` }).from(equipment);
    if (whereClause) {
      countQuery.where(whereClause);
    }
    const [countResult] = await countQuery;
    const total = Number(countResult.count);

    let itemsQuery = db.select().from(equipment);
    if (whereClause) {
      itemsQuery = itemsQuery.where(whereClause) as any;
    }
    const items = await (itemsQuery as any).limit(limit).offset(offset);

    return { items, total };
  }

  async getEquipmentCategoryCounts(): Promise<Record<string, number>> {
    const results = await db
      .select({
        category: equipment.category,
        count: sql<number>`count(*)`,
      })
      .from(equipment)
      .groupBy(equipment.category);

    const counts: Record<string, number> = {};
    for (const row of results) {
      counts[row.category] = Number(row.count);
    }
    return counts;
  }

  async getEquipmentById(equipmentId: string): Promise<Equipment | undefined> {
    const [item] = await db.select().from(equipment).where(eq(equipment.equipmentId, equipmentId));
    return item;
  }

  async createEquipment(data: InsertEquipment): Promise<Equipment> {
    const [item] = await db.insert(equipment).values(data).returning();
    return item;
  }

  async getParts(filters?: { category?: string; search?: string }): Promise<Part[]> {
    let query = db.select().from(parts);

    const conditions = [];

    if (filters?.category) {
      conditions.push(eq(parts.category, filters.category));
    }

    if (filters?.search) {
      const searchTerm = `%${filters.search}%`;
      conditions.push(
        or(
          ilike(parts.partNumber, searchTerm),
          ilike(parts.description, searchTerm),
          ilike(parts.compatibility, searchTerm),
        )!
      );
    }

    if (conditions.length > 0) {
      let combined = conditions[0]!;
      for (let i = 1; i < conditions.length; i++) {
        combined = sql`${combined} AND ${conditions[i]}`;
      }
      query = query.where(combined) as any;
    }

    return query.limit(200);
  }

  async createPart(data: InsertPart): Promise<Part> {
    const [item] = await db.insert(parts).values(data).returning();
    return item;
  }

  async createQuoteRequest(data: InsertQuoteRequest): Promise<QuoteRequest> {
    const [item] = await db.insert(quoteRequests).values(data).returning();
    return item;
  }

  async createContactInquiry(data: InsertContactInquiry): Promise<ContactInquiry> {
    const [item] = await db.insert(contactInquiries).values(data).returning();
    return item;
  }

  async getEquipmentCount(): Promise<number> {
    const [result] = await db.select({ count: sql<number>`count(*)` }).from(equipment);
    return Number(result.count);
  }

  async getPartsCount(): Promise<number> {
    const [result] = await db.select({ count: sql<number>`count(*)` }).from(parts);
    return Number(result.count);
  }

  async getPartsCategoryCounts(): Promise<Record<string, number>> {
    const results = await db
      .select({
        category: parts.category,
        count: sql<number>`count(*)`,
      })
      .from(parts)
      .groupBy(parts.category);

    const counts: Record<string, number> = {};
    for (const row of results) {
      counts[row.category] = Number(row.count);
    }
    return counts;
  }
}

export const storage = new DatabaseStorage();
