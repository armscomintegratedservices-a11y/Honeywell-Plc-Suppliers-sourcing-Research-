import React from "react";
import {
  TrendingUp,
  Award,
  Clock,
  ShieldCheck,
  Percent,
  AlertTriangle,
  ArrowUpRight,
  DollarSign,
  CheckCircle2,
  Package,
  ChevronRight,
} from "lucide-react";
import { NineSpendKpis, SpendSettings } from "../types";

interface KpiStripProps {
  kpis: NineSpendKpis;
  spendSettings: SpendSettings;
  filteredCount: number;
  distinctSuppliersCount: number;
  onFilterQualification?: (qualification: string) => void;
  onFilterScore?: (minScore: number) => void;
  onFilterLeadTime?: (maxDays: number) => void;
  onFilterReliability?: (minReliability: number) => void;
  onFilterConcentration?: () => void;
  onNavigateToTab?: (tab: string) => void;
  onOpenSpendSettings?: () => void;
  onFilterProduct?: () => void;
  activeFilterKey?: string;
}

export const KpiStrip: React.FC<KpiStripProps> = ({
  kpis,
  spendSettings,
  filteredCount,
  distinctSuppliersCount,
  onFilterQualification,
  onFilterScore,
  onFilterLeadTime,
  onFilterReliability,
  onFilterConcentration,
  onNavigateToTab,
  onOpenSpendSettings,
  onFilterProduct,
  activeFilterKey,
}) => {
  // Format currency in millions or billions (NGN ₦)
  const formatNaira = (amount: number) => {
    if (amount >= 1e9) {
      return `₦${(amount / 1e9).toFixed(2)}B`;
    }
    if (amount >= 1e6) {
      return `₦${(amount / 1e6).toFixed(1)}M`;
    }
    if (amount >= 1e3) {
      return `₦${(amount / 1e3).toFixed(0)}K`;
    }
    return `₦${amount.toLocaleString()}`;
  };

  const getSpendCaption = () => {
    switch (spendSettings.basis) {
      case "moq":
        return "Estimated at MOQ batch";
      case "actual":
        return "Custom recorded volume";
      case "capacity":
      default:
        return "Full monthly capacity model";
    }
  };

  return (
    <div
      id="kpi-strip"
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7"
    >
      {/* KPI 1: Total Spend Potential */}
      <button
        type="button"
        id="kpi-total-spend"
        onClick={() => {
          if (onNavigateToTab) onNavigateToTab("spend");
          else if (onOpenSpendSettings) onOpenSpendSettings();
        }}
        className={`group relative text-left rounded-xl border p-3.5 shadow-sm transition-all cursor-pointer hover:scale-[1.02] hover:shadow-lg ${
          activeFilterKey === "spend"
            ? "border-purple-500 bg-purple-950/40 ring-1 ring-purple-500"
            : "border-[#2A2740] bg-[#1B1926] hover:border-purple-500/60"
        }`}
        title="Click to view detailed Spend & Cost Analysis"
      >
        <div className="flex items-center justify-between text-[#9B95B0]">
          <span className="text-[11px] font-semibold uppercase tracking-wider group-hover:text-purple-300 transition-colors">
            Spend Potential
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-950/60 text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all">
            <DollarSign className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-xl font-black tracking-tight text-[#F5F3FA]">
            {formatNaira(kpis.totalCostOfProduction)}
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between text-[10px] text-purple-300/80">
          <span className="truncate">{getSpendCaption()}</span>
          <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        </div>
      </button>

      {/* KPI 2: Qualified Supplier Rate */}
      <button
        type="button"
        id="kpi-qualified-rate"
        onClick={() => {
          if (onFilterQualification) onFilterQualification("Qualified");
          else if (onNavigateToTab) onNavigateToTab("scorecard");
        }}
        className={`group relative text-left rounded-xl border p-3.5 shadow-sm transition-all cursor-pointer hover:scale-[1.02] hover:shadow-lg ${
          activeFilterKey === "qualification"
            ? "border-emerald-500 bg-emerald-950/40 ring-1 ring-emerald-500"
            : "border-[#2A2740] bg-[#1B1926] hover:border-emerald-500/60"
        }`}
        title="Click to toggle filter: Qualified suppliers only"
      >
        <div className="flex items-center justify-between text-[#9B95B0]">
          <span className="text-[11px] font-semibold uppercase tracking-wider group-hover:text-emerald-300 transition-colors">
            Qualified Rate
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-950/60 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all">
            <CheckCircle2 className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-xl font-black tracking-tight text-[#F5F3FA]">
            {kpis.qualifiedSupplierRate.toFixed(1)}%
          </span>
          <span className="text-[11px] text-[#9B95B0]">
            ({distinctSuppliersCount} vends)
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between text-[10px] text-emerald-400">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Click to filter Qualified
          </span>
          <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        </div>
      </button>

      {/* KPI 3: Average Supplier Score */}
      <button
        type="button"
        id="kpi-avg-score"
        onClick={() => {
          if (onFilterScore) onFilterScore(80);
          else if (onNavigateToTab) onNavigateToTab("scorecard");
        }}
        className={`group relative text-left rounded-xl border p-3.5 shadow-sm transition-all cursor-pointer hover:scale-[1.02] hover:shadow-lg ${
          activeFilterKey === "score"
            ? "border-purple-500 bg-purple-950/40 ring-1 ring-purple-500"
            : "border-[#2A2740] bg-[#1B1926] hover:border-purple-500/60"
        }`}
        title="Click to view Scorecard rankings & filter top scorers"
      >
        <div className="flex items-center justify-between text-[#9B95B0]">
          <span className="text-[11px] font-semibold uppercase tracking-wider group-hover:text-purple-300 transition-colors">
            Avg Score
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-950/60 text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all">
            <Award className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-xl font-black tracking-tight text-[#F5F3FA]">
            {kpis.avgSupplierScore.toFixed(1)}
          </span>
          <span className="text-xs text-[#9B95B0]">/ 100</span>
        </div>
        <div className="mt-1 flex items-center justify-between text-[10px] text-purple-300">
          <span className="flex items-center gap-1">
            <ArrowUpRight className="h-3 w-3 text-emerald-400" />
            Click for Top Tier (≥80)
          </span>
          <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        </div>
      </button>

      {/* KPI 4: Avg Lead Time */}
      <button
        type="button"
        id="kpi-avg-lead-time"
        onClick={() => {
          if (onFilterLeadTime) onFilterLeadTime(7);
          else {
            const el = document.getElementById("panel-avg-delivery-time");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }
        }}
        className={`group relative text-left rounded-xl border p-3.5 shadow-sm transition-all cursor-pointer hover:scale-[1.02] hover:shadow-lg ${
          activeFilterKey === "leadTime"
            ? "border-blue-500 bg-blue-950/40 ring-1 ring-blue-500"
            : "border-[#2A2740] bg-[#1B1926] hover:border-blue-500/60"
        }`}
        title="Click to view delivery times & filter fast delivery (≤ 7 days)"
      >
        <div className="flex items-center justify-between text-[#9B95B0]">
          <span className="text-[11px] font-semibold uppercase tracking-wider group-hover:text-blue-300 transition-colors">
            Avg Lead Time
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-950/60 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <Clock className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-xl font-black tracking-tight text-[#F5F3FA]">
            {kpis.avgLeadDays.toFixed(1)}
          </span>
          <span className="text-xs text-[#9B95B0]">days</span>
        </div>
        <div className="mt-1 flex items-center justify-between text-[10px] text-blue-300">
          <span className="truncate">Across {filteredCount} routes</span>
          <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        </div>
      </button>

      {/* KPI 5: Avg Reliability % */}
      <button
        type="button"
        id="kpi-avg-reliability"
        onClick={() => {
          if (onFilterReliability) onFilterReliability(85);
          else if (onNavigateToTab) onNavigateToTab("scorecard");
        }}
        className={`group relative text-left rounded-xl border p-3.5 shadow-sm transition-all cursor-pointer hover:scale-[1.02] hover:shadow-lg ${
          activeFilterKey === "reliability"
            ? "border-cyan-500 bg-cyan-950/40 ring-1 ring-cyan-500"
            : "border-[#2A2740] bg-[#1B1926] hover:border-cyan-500/60"
        }`}
        title="Click to filter high-reliability vendors (≥ 85%)"
      >
        <div className="flex items-center justify-between text-[#9B95B0]">
          <span className="text-[11px] font-semibold uppercase tracking-wider group-hover:text-cyan-300 transition-colors">
            Avg Reliability
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-950/60 text-cyan-400 group-hover:bg-cyan-600 group-hover:text-white transition-all">
            <Percent className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-xl font-black tracking-tight text-[#F5F3FA]">
            {kpis.avgReliabilityPct.toFixed(1)}%
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between text-[10px]">
          <div className="h-1.5 w-20 bg-[#2A2740] rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-400 rounded-full"
              style={{ width: `${Math.min(100, kpis.avgReliabilityPct)}%` }}
            />
          </div>
          <span className="text-cyan-300 text-[10px]">≥85% focus</span>
        </div>
      </button>

      {/* KPI 6: Concentration Risk */}
      <button
        type="button"
        id="kpi-concentration-risk"
        onClick={() => {
          if (onFilterConcentration) onFilterConcentration();
          else if (onNavigateToTab) onNavigateToTab("spend");
        }}
        className={`group relative text-left rounded-xl border p-3.5 shadow-sm transition-all cursor-pointer hover:scale-[1.02] hover:shadow-lg ${
          kpis.isConcentrationAboveThreshold
            ? "border-rose-800/60 bg-rose-950/20 hover:border-rose-600"
            : "border-[#2A2740] bg-[#1B1926] hover:border-purple-500/60"
        }`}
        title="Click to isolate and inspect Top 3 concentration suppliers"
      >
        <div className="flex items-center justify-between text-[#9B95B0]">
          <span className="text-[11px] font-semibold uppercase tracking-wider group-hover:text-rose-300 transition-colors">
            Top 3 Spend Share
          </span>
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-md transition-all ${
              kpis.isConcentrationAboveThreshold
                ? "bg-rose-950 text-rose-400 group-hover:bg-rose-600 group-hover:text-white"
                : "bg-purple-950/60 text-purple-400 group-hover:bg-purple-600 group-hover:text-white"
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span
            className={`text-xl font-black tracking-tight ${
              kpis.isConcentrationAboveThreshold ? "text-rose-300" : "text-[#F5F3FA]"
            }`}
          >
            {kpis.supplierConcentrationRisk.toFixed(1)}%
          </span>
          <span className="text-[10px] text-[#9B95B0]">
            (limit: {spendSettings.concentrationThreshold}%)
          </span>
        </div>
        <div
          className={`mt-1 flex items-center justify-between text-[10px] ${
            kpis.isConcentrationAboveThreshold ? "text-rose-400 font-medium" : "text-[#9B95B0]"
          }`}
        >
          <span className="truncate">
            {kpis.isConcentrationAboveThreshold ? "⚠️ Concentration Alert" : "Click to view Top 3"}
          </span>
          <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        </div>
      </button>

      {/* KPI 7: Avg Products Supplied by Each Month */}
      <button
        type="button"
        id="kpi-avg-products"
        onClick={() => {
          if (onFilterProduct) onFilterProduct();
          else if (onNavigateToTab) onNavigateToTab("directory");
        }}
        className="group relative text-left rounded-xl border border-[#2A2740] bg-[#1B1926] p-3.5 shadow-sm transition-all cursor-pointer hover:border-emerald-500/60 hover:scale-[1.02] hover:shadow-lg"
        title="Click to view commodities & product lines directory"
      >
        <div className="flex items-center justify-between text-[#9B95B0]">
          <span className="text-[11px] font-semibold uppercase tracking-wider group-hover:text-emerald-300 transition-colors">
            Prods Supplied / Mo
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-950/60 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all">
            <Package className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-xl font-black tracking-tight text-[#F5F3FA]">
            {kpis.distinctProductsCount || 19}
          </span>
          <span className="text-xs text-emerald-400 font-medium">products/mo</span>
        </div>
        <div className="mt-1 flex items-center justify-between text-[10px] text-emerald-300">
          <span className="truncate">~{(kpis.avgProductsPerSupplier || 3.7).toFixed(1)} / supplier</span>
          <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        </div>
      </button>
    </div>
  );
};
