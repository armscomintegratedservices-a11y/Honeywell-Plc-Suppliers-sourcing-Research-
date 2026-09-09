import React, { useState } from "react";
import {
  FileText,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Clock,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Printer,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Filter,
  Building2,
  Package,
} from "lucide-react";
import { NineSpendKpis, SpendSettings, RawSupplierRecord, SupplierDimensionRecord } from "../types";

interface ExecutiveSummaryPanelProps {
  kpis: NineSpendKpis;
  spendSettings: SpendSettings;
  filteredRecords: RawSupplierRecord[];
  supplierDimension: SupplierDimensionRecord[];
  selectedMonth: string;
  onFilterChange?: (filters: any) => void;
  onNavigateToTab?: (tab: string) => void;
  onSelectSupplier?: (supplierId: string) => void;
}

export const ExecutiveSummaryPanel: React.FC<ExecutiveSummaryPanelProps> = ({
  kpis,
  spendSettings,
  filteredRecords,
  supplierDimension,
  selectedMonth,
  onFilterChange,
  onNavigateToTab,
  onSelectSupplier,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copiedMemo, setCopiedMemo] = useState(false);
  const [activeRecommendationTab, setActiveRecommendationTab] = useState<"all" | "immediate" | "midterm" | "longterm">("all");

  const formatNaira = (amount: number) => {
    if (amount >= 1e9) return `₦${(amount / 1e9).toFixed(2)}B`;
    if (amount >= 1e6) return `₦${(amount / 1e6).toFixed(1)}M`;
    if (amount >= 1e3) return `₦${(amount / 1e3).toFixed(0)}K`;
    return `₦${amount.toLocaleString()}`;
  };

  const qualifiedCount = filteredRecords.filter((r) => r.qualification === "Qualified").length;
  const reviewCount = filteredRecords.filter((r) => r.qualification === "Review").length;
  const disqualifiedCount = filteredRecords.filter((r) => r.qualification === "Disqualified").length;

  const handleCopyMemo = () => {
    const memoText = `HONEYWELL PLC - PROCUREMENT & SOURCING EXECUTIVE BRIEFING
Period: ${selectedMonth}
Target: Managing Director & Executive Procurement Committee

1. EXECUTIVE DIAGNOSTIC OVERVIEW
- Total Procurement Spend Exposure: ${formatNaira(kpis.totalCostOfProduction)} across ${filteredRecords.length} routes.
- Qualified Supplier Compliance Rate: ${kpis.qualifiedSupplierRate.toFixed(1)}% (${qualifiedCount} fully qualified).
- Vendor Certification Rate: ${kpis.certComplianceRate.toFixed(1)}% meet NAFDAC/SON standards.
- Average Factory Inbound Lead Time: ${kpis.avgLeadDays.toFixed(1)} days (Factory SLA: 7.0 days).
- Supplier Concentration Risk: Top 3 suppliers command ${kpis.supplierConcentrationRisk.toFixed(1)}% of total supply (Threshold: ${spendSettings.concentrationThreshold}%).

2. KEY SOURCING RISKS & FINDINGS
- ${kpis.isConcentrationAboveThreshold ? "CRITICAL CONCENTRATION: Top 3 vendors exceed safety threshold, exposing Ikeja & Sagamu mills to single-point disruption." : "BALANCED EXPOSURE: Supplier spend distribution is within safe diversification parameters."}
- QUALITY AUDIT GAP: ${reviewCount} listings are currently under 'Review' status requiring immediate quality clearance.
- NORTHERN LOGISTICS CORRIDORS: Grain transit routes from Kano and Kaduna average ${kpis.avgLeadDays > 8 ? "extended delays" : "normal lead times"}.

3. RECOMMENDATIONS FOR MANAGEMENT DECISION-MAKING
[30-Day Immediate Directives]
1. Enforce a 30% dual-sourcing quota for Maize Grain and Soya Beans to eliminate single-source dependency.
2. Halt purchase order allocations to vendors lacking up-to-date 2026 NAFDAC/SON renewal documentation.
3. Establish a 10-day buffer stock requirement at Lagos receiving silos for long-haul northern shipments.

[90-Day Commercial Contracting]
4. Finalize forward volume-purchase agreements in Kano and Kaduna ahead of off-season price volatility.
5. Accelerate industrial trial blends for local Cassava and Sorghum flours to reduce foreign exchange wheat exposure.

[Long-Term Structural Initiatives]
6. Launch the HoneyWell Outgrower Accreditation Program, sponsoring HACCP/ISO 22000 audits for high-volume Tier-2 domestic cooperatives.
`;
    navigator.clipboard.writeText(memoText);
    setCopiedMemo(true);
    setTimeout(() => setCopiedMemo(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Quick Action Filters
  const handleFilterHighRisk = () => {
    if (onFilterChange) {
      onFilterChange((prev: any) => ({
        ...prev,
        qualification: ["Review", "Disqualified"],
      }));
    }
  };

  const handleFilterNorthernHubs = () => {
    if (onFilterChange) {
      onFilterChange((prev: any) => ({
        ...prev,
        market: ["Kano", "Kaduna", "Plateau", "Niger"],
      }));
    }
  };

  const handleFilterTopConcentration = () => {
    if (onFilterChange && kpis.top3Suppliers.length > 0) {
      onFilterChange((prev: any) => ({
        ...prev,
        supplier: kpis.top3Suppliers.map((s) => s.name),
      }));
    }
  };

  const handleResetFilters = () => {
    if (onFilterChange) {
      onFilterChange((prev: any) => ({
        ...prev,
        market: [],
        category: [],
        product: [],
        supplier: [],
        qualification: [],
        certification: [],
        status: [],
      }));
    }
  };

  // Strategic Decision Matrix Data
  const decisionMatrix = [
    {
      commodity: "Maize Grain",
      category: "Grains & Cereals",
      primarySupplier: "Kano Agro Ventures",
      secondaryBackup: "Kaduna Grain Co.",
      riskLevel: "High",
      decision: "Dual-Source Mandate (70/30 Split)",
      impact: "Guarantees continuous 24/7 milling capacity at Ikeja; avoids supply bottleneck.",
      status: "Review",
    },
    {
      commodity: "Soya Beans",
      category: "Oilseeds",
      primarySupplier: "Arewa Agro Traders",
      secondaryBackup: "Premier Harvest Nig Ltd",
      riskLevel: "Medium",
      decision: "Execute 6-Month Forward Contract",
      impact: "Hedges against 14% anticipated off-season price surge; stabilizes feed cost.",
      status: "Qualified",
    },
    {
      commodity: "Cassava Flour",
      category: "Flours & Starches",
      primarySupplier: "Lagos Agro Logistics",
      secondaryBackup: "Ibadan Cassava Mills",
      riskLevel: "Low",
      decision: "Increase Intake Ratio by 15%",
      impact: "Reduces FX-linked wheat flour reliance by ₦45M monthly.",
      status: "Qualified",
    },
    {
      commodity: "Sorghum Grain",
      category: "Grains & Cereals",
      primarySupplier: "Plateau Grain Hub",
      secondaryBackup: "Zaria Agricultural Ltd",
      riskLevel: "Medium",
      decision: "Mandate Buffer Inventory in Sagamu",
      impact: "Buffers against 9-day transit lead times from Middle Belt corridor.",
      status: "Qualified",
    },
  ];

  return (
    <div
      id="panel-executive-summary"
      className="rounded-xl border border-purple-800/50 bg-[#161424] shadow-lg shadow-purple-950/20 transition-all overflow-hidden"
    >
      {/* 1. Executive Panel Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2A2740] bg-gradient-to-r from-purple-950/80 via-[#1B1926] to-[#161424] px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/30 text-purple-300 border border-purple-500/40 shadow-inner">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black uppercase tracking-wider text-[#F5F3FA]">
                Executive Summary & Management Decision Briefing
              </h2>
              <span className="rounded bg-emerald-950/80 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-800/60">
                Board Ready
              </span>
              <span className="rounded bg-purple-900/60 px-2 py-0.5 text-[10px] font-semibold text-purple-200 border border-purple-700/50">
                {selectedMonth}
              </span>
            </div>
            <p className="text-xs text-[#9B95B0]">
              Strategic Procurement Insights & Actionable Directives for HoneyWell Plc Executive Leadership
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyMemo}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
              copiedMemo
                ? "border-emerald-500 bg-emerald-950/60 text-emerald-300"
                : "border-[#2A2740] bg-[#1B1926] text-[#F5F3FA] hover:border-purple-500 hover:text-purple-300"
            }`}
            title="Copy formatted management memo to clipboard"
          >
            {copiedMemo ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedMemo ? "Memo Copied!" : "Copy Board Memo"}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-lg border border-[#2A2740] bg-[#1B1926] px-3 py-1.5 text-xs font-medium text-[#9B95B0] hover:text-[#F5F3FA] hover:border-purple-500/50 transition-colors"
            title="Print or export executive briefing"
          >
            <Printer className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {onNavigateToTab && (
            <button
              onClick={() => onNavigateToTab("ai")}
              className="flex items-center gap-1 rounded-lg border border-purple-700/50 bg-purple-900/40 px-2.5 py-1.5 text-xs font-semibold text-purple-200 hover:bg-purple-800/50 transition-colors"
              title="Open Gemini AI strategic analysis"
            >
              <Sparkles className="h-3.5 w-3.5 text-purple-300" />
              <span className="hidden md:inline">Gemini AI</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2A2740] bg-[#1B1926] text-[#9B95B0] hover:text-[#F5F3FA] hover:border-purple-500 transition-colors"
            title={isExpanded ? "Collapse executive panel" : "Expand executive panel"}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="p-5 space-y-5">
          {/* 2. Management Diagnostics KPI Strip */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-4">
            {/* Metric 1: Total Spend Exposure */}
            <div className="rounded-xl border border-[#2A2740] bg-[#1B1926] p-3 shadow-xs">
              <div className="flex items-center justify-between text-[#9B95B0]">
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Total Sourcing Exposure
                </span>
                <DollarSign className="h-4 w-4 text-purple-400" />
              </div>
              <div className="mt-1 text-xl font-black text-[#F5F3FA]">
                {formatNaira(kpis.totalCostOfProduction)}
              </div>
              <p className="mt-0.5 text-[10px] text-purple-300">
                {qualifiedCount} qualified ({Math.round((qualifiedCount / (filteredRecords.length || 1)) * 100)}% of commitments)
              </p>
            </div>

            {/* Metric 2: Concentration Vulnerability */}
            <div
              className={`rounded-xl border p-3 shadow-xs ${
                kpis.isConcentrationAboveThreshold
                  ? "border-rose-700/60 bg-rose-950/20"
                  : "border-[#2A2740] bg-[#1B1926]"
              }`}
            >
              <div className="flex items-center justify-between text-[#9B95B0]">
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Concentration Risk
                </span>
                <AlertTriangle
                  className={`h-4 w-4 ${
                    kpis.isConcentrationAboveThreshold ? "text-rose-400" : "text-amber-400"
                  }`}
                />
              </div>
              <div
                className={`mt-1 text-xl font-black ${
                  kpis.isConcentrationAboveThreshold ? "text-rose-300" : "text-[#F5F3FA]"
                }`}
              >
                {kpis.supplierConcentrationRisk.toFixed(1)}%
              </div>
              <p
                className={`mt-0.5 text-[10px] ${
                  kpis.isConcentrationAboveThreshold ? "text-rose-400 font-bold" : "text-[#9B95B0]"
                }`}
              >
                {kpis.isConcentrationAboveThreshold
                  ? "Exceeds 50% safety limit (Top 3)"
                  : "Within acceptable policy threshold"}
              </p>
            </div>

            {/* Metric 3: Regulatory Compliance */}
            <div className="rounded-xl border border-[#2A2740] bg-[#1B1926] p-3 shadow-xs">
              <div className="flex items-center justify-between text-[#9B95B0]">
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Regulatory Compliance
                </span>
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="mt-1 text-xl font-black text-emerald-400">
                {kpis.certComplianceRate.toFixed(1)}%
              </div>
              <p className="mt-0.5 text-[10px] text-[#9B95B0]">
                NAFDAC & SON certified suppliers
              </p>
            </div>

            {/* Metric 4: Logistics Transit Lead Time */}
            <div className="rounded-xl border border-[#2A2740] bg-[#1B1926] p-3 shadow-xs">
              <div className="flex items-center justify-between text-[#9B95B0]">
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Average Inbound Transit
                </span>
                <Clock className="h-4 w-4 text-blue-400" />
              </div>
              <div className="mt-1 text-xl font-black text-[#F5F3FA]">
                {kpis.avgLeadDays.toFixed(1)} days
              </div>
              <p className="mt-0.5 text-[10px] text-blue-300">
                Factory SLA threshold: 7.0 days ({kpis.avgLeadDays > 7 ? "+ " + (kpis.avgLeadDays - 7).toFixed(1) + "d buffer" : "SLA Met"})
              </p>
            </div>
          </div>

          {/* 3. Executive Strategic Narrative & Core Diagnosis */}
          <div className="rounded-xl border border-[#2A2740] bg-[#14121F] p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" />
              Strategic Sourcing Diagnosis • {selectedMonth}
            </h3>
            <div className="mt-2.5 grid grid-cols-1 gap-3 md:grid-cols-2 text-xs text-[#C5C0D8] leading-relaxed">
              <div className="space-y-2">
                <p>
                  • <strong className="text-[#F5F3FA]">Manufacturing Continuity:</strong> Operating at an active monthly requirement of{" "}
                  <span className="text-purple-300 font-semibold">{filteredRecords.length} material lines</span> across{" "}
                  <span className="text-purple-300 font-semibold">{supplierDimension.length} verified vendors</span>. Critical grains (Maize, Sorghum) remain vulnerable to harvest seasonality and northern logistics transit variances.
                </p>
                <p>
                  • <strong className="text-[#F5F3FA]">Spend & Price Optimization:</strong> Raw material unit pricing averages{" "}
                  <span className="text-emerald-400 font-semibold">₦{Math.round(kpis.totalCostOfProduction / Math.max(1, filteredRecords.length * 1200))}/kg benchmark</span>. Kano and Kaduna supply corridors offer significant economies of scale, but carry an average delivery time of {kpis.avgLeadDays.toFixed(1)} days.
                </p>
              </div>
              <div className="space-y-2">
                <p>
                  • <strong className="text-[#F5F3FA]">Quality & Statutory Exposure:</strong> While composite supplier score holds at{" "}
                  <span className="text-purple-300 font-semibold">{kpis.avgSupplierScore.toFixed(1)}/100</span>, there are{" "}
                  <span className="text-amber-400 font-semibold">{reviewCount} suppliers flagged in 'Review' status</span>. Uncertified deliveries pose immediate NAFDAC inspection risks at Ikeja and Sagamu silos.
                </p>
                <p>
                  • <strong className="text-[#F5F3FA]">Concentration Exposure:</strong> Top 3 suppliers represent{" "}
                  <span className={kpis.isConcentrationAboveThreshold ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
                    {kpis.supplierConcentrationRisk.toFixed(1)}% of supply capacity
                  </span>. Management must enforce proactive multi-sourcing before Q4 manufacturing ramps.
                </p>
              </div>
            </div>
          </div>

          {/* 4. Recommendations for Management Decision-Making */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2A2740]/80 pb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F3FA]">
                  Actionable Recommendations for Management Decision-Making
                </h3>
                <span className="rounded-full bg-purple-900/60 px-2 py-0.5 text-[10px] font-bold text-purple-200">
                  Priority Directives
                </span>
              </div>

              {/* Recommendation Category Tabs */}
              <div className="flex items-center gap-1 text-[11px]">
                <button
                  onClick={() => setActiveRecommendationTab("all")}
                  className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
                    activeRecommendationTab === "all"
                      ? "bg-purple-600 text-white"
                      : "text-[#9B95B0] hover:bg-[#1F1C2E] hover:text-[#F5F3FA]"
                  }`}
                >
                  All (6)
                </button>
                <button
                  onClick={() => setActiveRecommendationTab("immediate")}
                  className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
                    activeRecommendationTab === "immediate"
                      ? "bg-rose-900/80 text-rose-200 border border-rose-700/60"
                      : "text-[#9B95B0] hover:bg-[#1F1C2E] hover:text-[#F5F3FA]"
                  }`}
                >
                  30-Day Operational
                </button>
                <button
                  onClick={() => setActiveRecommendationTab("midterm")}
                  className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
                    activeRecommendationTab === "midterm"
                      ? "bg-amber-900/80 text-amber-200 border border-amber-700/60"
                      : "text-[#9B95B0] hover:bg-[#1F1C2E] hover:text-[#F5F3FA]"
                  }`}
                >
                  90-Day Commercial
                </button>
                <button
                  onClick={() => setActiveRecommendationTab("longterm")}
                  className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
                    activeRecommendationTab === "longterm"
                      ? "bg-blue-900/80 text-blue-200 border border-blue-700/60"
                      : "text-[#9B95B0] hover:bg-[#1F1C2E] hover:text-[#F5F3FA]"
                  }`}
                >
                  Long-Term Structural
                </button>
              </div>
            </div>

            {/* Recommendations Grid */}
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
              {/* Directive 1: 30-Day Immediate */}
              {(activeRecommendationTab === "all" || activeRecommendationTab === "immediate") && (
                <div className="rounded-xl border border-rose-800/40 bg-rose-950/15 p-3.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="rounded bg-rose-900/60 px-2 py-0.5 text-[10px] font-bold text-rose-200 uppercase tracking-wider border border-rose-700/50">
                        Immediate 30-Day Action
                      </span>
                      <span className="text-rose-400 font-bold">Urgent</span>
                    </div>
                    <h4 className="mt-2 text-xs font-bold text-[#F5F3FA]">
                      1. Enforce 30% Dual-Sourcing Allocation for Maize & Soya
                    </h4>
                    <p className="mt-1.5 text-xs text-[#C5C0D8] leading-relaxed">
                      Mandate procurement teams to award secondary 30% purchase orders to alternative qualified suppliers (e.g. Kaduna Grain Co., Premier Harvest) to cap single-supplier exposure.
                    </p>
                  </div>
                  <div className="mt-3 border-t border-rose-900/40 pt-2 flex items-center justify-between text-[10px] text-rose-300">
                    <span>Target: Eliminates 100% single-point factory halt</span>
                    <button
                      onClick={handleFilterHighRisk}
                      className="font-bold underline hover:text-white"
                    >
                      Audit Suppliers →
                    </button>
                  </div>
                </div>
              )}

              {/* Directive 2: 30-Day Immediate */}
              {(activeRecommendationTab === "all" || activeRecommendationTab === "immediate") && (
                <div className="rounded-xl border border-rose-800/40 bg-rose-950/15 p-3.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="rounded bg-rose-900/60 px-2 py-0.5 text-[10px] font-bold text-rose-200 uppercase tracking-wider border border-rose-700/50">
                        Immediate 30-Day Action
                      </span>
                      <span className="text-rose-400 font-bold">Compliance</span>
                    </div>
                    <h4 className="mt-2 text-xs font-bold text-[#F5F3FA]">
                      2. Freeze PO Issuance to Uncertified & 'Review' Vendors
                    </h4>
                    <p className="mt-1.5 text-xs text-[#C5C0D8] leading-relaxed">
                      Temporarily place new contracts on hold for {reviewCount} suppliers pending expedited NAFDAC/SON renewal documentation. Prevent non-compliant inventory arrivals at Sagamu silos.
                    </p>
                  </div>
                  <div className="mt-3 border-t border-rose-900/40 pt-2 flex items-center justify-between text-[10px] text-rose-300">
                    <span>Target: 100% audit clearance before gate entry</span>
                    <button
                      onClick={() => onNavigateToTab && onNavigateToTab("compliance")}
                      className="font-bold underline hover:text-white"
                    >
                      Compliance Tab →
                    </button>
                  </div>
                </div>
              )}

              {/* Directive 3: 90-Day Midterm */}
              {(activeRecommendationTab === "all" || activeRecommendationTab === "midterm") && (
                <div className="rounded-xl border border-amber-800/40 bg-amber-950/15 p-3.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="rounded bg-amber-900/60 px-2 py-0.5 text-[10px] font-bold text-amber-200 uppercase tracking-wider border border-amber-700/50">
                        90-Day Commercial Directive
                      </span>
                      <span className="text-amber-400 font-bold">Cost Hedge</span>
                    </div>
                    <h4 className="mt-2 text-xs font-bold text-[#F5F3FA]">
                      3. Lock Forward Volume Contracts in Kano & Kaduna Hubs
                    </h4>
                    <p className="mt-1.5 text-xs text-[#C5C0D8] leading-relaxed">
                      Negotiate 6-month volume commitments with top Northern cooperatives ahead of dry-season grain escalation, securing minimum 5-8% volume discounts against open-market price surges.
                    </p>
                  </div>
                  <div className="mt-3 border-t border-amber-900/40 pt-2 flex items-center justify-between text-[10px] text-amber-300">
                    <span>Target: ₦62M estimated price variance savings</span>
                    <button
                      onClick={handleFilterNorthernHubs}
                      className="font-bold underline hover:text-white"
                    >
                      Northern Hubs →
                    </button>
                  </div>
                </div>
              )}

              {/* Directive 4: 90-Day Midterm */}
              {(activeRecommendationTab === "all" || activeRecommendationTab === "midterm") && (
                <div className="rounded-xl border border-amber-800/40 bg-amber-950/15 p-3.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="rounded bg-amber-900/60 px-2 py-0.5 text-[10px] font-bold text-amber-200 uppercase tracking-wider border border-amber-700/50">
                        90-Day Commercial Directive
                      </span>
                      <span className="text-amber-400 font-bold">FX Defense</span>
                    </div>
                    <h4 className="mt-2 text-xs font-bold text-[#F5F3FA]">
                      4. Accelerate Local Cassava & Sorghum Substitution
                    </h4>
                    <p className="mt-1.5 text-xs text-[#C5C0D8] leading-relaxed">
                      Collaborate with R&D and Production to increase domestic cassava flour blending ratios by 10-15%, shielding operating margins against foreign-exchange volatility on imported wheat.
                    </p>
                  </div>
                  <div className="mt-3 border-t border-amber-900/40 pt-2 flex items-center justify-between text-[10px] text-amber-300">
                    <span>Target: 15% reduction in import currency exposure</span>
                    <button
                      onClick={() => onNavigateToTab && onNavigateToTab("spend")}
                      className="font-bold underline hover:text-white"
                    >
                      Spend Analysis →
                    </button>
                  </div>
                </div>
              )}

              {/* Directive 5: Long-Term Structural */}
              {(activeRecommendationTab === "all" || activeRecommendationTab === "longterm") && (
                <div className="rounded-xl border border-blue-800/40 bg-blue-950/15 p-3.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="rounded bg-blue-900/60 px-2 py-0.5 text-[10px] font-bold text-blue-200 uppercase tracking-wider border border-blue-700/50">
                        Long-Term Structural
                      </span>
                      <span className="text-blue-400 font-bold">SLA Guarantee</span>
                    </div>
                    <h4 className="mt-2 text-xs font-bold text-[#F5F3FA]">
                      5. Institute 8-Day Haulage SLA & Dedicated Logistics Corridors
                    </h4>
                    <p className="mt-1.5 text-xs text-[#C5C0D8] leading-relaxed">
                      Contract verified 3PL fleet partners with GPS telemetry on major Kaduna-Lagos and Kano-Lagos trunk lines, enforcing 8-day SLA delivery limits with tiered demurrage penalties.
                    </p>
                  </div>
                  <div className="mt-3 border-t border-blue-900/40 pt-2 flex items-center justify-between text-[10px] text-blue-300">
                    <span>Target: Cuts average delivery variance to ≤ 7 days</span>
                    <button
                      onClick={() => {
                        const el = document.getElementById("panel-avg-delivery-time");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="font-bold underline hover:text-white"
                    >
                      Delivery Panel →
                    </button>
                  </div>
                </div>
              )}

              {/* Directive 6: Long-Term Structural */}
              {(activeRecommendationTab === "all" || activeRecommendationTab === "longterm") && (
                <div className="rounded-xl border border-blue-800/40 bg-blue-950/15 p-3.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="rounded bg-blue-900/60 px-2 py-0.5 text-[10px] font-bold text-blue-200 uppercase tracking-wider border border-blue-700/50">
                        Long-Term Structural
                      </span>
                      <span className="text-blue-400 font-bold">Vendor Dev</span>
                    </div>
                    <h4 className="mt-2 text-xs font-bold text-[#F5F3FA]">
                      6. HoneyWell Supplier Quality Incubation & Certification
                    </h4>
                    <p className="mt-1.5 text-xs text-[#C5C0D8] leading-relaxed">
                      Co-sponsor technical GAP and ISO 22000 hygiene training for high-capacity Tier-2 agricultural cooperatives, elevating qualified supplier conversion from 35% to 65% by end of 2026.
                    </p>
                  </div>
                  <div className="mt-3 border-t border-blue-900/40 pt-2 flex items-center justify-between text-[10px] text-blue-300">
                    <span>Target: Expands approved vendor base by 30+ mills</span>
                    <button
                      onClick={() => onNavigateToTab && onNavigateToTab("directory")}
                      className="font-bold underline hover:text-white"
                    >
                      Directory →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 5. Strategic Sourcing Decision Matrix Table */}
          <div className="rounded-xl border border-[#2A2740] bg-[#14121F] p-4">
            <div className="flex items-center justify-between border-b border-[#2A2740]/70 pb-2.5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F3FA]">
                  Executive Sourcing Decision Matrix
                </h3>
                <p className="text-[11px] text-[#9B95B0]">
                  Core commodity allocations, backup resilience, and board-level action directives
                </p>
              </div>
              <span className="rounded bg-purple-950/80 px-2.5 py-0.5 text-[10px] font-bold text-purple-300 border border-purple-800/60">
                Active Cycle: {selectedMonth}
              </span>
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#2A2740] text-[10px] uppercase tracking-wider text-[#9B95B0]">
                    <th className="pb-2 font-semibold">Commodity</th>
                    <th className="pb-2 font-semibold">Primary Supplier</th>
                    <th className="pb-2 font-semibold">Secondary Backup</th>
                    <th className="pb-2 font-semibold text-center">Risk Level</th>
                    <th className="pb-2 font-semibold">Management Decision</th>
                    <th className="pb-2 font-semibold">Expected Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#252238]">
                  {decisionMatrix.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#1E1B2C] transition-colors">
                      <td className="py-2.5 pr-3">
                        <span className="font-bold text-[#F5F3FA]">{item.commodity}</span>
                        <span className="block text-[10px] text-[#9B95B0]">{item.category}</span>
                      </td>
                      <td className="py-2.5 pr-3">
                        <span className="font-semibold text-purple-300">{item.primarySupplier}</span>
                        <span className="block text-[10px] text-emerald-400">Contracted Lead</span>
                      </td>
                      <td className="py-2.5 pr-3">
                        <span className="text-[#C5C0D8]">{item.secondaryBackup}</span>
                        <span className="block text-[10px] text-[#9B95B0]">Pre-qualified Backup</span>
                      </td>
                      <td className="py-2.5 text-center pr-3">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            item.riskLevel === "High"
                              ? "bg-rose-950/80 text-rose-300 border border-rose-800/60"
                              : item.riskLevel === "Medium"
                              ? "bg-amber-950/80 text-amber-300 border border-amber-800/60"
                              : "bg-emerald-950/80 text-emerald-300 border border-emerald-800/60"
                          }`}
                        >
                          {item.riskLevel}
                        </span>
                      </td>
                      <td className="py-2.5 pr-3 font-semibold text-[#F5F3FA]">
                        {item.decision}
                      </td>
                      <td className="py-2.5 text-[11px] text-[#9B95B0]">
                        {item.impact}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 6. Interactive Executive Action Triggers */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-purple-800/40 bg-purple-950/20 px-4 py-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-purple-400" />
              <span className="text-xs font-bold text-[#F5F3FA]">
                One-Click Executive Filter Focus:
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button
                onClick={handleFilterHighRisk}
                className="rounded-lg border border-rose-800/50 bg-rose-950/40 px-3 py-1.5 font-medium text-rose-300 hover:bg-rose-900/60 hover:text-white transition-colors"
                title="Filter to suppliers in Review or Disqualified status"
              >
                Inspect Review & High-Risk ({reviewCount + disqualifiedCount})
              </button>

              <button
                onClick={handleFilterNorthernHubs}
                className="rounded-lg border border-purple-800/50 bg-purple-950/40 px-3 py-1.5 font-medium text-purple-300 hover:bg-purple-900/60 hover:text-white transition-colors"
                title="Focus on Kano, Kaduna, Plateau and Niger grain markets"
              >
                Focus Northern Grain Corridors
              </button>

              <button
                onClick={handleFilterTopConcentration}
                className="rounded-lg border border-amber-800/50 bg-amber-950/40 px-3 py-1.5 font-medium text-amber-300 hover:bg-amber-900/60 hover:text-white transition-colors"
                title="Filter to top 3 suppliers contributing to concentration risk"
              >
                Focus Top 3 Concentration Vendors
              </button>

              <button
                onClick={handleResetFilters}
                className="rounded-lg border border-[#2A2740] bg-[#1B1926] px-3 py-1.5 font-medium text-[#9B95B0] hover:text-[#F5F3FA] transition-colors"
                title="Reset all filters to view full dataset"
              >
                Reset Focus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
