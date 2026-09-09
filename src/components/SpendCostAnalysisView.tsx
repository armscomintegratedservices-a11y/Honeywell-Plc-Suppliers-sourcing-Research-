import React from "react";
import {
  NineSpendKpis,
  SpendSettings,
  RawSupplierRecord,
  SupplierDimensionRecord,
} from "../types";
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Award,
  Clock,
  ShieldCheck,
  Building2,
  PieChart as PieIcon,
  Info,
  Sliders,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { calculateRecordSpend } from "../lib/aggregations";

interface SpendCostAnalysisViewProps {
  kpis: NineSpendKpis;
  spendSettings: SpendSettings;
  filteredRecords: RawSupplierRecord[];
  supplierDimension: SupplierDimensionRecord[];
  onOpenSettings: () => void;
}

const PURPLE_PALETTE = [
  "#8B5CF6",
  "#7C3AED",
  "#6D28D9",
  "#5B21B6",
  "#4C1D95",
  "#A78BFA",
  "#C4B5FD",
  "#DDD6FE",
];

export const SpendCostAnalysisView: React.FC<SpendCostAnalysisViewProps> = ({
  kpis,
  spendSettings,
  filteredRecords,
  supplierDimension,
  onOpenSettings,
}) => {
  const formatNaira = (num: number) => {
    if (num >= 1e9) return `₦${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `₦${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `₦${(num / 1e3).toFixed(0)}K`;
    return `₦${num.toLocaleString()}`;
  };

  // 1. Spend by Category
  const categorySpendMap = new Map<string, number>();
  filteredRecords.forEach((r) => {
    const spend = calculateRecordSpend(r, spendSettings);
    categorySpendMap.set(r.category, (categorySpendMap.get(r.category) || 0) + spend);
  });

  const categoryData = Array.from(categorySpendMap.entries())
    .map(([name, spend]) => ({
      name,
      spendM: parseFloat((spend / 1e6).toFixed(1)),
      spendRaw: spend,
    }))
    .sort((a, b) => b.spendRaw - a.spendRaw)
    .slice(0, 8);

  // 2. Spend by Market (State)
  const marketSpendMap = new Map<string, number>();
  filteredRecords.forEach((r) => {
    const spend = calculateRecordSpend(r, spendSettings);
    marketSpendMap.set(r.market, (marketSpendMap.get(r.market) || 0) + spend);
  });

  const marketData = Array.from(marketSpendMap.entries())
    .map(([name, spend]) => ({
      name,
      spendM: parseFloat((spend / 1e6).toFixed(1)),
      spendRaw: spend,
    }))
    .sort((a, b) => b.spendRaw - a.spendRaw);

  return (
    <div id="spend-cost-analysis-view" className="space-y-4">
      {/* Header & Spend Basis Explanation */}
      <div className="rounded-xl border border-[#2A2740] bg-[#1B1926] p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2A2740]/60 pb-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#F5F3FA] flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-purple-400" />
              Spend & Cost Analysis (9 Procurement KPIs)
            </h2>
            <p className="text-xs text-[#9B95B0]">
              Mathematical financial modeling grounded in supplier capacity, unit price, and MOQ constraints
            </p>
          </div>

          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 rounded-lg border border-purple-800/40 bg-purple-950/40 px-3 py-1.5 text-xs font-semibold text-purple-300 hover:bg-purple-900/50 transition-colors"
          >
            <Sliders className="h-3.5 w-3.5 text-purple-400" />
            <span>Configure Spend Basis & Thresholds</span>
          </button>
        </div>

        <div className="mt-3 flex items-start gap-2.5 rounded-lg bg-[#14121F] p-3 text-xs text-[#9B95B0]">
          <Info className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#F5F3FA]">Auditable Spend Calculation Model: </strong>
            {spendSettings.basis === "capacity" && (
              <span>
                Currently evaluating <strong>Full Monthly Capacity Potential</strong>:{" "}
                <code className="text-purple-300 bg-purple-950/60 px-1 py-0.5 rounded">
                  Spend = Price/kg × (Capacity Tonnes/Mo × 1,000 kg)
                </code>
                . Labeled strictly as an estimate of total supplier production envelope, not actual PO commitment.
              </span>
            )}
            {spendSettings.basis === "moq" && (
              <span>
                Currently evaluating <strong>Minimum Order Quantity (MOQ) Spend</strong>:{" "}
                <code className="text-purple-300 bg-purple-950/60 px-1 py-0.5 rounded">
                  Spend = Price/kg × MOQ kg
                </code>
                . Reflects minimum working capital required to initiate purchase batches.
              </span>
            )}
            {spendSettings.basis === "actual" && (
              <span>
                Currently evaluating <strong>Custom Recorded Purchase Quantities</strong> per supplier.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* The 9 Spend KPIs Detailed Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {/* KPI 1: Highest Spend Supplier */}
        <div className="rounded-xl border border-[#2A2740] bg-[#1B1926] p-4 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9B95B0]">
            1. Highest Spend Supplier
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <h3 className="text-base font-bold text-[#F5F3FA] truncate max-w-[200px]" title={kpis.highestSpendSupplier.name}>
              {kpis.highestSpendSupplier.name}
            </h3>
            <span className="font-mono text-xs text-purple-400 font-semibold">
              {kpis.highestSpendSupplier.id}
            </span>
          </div>
          <p className="mt-1 text-lg font-black text-purple-300">
            {formatNaira(kpis.highestSpendSupplier.spend)}
          </p>
          <span className="text-[10px] text-[#9B95B0]">Max single-supplier spend capacity</span>
        </div>

        {/* KPI 2: Lowest Spend Supplier */}
        <div className="rounded-xl border border-[#2A2740] bg-[#1B1926] p-4 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9B95B0]">
            2. Lowest Spend Supplier (Active/Qual)
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <h3 className="text-base font-bold text-[#F5F3FA] truncate max-w-[200px]" title={kpis.lowestSpendSupplier.name}>
              {kpis.lowestSpendSupplier.name}
            </h3>
            <span className="font-mono text-xs text-purple-400 font-semibold">
              {kpis.lowestSpendSupplier.id}
            </span>
          </div>
          <p className="mt-1 text-lg font-black text-emerald-400">
            {formatNaira(kpis.lowestSpendSupplier.spend)}
          </p>
          <span className="text-[10px] text-[#9B95B0]">Minimum active qualified procurement option</span>
        </div>

        {/* KPI 3: Total Cost of Production */}
        <div className="rounded-xl border border-[#2A2740] bg-[#1B1926] p-4 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9B95B0]">
            3. Total Cost of Production
          </span>
          <p className="mt-2 text-2xl font-black text-[#F5F3FA]">
            {formatNaira(kpis.totalCostOfProduction)}
          </p>
          <p className="mt-1 text-[10px] text-purple-300">
            Sum across {filteredRecords.length} filtered supplier records
          </p>
          <span className="text-[10px] text-[#9B95B0] block truncate">
            Estimated at full monthly capacity — not actual purchase spend
          </span>
        </div>

        {/* KPI 4: Average Lead Time */}
        <div className="rounded-xl border border-[#2A2740] bg-[#1B1926] p-4 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9B95B0]">
            4. Average Lead Time
          </span>
          <p className="mt-2 text-2xl font-black text-[#F5F3FA]">
            {kpis.avgLeadDays.toFixed(1)} <span className="text-sm font-normal text-[#9B95B0]">days</span>
          </p>
          <p className="mt-1 text-[10px] text-[#9B95B0]">
            Supply order placement to warehouse receipt transit
          </p>
        </div>

        {/* KPI 5: Average Reliability % */}
        <div className="rounded-xl border border-[#2A2740] bg-[#1B1926] p-4 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9B95B0]">
            5. Average Reliability %
          </span>
          <p className="mt-2 text-2xl font-black text-cyan-400">
            {kpis.avgReliabilityPct.toFixed(1)}%
          </p>
          <p className="mt-1 text-[10px] text-[#9B95B0]">
            On-time, in-full dispatch fidelity across current routes
          </p>
        </div>

        {/* KPI 6: Average Supplier Score */}
        <div className="rounded-xl border border-[#2A2740] bg-[#1B1926] p-4 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9B95B0]">
            6. Average Supplier Score
          </span>
          <p className="mt-2 text-2xl font-black text-purple-300">
            {kpis.avgSupplierScore.toFixed(1)}{" "}
            <span className="text-sm font-normal text-[#9B95B0]">/ 100</span>
          </p>
          <p className="mt-1 text-[10px] text-[#9B95B0]">
            Composite Quality, Reliability, and Delivery benchmark
          </p>
        </div>

        {/* KPI 7: Qualified Supplier Rate */}
        <div className="rounded-xl border border-[#2A2740] bg-[#1B1926] p-4 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9B95B0]">
            7. Qualified Supplier Rate
          </span>
          <p className="mt-2 text-2xl font-black text-emerald-400">
            {kpis.qualifiedSupplierRate.toFixed(1)}%
          </p>
          <p className="mt-1 text-[10px] text-[#9B95B0]">
            Distinct Qualified Supplier IDs ÷ Total Distinct IDs
          </p>
        </div>

        {/* KPI 8: Certification Compliance Rate */}
        <div className="rounded-xl border border-[#2A2740] bg-[#1B1926] p-4 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9B95B0]">
            8. Certification Compliance Rate
          </span>
          <p className="mt-2 text-2xl font-black text-blue-400">
            {kpis.certComplianceRate.toFixed(1)}%
          </p>
          <p className="mt-1 text-[10px] text-[#9B95B0]">
            Listings with valid NAFDAC, SON, or ISO documented approval
          </p>
        </div>

        {/* KPI 9: Supplier Concentration Risk */}
        <div
          className={`rounded-xl border p-4 shadow-sm ${
            kpis.isConcentrationAboveThreshold
              ? "border-rose-800/80 bg-rose-950/30"
              : "border-[#2A2740] bg-[#1B1926]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9B95B0]">
              9. Supplier Concentration Risk
            </span>
            {kpis.isConcentrationAboveThreshold && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-rose-400">
                <AlertTriangle className="h-3 w-3" /> Exceeds Limit
              </span>
            )}
          </div>
          <p
            className={`mt-2 text-2xl font-black ${
              kpis.isConcentrationAboveThreshold ? "text-rose-400" : "text-[#F5F3FA]"
            }`}
          >
            {kpis.supplierConcentrationRisk.toFixed(1)}%
          </p>
          <p className="mt-1 text-[10px] text-[#9B95B0]">
            % of Total Cost held by top 3 suppliers (Threshold: {spendSettings.concentrationThreshold}%)
          </p>
        </div>
      </div>

      {/* Concentration Risk Detailed Breakdown */}
      <div className="rounded-xl border border-[#2A2740] bg-[#1B1926] p-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#2A2740]/60 pb-2.5">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F3FA]">
              Top 3 Supplier Concentration Detail
            </h3>
            <p className="text-[11px] text-[#9B95B0]">
              Auditing HoneyWell&apos;s reliance on dominant raw material producers
            </p>
          </div>
          <span
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
              kpis.isConcentrationAboveThreshold
                ? "bg-rose-950 text-rose-300 border border-rose-800"
                : "bg-emerald-950 text-emerald-300 border border-emerald-800"
            }`}
          >
            {kpis.isConcentrationAboveThreshold ? "High Risk Alert" : "Acceptable Diversification"}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {kpis.top3Suppliers.map((s, idx) => (
            <div
              key={s.id}
              className="rounded-lg border border-[#2A2740] bg-[#14121F] p-3 text-xs space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#F5F3FA] truncate max-w-[150px]" title={s.name}>
                  #{idx + 1} {s.name}
                </span>
                <span className="font-mono text-[10px] text-purple-400">{s.id}</span>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-sm font-black text-purple-300">
                  {formatNaira(s.spend)}
                </span>
                <span className="text-xs font-bold text-emerald-400">
                  {s.pctOfTotal.toFixed(1)}% share
                </span>
              </div>
              <div className="h-1.5 w-full bg-[#2A2740] rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${Math.min(100, s.pctOfTotal)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category and Market Spend Distribution Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Spend by Category */}
        <div className="rounded-xl border border-[#2A2740] bg-[#1B1926] p-4 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F3FA] border-b border-[#2A2740]/60 pb-2.5">
            Spend Potential by Raw Material Category (₦ Millions)
          </h3>
          <div className="h-64 w-full pt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#252236" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#9B95B0", fontSize: 10 }} interval={0} angle={-25} textAnchor="end" />
                <YAxis tick={{ fill: "#9B95B0", fontSize: 10 }} unit="M" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1B1926", borderColor: "#2A2740", fontSize: "11px" }}
                  formatter={(val: any) => [`₦${val}M`, "Spend Potential"]}
                />
                <Bar dataKey="spendM" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spend by Market State */}
        <div className="rounded-xl border border-[#2A2740] bg-[#1B1926] p-4 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F3FA] border-b border-[#2A2740]/60 pb-2.5">
            Spend Potential by Nigerian State Hub (₦ Millions)
          </h3>
          <div className="h-64 w-full pt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marketData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#252236" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#9B95B0", fontSize: 10 }} interval={0} angle={-25} textAnchor="end" />
                <YAxis tick={{ fill: "#9B95B0", fontSize: 10 }} unit="M" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1B1926", borderColor: "#2A2740", fontSize: "11px" }}
                  formatter={(val: any) => [`₦${val}M`, "Spend Potential"]}
                />
                <Bar dataKey="spendM" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
