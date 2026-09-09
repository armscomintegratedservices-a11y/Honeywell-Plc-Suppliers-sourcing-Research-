/**
 * HoneyWell Plc - Monthly Procurement Dynamics & Sourcing Intelligence (Jan - Sept 2026)
 *
 * Models Nigerian agricultural commodity seasons, logistics weather factors,
 * farm-gate harvest cycles, and macro spend dynamics across 2026.
 */

import { RawSupplierRecord } from "../types";

export interface MonthProfile {
  month: string;
  shortName: string;
  index: number; // 0 for Jan, 8 for Sep
  quarter: "Q1" | "Q2" | "Q3";
  seasonTitle: string;
  seasonBadge: string;
  seasonType:
    | "harvest_glut"
    | "dry_transit"
    | "pre_plant"
    | "rain_onset"
    | "lean_season"
    | "peak_lean"
    | "monsoon_transit"
    | "early_crop"
    | "q3_benchmark";
  priceIndex: number; // Multiplier relative to Sept 2026 baseline (e.g. 0.91 = 9% cheaper)
  leadDaysDelta: number; // Days added/subtracted to transit lead time
  capacityMultiplier: number; // Available supplier monthly capacity factor
  reliabilityDeltaPct: number; // Delivery reliability shift in percentage points
  demandIndexDelta: number; // Shift in downstream demand index
  weatherTransitRisk: "Optimal" | "Good" | "Moderate" | "Challenging" | "Severe";
  weatherDescription: string;
  keyCommodityNotes: string;
  recommendedStrategy: string;
  baselineProcurementTargetNgn: number;
}

export interface MonthCustomInputs {
  customPriceDeltaPct: number; // user custom shift in % (e.g. -5 to +10)
  customLeadDaysDelta: number; // user custom shift in days (e.g. -2 to +3)
  customCapacityMultiplier: number; // user custom capacity multiplier (e.g. 0.8 to 1.25)
  customTargetBudgetNgn?: number; // user custom target budget in NGN
}

export const MONTH_PROFILES: Record<string, MonthProfile> = {
  "January 2026": {
    month: "January 2026",
    shortName: "Jan",
    index: 0,
    quarter: "Q1",
    seasonTitle: "Post-Harvest Grain Glut & Dry Corridors",
    seasonBadge: "🌾 Post-Harvest Glut",
    seasonType: "harvest_glut",
    priceIndex: 0.91, // 9% discount compared to baseline
    leadDaysDelta: -1.0, // 1 day faster delivery due to dry weather
    capacityMultiplier: 1.12, // 12% higher supply volume
    reliabilityDeltaPct: +2.8,
    demandIndexDelta: -7,
    weatherTransitRisk: "Optimal",
    weatherDescription: "Dry harmattan season; minimal transit bottlenecks on Northern trunk roads.",
    keyCommodityNotes:
      "High grain availability in Kano, Kaduna, and Niger. Best window for annual bulk Maize, Sorghum, and Soya Beans intake.",
    recommendedStrategy:
      "Maximize bulk forward contracts; lock in sub-₦600/kg maize from Tier-1 suppliers.",
    baselineProcurementTargetNgn: 4050000000,
  },
  "February 2026": {
    month: "February 2026",
    shortName: "Feb",
    index: 1,
    quarter: "Q1",
    seasonTitle: "Dry Season Logistics & Warehouse Influx",
    seasonBadge: "🚛 Dry Transit Flow",
    seasonType: "dry_transit",
    priceIndex: 0.93,
    leadDaysDelta: -0.8,
    capacityMultiplier: 1.09,
    reliabilityDeltaPct: +2.2,
    demandIndexDelta: -4,
    weatherTransitRisk: "Optimal",
    weatherDescription: "Firm road conditions; high truck turnaround on Lagos-Kano transit corridor.",
    keyCommodityNotes:
      "Steady moisture content in stored grains; Oilseeds (Soya, Groundnut) flowing steadily from Benue & Plateau.",
    recommendedStrategy:
      "Finalize Q1 strategic reserves; enforce SON/NAFDAC inspection at receiving silo bays.",
    baselineProcurementTargetNgn: 4150000000,
  },
  "March 2026": {
    month: "March 2026",
    shortName: "Mar",
    index: 2,
    quarter: "Q1",
    seasonTitle: "Pre-Planting Inventory Drawdown",
    seasonBadge: "📦 Stock Drawdown",
    seasonType: "pre_plant",
    priceIndex: 0.96,
    leadDaysDelta: -0.5,
    capacityMultiplier: 1.05,
    reliabilityDeltaPct: +1.2,
    demandIndexDelta: -1,
    weatherTransitRisk: "Good",
    weatherDescription: "Late dry season; occasional localized dust hazes in Middle Belt.",
    keyCommodityNotes:
      "Farm gate reserves beginning to diminish as smallholders retain seed grain for upcoming April planting.",
    recommendedStrategy:
      "Review supplier MOQ adherence; secure commitments for Cassava Flour and Garri processors.",
    baselineProcurementTargetNgn: 4280000000,
  },
  "April 2026": {
    month: "April 2026",
    shortName: "Apr",
    index: 3,
    quarter: "Q2",
    seasonTitle: "Early Rain Onset in Southern Hubs",
    seasonBadge: "🌦️ Rain Onset",
    seasonType: "rain_onset",
    priceIndex: 0.99,
    leadDaysDelta: 0.0,
    capacityMultiplier: 1.01,
    reliabilityDeltaPct: +0.2,
    demandIndexDelta: +2,
    weatherTransitRisk: "Moderate",
    weatherDescription: "Early showers in Ogun, Lagos, and Ondo; diesel fuel freight rates firming up.",
    keyCommodityNotes:
      "Early planting underway in South-West. Grain prices firming up slightly as transit times align to baseline.",
    recommendedStrategy:
      "Audit logistics carriers; maintain dual-sourcing across North-Central and South-West hubs.",
    baselineProcurementTargetNgn: 4390000000,
  },
  "May 2026": {
    month: "May 2026",
    shortName: "May",
    index: 4,
    quarter: "Q2",
    seasonTitle: "Lean Season Influx & Price Escalation",
    seasonBadge: "⚠️ Lean Season",
    seasonType: "lean_season",
    priceIndex: 1.04, // 4% higher than baseline
    leadDaysDelta: +0.5,
    capacityMultiplier: 0.96,
    reliabilityDeltaPct: -1.2,
    demandIndexDelta: +6,
    weatherTransitRisk: "Moderate",
    weatherDescription: "Frequent rain in Southern processing zones; slight depot unloading delays.",
    keyCommodityNotes:
      "Open-market grain reserves thinning; market prices ticking upward across Dawanau and Bodija markets.",
    recommendedStrategy:
      "Prioritize Qualified suppliers with guaranteed inventory; verify pre-booked forward volume.",
    baselineProcurementTargetNgn: 4620000000,
  },
  "June 2026": {
    month: "June 2026",
    shortName: "Jun",
    index: 5,
    quarter: "Q2",
    seasonTitle: "Peak Lean Season & High Demand Index",
    seasonBadge: "⚡ Peak Lean Season",
    seasonType: "peak_lean",
    priceIndex: 1.08, // 8% above baseline
    leadDaysDelta: +0.9,
    capacityMultiplier: 0.91,
    reliabilityDeltaPct: -2.3,
    demandIndexDelta: +10,
    weatherTransitRisk: "Challenging",
    weatherDescription: "Mid-year heavy rain; occasional truck queuing at interstate border checks.",
    keyCommodityNotes:
      "Highest open-market price point of the year for white maize and oilseeds. Honeywell safety stock activated.",
    recommendedStrategy:
      "Draw down strategic buffers; avoid spot-market purchases; enforce strict delivery penalty terms.",
    baselineProcurementTargetNgn: 4810000000,
  },
  "July 2026": {
    month: "July 2026",
    shortName: "Jul",
    index: 6,
    quarter: "Q3",
    seasonTitle: "Monsoon Rainfall & Logistics Transit Delays",
    seasonBadge: "🌧️ Heavy Rains & Delays",
    seasonType: "monsoon_transit",
    priceIndex: 1.05,
    leadDaysDelta: +1.5, // 1.5 days delay due to rains & flooded roads
    capacityMultiplier: 0.94,
    reliabilityDeltaPct: -3.6,
    demandIndexDelta: +7,
    weatherTransitRisk: "Severe",
    weatherDescription: "Heavy monsoon downpours; road washouts reported on Minna-Jebba and Lokoja corridors.",
    keyCommodityNotes:
      "Logistics transit lead times reach annual peak (avg 8.3 days). Extra moisture tests mandatory for all grain deliveries.",
    recommendedStrategy:
      "Adjust delivery SLAs by +2 days; reroute shipments through Eastern corridors; inspect moisture <12%.",
    baselineProcurementTargetNgn: 4680000000,
  },
  "August 2026": {
    month: "August 2026",
    shortName: "Aug",
    index: 7,
    quarter: "Q3",
    seasonTitle: "Early Green Harvest (South-West)",
    seasonBadge: "🌱 Early Green Crop",
    seasonType: "early_crop",
    priceIndex: 1.02,
    leadDaysDelta: +0.4,
    capacityMultiplier: 1.02,
    reliabilityDeltaPct: +0.6,
    demandIndexDelta: +3,
    weatherTransitRisk: "Moderate",
    weatherDescription: "August break in southern rainfall; improved road turnaround.",
    keyCommodityNotes:
      "Early green maize harvest in Oyo, Osun, and Ogun dampens spot market price pressures. Moisture remains elevated.",
    recommendedStrategy:
      "Onboard early-crop suppliers; secure processing flours from local mills to offset transit risks.",
    baselineProcurementTargetNgn: 4540000000,
  },
  "September 2026": {
    month: "September 2026",
    shortName: "Sep",
    index: 8,
    quarter: "Q3",
    seasonTitle: "Q3 Northern Main Crop Harvest Benchmark",
    seasonBadge: "📊 Q3 Benchmark",
    seasonType: "q3_benchmark",
    priceIndex: 1.00, // Standard baseline benchmark
    leadDaysDelta: 0.0,
    capacityMultiplier: 1.00,
    reliabilityDeltaPct: 0.0,
    demandIndexDelta: 0,
    weatherTransitRisk: "Good",
    weatherDescription: "Main dry harvest transition; stable long-haul freight operations.",
    keyCommodityNotes:
      "Benchmark procurement period. Major grain harvests commencing across Kano, Kaduna, Kebbi, and Katsina.",
    recommendedStrategy:
      "Comprehensive supplier annual evaluation; benchmark market prices against contract baselines.",
    baselineProcurementTargetNgn: 4450000000,
  },
};

export const MONTH_OPTIONS = [
  "January 2026",
  "February 2026",
  "March 2026",
  "April 2026",
  "May 2026",
  "June 2026",
  "July 2026",
  "August 2026",
  "September 2026",
];

/**
 * Returns the profile for a given month, defaulting to September 2026 if not found.
 */
export function getMonthProfile(monthName: string): MonthProfile {
  return MONTH_PROFILES[monthName] || MONTH_PROFILES["September 2026"];
}

/**
 * Applies monthly dynamics and optional custom user inputs to the baseline records.
 * Returns a new dataset where price/kg, leadDays, capacity, reliability, demand,
 * and scores reflect the active month's procurement realities.
 */
export function applyMonthDynamics(
  baseRecords: RawSupplierRecord[],
  selectedMonth: string,
  customInputs?: MonthCustomInputs
): RawSupplierRecord[] {
  const profile = getMonthProfile(selectedMonth);

  // Effective price factor
  const customPriceShift = customInputs?.customPriceDeltaPct ? customInputs.customPriceDeltaPct / 100 : 0;
  const effectivePriceMultiplier = Math.max(0.6, profile.priceIndex * (1 + customPriceShift));

  // Effective lead days shift
  const customLeadShift = customInputs?.customLeadDaysDelta || 0;
  const effectiveLeadDelta = profile.leadDaysDelta + customLeadShift;

  // Effective capacity factor
  const customCapMultiplier = customInputs?.customCapacityMultiplier || 1.0;
  const effectiveCapacityMultiplier = Math.max(0.5, profile.capacityMultiplier * customCapMultiplier);

  // Effective reliability shift
  const effectiveRelDelta = profile.reliabilityDeltaPct;

  // Effective demand index shift
  const effectiveDemandDelta = profile.demandIndexDelta;

  return baseRecords.map((r, idx) => {
    // Unique deterministic seed pseudo-randomness for natural monthly variance per record
    const pseudoNoise = ((idx % 7) - 3) * 0.006;

    // Adjusted price per kg (in NGN ₦)
    const basePrice = r.pricePerKg || 500;
    const adjustedPrice = Math.round(basePrice * (effectivePriceMultiplier + pseudoNoise) * 100) / 100;

    // Adjusted lead time in days (min 2 days)
    const baseLead = r.leadDays || 7;
    const adjustedLead = Math.max(2, Math.round(baseLead + effectiveLeadDelta));

    // Adjusted monthly capacity in tonnes
    const baseCapacity = r.capacityTonsMonth || 50;
    const adjustedCapacity = Math.max(1, Math.round(baseCapacity * effectiveCapacityMultiplier));

    // Adjusted reliability %
    const baseRel = r.reliabilityPct || 80;
    const adjustedRel = Math.min(100, Math.max(45, Math.round((baseRel + effectiveRelDelta) * 10) / 10));

    // Adjusted demand index (0-100)
    const baseDemand = r.demandIndex || 50;
    const adjustedDemand = Math.min(100, Math.max(15, Math.round(baseDemand + effectiveDemandDelta)));

    // Composite supplier score adjustment based on performance shifts
    const baseScore = r.supplierScore || 65;
    const scoreShift = effectiveRelDelta * 0.4 - effectiveLeadDelta * 0.6;
    const adjustedScore = Math.min(100, Math.max(30, Math.round((baseScore + scoreShift) * 10) / 10));

    return {
      ...r,
      pricePerKg: adjustedPrice,
      leadDays: adjustedLead,
      capacityTonsMonth: adjustedCapacity,
      reliabilityPct: adjustedRel,
      demandIndex: adjustedDemand,
      supplierScore: adjustedScore,
    };
  });
}
