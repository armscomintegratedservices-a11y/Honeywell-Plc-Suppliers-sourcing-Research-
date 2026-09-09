import React, { useState } from "react";
import { RawSupplierRecord } from "../types";
import {
  ArrowUpDown,
  Download,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Sparkles,
  Search,
  ExternalLink,
  Building2,
  MapPin,
  TrendingUp,
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface SupplierDirectoryProps {
  records: RawSupplierRecord[];
  shortlist: string[]; // list of supplierIds or row keys
  onToggleShortlist: (supplierId: string) => void;
  onSelectSupplier: (supplierId: string) => void;
  onOpenAlternatives: (record: RawSupplierRecord) => void;
}

type SortField =
  | "supplierId"
  | "supplier"
  | "product"
  | "category"
  | "market"
  | "pricePerKg"
  | "capacityTonsMonth"
  | "leadDays"
  | "qualityPct"
  | "reliabilityPct"
  | "supplierScore"
  | "qualification"
  | "status";

export const SupplierDirectory: React.FC<SupplierDirectoryProps> = ({
  records,
  shortlist,
  onToggleShortlist,
  onSelectSupplier,
  onOpenAlternatives,
}) => {
  const [localSearch, setLocalSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("supplierScore");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showChart, setShowChart] = useState(true);

  // Filter records by local table search
  const filtered = records.filter((r) => {
    if (!localSearch.trim()) return true;
    const q = localSearch.toLowerCase().trim();
    return (
      r.supplier.toLowerCase().includes(q) ||
      r.supplierId.toLowerCase().includes(q) ||
      r.product.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.market.toLowerCase().includes(q)
    );
  });

  // Sort records
  const sorted = [...filtered].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (typeof aVal === "string") {
      aVal = (aVal as string).toLowerCase();
      bVal = ((bVal as string) || "").toLowerCase();
      return sortOrder === "asc"
        ? (aVal as string).localeCompare(bVal as string)
        : (bVal as string).localeCompare(aVal as string);
    }

    const aNum = (aVal as number) || 0;
    const bNum = (bVal as number) || 0;
    return sortOrder === "asc" ? aNum - bNum : bNum - aNum;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  // Export filtered table to CSV
  const handleExportCsv = () => {
    const headers = [
      "Supplier ID",
      "Supplier Name",
      "Product",
      "Category",
      "Market",
      "Price Per Kg (NGN)",
      "Capacity (Tonnes/Mo)",
      "Lead Days",
      "Quality %",
      "Reliability %",
      "Supplier Score",
      "Qualification",
      "Status",
      "Certification",
      "Cert OK",
      "Delivery OK",
    ];

    const rows = sorted.map((r) => [
      r.supplierId,
      `"${r.supplier.replace(/"/g, '""')}"`,
      `"${r.product.replace(/"/g, '""')}"`,
      `"${r.category.replace(/"/g, '""')}"`,
      `"${r.market}"`,
      r.pricePerKg,
      r.capacityTonsMonth,
      r.leadDays,
      r.qualityPct,
      r.reliabilityPct,
      r.supplierScore,
      r.qualification,
      r.status,
      `"${(r.certification || "").replace(/"/g, '""')}"`,
      r.certOk,
      r.deliveryOk,
    ]);

    const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `HoneyWell_Supplier_Directory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Qualified suppliers per state for the summary chart
  const stateSummaryMap = new Map<string, { total: number; qualified: number }>();
  records.forEach((r) => {
    if (!stateSummaryMap.has(r.market)) {
      stateSummaryMap.set(r.market, { total: 0, qualified: 0 });
    }
    const cur = stateSummaryMap.get(r.market)!;
    cur.total++;
    if (r.qualification === "Qualified") cur.qualified++;
  });

  const stateChartData = Array.from(stateSummaryMap.entries()).map(([market, v]) => ({
    market,
    qualified: v.qualified,
    reviewOrDisqualified: v.total - v.qualified,
    total: v.total,
  }));
  stateChartData.sort((a, b) => b.qualified - a.qualified);

  return (
    <div id="supplier-directory-view" className="space-y-4">
      {/* Top Controls & State Summary Chart */}
      <div className="rounded-xl border border-[#2A2740] bg-[#1B1926] p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2A2740]/60 pb-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#F5F3FA] flex items-center gap-2">
              <Building2 className="h-4 w-4 text-purple-400" />
              Supplier Directory Master List
            </h2>
            <p className="text-xs text-[#9B95B0]">
              Full database of raw-material suppliers across Nigerian processing markets
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Local Search Input */}
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#9B95B0]" />
              <input
                type="text"
                placeholder="Filter table rows..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full rounded-lg border border-[#2A2740] bg-[#14121F] py-1.5 pl-8 pr-3 text-xs text-[#F5F3FA] placeholder-[#9B95B0] focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* Toggle State Summary Chart */}
            <button
              onClick={() => setShowChart(!showChart)}
              className="flex items-center gap-1.5 rounded-lg border border-[#2A2740] bg-[#14121F] px-3 py-1.5 text-xs text-[#9B95B0] hover:text-[#F5F3FA] transition-colors"
            >
              <TrendingUp className="h-3.5 w-3.5 text-purple-400" />
              <span>{showChart ? "Hide State Chart" : "State Breakdown"}</span>
            </button>

            {/* Export CSV Button */}
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 rounded-lg border border-purple-700/60 bg-purple-950/40 px-3 py-1.5 text-xs font-semibold text-purple-300 hover:bg-purple-900/60 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* State Sourcing Coverage Chart */}
        {showChart && (
          <div className="mt-3 pt-1">
            <div className="flex items-center justify-between text-xs text-[#9B95B0] mb-1.5">
              <span className="font-semibold text-[#F5F3FA]">
                Qualified Suppliers by Nigerian Hub (State)
              </span>
              <span className="text-[11px] text-purple-300">
                Green = Qualified • Purple = Under Review / Disqualified
              </span>
            </div>
            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stateChartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#252236" vertical={false} />
                  <XAxis dataKey="market" tick={{ fill: "#9B95B0", fontSize: 10 }} axisLine={{ stroke: "#2A2740" }} />
                  <YAxis tick={{ fill: "#9B95B0", fontSize: 10 }} axisLine={{ stroke: "#2A2740" }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1B1926", borderColor: "#2A2740", fontSize: "11px" }}
                    itemStyle={{ color: "#F5F3FA" }}
                  />
                  <Bar dataKey="qualified" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} name="Qualified" />
                  <Bar dataKey="reviewOrDisqualified" stackId="a" fill="#7C3AED" radius={[4, 4, 0, 0]} name="Review / Disqualified" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Directory Table */}
      <div className="rounded-xl border border-[#2A2740] bg-[#1B1926] shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#14121F] border-b border-[#2A2740] text-[11px] uppercase tracking-wider text-[#9B95B0] select-none">
              <tr>
                <th className="py-3 px-3 w-10 text-center">Shortlist</th>
                <th
                  onClick={() => handleSort("supplierId")}
                  className="py-3 px-3 cursor-pointer hover:text-[#F5F3FA] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    ID
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("supplier")}
                  className="py-3 px-3 cursor-pointer hover:text-[#F5F3FA] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Supplier Name
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("product")}
                  className="py-3 px-3 cursor-pointer hover:text-[#F5F3FA] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Product
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("category")}
                  className="py-3 px-3 cursor-pointer hover:text-[#F5F3FA] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Category
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("market")}
                  className="py-3 px-3 cursor-pointer hover:text-[#F5F3FA] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Market
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("pricePerKg")}
                  className="py-3 px-3 text-right cursor-pointer hover:text-[#F5F3FA] transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    Price/kg
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("capacityTonsMonth")}
                  className="py-3 px-3 text-right cursor-pointer hover:text-[#F5F3FA] transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    Capacity (t)
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("leadDays")}
                  className="py-3 px-3 text-right cursor-pointer hover:text-[#F5F3FA] transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    Lead (d)
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("qualityPct")}
                  className="py-3 px-3 text-right cursor-pointer hover:text-[#F5F3FA] transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    Quality %
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("reliabilityPct")}
                  className="py-3 px-3 text-right cursor-pointer hover:text-[#F5F3FA] transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    Reliability %
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("supplierScore")}
                  className="py-3 px-3 text-right cursor-pointer hover:text-[#F5F3FA] transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    Score
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("qualification")}
                  className="py-3 px-3 text-center cursor-pointer hover:text-[#F5F3FA] transition-colors"
                >
                  <div className="flex items-center justify-center gap-1">
                    Qualification
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#232036]">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={14} className="py-12 text-center text-[#9B95B0]">
                    No suppliers match the active search and filter criteria.
                  </td>
                </tr>
              ) : (
                sorted.map((r, index) => {
                  const isShortlisted = shortlist.includes(r.supplierId);
                  const qualDot =
                    r.qualification === "Qualified"
                      ? "bg-emerald-400"
                      : r.qualification === "Review"
                      ? "bg-amber-400"
                      : "bg-rose-500";

                  return (
                    <tr
                      key={`${r.supplierId}-${index}`}
                      className="hover:bg-[#201D2F] transition-colors group"
                    >
                      {/* Shortlist Star */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => onToggleShortlist(r.supplierId)}
                          className="text-[#9B95B0] hover:text-amber-400 transition-colors"
                          title={isShortlisted ? "Remove from shortlist" : "Add to procurement shortlist"}
                        >
                          <Bookmark
                            className={`h-4 w-4 ${
                              isShortlisted ? "text-amber-400 fill-amber-400" : ""
                            }`}
                          />
                        </button>
                      </td>

                      {/* Supplier ID */}
                      <td className="py-2.5 px-3 font-mono text-purple-400 font-semibold">
                        {r.supplierId}
                      </td>

                      {/* Supplier Name */}
                      <td className="py-2.5 px-3">
                        <button
                          onClick={() => onSelectSupplier(r.supplierId)}
                          className="font-semibold text-[#F5F3FA] hover:text-purple-300 text-left transition-colors"
                        >
                          {r.supplier}
                        </button>
                      </td>

                      {/* Product */}
                      <td className="py-2.5 px-3 text-[#F5F3FA]">{r.product}</td>

                      {/* Category */}
                      <td className="py-2.5 px-3 text-[#9B95B0]">{r.category}</td>

                      {/* Market */}
                      <td className="py-2.5 px-3 text-[#9B95B0]">{r.market}</td>

                      {/* Price Per Kg */}
                      <td className="py-2.5 px-3 text-right font-medium text-[#F5F3FA]">
                        ₦{r.pricePerKg?.toLocaleString()}
                      </td>

                      {/* Capacity */}
                      <td className="py-2.5 px-3 text-right text-[#9B95B0]">
                        {r.capacityTonsMonth?.toLocaleString()} t
                      </td>

                      {/* Lead Days */}
                      <td className="py-2.5 px-3 text-right text-[#9B95B0]">
                        {r.leadDays} d
                      </td>

                      {/* Quality % */}
                      <td className="py-2.5 px-3 text-right font-medium text-emerald-400">
                        {r.qualityPct?.toFixed(1)}%
                      </td>

                      {/* Reliability % */}
                      <td className="py-2.5 px-3 text-right font-medium text-cyan-400">
                        {r.reliabilityPct?.toFixed(1)}%
                      </td>

                      {/* Supplier Score */}
                      <td className="py-2.5 px-3 text-right font-black text-purple-300">
                        {r.supplierScore?.toFixed(1)}
                      </td>

                      {/* Qualification Badge */}
                      <td className="py-2.5 px-3 text-center">
                        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold bg-[#14121F] border border-[#2A2740]">
                          <span className={`h-1.5 w-1.5 rounded-full ${qualDot}`} />
                          <span className="text-[#F5F3FA]">{r.qualification}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onOpenAlternatives(r)}
                            className="rounded-lg bg-[#201D2F] p-1.5 text-purple-400 hover:bg-purple-950 hover:text-purple-300 border border-[#2A2740] transition-colors"
                            title="Find alternative suppliers for this product"
                          >
                            <Sparkles className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => onSelectSupplier(r.supplierId)}
                            className="rounded-lg bg-[#201D2F] p-1.5 text-[#9B95B0] hover:text-[#F5F3FA] border border-[#2A2740] transition-colors"
                            title="Inspect in Supplier Scorecard"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Directory Footer */}
        <div className="border-t border-[#2A2740] bg-[#14121F] px-4 py-2.5 flex items-center justify-between text-xs text-[#9B95B0]">
          <span>
            Showing {sorted.length} of {records.length} records
          </span>
          <span className="text-purple-300">
            {shortlist.length} suppliers shortlisted for monthly committee
          </span>
        </div>
      </div>
    </div>
  );
};
