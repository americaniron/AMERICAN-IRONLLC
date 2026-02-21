import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQuoteRequestSchema, insertContactInquirySchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/equipment", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const search = req.query.search as string | undefined;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 24;
      const result = await storage.getEquipment({ category, search, page, limit });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch equipment" });
    }
  });

  app.get("/api/equipment/categories/counts", async (req, res) => {
    try {
      const counts = await storage.getEquipmentCategoryCounts();
      res.json(counts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch category counts" });
    }
  });

  app.get("/api/equipment/:id", async (req, res) => {
    try {
      const item = await storage.getEquipmentById(req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Equipment not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch equipment" });
    }
  });

  app.get("/api/parts", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const search = req.query.search as string | undefined;
      const items = await storage.getParts({ category, search });
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch parts" });
    }
  });

  app.post("/api/quotes", async (req, res) => {
    try {
      const data = insertQuoteRequestSchema.parse(req.body);
      const item = await storage.createQuoteRequest(data);
      res.status(201).json(item);
    } catch (error: any) {
      if (error?.issues) {
        return res.status(400).json({ error: "Validation error", details: error.issues });
      }
      res.status(500).json({ error: "Failed to create quote request" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const data = insertContactInquirySchema.parse(req.body);
      const item = await storage.createContactInquiry(data);
      res.status(201).json(item);
    } catch (error: any) {
      if (error?.issues) {
        return res.status(400).json({ error: "Validation error", details: error.issues });
      }
      res.status(500).json({ error: "Failed to create contact inquiry" });
    }
  });

  app.get("/api/stats", async (req, res) => {
    try {
      const equipmentCount = await storage.getEquipmentCount();
      const partsCount = await storage.getPartsCount();
      res.json({ equipmentCount, partsCount });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  return httpServer;
}
