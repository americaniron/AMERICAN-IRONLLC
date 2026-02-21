import { db } from "./db";
import { equipment, parts } from "@shared/schema";
import { sql } from "drizzle-orm";

const partsData = [
  { partNumber: "5P-8500", description: "Hydraulic Pump Assembly - Main", category: "hydraulics", price: "$4,250", compatibility: "CAT 336, 349, 352" },
  { partNumber: "1R-0750", description: "Fuel Filter - Primary", category: "filters-and-fluids", price: "$42", compatibility: "CAT C7, C9, C13" },
  { partNumber: "1R-0751", description: "Fuel Filter - Secondary", category: "filters-and-fluids", price: "$38", compatibility: "CAT C7, C9, C13" },
  { partNumber: "1R-0739", description: "Oil Filter - Engine", category: "filters-and-fluids", price: "$28", compatibility: "CAT C9, C13, C15" },
  { partNumber: "3E-9745", description: "Hydraulic Cylinder - Boom", category: "hydraulics", price: "$8,500", compatibility: "CAT 349, 352, 374" },
  { partNumber: "2G-8264", description: "Turbocharger Assembly", category: "engine", price: "$6,800", compatibility: "CAT C13, C15" },
  { partNumber: "7C-4957", description: "Water Pump - Engine Cooling", category: "engine", price: "$1,250", compatibility: "CAT C9, C13" },
  { partNumber: "2P-5870", description: "Transmission Control Valve", category: "drivetrain", price: "$3,400", compatibility: "CAT 950, 966, 972" },
  { partNumber: "8T-4778", description: "Final Drive Assembly - LH", category: "drivetrain", price: "$12,500", compatibility: "CAT D6T, D6R" },
  { partNumber: "8T-4779", description: "Final Drive Assembly - RH", category: "drivetrain", price: "$12,500", compatibility: "CAT D6T, D6R" },
  { partNumber: "6V-8398", description: "Track Roller - Single Flange", category: "undercarriage", price: "$450", compatibility: "CAT 320, 325, 330" },
  { partNumber: "6V-8399", description: "Track Roller - Double Flange", category: "undercarriage", price: "$520", compatibility: "CAT 320, 325, 330" },
  { partNumber: "6Y-2254", description: "Track Chain Assembly", category: "undercarriage", price: "$6,200", compatibility: "CAT D6T, D6R, D6N" },
  { partNumber: "9W-6659", description: "Track Shoe - 560mm", category: "undercarriage", price: "$185", compatibility: "CAT 320, 330 Excavators" },
  { partNumber: "1U-3252", description: "Bucket Tooth - Heavy Duty", category: "ground-engaging-tools", price: "$85", compatibility: "CAT J-Series Adapters" },
  { partNumber: "4T-6698", description: "Cutting Edge - 8ft", category: "ground-engaging-tools", price: "$420", compatibility: "CAT 950, 966 Loaders" },
  { partNumber: "1P-3703", description: "Control Valve Group", category: "hydraulics", price: "$5,600", compatibility: "CAT 336, 349" },
  { partNumber: "2S-1721", description: "Crankshaft - Remanufactured", category: "engine", price: "$8,900", compatibility: "CAT C15, C18" },
  { partNumber: "3S-4757", description: "Cylinder Head Assembly", category: "engine", price: "$4,200", compatibility: "CAT C9, C13" },
  { partNumber: "8E-5782", description: "Swing Motor Assembly", category: "hydraulics", price: "$7,800", compatibility: "CAT 336, 349 Excavators" },
  { partNumber: "4P-2822", description: "Air Filter - Primary", category: "filters-and-fluids", price: "$65", compatibility: "CAT C9, C13, C15" },
  { partNumber: "4P-2823", description: "Air Filter - Secondary", category: "filters-and-fluids", price: "$45", compatibility: "CAT C9, C13, C15" },
  { partNumber: "5I-8670", description: "Hydraulic Return Filter", category: "filters-and-fluids", price: "$52", compatibility: "CAT 320, 325, 330" },
  { partNumber: "7W-2326", description: "Starter Motor - 24V", category: "electrical", price: "$1,850", compatibility: "CAT C9, C13, C15" },
  { partNumber: "6T-1773", description: "Alternator Assembly - 24V", category: "electrical", price: "$1,200", compatibility: "CAT C9, C13" },
  { partNumber: "3E-7985", description: "ECM Control Module", category: "electrical", price: "$4,500", compatibility: "CAT C13, C15" },
  { partNumber: "7T-4831", description: "Radiator Assembly", category: "cooling-systems", price: "$3,800", compatibility: "CAT 950, 966 Loaders" },
  { partNumber: "2P-8797", description: "Oil Cooler - Hydraulic", category: "cooling-systems", price: "$2,100", compatibility: "CAT 336, 349" },
  { partNumber: "1U-1846", description: "Ripper Shank - Single", category: "ground-engaging-tools", price: "$950", compatibility: "CAT D8, D9, D10" },
  { partNumber: "4T-2345", description: "Wear Plate - Floor", category: "ground-engaging-tools", price: "$280", compatibility: "CAT 966, 972 Buckets" },
  { partNumber: "8W-9610", description: "Hydraulic Hose Assembly 36\"", category: "hoses-and-tubes", price: "$185", compatibility: "Universal - SAE 100R12" },
  { partNumber: "8W-9611", description: "Hydraulic Hose Assembly 48\"", category: "hoses-and-tubes", price: "$225", compatibility: "Universal - SAE 100R12" },
  { partNumber: "1U-3252B", description: "Bucket Tooth Kit - 5 Pack", category: "ground-engaging-tools", price: "$380", compatibility: "CAT J-Series Adapters" },
  { partNumber: "GP-KIT-001", description: "Hydraulic Seal Kit - Boom Cylinder", category: "upgrades-repair-kits", price: "$450", compatibility: "CAT 320, 325, 330" },
  { partNumber: "GP-KIT-002", description: "Engine Overhaul Gasket Set", category: "upgrades-repair-kits", price: "$1,800", compatibility: "CAT C13" },
  { partNumber: "GP-KIT-003", description: "Undercarriage Complete Rebuild Kit", category: "upgrades-repair-kits", price: "$22,500", compatibility: "CAT D6T" },
  { partNumber: "1U-3352", description: "End Bit - LH", category: "ground-engaging-tools", price: "$320", compatibility: "CAT D6, D7 Dozers" },
  { partNumber: "1U-3353", description: "End Bit - RH", category: "ground-engaging-tools", price: "$320", compatibility: "CAT D6, D7 Dozers" },
  { partNumber: "6I-2503", description: "Hydraulic Tube - Pressure", category: "hoses-and-tubes", price: "$210", compatibility: "CAT 950, 966 Loaders" },
  { partNumber: "GP-KIT-004", description: "Transmission Rebuild Kit", category: "upgrades-repair-kits", price: "$14,500", compatibility: "CAT 950, 966" },
  { partNumber: "252-5361", description: "Thumb Attachment - Hydraulic", category: "attachments", price: "$6,800", compatibility: "CAT 336, 349 Excavators" },
  { partNumber: "301-4488", description: "Pallet Fork Set 48\"", category: "attachments", price: "$3,200", compatibility: "CAT Wheel Loaders" },
];

export async function seedDatabase() {
  try {
    const [existing] = await db.select({ count: sql<number>`count(*)` }).from(parts);
    if (Number(existing.count) > 0) {
      console.log("Database already seeded, skipping.");
      return;
    }

    console.log("Seeding parts data...");

    await db.insert(parts).values(partsData);
    console.log(`Inserted ${partsData.length} parts.`);

    console.log("Seeding complete.");
  } catch (error) {
    console.error("Seeding error:", error);
  }
}
