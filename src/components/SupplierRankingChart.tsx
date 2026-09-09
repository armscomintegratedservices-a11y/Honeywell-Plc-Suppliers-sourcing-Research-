import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { SupplierDimensionRecord } from "../types";
import { Award, ArrowUpDown } from "lucide-react";

interface SupplierRankingChartProps {
  suppliers: SupplierDimensionRecord[];
  onSelectSupplier?: (supplierId: string) => void;
}

export const SupplierRankingChart: React.FC<SupplierRankingChartProps> = ({
  suppliers,
  onSelectSupplier,
}) => {
  const [metric, setMetric] = useState<"score" | "spend">("score");

  // Take top 7 suppliers based on active metric
  const sorted = [...suppliers].sort((a, b) => {
    if (metric === "spend") {
      return b.estimatedSpendPotential - a.estimatedSpendPotential;
    }
    return b.avgSupplierScore - a.avgSupplierScore;
  });

  const topSuppliers = sorted.slice(0, 7).map((s) => ({
    id: s.supplierId,
    name: s.supplierName.length > 18 ? s.supplierName.substring(0, 16) + "…" : s.supplierName,
    fullName: s.supplierName,
    score: parseFloat(s.avgSupplierScore.toFixed(1)),
    spendM: parseFloat((s.estimatedSpendPotential / 1e6).toFixed(2)),
    market: s.market,
    qualification: s.overallQualification,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-xl border border-[#2A2740] bg-[#1B1926] p-3 shadow-xl text-xs">
          <p className="font-bold text-[#F5F3FA]">{data.fullName}</p>
          <div className="mt-1 space-y-0.5 text-[#9B95B0]">
            <p>ID: <span className="text-purple-300 font-mono">{data.id}</span></p>
            <p>Market: <span className="text-[#F5F3FA]">{data.market}</span></p>
            <p>Supplier Score: <span className="text-emerald-400 font-bold">{data.score} / 100</span></p>
            <p>Est. Spend Potential: <span className="text-purple-400 font-bold">₦{data.spendM}M</span></p>
            <p>Qualification: <span className="text-[#F5F3FA]">{data.qualification}</span></p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      id="supplier-ranking-card"
      className="flex flex-col rounded-xl border border-[#2A2740] bg-[#1B1926] p-4 shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-[#2A2740]/60 pb-2.5">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F3FA]">
            Top Supplier Rankings
          </h3>
          <p className="text-[11px] text-[#9B95B0]">
            Comparative performance across evaluated partners
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-[#14121F] p-1 border border-[#2A2740]">
          <button
            onClick={() => setMetric("score")}
            className={`rounded-md px-2 py-0.5 text-[11px] font-medium transition-all ${
              metric === "score"
                ? "bg-purple-600 text-white"
                : "text-[#9B95B0] hover:text-[#F5F3FA]"
            }`}
          >
            Score
          </button>
          <button
            onClick={() => setMetric("spend")}
            className={`rounded-md px-2 py-0.5 text-[11px] font-medium transition-all ${
              metric === "spend"
                ? "bg-purple-600 text-white"
                : "text-[#9B95B0] hover:text-[#F5F3FA]"
            }`}
          >
            Spend
          </button>
        </div>
      </div>

      {/* Horizontal Bar Chart */}
      <div className="h-52 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={topSuppliers}
            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
          >
            <XAxis
              type="number"
              domain={metric === "score" ? [0, 100] : [0, "auto"]}
              tick={{ fill: "#9B95B0", fontSize: 10 }}
              axisLine={{ stroke: "#2A2740" }}
              tickLine={{ stroke: "#2A2740" }}
              unit={metric === "score" ? " pts" : "M"}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: "#F5F3FA", fontSize: 11 }}
              axisLine={{ stroke: "#2A2740" }}
              tickLine={false}
              width={110}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(124, 58, 237, 0.08)" }} />
            <Bar
              dataKey={metric === "score" ? "score" : "spendM"}
              radius={[0, 6, 6, 0]}
              barSize={14}
              onClick={(entry) => onSelectSupplier && onSelectSupplier(entry.id)}
              className="cursor-pointer"
            >
              {topSuppliers.map((entry, index) => {
                const colors = [
                  "#8B5CF6", // primary purple
                  "#7C3AED",
                  "#6D28D9",
                  "#5B21B6",
                  "#4C1D95",
                  "#3B1877",
                  "#2E1065",
                ];
                return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between border-t border-[#2A2740]/60 pt-2 text-[10px] text-[#9B95B0]">
        <span>Click bar to inspect in scorecard</span>
        <span className="text-purple-400">Showing top {topSuppliers.length}</span>
      </div>
    </div>
  );
};
