import React, { useState } from "react";
import { SupplierDimensionRecord, RawSupplierRecord } from "../types";
import { TopComplianceDonutChart } from "./TopComplianceDonutChart";
import {
  Award,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  Bookmark,
  Building2,
  DollarSign,
  TrendingUp,
  Filter,
} from "lucide-react";

interface SupplierScorecardTableProps {
  suppliers: SupplierDimensionRecord[];
  allRecords: RawSupplierRecord[];
  shortlist: string[];
  onToggleShortlist: (supplierId: string) => void;
  onOpenAlternatives: (record: RawSupplierRecord) => void;
}

type ScoreTier = "all" | "top" | "review" | "risk";

export const SupplierScorecardTable: React.FC<SupplierScorecardTableProps> = ({
  suppliers,
  allRecords,
  shortlist,
  onToggleShortlist,
  onOpenAlternatives,
}) => {
  const [selectedTier, setSelectedTier] = useState<ScoreTier>("all");
  const [expandedSupplierId, setExpandedSupplierId] = useState<string | null>(null);

  // Filter suppliers by selected performance tier
  const filteredSuppliers = suppliers.filter((s) => {
    if (selectedTier === "top") return s.avgSupplierScore >= 80 && s.overallQualification === "Qualified";
    if (selectedTier === "review") return s.overallQualification === "Review" || (s.avgSupplierScore >= 65 && s.avgSupplierScore < 80);
    if (selectedTier === "risk") return s.overallQualification === "Disqualified" || s.avgSupplierScore < 65;
    return true;
  });

  const toggleExpand = (supplierId: string) => {
    setExpandedSupplierId(expandedSupplierId === supplierId ? null : supplierId);
  };

  return (
    <div id="supplier-scorecard-view" className="space-y-4">
      {/* Header & Performance Tiers Filter */}
      <div className="rounded-xl border border-[#2A2740] bg-[#1B1926] p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2A2740]/60 pb-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#F5F3FA] flex items-center gap-2">
              <Award className="h-4 w-4 text-purple-400" />
              Supplier Dimension Scorecard
            </h2>
            <p className="text-xs text-[#9B95B0]">
              Aggregated supplier metrics (one row per distinct partner) answering performance & reliability criteria
            </p>
          </div>

          {/* Tier Buttons */}
          <div className="flex items-center gap-1.5 rounded-xl border border-[#2A2740] bg-[#14121F] p-1 text-xs">
            <button
              onClick={() => setSelectedTier("all")}
              className={`rounded-lg px-3 py-1 font-medium transition-all ${
                selectedTier === "all"
                  ? "bg-purple-600 text-white"
                  : "text-[#9B95B0] hover:text-[#F5F3FA]"
              }`}
            >
              All ({suppliers.length})
            </button>
            <button
              onClick={() => setSelectedTier("top")}
              className={`rounded-lg px-3 py-1 font-medium transition-all ${
                selectedTier === "top"
                  ? "bg-emerald-600 text-white"
                  : "text-[#9B95B0] hover:text-[#F5F3FA]"
              }`}
            >
              Top Tier (Score ≥ 80)
            </button>
            <button
              onClick={() => setSelectedTier("review")}
              className={`rounded-lg px-3 py-1 font-medium transition-all ${
                selectedTier === "review"
                  ? "bg-amber-600 text-white"
                  : "text-[#9B95B0] hover:text-[#F5F3FA]"
              }`}
            >
              Under Review
            </button>
            <button
              onClick={() => setSelectedTier("risk")}
              className={`rounded-lg px-3 py-1 font-medium transition-all ${
                selectedTier === "risk"
                  ? "bg-rose-600 text-white"
                  : "text-[#9B95B0] hover:text-[#F5F3FA]"
              }`}
            >
              High Risk / Action Needed
            </button>
          </div>
        </div>

        {/* Informative Guidance Banner */}
        <div className="mt-3 flex items-center justify-between rounded-lg bg-[#14121F] px-3.5 py-2 text-xs text-[#9B95B0]">
          <span>
            {selectedTier === "top" && "Showing certified high-reliability suppliers ready for procurement volume expansion."}
            {selectedTier === "risk" && "Showing suppliers with critical defects, missed certifications, or delivery flags requiring replacement."}
            {selectedTier === "review" && "Suppliers pending QA re-audit or initial trial run evaluations."}
            {selectedTier === "all" && "One consolidated row per Supplier ID, eliminating duplicate counting across product portfolios."}
          </span>
          <span className="text-purple-300 font-semibold">
            {filteredSuppliers.length} Partners Evaluated
          </span>
        </div>
      </div>

      {/* Donut Chart: Active Scorecard for First 4 Best Compliance Suppliers (2026 till Date) */}
      <TopComplianceDonutChart
        records={allRecords}
        onSelectSupplier={(id) => setExpandedSupplierId(id)}
      />

      {/* Scorecard Table */}
      <div className="rounded-xl border border-[#2A2740] bg-[#1B1926] shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#14121F] border-b border-[#2A2740] text-[11px] uppercase tracking-wider text-[#9B95B0]">
              <tr>
                <th className="py-3 px-3 w-8"></th>
                <th className="py-3 px-3">Supplier ID</th>
                <th className="py-3 px-3">Supplier Name</th>
                <th className="py-3 px-3">Market</th>
                <th className="py-3 px-3 text-center">Listings</th>
                <th className="py-3 px-3 text-right">Avg Price/kg</th>
                <th className="py-3 px-3 text-right">Avg Quality</th>
                <th className="py-3 px-3 text-right">Avg Reliability</th>
                <th className="py-3 px-3 text-right">Composite Score</th>
                <th className="py-3 px-3 text-center">Qualification</th>
                <th className="py-3 px-3 text-right">Spend Potential</th>
                <th className="py-3 px-3 text-center">Alternatives</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#232036]">
              {filteredSuppliers.map((s) => {
                const isExpanded = expandedSupplierId === s.supplierId;
                const isShortlisted = shortlist.includes(s.supplierId);
                const qualDot =
                  s.overallQualification === "Qualified"
                    ? "bg-emerald-400"
                    : s.overallQualification === "Review"
                    ? "bg-amber-400"
                    : "bg-rose-500";

                // Get product listings for this supplier
                const supplierItems = allRecords.filter((r) => r.supplierId === s.supplierId);

                return (
                  <React.Fragment key={s.supplierId}>
                    <tr className={`hover:bg-[#201D2F] transition-colors ${isExpanded ? "bg-[#201D2F]/80" : ""}`}>
                      {/* Expand Chevron */}
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => toggleExpand(s.supplierId)}
                          className="text-[#9B95B0] hover:text-[#F5F3FA]"
                          title="Expand supplier products"
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      </td>

                      {/* Supplier ID */}
                      <td className="py-3 px-3 font-mono font-bold text-purple-400">
                        {s.supplierId}
                      </td>

                      {/* Supplier Name */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onToggleShortlist(s.supplierId)}
                            title={isShortlisted ? "Remove from shortlist" : "Add to shortlist"}
                          >
                            <Bookmark
                              className={`h-3.5 w-3.5 ${
                                isShortlisted ? "text-amber-400 fill-amber-400" : "text-[#9B95B0] hover:text-amber-400"
                              }`}
                            />
                          </button>
                          <span className="font-semibold text-[#F5F3FA]">{s.supplierName}</span>
                        </div>
                      </td>

                      {/* Primary Market */}
                      <td className="py-3 px-3 text-[#9B95B0]">{s.market}</td>

                      {/* Product Listings Count */}
                      <td className="py-3 px-3 text-center">
                        <span className="rounded-full bg-[#14121F] border border-[#2A2740] px-2 py-0.5 text-[10px] font-semibold text-[#F5F3FA]">
                          {s.productListings} {s.productListings === 1 ? "item" : "items"}
                        </span>
                      </td>

                      {/* Avg Price */}
                      <td className="py-3 px-3 text-right font-medium text-[#F5F3FA]">
                        ₦{Math.round(s.avgPricePerKg).toLocaleString()}
                      </td>

                      {/* Avg Quality */}
                      <td className="py-3 px-3 text-right font-medium text-emerald-400">
                        {s.avgQualityPct.toFixed(1)}%
                      </td>

                      {/* Avg Reliability */}
                      <td className="py-3 px-3 text-right font-medium text-cyan-400">
                        {s.avgReliabilityPct.toFixed(1)}%
                      </td>

                      {/* Avg Score */}
                      <td className="py-3 px-3 text-right font-black text-purple-300">
                        {s.avgSupplierScore.toFixed(1)}
                      </td>

                      {/* Overall Qualification */}
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold bg-[#14121F] border border-[#2A2740]">
                          <span className={`h-1.5 w-1.5 rounded-full ${qualDot}`} />
                          <span className="text-[#F5F3FA]">{s.overallQualification}</span>
                        </span>
                      </td>

                      {/* Spend Potential */}
                      <td className="py-3 px-3 text-right font-bold text-[#F5F3FA]">
                        ₦{(s.estimatedSpendPotential / 1e6).toFixed(1)}M
                      </td>

                      {/* Find Alternatives Action */}
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => {
                            if (supplierItems[0]) {
                              onOpenAlternatives(supplierItems[0]);
                            }
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-purple-700/60 bg-purple-950/40 px-2.5 py-1 text-[11px] font-semibold text-purple-300 hover:bg-purple-900/60 transition-colors"
                          title="Find qualified alternative suppliers for this partner"
                        >
                          <Sparkles className="h-3 w-3" />
                          <span>Find Alts</span>
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Detail View */}
                    {isExpanded && (
                      <tr className="bg-[#151320] border-b border-[#2A2740]">
                        <td colSpan={12} className="p-4">
                          <div className="rounded-xl border border-[#2A2740] bg-[#1B1926] p-3.5 space-y-3">
                            <div className="flex items-center justify-between border-b border-[#2A2740]/60 pb-2">
                              <h4 className="text-xs font-bold text-[#F5F3FA] flex items-center gap-2">
                                <Building2 className="h-3.5 w-3.5 text-purple-400" />
                                Product Listings for {s.supplierName} ({s.supplierId})
                              </h4>
                              <span className="text-[11px] text-[#9B95B0]">
                                Categories: {s.categories.join(", ")}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                              {supplierItems.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="rounded-lg border border-[#2A2740] bg-[#14121F] p-2.5 text-xs space-y-1"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-semibold text-[#F5F3FA]">
                                      {item.product}
                                    </span>
                                    <span className="text-[10px] text-purple-400">
                                      ₦{item.pricePerKg}/kg
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between text-[11px] text-[#9B95B0]">
                                    <span>Cap: {item.capacityTonsMonth} t/mo</span>
                                    <span>Lead: {item.leadDays} days</span>
                                  </div>
                                  <div className="flex items-center justify-between text-[11px] text-[#9B95B0] pt-1 border-t border-[#232036]">
                                    <span>Cert: {item.certification || "None"}</span>
                                    <span className={item.certOk === "Yes" ? "text-emerald-400" : "text-rose-400"}>
                                      Cert: {item.certOk}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => onOpenAlternatives(item)}
                                    className="mt-1 w-full rounded bg-purple-950/60 py-1 text-[10px] font-semibold text-purple-300 hover:bg-purple-900 border border-purple-800/40 text-center block"
                                  >
                                    Find Alternatives for {item.product}
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
