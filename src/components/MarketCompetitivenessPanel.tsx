import React, { useState } from "react";
import { RawSupplierRecord, MarketCompetitivenessItem } from "../types";
import { computeMarketCompetitiveness } from "../lib/aggregations";
import {
  Globe2,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  CheckCircle2,
  Layers,
  MapPin,
} from "lucide-react";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

interface MarketCompetitivenessPanelProps {
  allRecords: RawSupplierRecord[];
  onSelectMarket?: (market: string) => void;
}

export const MarketCompetitivenessPanel: React.FC<MarketCompetitivenessPanelProps> = ({
  allRecords,
  onSelectMarket,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [filterView, setFilterView] = useState<"all" | "opportunities" | "suboptimal">("all");

  const competitivenessData = computeMarketCompetitiveness(allRecords);

  // Extract unique categories
  const categories = Array.from(new Set(competitivenessData.map((d) => d.category))).sort();

  // Filtered dataset
  const filtered = competitivenessData.filter((item) => {
    if (selectedCategory !== "all" && item.category !== selectedCategory) {
      return false;
    }
    if (filterView === "opportunities" && !item.isPotentialOpportunity) {
      return false;
    }
    if (filterView === "suboptimal" && !item.isSuboptimalSourcing) {
      return false;
    }
    return true;
  });

  const opportunitiesCount = competitivenessData.filter((d) => d.isPotentialOpportunity).length;
  const suboptimalCount = competitivenessData.filter((d) => d.isSuboptimalSourcing).length;

  // Scatter chart data: Price vs Quality
  const scatterData = filtered.map((d) => ({
    name: `${d.market} - ${d.category}`,
    price: Math.round(d.avgPricePerKg),
    quality: parseFloat(d.avgQualityPct.toFixed(1)),
    demand: parseFloat(d.avgDemandIndex.toFixed(1)),
    market: d.market,
    category: d.category,
    isOpp: d.isPotentialOpportunity,
    isSub: d.isSuboptimalSourcing,
  }));

  const CustomScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-xl border border-[#2A2740] bg-[#1B1926] p-3 shadow-xl text-xs">
          <p className="font-bold text-[#F5F3FA] flex items-center gap-1.5">
            <MapPin className="h-3 w-3 text-purple-400" />
            {data.market} ({data.category})
          </p>
          <div className="mt-1.5 space-y-1 text-[#9B95B0]">
            <p>Avg Price: <strong className="text-[#F5F3FA]">₦{data.price}/kg</strong></p>
            <p>Avg Quality: <strong className="text-emerald-400">{data.quality}%</strong></p>
            <p>Demand Index: <strong className="text-purple-300">{data.demand}</strong></p>
            {data.isOpp && (
              <span className="inline-block rounded bg-emerald-950 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-800">
                ✨ Sourcing Opportunity
              </span>
            )}
            {data.isSub && (
              <span className="inline-block rounded bg-rose-950 px-1.5 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-800">
                ⚠️ Suboptimal Price/Quality
              </span>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="market-competitiveness-view" className="space-y-4">
      {/* Header & Strategic Insight Overview */}
      <div className="rounded-xl border border-[#2A2740] bg-[#1B1926] p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2A2740]/60 pb-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#F5F3FA] flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-purple-400" />
              Market Competitiveness & Price Arbitrage Analysis
            </h2>
            <p className="text-xs text-[#9B95B0]">
              Management Question #5: Benchmarking regional price vs quality trade-offs across 12 Nigerian processing hubs
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-lg border border-[#2A2740] bg-[#14121F] px-3 py-1.5 text-xs text-[#F5F3FA] focus:border-purple-500 focus:outline-none cursor-pointer"
            >
              <option value="all">All Raw Material Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <div className="flex items-center rounded-lg border border-[#2A2740] bg-[#14121F] p-1 text-xs">
              <button
                onClick={() => setFilterView("all")}
                className={`rounded px-2 py-0.5 font-medium transition-colors ${
                  filterView === "all" ? "bg-purple-600 text-white" : "text-[#9B95B0] hover:text-[#F5F3FA]"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterView("opportunities")}
                className={`rounded px-2 py-0.5 font-medium transition-colors ${
                  filterView === "opportunities" ? "bg-emerald-600 text-white" : "text-[#9B95B0] hover:text-[#F5F3FA]"
                }`}
              >
                Opportunities ({opportunitiesCount})
              </button>
              <button
                onClick={() => setFilterView("suboptimal")}
                className={`rounded px-2 py-0.5 font-medium transition-colors ${
                  filterView === "suboptimal" ? "bg-rose-600 text-white" : "text-[#9B95B0] hover:text-[#F5F3FA]"
                }`}
              >
                Suboptimal ({suboptimalCount})
              </button>
            </div>
          </div>
        </div>

        {/* Actionable Strategy Takeaway Tiles */}
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-emerald-800/40 bg-emerald-950/20 p-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
              <Sparkles className="h-4 w-4" />
              <span>Potential Sourcing Arbitrage Opportunities</span>
            </div>
            <p className="text-[#9B95B0] text-[11px] leading-relaxed">
              Markets flagged with <strong className="text-emerald-300">Opportunity</strong> offer unit prices
              at least 5% lower than national benchmarks while sustaining Quality ratings ≥ 85%. Prioritize
              increasing purchase allocations in these regional clusters.
            </p>
          </div>

          <div className="rounded-lg border border-rose-800/40 bg-rose-950/20 p-3 text-xs">
            <div className="flex items-center gap-2 text-rose-400 font-bold mb-1">
              <AlertTriangle className="h-4 w-4" />
              <span>Suboptimal Cost/Quality Hotspots</span>
            </div>
            <p className="text-[#9B95B0] text-[11px] leading-relaxed">
              Markets flagged with <strong className="text-rose-300">Suboptimal</strong> exhibit unit pricing
              above average alongside sub-par quality metrics. These routes warrant immediate contract renegotiations
              or volume diversion to alternative supply states.
            </p>
          </div>
        </div>
      </div>

      {/* Scatter Chart: Price vs Quality Correlation */}
      <div className="rounded-xl border border-[#2A2740] bg-[#1B1926] p-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#2A2740]/60 pb-2.5">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F3FA]">
              Price vs Quality Frontier (Nigerian Hubs)
            </h3>
            <p className="text-[11px] text-[#9B95B0]">
              Optimal sourcing quadrant: Bottom-Right (Lower Price / Higher Quality)
            </p>
          </div>
          <span className="text-[10px] text-purple-300">
            Bubble size proportional to Demand Index
          </span>
        </div>

        <div className="h-72 w-full pt-3">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#252236" />
              <XAxis
                type="number"
                dataKey="price"
                name="Price (₦/kg)"
                tick={{ fill: "#9B95B0", fontSize: 10 }}
                axisLine={{ stroke: "#2A2740" }}
                unit="₦"
              />
              <YAxis
                type="number"
                dataKey="quality"
                name="Quality %"
                domain={[60, 100]}
                tick={{ fill: "#9B95B0", fontSize: 10 }}
                axisLine={{ stroke: "#2A2740" }}
                unit="%"
              />
              <ZAxis type="number" dataKey="demand" range={[60, 260]} />
              <Tooltip content={<CustomScatterTooltip />} />
              <Scatter
                name="Market Hubs"
                data={scatterData}
                fill="#8B5CF6"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Market & Category Benchmarking Table */}
      <div className="rounded-xl border border-[#2A2740] bg-[#1B1926] shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#14121F] border-b border-[#2A2740] text-[11px] uppercase tracking-wider text-[#9B95B0]">
              <tr>
                <th className="py-3 px-3">Market (State)</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-right">Avg Price/kg</th>
                <th className="py-3 px-3 text-right">Avg Quality</th>
                <th className="py-3 px-3 text-right">Demand Index</th>
                <th className="py-3 px-3 text-right">Cust Quality %</th>
                <th className="py-3 px-3 text-right">Complaints %</th>
                <th className="py-3 px-3 text-center">Suppliers</th>
                <th className="py-3 px-3 text-center">Competitive Assessment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#232036]">
              {filtered.map((item, idx) => (
                <tr
                  key={`${item.market}-${item.category}-${idx}`}
                  className="hover:bg-[#201D2F] transition-colors"
                >
                  <td className="py-2.5 px-3 font-semibold text-[#F5F3FA]">
                    {item.market}
                  </td>
                  <td className="py-2.5 px-3 text-[#9B95B0]">{item.category}</td>
                  <td className="py-2.5 px-3 text-right font-medium text-[#F5F3FA]">
                    ₦{Math.round(item.avgPricePerKg).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                    {item.avgQualityPct.toFixed(1)}%
                  </td>
                  <td className="py-2.5 px-3 text-right text-purple-300">
                    {item.avgDemandIndex.toFixed(1)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-[#F5F3FA]">
                    {item.avgCustomerQualityPct.toFixed(1)}%
                  </td>
                  <td className="py-2.5 px-3 text-right font-medium text-rose-400">
                    {item.avgComplaintsPct.toFixed(1)}%
                  </td>
                  <td className="py-2.5 px-3 text-center text-[#9B95B0]">
                    {item.qualifiedCount} / {item.supplierCount} qual
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {item.isPotentialOpportunity ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/80 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-800">
                        <Sparkles className="h-3 w-3 text-emerald-400" />
                        Opportunity Hub
                      </span>
                    ) : item.isSuboptimalSourcing ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-950/80 px-2.5 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-800">
                        <AlertTriangle className="h-3 w-3 text-rose-400" />
                        Suboptimal Mix
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#9B95B0]">Market Standard</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-[#2A2740] bg-[#14121F] px-4 py-2.5 flex items-center justify-between text-xs text-[#9B95B0]">
          <span>Displaying {filtered.length} regional market-category pairs</span>
          <span className="text-purple-300">Source: HoneyWell Sourcing Benchmark Grid</span>
        </div>
      </div>
    </div>
  );
};
