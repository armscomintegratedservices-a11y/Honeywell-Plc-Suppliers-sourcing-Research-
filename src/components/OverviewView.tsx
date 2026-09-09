import React from "react";
import { KpiStrip } from "./KpiStrip";
import { SupplierGauge } from "./SupplierGauge";
import { SupplierRankingChart } from "./SupplierRankingChart";
import { TopComplianceDonutChart } from "./TopComplianceDonutChart";
import { AverageDeliveryTimePanel } from "./AverageDeliveryTimePanel";
import { MonthIntelligenceBar } from "./MonthIntelligenceBar";
import { QuickFilterBar } from "./QuickFilterBar";
import { ExecutiveSummaryPanel } from "./ExecutiveSummaryPanel";
import { MonthCustomInputs } from "../lib/monthDynamics";
import {
  NineSpendKpis,
  SpendSettings,
  SupplierDimensionRecord,
  RawSupplierRecord,
  FilterState,
} from "../types";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import {
  ArrowRight,
  MapPin,
  Layers,
  CheckCircle2,
  AlertCircle,
  Truck,
  Clock,
  ShieldCheck,
  Package,
  Building2,
  FileText,
  Filter,
} from "lucide-react";

interface OverviewViewProps {
  kpis: NineSpendKpis;
  spendSettings: SpendSettings;
  supplierDimension: SupplierDimensionRecord[];
  filteredRecords: RawSupplierRecord[];
  onNavigateToTab: (tab: any) => void;
  onSelectSupplier: (supplierId: string) => void;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  onOpenMonthModal: () => void;
  customInputs?: MonthCustomInputs;
  filters?: FilterState;
  onFilterChange?: React.Dispatch<React.SetStateAction<FilterState>> | ((updater: any) => void);
  onResetFilters?: () => void;
  availableMarkets?: string[];
  availableCategories?: string[];
  availableProducts?: string[];
  availableSuppliers?: string[];
  availableCertifications?: string[];
  totalRecords?: number;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  kpis,
  spendSettings,
  supplierDimension,
  filteredRecords,
  onNavigateToTab,
  onSelectSupplier,
  selectedMonth,
  onMonthChange,
  onOpenMonthModal,
  customInputs,
  filters,
  onFilterChange,
  onResetFilters,
  availableMarkets = [],
  availableCategories = [],
  availableProducts = [],
  availableSuppliers = [],
  availableCertifications = [],
  totalRecords = 111,
}) => {
  // Aggregate data by market for the bottom benchmark chart
  const marketMap = new Map<string, { count: number; sumPrice: number; sumQuality: number }>();
  filteredRecords.forEach((r) => {
    if (!marketMap.has(r.market)) {
      marketMap.set(r.market, { count: 0, sumPrice: 0, sumQuality: 0 });
    }
    const item = marketMap.get(r.market)!;
    item.count++;
    item.sumPrice += r.pricePerKg || 0;
    item.sumQuality += r.qualityPct || 0;
  });

  const marketChartData = Array.from(marketMap.entries()).map(([market, val]) => ({
    market,
    avgPrice: Math.round(val.sumPrice / val.count),
    avgQuality: Math.round(val.sumQuality / val.count),
    suppliers: val.count,
  }));

  // Status counts
  const qualifiedCount = filteredRecords.filter((r) => r.qualification === "Qualified").length;
  const reviewCount = filteredRecords.filter((r) => r.qualification === "Review").length;
  const disqualifiedCount = filteredRecords.filter((r) => r.qualification === "Disqualified").length;

  // Recent 6 evaluated supplier records for the status table
  const sampleRecords = filteredRecords.slice(0, 6);

  // Interactive toggle helpers
  const handleToggleMarket = (marketName: string) => {
    if (!onFilterChange) return;
    onFilterChange((prev: any) => {
      const current = prev.market || [];
      const updated = current.includes(marketName)
        ? current.filter((m: string) => m !== marketName)
        : [marketName];
      return { ...prev, market: updated };
    });
  };

  const handleToggleCategory = (catName: string) => {
    if (!onFilterChange) return;
    onFilterChange((prev: any) => {
      const current = prev.category || [];
      const updated = current.includes(catName)
        ? current.filter((c: string) => c !== catName)
        : [catName];
      return { ...prev, category: updated };
    });
  };

  const handleToggleProduct = (prodName: string) => {
    if (!onFilterChange) return;
    onFilterChange((prev: any) => {
      const current = prev.product || [];
      const updated = current.includes(prodName)
        ? current.filter((p: string) => p !== prodName)
        : [prodName];
      return { ...prev, product: updated };
    });
  };

  const handleToggleQualification = (q: string) => {
    if (!onFilterChange) return;
    onFilterChange((prev: any) => {
      const current = prev.qualification || [];
      const updated = current.includes(q)
        ? current.filter((item: string) => item !== q)
        : [q];
      return { ...prev, qualification: updated };
    });
  };

  const handleToggleSupplier = (supplierName: string) => {
    if (!onFilterChange) return;
    onFilterChange((prev: any) => {
      const current = prev.supplier || [];
      const updated = current.includes(supplierName)
        ? current.filter((s: string) => s !== supplierName)
        : [supplierName];
      return { ...prev, supplier: updated };
    });
  };

  const handleFilterTopConcentration = () => {
    if (!onFilterChange) return;
    if (kpis.top3Suppliers && kpis.top3Suppliers.length > 0) {
      onFilterChange((prev: any) => ({
        ...prev,
        supplier: kpis.top3Suppliers.map((s) => s.name),
      }));
    }
  };

  const MarketTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-[#2A2740] bg-[#1B1926] p-3 shadow-xl text-xs">
          <p className="font-bold text-[#F5F3FA] flex items-center gap-1">
            <MapPin className="h-3 w-3 text-purple-400" />
            {label} State
          </p>
          <div className="mt-1 space-y-0.5 text-[#9B95B0]">
            <p>Avg Price: <span className="text-[#F5F3FA] font-bold">₦{payload[0]?.value}/kg</span></p>
            <p>Avg Quality: <span className="text-emerald-400 font-bold">{payload[1]?.value}%</span></p>
            <p>Listings: <span className="text-purple-300 font-bold">{payload[0]?.payload?.suppliers}</span></p>
            <p className="mt-1 text-[10px] text-purple-400 italic">Click bar to filter by {label}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Calculate average price from filtered records for live month display
  const avgPricePerKg =
    filteredRecords.length > 0
      ? filteredRecords.reduce((acc, r) => acc + (r.pricePerKg || 0), 0) / filteredRecords.length
      : 0;

  return (
    <div id="overview-view" className="space-y-4">
      {/* 0. Interactive 2026 Month Timeline & Sourcing Intelligence Ribbon */}
      <MonthIntelligenceBar
        selectedMonth={selectedMonth}
        onMonthChange={onMonthChange}
        onOpenMonthModal={onOpenMonthModal}
        customInputs={customInputs}
        totalMonthlySpend={kpis.totalCostOfProduction}
        avgPricePerKg={avgPricePerKg}
        avgLeadDays={kpis.avgLeadDays}
      />

      {/* 1. Quick Interactive Sourcing Filters Ribbon (State, Category, Qualification, Status, Cert, Product, Supplier) */}
      {filters && onFilterChange && (
        <QuickFilterBar
          filters={filters}
          onFilterChange={onFilterChange as any}
          onResetFilters={onResetFilters || (() => {})}
          availableMarkets={availableMarkets}
          availableCategories={availableCategories}
          availableProducts={availableProducts}
          availableSuppliers={availableSuppliers}
          availableCertifications={availableCertifications}
          totalFiltered={filteredRecords.length}
          totalRecords={totalRecords}
        />
      )}

      {/* 2. Top Interactive KPI Strip */}
      <KpiStrip
        kpis={kpis}
        spendSettings={spendSettings}
        filteredCount={filteredRecords.length}
        distinctSuppliersCount={supplierDimension.length}
        onFilterQualification={handleToggleQualification}
        onFilterScore={() => onNavigateToTab("scorecard")}
        onFilterLeadTime={() => {
          const el = document.getElementById("panel-avg-delivery-time");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        onFilterReliability={() => onNavigateToTab("scorecard")}
        onFilterConcentration={handleFilterTopConcentration}
        onNavigateToTab={onNavigateToTab}
        onOpenSpendSettings={() => onNavigateToTab("settings")}
        onFilterProduct={() => onNavigateToTab("directory")}
        activeFilterKey={
          filters?.qualification?.length
            ? "qualification"
            : filters?.supplier?.length
            ? "concentration"
            : undefined
        }
      />

      {/* 3. Dedicated Executive Summary & Management Recommendations Panel */}
      <ExecutiveSummaryPanel
        kpis={kpis}
        spendSettings={spendSettings}
        filteredRecords={filteredRecords}
        supplierDimension={supplierDimension}
        selectedMonth={selectedMonth}
        onFilterChange={onFilterChange as any}
        onNavigateToTab={onNavigateToTab}
        onSelectSupplier={onSelectSupplier}
      />

      {/* 4. Quick Action Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-[#2A2740] bg-[#14121F] px-3.5 py-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Scroll to Average Delivery Time */}
          <button
            id="btn-scroll-delivery-panel"
            onClick={() => {
              const el = document.getElementById("panel-avg-delivery-time");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-950/40 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-900/50 hover:border-emerald-400 transition-all shadow-xs group"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded bg-emerald-500/20 text-emerald-300 group-hover:scale-110 transition-transform">
              <Truck className="h-3.5 w-3.5" />
            </div>
            <span>Avg Delivery Time by Each Supplier ({selectedMonth})</span>
            <span className="rounded-full bg-emerald-900/80 px-1.5 py-0.5 text-[10px] text-emerald-200">
              {kpis.avgLeadDays ? `${kpis.avgLeadDays.toFixed(1)}d avg` : "Live SLA"}
            </span>
          </button>

          {/* Interactive Compliance & Spec Quick Access */}
          <button
            onClick={() => onNavigateToTab("compliance")}
            className="flex items-center gap-2 rounded-lg border border-purple-800/40 bg-purple-950/30 px-3 py-1.5 text-xs font-semibold text-purple-300 hover:bg-purple-900/40 hover:border-purple-500 transition-all shadow-xs"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-purple-400" />
            <span>Interactive Compliance & Spec Audit</span>
            <span className="rounded-full bg-purple-900/70 px-1.5 py-0.5 text-[10px] text-purple-200">
              {kpis.certComplianceRate ? `${Math.round(kpis.certComplianceRate)}% OK` : "Audit"}
            </span>
          </button>

          {/* Executive Briefing Shortcut */}
          <button
            onClick={() => {
              const el = document.getElementById("panel-executive-summary");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex items-center gap-2 rounded-lg border border-purple-800/40 bg-purple-950/30 px-3 py-1.5 text-xs font-semibold text-purple-300 hover:bg-purple-900/40 hover:border-purple-500 transition-all shadow-xs"
          >
            <FileText className="h-3.5 w-3.5 text-purple-400" />
            <span>Management Decision Memo</span>
          </button>
        </div>

        <div className="text-[11px] text-[#9B95B0]">
          Active procurement period:{" "}
          <span className="text-[#F5F3FA] font-bold text-purple-300">{selectedMonth}</span>
        </div>
      </div>

      {/* 5. Executive Analytics Row: Gauge + Active Scorecard Top 4 Compliance Donut */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Gauge Chart: Overall Supplier Health Index */}
        <div className="lg:col-span-4">
          <SupplierGauge
            score={kpis.avgSupplierScore}
            qualifiedRate={kpis.qualifiedSupplierRate}
            target={80}
          />
        </div>

        {/* Donut Chart: Active Scorecard for First 4 Best Compliance Suppliers */}
        <div className="lg:col-span-8">
          <TopComplianceDonutChart
            records={filteredRecords}
            onSelectSupplier={onSelectSupplier}
            selectedMonth={selectedMonth}
          />
        </div>
      </div>

      {/* 6. Performance Rankings & Status Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Horizontal Ranking Bar Chart */}
        <div className="lg:col-span-8">
          <SupplierRankingChart
            suppliers={supplierDimension}
            onSelectSupplier={onSelectSupplier}
          />
        </div>

        {/* Interactive Qualification Status Breakdown Panel */}
        <div className="lg:col-span-4 flex flex-col justify-between rounded-xl border border-[#2A2740] bg-[#1B1926] p-4 shadow-sm">
          <div>
            <div className="flex items-center justify-between border-b border-[#2A2740]/60 pb-2.5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F3FA]">
                  Interactive Qualification Status
                </h3>
                <p className="text-[11px] text-[#9B95B0]">Click status button to filter records</p>
              </div>
              <span className="text-xs text-purple-400 font-semibold">
                {filteredRecords.length} Listings
              </span>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              {/* Qualified Status Button */}
              <button
                type="button"
                onClick={() => handleToggleQualification("Qualified")}
                className={`flex w-full items-center justify-between rounded-lg p-2.5 transition-all cursor-pointer ${
                  filters?.qualification?.includes("Qualified")
                    ? "bg-emerald-950/80 border border-emerald-500 ring-1 ring-emerald-500 shadow-md"
                    : "bg-[#14121F] border border-[#2A2740] hover:border-emerald-500/50 hover:bg-[#1B182B]"
                }`}
                title="Click to toggle Qualified filter"
              >
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-sm" />
                  <span className="text-[#F5F3FA] font-semibold">Qualified Tier</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-emerald-400 text-sm">{qualifiedCount}</span>
                  <span className="text-[10px] text-[#9B95B0]">
                    ({filteredRecords.length ? Math.round((qualifiedCount / filteredRecords.length) * 100) : 0}%)
                  </span>
                </div>
              </button>

              {/* Review Status Button */}
              <button
                type="button"
                onClick={() => handleToggleQualification("Review")}
                className={`flex w-full items-center justify-between rounded-lg p-2.5 transition-all cursor-pointer ${
                  filters?.qualification?.includes("Review")
                    ? "bg-amber-950/80 border border-amber-500 ring-1 ring-amber-500 shadow-md"
                    : "bg-[#14121F] border border-[#2A2740] hover:border-amber-500/50 hover:bg-[#1B182B]"
                }`}
                title="Click to toggle Under Review filter"
              >
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400 shadow-sm" />
                  <span className="text-[#F5F3FA] font-semibold">Under QA Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-300 text-sm">{reviewCount}</span>
                  <span className="text-[10px] text-[#9B95B0]">
                    ({filteredRecords.length ? Math.round((reviewCount / filteredRecords.length) * 100) : 0}%)
                  </span>
                </div>
              </button>

              {/* Disqualified Status Button */}
              <button
                type="button"
                onClick={() => handleToggleQualification("Disqualified")}
                className={`flex w-full items-center justify-between rounded-lg p-2.5 transition-all cursor-pointer ${
                  filters?.qualification?.includes("Disqualified")
                    ? "bg-rose-950/80 border border-rose-500 ring-1 ring-rose-500 shadow-md"
                    : "bg-[#14121F] border border-[#2A2740] hover:border-rose-500/50 hover:bg-[#1B182B]"
                }`}
                title="Click to toggle Disqualified filter"
              >
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500 shadow-sm" />
                  <span className="text-[#F5F3FA] font-semibold">Disqualified</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-rose-300 text-sm">{disqualifiedCount}</span>
                  <span className="text-[10px] text-[#9B95B0]">
                    ({filteredRecords.length ? Math.round((disqualifiedCount / filteredRecords.length) * 100) : 0}%)
                  </span>
                </div>
              </button>
            </div>
          </div>

          <div className="mt-4 border-t border-[#2A2740]/60 pt-3">
            <button
              onClick={() => onNavigateToTab("compliance")}
              className="flex w-full items-center justify-between rounded-lg bg-purple-950/40 border border-purple-800/40 px-3 py-2 text-xs font-semibold text-purple-300 hover:bg-purple-900/50 transition-colors"
            >
              <span>View Interactive Compliance Audit</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 7. Average Delivery Time by Each Supplier Panel */}
      <AverageDeliveryTimePanel
        records={filteredRecords}
        onSelectSupplier={onSelectSupplier}
        selectedMonth={selectedMonth}
      />

      {/* 8. Bottom Row: Interactive Market Price/Quality Benchmark + Status Table */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Interactive Market Benchmark Trend / Bar Chart */}
        <div className="lg:col-span-7 rounded-xl border border-[#2A2740] bg-[#1B1926] p-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#2A2740]/60 pb-2.5">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F3FA]">
                Market Competitiveness: Price vs Quality by State
              </h3>
              <p className="text-[11px] text-[#9B95B0]">
                Click any bar or state to filter dashboard • Comparing Price/kg (₦) and Quality (%)
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab("competitiveness")}
              className="text-xs font-medium text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              Deep Dive <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="h-64 w-full pt-3 cursor-pointer">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={marketChartData}
                margin={{ top: 10, right: 10, left: -10, bottom: 25 }}
                onClick={(e: any) => {
                  if (e && e.activeLabel) {
                    handleToggleMarket(e.activeLabel);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#252236" vertical={false} />
                <XAxis
                  dataKey="market"
                  tick={{ fill: "#9B95B0", fontSize: 10, cursor: "pointer" }}
                  axisLine={{ stroke: "#2A2740" }}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  onClick={(e: any) => {
                    if (e && e.value) handleToggleMarket(e.value);
                  }}
                />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  tick={{ fill: "#9B95B0", fontSize: 10 }}
                  axisLine={{ stroke: "#2A2740" }}
                  unit="₦"
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[60, 100]}
                  tick={{ fill: "#9B95B0", fontSize: 10 }}
                  axisLine={{ stroke: "#2A2740" }}
                  unit="%"
                />
                <Tooltip content={<MarketTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: "11px", paddingTop: "6px" }}
                  iconType="circle"
                />
                <Bar
                  yAxisId="left"
                  dataKey="avgPrice"
                  name="Avg Price (₦/kg)"
                  fill="#7C3AED"
                  radius={[4, 4, 0, 0]}
                  barSize={16}
                />
                <Bar
                  yAxisId="right"
                  dataKey="avgQuality"
                  name="Avg Quality (%)"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                  barSize={16}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Interactive Active Supplier Listings Table */}
        <div className="lg:col-span-5 rounded-xl border border-[#2A2740] bg-[#1B1926] p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#2A2740]/60 pb-2.5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F3FA]">
                  Active Supplier Listings
                </h3>
                <p className="text-[11px] text-[#9B95B0]">
                  Click vendor, product, or status to filter or inspect
                </p>
              </div>
              <button
                onClick={() => onNavigateToTab("directory")}
                className="text-xs font-medium text-purple-400 hover:text-purple-300 flex items-center gap-1"
              >
                Directory <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#2A2740] text-[10px] uppercase tracking-wider text-[#9B95B0]">
                    <th className="pb-2 font-semibold">Supplier / ID</th>
                    <th className="pb-2 font-semibold">Product</th>
                    <th className="pb-2 font-semibold text-right">Price/kg</th>
                    <th className="pb-2 font-semibold text-right">Score</th>
                    <th className="pb-2 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#232036]">
                  {sampleRecords.map((r, idx) => {
                    const dotColor =
                      r.qualification === "Qualified"
                        ? "bg-emerald-400"
                        : r.qualification === "Review"
                        ? "bg-amber-400"
                        : "bg-rose-500";

                    return (
                      <tr
                        key={`${r.supplierId}-${idx}`}
                        className="hover:bg-[#201D2F] transition-colors"
                      >
                        <td
                          className="py-2.5 pr-2 cursor-pointer group"
                          onClick={() => {
                            handleToggleSupplier(r.supplier);
                            onSelectSupplier(r.supplierId);
                          }}
                          title="Click to filter by supplier or view in scorecard"
                        >
                          <p className="font-semibold text-[#F5F3FA] group-hover:text-purple-300 truncate max-w-[130px] transition-colors">
                            {r.supplier}
                          </p>
                          <span className="text-[10px] text-purple-400 font-mono">
                            {r.supplierId}
                          </span>
                        </td>
                        <td className="py-2.5 pr-2">
                          <button
                            onClick={() => handleToggleProduct(r.product)}
                            className="text-[#9B95B0] hover:text-emerald-300 truncate max-w-[100px] text-left transition-colors"
                            title={`Click to filter by ${r.product}`}
                          >
                            {r.product}
                          </button>
                        </td>
                        <td className="py-2.5 pr-2 text-right font-medium text-[#F5F3FA]">
                          ₦{r.pricePerKg?.toLocaleString()}
                        </td>
                        <td className="py-2.5 pr-2 text-right font-bold text-purple-300">
                          {r.supplierScore?.toFixed(1)}
                        </td>
                        <td className="py-2.5 text-center">
                          <button
                            onClick={() => handleToggleQualification(r.qualification)}
                            className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium bg-[#14121F] border border-[#2A2740] hover:border-purple-500 transition-colors"
                            title={`Click to filter by ${r.qualification}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
                            <span className="text-[#F5F3FA]">{r.qualification}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-3 border-t border-[#2A2740]/60 pt-2 flex items-center justify-between text-[11px] text-[#9B95B0]">
            <span>Click any item above to filter interactive state</span>
            <span className="text-purple-400 font-semibold">{filteredRecords.length} records active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
