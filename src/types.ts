/**
 * HoneyWell Plc - Supplier Sourcing & Research Dashboard Types
 */

export interface RawSupplierRecord {
  id?: number;                    // Product ID (repeats across suppliers offering same product)
  product: string;                // Product name (e.g. Maize Grain, Soya Beans)
  category: string;               // Product category (e.g. Maize, Oilseeds, Cereals)
  market: string;                 // Nigerian state/region where supplier operates
  origin?: string;                // Source location of raw material
  supplier: string;               // Supplier company name
  supplierId: string;             // Surrogate supplier key (SUP-###), unique per distinct supplier name
  unit?: string;                  // Unit of measure (kg)
  pricePerKg: number;             // Quoted unit price (in NGN ₦)
  qualityPct: number;             // Quality score percentage (0-100)
  leadDays: number;               // Delivery lead time in days
  reliabilityPct: number;         // Reliability score percentage (0-100)
  capacityTonsMonth: number;      // Monthly supply capacity in tonnes
  moqKg: number;                  // Minimum order quantity in kg
  spec: "Fully Match" | "Partial Match" | string; // Specification match
  specMatch?: string;             // Alias for specification match
  certification: string;          // Semicolon-separated certifications (e.g. "NAFDAC; HACCP; ISO 22000")
  certOk: "Yes" | "No";           // Certification requirement met
  deliveryOk: "Yes" | "No";       // Delivery requirement met
  status: "Active" | "Inactive";  // Operational status
  demandIndex: number;            // Relative market demand indicator (0-100)
  customerQualityPct: number;     // Downstream customer-reported quality (0-100)
  complaintsPct: number;          // Customer complaint rate percentage
  supplierScore: number;          // Composite score (0-100)
  qualification: "Qualified" | "Review" | "Disqualified"; // Procurement qualification tier
}

export interface SupplierDimensionRecord {
  supplierId: string;             // Unique join key
  supplierName: string;           // Distinct supplier name
  market: string;                 // Primary operating market
  productListings: number;        // Number of product lines provided
  avgPricePerKg: number;          // Average price across listings
  avgQualityPct: number;          // Average quality across listings
  avgReliabilityPct: number;      // Average reliability across listings
  avgSupplierScore: number;       // Average composite score
  qualifiedListings: number;      // Count of listings with Qualified status
  activeListings: number;         // Count of active listings
  totalCapacityTonsMonth: number; // Aggregate monthly capacity
  categories: string[];           // Categories covered
  products: string[];             // Products offered
  certOkCount: number;            // Listings with Cert OK = Yes
  deliveryOkCount: number;        // Listings with Delivery OK = Yes
  overallQualification: "Qualified" | "Review" | "Disqualified";
  overallStatus: "Active" | "Inactive";
  estimatedSpendPotential: number; // Spend across all supplier listings based on active formula
}

export interface FilterState {
  market: string[];
  category: string[];
  product: string[];
  supplier: string[];
  qualification: string[];
  certification: string[];
  status: string[];
  search: string;
  selectedMonth?: string;
}

export type SpendBasis = "capacity" | "moq" | "actual";

export interface SpendSettings {
  basis: SpendBasis;
  concentrationThreshold: number; // e.g. 50%
  actualQuantities: Record<string, number>; // supplierId -> custom purchase quantity in kg
}

export interface NineSpendKpis {
  highestSpendSupplier: {
    name: string;
    id: string;
    spend: number;
  };
  lowestSpendSupplier: {
    name: string;
    id: string;
    spend: number;
  };
  totalCostOfProduction: number;
  avgLeadDays: number;
  avgReliabilityPct: number;
  avgSupplierScore: number;
  qualifiedSupplierRate: number;      // percentage 0-100
  certComplianceRate: number;         // percentage 0-100
  supplierConcentrationRisk: number;  // percentage 0-100
  isConcentrationAboveThreshold: boolean;
  top3Suppliers: Array<{ id: string; name: string; spend: number; pctOfTotal: number }>;
  avgProductsSuppliedPerMonth: number; // Average products supplied per monthly cycle
  distinctProductsCount: number;       // Number of distinct products in active cycle
  avgProductsPerSupplier: number;      // Average products offered per supplier each month
  totalMonthlyCapacityTons: number;    // Aggregate monthly capacity supplied
}

export interface MarketCompetitivenessItem {
  market: string;
  category: string;
  avgPricePerKg: number;
  avgQualityPct: number;
  avgDemandIndex: number;
  avgCustomerQualityPct: number;
  avgComplaintsPct: number;
  supplierCount: number;
  qualifiedCount: number;
  isPotentialOpportunity: boolean; // Flagged if price is low & quality is high
  isSuboptimalSourcing: boolean;   // Flagged if price is high & quality is low
}

export interface AiInsightsResult {
  keyInsights: string[];
  recommendations: string[];
  riskFlags: string[];
  fallback?: boolean;
  source?: string;
}

export interface UploadValidationResult {
  valid: boolean;
  missingColumns: string[];
  extraColumns: string[];
  inconsistencies: string[];
  totalRows: number;
  distinctSuppliers: number;
  distinctSupplierIds: number;
}
