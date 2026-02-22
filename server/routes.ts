import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQuoteRequestSchema, insertContactInquirySchema } from "@shared/schema";
import OpenAI from "openai";
import { z } from "zod";

const estimateRequestSchema = z.object({
  projectName: z.string().min(1).max(200),
  projectType: z.string().min(1).max(100),
  location: z.string().min(1).max(200),
  terrain: z.string().min(1).max(100),
  projectSize: z.string().min(1).max(100),
  duration: z.string().min(1).max(100),
  additionalDetails: z.string().max(2000).optional().nullable(),
});

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

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

  app.get("/api/parts/categories/counts", async (req, res) => {
    try {
      const counts = await storage.getPartsCategoryCounts();
      res.json(counts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch parts category counts" });
    }
  });

  app.get("/api/parts", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const subcategory = req.query.subcategory as string | undefined;
      const search = req.query.search as string | undefined;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const result = await storage.getParts({ category, subcategory, search, page, limit });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch parts" });
    }
  });

  app.get("/api/parts/subcategories/counts", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const counts = await storage.getPartsSubcategoryCounts(category);
      res.json(counts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subcategory counts" });
    }
  });

  app.get("/api/parts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid part ID" });
      const item = await storage.getPartById(id);
      if (!item) return res.status(404).json({ error: "Part not found" });
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch part" });
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
      const powerUnitsCount = await storage.getPowerUnitsCount();
      res.json({ equipmentCount, partsCount, powerUnitsCount });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.get("/api/power-units", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const search = req.query.search as string | undefined;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 24;
      const result = await storage.getPowerUnits({ category, search, page, limit });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch power units" });
    }
  });

  app.get("/api/power-units/categories/counts", async (req, res) => {
    try {
      const counts = await storage.getPowerUnitCategoryCounts();
      res.json(counts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch power unit category counts" });
    }
  });

  app.get("/api/power-units/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid power unit ID" });
      const item = await storage.getPowerUnitById(id);
      if (!item) return res.status(404).json({ error: "Power unit not found" });
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch power unit" });
    }
  });

  app.post("/api/estimate", async (req, res) => {
    try {
      const parsed = estimateRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Validation error", details: parsed.error.issues });
      }
      const { projectName, projectType, location, terrain, projectSize, duration, additionalDetails } = parsed.data;

      const categoryCounts = await storage.getEquipmentCategoryCounts();
      const equipmentSummary = await storage.getEquipmentPriceSummary();
      const partsCategoryCounts = await storage.getPartsCategoryCounts();

      const inventoryContext = `
AMERICAN IRON LLC INVENTORY DATA:
Equipment Categories & Counts: ${JSON.stringify(categoryCounts)}
Equipment Price Ranges by Category: ${JSON.stringify(equipmentSummary)}
Parts Categories & Counts: ${JSON.stringify(partsCategoryCounts)}
Total Equipment Items: ${Object.values(categoryCounts).reduce((a: number, b: number) => a + b, 0)}
Total Parts Items: ${Object.values(partsCategoryCounts).reduce((a: number, b: number) => a + b, 0)}
`;

      const systemPrompt = `You are the IRON Estimator — an institutional-grade construction equipment estimation tool for American Iron LLC, a leading heavy equipment and parts company based in Tampa, Florida. You provide comprehensive, thorough, and professional project equipment estimates.

${inventoryContext}

You must generate a detailed, institutional-quality estimate that includes:

1. **Primary Equipment Requirements**: List each piece of heavy equipment needed with specific make/model recommendations from our inventory categories (Excavators, Bulldozers, Wheel Loaders, Articulated Trucks, Motor Graders, Compactors, Scrapers, Track Dozers, Backhoes, Skidsteers, Telehandlers, etc.), quantities needed, and estimated costs based on our pricing.

2. **Supporting Equipment**: Forklifts, telehandlers, skidsteers, compactors, and other support machinery needed.

3. **Power Generation**: Generators and power units required for the project scope and location.

4. **Transportation & Logistics**: Estimated transport costs for equipment mobilization/demobilization based on the project location relative to our Tampa, FL headquarters.

5. **Maintenance & Parts Budget**: Estimated maintenance costs and replacement parts budget based on project duration, including filters, hydraulic components, undercarriage parts, engine components, etc. from our 12,200+ parts catalog.

6. **Personnel Considerations**: Estimated operator and maintenance crew requirements.

7. **Cost Summary**: 
   - Equipment Purchase/Rental Costs
   - Transportation Costs
   - Maintenance & Parts Reserve
   - Support Equipment Costs
   - Total Estimated Project Equipment Budget

Format your response as a structured, professional report with clear sections, bullet points, and cost breakdowns. Use real pricing ranges based on the inventory data provided. Be specific with equipment models and quantities. Consider the terrain type, project size, duration, and location when making recommendations.

Always provide cost ranges (low-mid-high) to give the client flexibility in budgeting. Include a note that actual pricing may vary and encourage the visitor to request a formal quote through American Iron LLC for exact pricing.`;

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const stream = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Generate a comprehensive construction project equipment estimate for the following project:

**Project Name:** ${projectName}
**Project Type:** ${projectType}
**Location:** ${location}
**Terrain Type:** ${terrain}
**Project Size/Scale:** ${projectSize}
**Estimated Duration:** ${duration}
${additionalDetails ? `**Additional Details:** ${additionalDetails}` : ""}

Provide a thorough, institutional-grade estimate with specific equipment recommendations, quantities, cost breakdowns, and a comprehensive budget summary.`,
          },
        ],
        stream: true,
        max_completion_tokens: 8192,
      });

      let fullResponse = "";

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          fullResponse += content;
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      await storage.createProjectEstimate({
        projectName,
        projectType,
        location,
        terrain,
        projectSize,
        duration,
        additionalDetails: additionalDetails || null,
        estimateResult: fullResponse,
      });

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error) {
      console.error("Error generating estimate:", error);
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: "Failed to generate estimate" })}\n\n`);
        res.end();
      } else {
        res.status(500).json({ error: "Failed to generate estimate" });
      }
    }
  });

  return httpServer;
}
