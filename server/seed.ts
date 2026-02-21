import { db } from "./db";
import { equipment, parts } from "@shared/schema";
import { sql } from "drizzle-orm";

const equipmentImages = [
  "/images/cat-wheel-loader.png",
  "/images/cat-excavator.png",
  "/images/cat-bulldozer.png",
];

const equipmentData = [
  { equipmentId: "19556401", make: "CAT", model: "615C II", year: 2004, meter: 3861, price: "$189,000", city: "San Antonio", state: "TX", category: "SCRAPERS" },
  { equipmentId: "19556402", make: "CAT", model: "621", year: 2024, meter: 1835, price: "$1,072,049", city: "Georgetown", state: "TX", category: "SCRAPERS" },
  { equipmentId: "19556405", make: "CAT", model: "621K", year: 2020, meter: 2839, price: "$913,499", city: "Georgetown", state: "TX", category: "SCRAPERS" },
  { equipmentId: "19556411", make: "CAT", model: "623K", year: 2024, meter: 1337, price: "$1,296,749", city: "Dallas", state: "TX", category: "SCRAPERS" },
  { equipmentId: "19556420", make: "CAT", model: "631K", year: 2023, meter: 3958, price: "$1,194,899", city: "Cleburne", state: "TX", category: "SCRAPERS" },
  { equipmentId: "19556432", make: "CAT", model: "631", year: 2024, meter: 1286, price: "$1,472,099", city: "Austin", state: "TX", category: "SCRAPERS" },
  { equipmentId: "6564805", make: "CAT", model: "725", year: 2024, meter: 533, price: "CALL", city: "Victoria", state: "TX", category: "ARTICULATED TRUCKS" },
  { equipmentId: "6678230", make: "CAT", model: "725", year: 2023, meter: 1606, price: "$416,955", city: "Longview", state: "TX", category: "ARTICULATED TRUCKS" },
  { equipmentId: "7018505", make: "CAT", model: "725", year: 2024, meter: 545, price: "$625,799", city: "San Antonio", state: "TX", category: "ARTICULATED TRUCKS" },
  { equipmentId: "8039330", make: "CAT", model: "725C", year: 2016, meter: 6652, price: "$157,500", city: "San Antonio", state: "TX", category: "ARTICULATED TRUCKS" },
  { equipmentId: "EQ-WL-001", make: "CAT", model: "950 GC", year: 2023, meter: 1200, price: "$385,000", city: "Tampa", state: "FL", category: "WHEEL LOADERS" },
  { equipmentId: "EQ-WL-002", make: "CAT", model: "966M XE", year: 2022, meter: 3400, price: "$520,000", city: "Houston", state: "TX", category: "WHEEL LOADERS" },
  { equipmentId: "EQ-WL-003", make: "VOLVO", model: "L150H", year: 2021, meter: 4500, price: "$295,000", city: "Orlando", state: "FL", category: "WHEEL LOADERS" },
  { equipmentId: "EQ-WL-004", make: "KOMATSU", model: "WA470-8", year: 2023, meter: 800, price: "$465,000", city: "Dallas", state: "TX", category: "WHEEL LOADERS" },
  { equipmentId: "EQ-EX-001", make: "CAT", model: "336 GC", year: 2024, meter: 450, price: "$410,000", city: "Tampa", state: "FL", category: "EXCAVATORS" },
  { equipmentId: "EQ-EX-002", make: "CAT", model: "349", year: 2023, meter: 1800, price: "$580,000", city: "Austin", state: "TX", category: "EXCAVATORS" },
  { equipmentId: "EQ-EX-003", make: "KOMATSU", model: "PC490LC-11", year: 2022, meter: 3200, price: "$445,000", city: "Jacksonville", state: "FL", category: "EXCAVATORS" },
  { equipmentId: "EQ-EX-004", make: "VOLVO", model: "EC480E", year: 2021, meter: 5100, price: "$320,000", city: "San Antonio", state: "TX", category: "EXCAVATORS" },
  { equipmentId: "EQ-EX-005", make: "DEERE", model: "470G LC", year: 2023, meter: 900, price: "$475,000", city: "Miami", state: "FL", category: "EXCAVATORS" },
  { equipmentId: "EQ-BD-001", make: "CAT", model: "D6T XL", year: 2023, meter: 1500, price: "$395,000", city: "Houston", state: "TX", category: "BULLDOZERS" },
  { equipmentId: "EQ-BD-002", make: "CAT", model: "D8T", year: 2022, meter: 2800, price: "$620,000", city: "Tampa", state: "FL", category: "BULLDOZERS" },
  { equipmentId: "EQ-BD-003", make: "KOMATSU", model: "D65PX-18", year: 2024, meter: 300, price: "$425,000", city: "Georgetown", state: "TX", category: "BULLDOZERS" },
  { equipmentId: "EQ-BD-004", make: "DEERE", model: "850L", year: 2023, meter: 1200, price: "$365,000", city: "Cleburne", state: "TX", category: "BULLDOZERS" },
  { equipmentId: "EQ-TH-001", make: "CAT", model: "TL1255D", year: 2024, meter: 200, price: "$195,000", city: "Tampa", state: "FL", category: "TELEHANDLERS" },
  { equipmentId: "EQ-TH-002", make: "JCB", model: "540-170", year: 2023, meter: 1100, price: "$135,000", city: "Dallas", state: "TX", category: "TELEHANDLERS" },
  { equipmentId: "EQ-MG-001", make: "CAT", model: "14M3", year: 2023, meter: 2200, price: "$480,000", city: "Austin", state: "TX", category: "MOTOR GRADERS" },
  { equipmentId: "EQ-MG-002", make: "DEERE", model: "872GP", year: 2022, meter: 3500, price: "$345,000", city: "San Antonio", state: "TX", category: "MOTOR GRADERS" },
  { equipmentId: "EQ-OHT-001", make: "CAT", model: "773G", year: 2022, meter: 4200, price: "$890,000", city: "Georgetown", state: "TX", category: "OFF-HIGHWAY TRUCKS" },
  { equipmentId: "EQ-OHT-002", make: "CAT", model: "777G", year: 2023, meter: 1800, price: "$1,450,000", city: "Victoria", state: "TX", category: "OFF-HIGHWAY TRUCKS" },
  { equipmentId: "EQ-BH-001", make: "CAT", model: "420 XE", year: 2024, meter: 350, price: "$145,000", city: "Tampa", state: "FL", category: "BACKHOES" },
  { equipmentId: "EQ-BH-002", make: "DEERE", model: "410L", year: 2023, meter: 800, price: "$125,000", city: "Houston", state: "TX", category: "BACKHOES" },
  { equipmentId: "EQ-CP-001", make: "CAT", model: "CS56B", year: 2023, meter: 600, price: "$215,000", city: "Austin", state: "TX", category: "COMPACTORS" },
  { equipmentId: "EQ-SS-001", make: "CAT", model: "259D3", year: 2024, meter: 150, price: "$78,000", city: "Tampa", state: "FL", category: "SKIDSTEER" },
  { equipmentId: "EQ-SS-002", make: "BOBCAT", model: "T870", year: 2023, meter: 500, price: "$85,000", city: "Miami", state: "FL", category: "SKIDSTEER" },
  { equipmentId: "EQ-PL-001", make: "CAT", model: "PL61", year: 2022, meter: 2500, price: "$725,000", city: "Houston", state: "TX", category: "PIPELAYERS" },
  { equipmentId: "EQ-TD-001", make: "CAT", model: "D5", year: 2024, meter: 400, price: "$295,000", city: "Georgetown", state: "TX", category: "TRACK DOZERS" },
  { equipmentId: "EQ-TD-002", make: "CAT", model: "973D", year: 2022, meter: 3100, price: "$385,000", city: "Dallas", state: "TX", category: "TRACK DOZERS" },
  { equipmentId: "EQ-AP-001", make: "CAT", model: "AP1000F", year: 2023, meter: 1800, price: "$545,000", city: "Tampa", state: "FL", category: "ASPHALT PAVERS" },
  { equipmentId: "EQ-AP-002", make: "CAT", model: "AP600F", year: 2022, meter: 2400, price: "$385,000", city: "Houston", state: "TX", category: "ASPHALT PAVERS" },
  { equipmentId: "EQ-FE-001", make: "CAT", model: "568", year: 2023, meter: 2200, price: "$625,000", city: "Jacksonville", state: "FL", category: "FORESTRY EQUIPMENT" },
  { equipmentId: "EQ-FE-002", make: "CAT", model: "538", year: 2024, meter: 600, price: "$485,000", city: "Orlando", state: "FL", category: "FORESTRY EQUIPMENT" },
  { equipmentId: "EQ-CLP-001", make: "CAT", model: "PM820", year: 2023, meter: 1500, price: "$750,000", city: "San Antonio", state: "TX", category: "COLD PLANERS" },
  { equipmentId: "EQ-CLP-002", make: "CAT", model: "PM622", year: 2022, meter: 2800, price: "$520,000", city: "Austin", state: "TX", category: "COLD PLANERS" },
];

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
  { partNumber: "6Y-2987", description: "Track Roller - Double Flange", category: "undercarriage", price: "$850", compatibility: "CAT D6, D7, D8" },
  { partNumber: "6Y-5042", description: "Track Chain Assembly", category: "undercarriage", price: "$6,200", compatibility: "CAT 320, 325, 330" },
  { partNumber: "9W-6955", description: "Bucket Teeth - Heavy Duty", category: "ground-engaging-tools", price: "$95", compatibility: "CAT J-Series Adapters" },
  { partNumber: "9W-6956", description: "Bucket Adapter - Center", category: "ground-engaging-tools", price: "$280", compatibility: "CAT 320-390 Excavators" },
  { partNumber: "4J-0524", description: "Cutting Edge - Loader", category: "ground-engaging-tools", price: "$450", compatibility: "CAT 950, 966 Loaders" },
  { partNumber: "110-6326", description: "ECM - Engine Control Module", category: "electrical-and-electronics", price: "$5,200", compatibility: "CAT C13 ACERT" },
  { partNumber: "320-3563", description: "Wiring Harness - Main Chassis", category: "electrical-and-electronics", price: "$2,800", compatibility: "CAT 349 Excavator" },
  { partNumber: "8C-3146", description: "Hydraulic Hose Assembly - High Pressure", category: "hoses-and-tubes", price: "$185", compatibility: "CAT Excavators" },
  { partNumber: "8C-6862", description: "Hydraulic Hose - Return Line", category: "hoses-and-tubes", price: "$125", compatibility: "CAT 320-390 Excavators" },
  { partNumber: "GP-KIT-001", description: "Major Overhaul Kit - Engine", category: "upgrades-repair-kits", price: "$8,500", compatibility: "CAT C13" },
  { partNumber: "GP-KIT-002", description: "Hydraulic Seal Kit - Boom Cylinder", category: "upgrades-repair-kits", price: "$420", compatibility: "CAT 336, 349" },
  { partNumber: "GP-KIT-003", description: "Undercarriage Rebuild Kit", category: "upgrades-repair-kits", price: "$18,000", compatibility: "CAT D6T" },
  { partNumber: "194-6725", description: "Quick Coupler - Hydraulic", category: "attachments", price: "$4,800", compatibility: "CAT 320-336 Excavators" },
  { partNumber: "259-4741", description: "GP Bucket 72\" - Loader", category: "attachments", price: "$5,200", compatibility: "CAT 950, 962, 966" },
  { partNumber: "371-3592", description: "Ripper Assembly - Single Shank", category: "attachments", price: "$15,000", compatibility: "CAT D6T, D7E" },
  { partNumber: "1R-1808", description: "Air Filter - Primary", category: "filters-and-fluids", price: "$85", compatibility: "CAT C9, C13, C15" },
  { partNumber: "1R-1809", description: "Air Filter - Secondary", category: "filters-and-fluids", price: "$55", compatibility: "CAT C9, C13, C15" },
  { partNumber: "3E-4382", description: "Hydraulic Control Valve", category: "hydraulics", price: "$3,600", compatibility: "CAT 336, 349" },
  { partNumber: "7X-0324", description: "Injector Assembly - Fuel", category: "engine", price: "$1,850", compatibility: "CAT C13 ACERT" },
  { partNumber: "2354512", description: "Idler Assembly - Front", category: "undercarriage", price: "$1,400", compatibility: "CAT D6, D7" },
  { partNumber: "2354513", description: "Carrier Roller Assembly", category: "undercarriage", price: "$650", compatibility: "CAT 320, 325, 330" },
  { partNumber: "178-6539", description: "Alternator 24V 95A", category: "electrical-and-electronics", price: "$980", compatibility: "CAT C7-C15 Engines" },
  { partNumber: "3T-5760", description: "Starter Motor 24V", category: "electrical-and-electronics", price: "$1,450", compatibility: "CAT C9, C13 Engines" },
  { partNumber: "8D-4765", description: "Axle Shaft - Rear", category: "drivetrain", price: "$2,800", compatibility: "CAT 725, 730 Trucks" },
  { partNumber: "1U-3352", description: "End Bit - LH", category: "ground-engaging-tools", price: "$320", compatibility: "CAT D6, D7 Dozers" },
  { partNumber: "1U-3353", description: "End Bit - RH", category: "ground-engaging-tools", price: "$320", compatibility: "CAT D6, D7 Dozers" },
  { partNumber: "6I-2503", description: "Hydraulic Tube - Pressure", category: "hoses-and-tubes", price: "$210", compatibility: "CAT 950, 966 Loaders" },
  { partNumber: "GP-KIT-004", description: "Transmission Rebuild Kit", category: "upgrades-repair-kits", price: "$14,500", compatibility: "CAT 950, 966" },
  { partNumber: "252-5361", description: "Thumb Attachment - Hydraulic", category: "attachments", price: "$6,800", compatibility: "CAT 336, 349 Excavators" },
  { partNumber: "301-4488", description: "Pallet Fork Set 48\"", category: "attachments", price: "$3,200", compatibility: "CAT Wheel Loaders" },
];

export async function seedDatabase() {
  try {
    const [existing] = await db.select({ count: sql<number>`count(*)` }).from(equipment);
    if (Number(existing.count) > 0) {
      console.log("Database already seeded, skipping.");
      return;
    }

    console.log("Seeding database...");

    const equipmentWithImages = equipmentData.map((item, i) => ({
      ...item,
      imageUrl: equipmentImages[i % equipmentImages.length],
    }));

    await db.insert(equipment).values(equipmentWithImages);
    console.log(`Inserted ${equipmentWithImages.length} equipment items.`);

    await db.insert(parts).values(partsData);
    console.log(`Inserted ${partsData.length} parts.`);

    console.log("Seeding complete.");
  } catch (error) {
    console.error("Seeding error:", error);
  }
}
