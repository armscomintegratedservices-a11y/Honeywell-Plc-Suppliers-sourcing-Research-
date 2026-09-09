/**
 * HoneyWell Plc - Supplier Sourcing & Research Aggregations & Metrics Engine
 *
 * This module houses all mathematical transformations, KPI computations,
 * surrogate Supplier ID generation/validation, spend modeling, and analytical helpers.
 */

import {
  RawSupplierRecord,
  SupplierDimensionRecord,
  FilterState,
  SpendSettings,
  NineSpendKpis,
  MarketCompetitivenessItem,
} from "../types";

/**
 * Assigns or validates surrogate Supplier IDs.
 * Requirement:
 * - Assign IDs alphabetically by distinct Supplier name (format SUP-001, SUP-002, ...)
 * - Guarantee one ID per unique name and no duplicates
 * - If an existing Supplier ID column is present, validate and flag inconsistencies:
 *   e.g. same name mapped to two different IDs, or one ID shared by two names.
 */
export function processSupplierIds(records: RawSupplierRecord[]): {
  processedRecords: RawSupplierRecord[];
  issues: string[];
  supplierToIdMap: Map<string, string>;
} {
  const issues: string[] = [];

  // 1. Collect unique distinct supplier names and sort them alphabetically
  const uniqueNames = Array.from(new Set(records.map((r) => r.supplier.trim()))).filter(Boolean);
  uniqueNames.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

  // 2. Generate deterministic alphabetical mapping SUP-001, SUP-002...
  const supplierToIdMap = new Map<string, string>();
  uniqueNames.forEach((name, index) => {
    const seq = String(index + 1).padStart(3, "0");
    supplierToIdMap.set(name, `SUP-${seq}`);
  });

  // 3. Validation checks on incoming supplier IDs (if provided)
  const incomingNameToIds = new Map<string, Set<string>>();
  const incomingIdToNames = new Map<string, Set<string>>();

  records.forEach((r) => {
    const sName = r.supplier.trim();
    const sId = r.supplierId?.trim();
    if (sName && sId) {
      if (!incomingNameToIds.has(sName)) incomingNameToIds.set(sName, new Set());
      incomingNameToIds.get(sName)!.add(sId);

      if (!incomingIdToNames.has(sId)) incomingIdToNames.set(sId, new Set());
      incomingIdToNames.get(sId)!.add(sName);
    }
  });

  incomingNameToIds.forEach((ids, name) => {
    if (ids.size > 1) {
      issues.push(`Supplier '${name}' has multiple incoming IDs: ${Array.from(ids).join(", ")}`);
    }
  });

  incomingIdToNames.forEach((names, id) => {
    if (names.size > 1) {
      issues.push(`ID '${id}' is shared by multiple suppliers: ${Array.from(names).join(", ")}`);
    }
  });

  // 4. Standardize records with the guaranteed deterministic Supplier ID
  const processedRecords = records.map((r) => {
    const cleanSupplier = r.supplier.trim();
    const deterministicId = supplierToIdMap.get(cleanSupplier) || r.supplierId || "SUP-999";
    return {
      ...r,
      supplier: cleanSupplier,
      supplierId: deterministicId,
    };
  });

  return { processedRecords, issues, supplierToIdMap };
}

/**
 * Calculates Estimated Spend for a single RawSupplierRecord.
 *
 * Section 4 Data Assumption:
 * The dataset is a sourcing/research dataset with no actual purchase order field.
 * Default: Estimated Monthly Spend Potential = Price/kg × Capacity t/mo × 1000 (tonnes -> kg)
 * Admin override options:
 * - "moq": Price/kg × MOQ kg (minimum order value)
 * - "actual": Price/kg × Actual Quantity Purchased (from custom settings)
 */
export function calculateRecordSpend(record: RawSupplierRecord, settings: SpendSettings): number {
  const price = record.pricePerKg || 0;

  switch (settings.basis) {
    case "moq":
      // Spend basis = Minimum Order Quantity cost
      return price * (record.moqKg || 0);

    case "actual": {
      // Spend basis = Custom or actual purchased quantity in kg
      const customQty = settings.actualQuantities[record.supplierId];
      if (customQty !== undefined && customQty > 0) {
        return price * customQty;
      }
      // Fallback: 50% capacity utilization if not set
      return price * (record.capacityTonsMonth || 0) * 1000 * 0.5;
    }

    case "capacity":
    default:
      // Default: Full Monthly Capacity Potential
      // Formula: Price/kg * Capacity in Tonnes * 1,000 kg/Tonne
      return price * (record.capacityTonsMonth || 0) * 1000;
  }
}

/**
 * Pre-aggregates the Supplier Dimension from raw records.
 * One row per distinct Supplier ID, preventing double-counting across multiple product listings.
 */
export function computeSupplierDimension(
  records: RawSupplierRecord[],
  settings: SpendSettings
): SupplierDimensionRecord[] {
  const map = new Map<string, RawSupplierRecord[]>();

  records.forEach((r) => {
    if (!map.has(r.supplierId)) {
      map.set(r.supplierId, []);
    }
    map.get(r.supplierId)!.push(r);
  });

  const dimension: SupplierDimensionRecord[] = [];

  map.forEach((items, supplierId) => {
    const supplierName = items[0].supplier;
    const market = items[0].market;
    const productListings = items.length;

    let totalPrice = 0;
    let totalQuality = 0;
    let totalReliability = 0;
    let totalScore = 0;
    let totalCapacity = 0;
    let qualifiedCount = 0;
    let activeCount = 0;
    let certOkCount = 0;
    let deliveryOkCount = 0;
    let totalSpend = 0;

    const categoriesSet = new Set<string>();
    const productsSet = new Set<string>();

    items.forEach((r) => {
      totalPrice += r.pricePerKg || 0;
      totalQuality += r.qualityPct || 0;
      totalReliability += r.reliabilityPct || 0;
      totalScore += r.supplierScore || 0;
      totalCapacity += r.capacityTonsMonth || 0;
      totalSpend += calculateRecordSpend(r, settings);

      if (r.qualification === "Qualified") qualifiedCount++;
      if (r.status === "Active") activeCount++;
      if (r.certOk === "Yes") certOkCount++;
      if (r.deliveryOk === "Yes") deliveryOkCount++;

      if (r.category) categoriesSet.add(r.category);
      if (r.product) productsSet.add(r.product);
    });

    // Overall qualification: Qualified if at least 1 qualified listing and no disqualified, or majority qualified
    let overallQualification: "Qualified" | "Review" | "Disqualified" = "Review";
    if (qualifiedCount === productListings && productListings > 0) {
      overallQualification = "Qualified";
    } else if (items.some((i) => i.qualification === "Disqualified")) {
      overallQualification = "Disqualified";
    } else if (qualifiedCount > 0) {
      overallQualification = "Qualified";
    }

    dimension.push({
      supplierId,
      supplierName,
      market,
      productListings,
      avgPricePerKg: productListings > 0 ? totalPrice / productListings : 0,
      avgQualityPct: productListings > 0 ? totalQuality / productListings : 0,
      avgReliabilityPct: productListings > 0 ? totalReliability / productListings : 0,
      avgSupplierScore: productListings > 0 ? totalScore / productListings : 0,
      qualifiedListings: qualifiedCount,
      activeListings: activeCount,
      totalCapacityTonsMonth: totalCapacity,
      categories: Array.from(categoriesSet),
      products: Array.from(productsSet),
      certOkCount,
      deliveryOkCount,
      overallQualification,
      overallStatus: activeCount > 0 ? "Active" : "Inactive",
      estimatedSpendPotential: totalSpend,
    });
  });

  // Sort by average supplier score descending
  dimension.sort((a, b) => b.avgSupplierScore - a.avgSupplierScore);
  return dimension;
}

/**
 * Applies multi-select filters and search terms globally to the dataset.
 */
export function applyFilters(
  records: RawSupplierRecord[],
  filters: FilterState
): RawSupplierRecord[] {
  return records.filter((r) => {
    // Market filter
    if (filters.market.length > 0 && !filters.market.includes(r.market)) {
      return false;
    }
    // Category filter
    if (filters.category.length > 0 && !filters.category.includes(r.category)) {
      return false;
    }
    // Product filter
    if (filters.product.length > 0 && !filters.product.includes(r.product)) {
      return false;
    }
    // Supplier filter
    if (filters.supplier.length > 0 && !filters.supplier.includes(r.supplier)) {
      return false;
    }
    // Qualification filter
    if (filters.qualification.length > 0 && !filters.qualification.includes(r.qualification)) {
      return false;
    }
    // Certification filter: match if the record holds any of the selected certifications
    if (filters.certification.length > 0) {
      const heldCerts = (r.certification || "")
        .split(";")
        .map((c) => c.trim())
        .filter(Boolean);
      const matchesCert = filters.certification.some((c) => heldCerts.includes(c));
      if (!matchesCert) return false;
    }
    // Status filter
    if (filters.status.length > 0 && !filters.status.includes(r.status)) {
      return false;
    }
    // Text search filter across multiple fields
    if (filters.search && filters.search.trim() !== "") {
      const q = filters.search.toLowerCase().trim();
      const match =
        r.supplier.toLowerCase().includes(q) ||
        r.supplierId.toLowerCase().includes(q) ||
        r.product.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.market.toLowerCase().includes(q) ||
        r.origin.toLowerCase().includes(q) ||
        r.certification.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });
}

/**
 * Computes the 9 Spend & Cost Analysis KPIs from filtered records.
 *
 * 1. Highest Spend Supplier
 * 2. Lowest Spend Supplier (among Active/Qualified suppliers)
 * 3. Total Cost of Production
 * 4. Average Lead Time
 * 5. Average Reliability %
 * 6. Average Supplier Score
 * 7. Qualified Supplier Rate
 * 8. Certification Compliance Rate
 * 9. Supplier Concentration Risk
 */
export function computeNineSpendKpis(
  filteredRecords: RawSupplierRecord[],
  settings: SpendSettings
): NineSpendKpis {
  if (filteredRecords.length === 0) {
    return {
      highestSpendSupplier: { name: "N/A", id: "N/A", spend: 0 },
      lowestSpendSupplier: { name: "N/A", id: "N/A", spend: 0 },
      totalCostOfProduction: 0,
      avgLeadDays: 0,
      avgReliabilityPct: 0,
      avgSupplierScore: 0,
      qualifiedSupplierRate: 0,
      certComplianceRate: 0,
      supplierConcentrationRisk: 0,
      isConcentrationAboveThreshold: false,
      top3Suppliers: [],
      avgProductsSuppliedPerMonth: 0,
      distinctProductsCount: 0,
      avgProductsPerSupplier: 0,
      totalMonthlyCapacityTons: 0,
    };
  }

  // Aggregate spend per supplier ID
  const supplierSpendMap = new Map<string, { name: string; spend: number; isActiveQualified: boolean }>();

  let totalProductionCost = 0;
  let sumLeadDays = 0;
  let sumReliability = 0;
  let sumSupplierScore = 0;
  let certOkCount = 0;

  filteredRecords.forEach((r) => {
    const spend = calculateRecordSpend(r, settings);
    totalProductionCost += spend;
    sumLeadDays += r.leadDays || 0;
    sumReliability += r.reliabilityPct || 0;
    sumSupplierScore += r.supplierScore || 0;
    if (r.certOk === "Yes") certOkCount++;

    const isActiveQualified = r.status === "Active" && r.qualification === "Qualified";

    if (!supplierSpendMap.has(r.supplierId)) {
      supplierSpendMap.set(r.supplierId, {
        name: r.supplier,
        spend: 0,
        isActiveQualified,
      });
    }
    const cur = supplierSpendMap.get(r.supplierId)!;
    cur.spend += spend;
    if (isActiveQualified) {
      cur.isActiveQualified = true;
    }
  });

  const allSuppliers = Array.from(supplierSpendMap.entries()).map(([id, val]) => ({
    id,
    name: val.name,
    spend: val.spend,
    isActiveQualified: val.isActiveQualified,
  }));

  // Sort by spend descending
  allSuppliers.sort((a, b) => b.spend - a.spend);

  // 1. Highest Spend Supplier
  const highest = allSuppliers[0] || { name: "N/A", id: "N/A", spend: 0 };

  // 2. Lowest Spend Supplier among Active / Qualified
  const activeQualifiedSuppliers = allSuppliers.filter((s) => s.isActiveQualified);
  const lowest =
    activeQualifiedSuppliers.length > 0
      ? activeQualifiedSuppliers[activeQualifiedSuppliers.length - 1]
      : allSuppliers[allSuppliers.length - 1] || { name: "N/A", id: "N/A", spend: 0 };

  // 3. Total Cost of Production
  const totalCost = totalProductionCost;

  // 4. Average Lead Time
  const avgLead = sumLeadDays / filteredRecords.length;

  // 5. Average Reliability %
  const avgRel = sumReliability / filteredRecords.length;

  // 6. Average Supplier Score
  const avgScore = sumSupplierScore / filteredRecords.length;

  // 7. Qualified Supplier Rate & Monthly Products Metrics
  const distinctSupplierIds = new Set<string>();
  const qualifiedSupplierIds = new Set<string>();
  const distinctProducts = new Set<string>();
  let totalMonthlyCapacityTons = 0;

  filteredRecords.forEach((r) => {
    distinctSupplierIds.add(r.supplierId);
    if (r.qualification === "Qualified") {
      qualifiedSupplierIds.add(r.supplierId);
    }
    if (r.product) {
      distinctProducts.add(r.product.trim());
    }
    totalMonthlyCapacityTons += r.capacityTonsMonth || 0;
  });

  const qualRate =
    distinctSupplierIds.size > 0
      ? (qualifiedSupplierIds.size / distinctSupplierIds.size) * 100
      : 0;

  const distinctProductsCount = distinctProducts.size;
  const avgProductsPerSupplier =
    distinctSupplierIds.size > 0 ? filteredRecords.length / distinctSupplierIds.size : 0;
  const avgProductsSuppliedPerMonth = distinctProductsCount;

  // 8. Certification Compliance Rate: % of records where Cert OK = "Yes"
  const certRate = (certOkCount / filteredRecords.length) * 100;

  // 9. Supplier Concentration Risk: % of Total Cost of Production held by top 3 suppliers
  const top3 = allSuppliers.slice(0, 3);
  const top3Spend = top3.reduce((sum, s) => sum + s.spend, 0);
  const concentrationRisk = totalCost > 0 ? (top3Spend / totalCost) * 100 : 0;
  const isAboveThreshold = concentrationRisk > settings.concentrationThreshold;

  const top3WithPct = top3.map((s) => ({
    ...s,
    pctOfTotal: totalCost > 0 ? (s.spend / totalCost) * 100 : 0,
  }));

  return {
    highestSpendSupplier: { name: highest.name, id: highest.id, spend: highest.spend },
    lowestSpendSupplier: { name: lowest.name, id: lowest.id, spend: lowest.spend },
    totalCostOfProduction: totalCost,
    avgLeadDays: avgLead,
    avgReliabilityPct: avgRel,
    avgSupplierScore: avgScore,
    qualifiedSupplierRate: qualRate,
    certComplianceRate: certRate,
    supplierConcentrationRisk: concentrationRisk,
    isConcentrationAboveThreshold: isAboveThreshold,
    top3Suppliers: top3WithPct,
    avgProductsSuppliedPerMonth,
    distinctProductsCount,
    avgProductsPerSupplier,
    totalMonthlyCapacityTons,
  };
}

/**
 * Computes Market Competitiveness analysis for Management Question #5.
 * Compares average Price/kg, Quality %, Demand Index, Customer Quality %, and Complaints % by Market/Category.
 */
export function computeMarketCompetitiveness(
  records: RawSupplierRecord[]
): MarketCompetitivenessItem[] {
  const groups = new Map<string, RawSupplierRecord[]>();

  records.forEach((r) => {
    const key = `${r.market}___${r.category}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(r);
  });

  // Calculate overall dataset benchmark for comparisons
  let overallSumPrice = 0;
  let overallSumQuality = 0;
  records.forEach((r) => {
    overallSumPrice += r.pricePerKg || 0;
    overallSumQuality += r.qualityPct || 0;
  });
  const overallAvgPrice = records.length > 0 ? overallSumPrice / records.length : 800;
  const overallAvgQuality = records.length > 0 ? overallSumQuality / records.length : 80;

  const result: MarketCompetitivenessItem[] = [];

  groups.forEach((items, key) => {
    const [market, category] = key.split("___");
    const count = items.length;

    let sumPrice = 0;
    let sumQuality = 0;
    let sumDemand = 0;
    let sumCustQuality = 0;
    let sumComplaints = 0;
    let qualCount = 0;

    items.forEach((r) => {
      sumPrice += r.pricePerKg || 0;
      sumQuality += r.qualityPct || 0;
      sumDemand += r.demandIndex || 0;
      sumCustQuality += r.customerQualityPct || 0;
      sumComplaints += r.complaintsPct || 0;
      if (r.qualification === "Qualified") qualCount++;
    });

    const avgPrice = sumPrice / count;
    const avgQual = sumQuality / count;

    // A sourcing market is an Opportunity if Price is <= 90% of benchmark and Quality >= 85%
    const isPotentialOpportunity = avgPrice < overallAvgPrice * 0.95 && avgQual >= 85;

    // A sourcing market is Suboptimal if Price is higher than benchmark AND Quality is lower than benchmark
    const isSuboptimalSourcing = avgPrice > overallAvgPrice * 1.05 && avgQual < overallAvgQuality;

    result.push({
      market,
      category,
      avgPricePerKg: avgPrice,
      avgQualityPct: avgQual,
      avgDemandIndex: sumDemand / count,
      avgCustomerQualityPct: sumCustQuality / count,
      avgComplaintsPct: sumComplaints / count,
      supplierCount: count,
      qualifiedCount: qualCount,
      isPotentialOpportunity,
      isSuboptimalSourcing,
    });
  });

  // Sort by category then market
  result.sort((a, b) => a.category.localeCompare(b.category) || a.market.localeCompare(b.market));
  return result;
}

/**
 * "Find Alternatives" Tool (Management Question #2):
 * Given a supplier or a product/category, finds alternative suppliers
 * offering the same Product or Category with Qualification = "Qualified" and Status = "Active",
 * sorted by Supplier Score descending, excluding the current supplier.
 */
export function findAlternativeSuppliers(
  records: RawSupplierRecord[],
  currentSupplierId: string,
  targetProduct?: string,
  targetCategory?: string
): RawSupplierRecord[] {
  return records
    .filter((r) => {
      // Must not be the same supplier
      if (r.supplierId === currentSupplierId) return false;

      // Must be Active and Qualified
      if (r.status !== "Active" || r.qualification !== "Qualified") return false;

      // Match product if specified, otherwise match category
      if (targetProduct) {
        return r.product.toLowerCase() === targetProduct.toLowerCase();
      }
      if (targetCategory) {
        return r.category.toLowerCase() === targetCategory.toLowerCase();
      }
      return true;
    })
    .sort((a, b) => (b.supplierScore || 0) - (a.supplierScore || 0));
}

/**
 * Creates a compact aggregated payload for the Gemini API.
 * Contains only non-PII aggregate summaries to protect data privacy.
 */
export function buildCompactSummaryForAi(
  filteredRecords: RawSupplierRecord[],
  kpis: NineSpendKpis,
  settings: SpendSettings
) {
  // Aggregate spend by market
  const marketMap = new Map<string, { spend: number; count: number; qualified: number }>();
  filteredRecords.forEach((r) => {
    if (!marketMap.has(r.market)) {
      marketMap.set(r.market, { spend: 0, count: 0, qualified: 0 });
    }
    const cur = marketMap.get(r.market)!;
    cur.spend += calculateRecordSpend(r, settings);
    cur.count++;
    if (r.qualification === "Qualified") cur.qualified++;
  });

  // Aggregate by category
  const categoryMap = new Map<string, { spend: number; count: number; qualified: number; avgPrice: number }>();
  filteredRecords.forEach((r) => {
    if (!categoryMap.has(r.category)) {
      categoryMap.set(r.category, { spend: 0, count: 0, qualified: 0, avgPrice: 0 });
    }
    const cur = categoryMap.get(r.category)!;
    cur.spend += calculateRecordSpend(r, settings);
    cur.avgPrice += r.pricePerKg || 0;
    cur.count++;
    if (r.qualification === "Qualified") cur.qualified++;
  });

  const categories = Array.from(categoryMap.entries()).map(([name, val]) => ({
    name,
    count: val.count,
    qualified: val.qualified,
    avgPricePerKg: Math.round(val.avgPrice / val.count),
    spendEst: Math.round(val.spend),
  }));

  const markets = Array.from(marketMap.entries()).map(([name, val]) => ({
    name,
    supplierRows: val.count,
    qualifiedRows: val.qualified,
    spendEst: Math.round(val.spend),
  }));

  return {
    totalRecords: filteredRecords.length,
    totalMarkets: marketMap.size,
    totalCategories: categoryMap.size,
    spendBasisUsed: settings.basis,
    totalSpend: Math.round(kpis.totalCostOfProduction),
    avgLeadDays: parseFloat(kpis.avgLeadDays.toFixed(1)),
    avgReliability: parseFloat(kpis.avgReliabilityPct.toFixed(1)),
    avgSupplierScore: parseFloat(kpis.avgSupplierScore.toFixed(1)),
    qualifiedRate: parseFloat(kpis.qualifiedSupplierRate.toFixed(1)),
    certComplianceRate: parseFloat(kpis.certComplianceRate.toFixed(1)),
    concentrationRisk: parseFloat(kpis.supplierConcentrationRisk.toFixed(1)),
    top3ConcentrationSuppliers: kpis.top3Suppliers.map((s) => ({
      name: s.name,
      sharePct: parseFloat(s.pctOfTotal.toFixed(1)),
    })),
    categoriesOverview: categories.slice(0, 10),
    topMarkets: markets.sort((a, b) => b.supplierRows - a.supplierRows).slice(0, 8),
    disqualifiedOrReviewCount: filteredRecords.filter((r) => r.qualification !== "Qualified").length,
  };
}
