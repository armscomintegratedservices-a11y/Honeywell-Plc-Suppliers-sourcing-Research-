import React, { useState, useMemo } from "react";
import { RawSupplierRecord } from "../types";
import {
  Truck,
  Clock,
  ArrowUpDown,
  Search,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  TrendingDown,
  Calendar,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

interface AverageDeliveryTimePanelProps {
  records: RawSupplierRecord[];
  onSelectSupplier?: (supplierId: string) => void;
  selectedMonth?: string;
  isCollapsible?: boolean;
}

interface SupplierDeliveryStat {
  supplierId: string;
  supplierName: string;
  market: string;
  origin: string;
  avgLeadDays: number;
  minLeadDays: number;
  maxLeadDays: number;
  routeCount: number;
  deliveryOkRate: number; // % of listings with delivery OK
  avgReliability: number;
  status: string;
}

export const AverageDeliveryTimePanel: React.FC<AverageDeliveryTimePanelProps> = ({
  records,
  onSelectSupplier,
  selectedMonth,
  isCollapsible = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"fastest" | "slowest" | "name">("fastest");
  const [isExpanded, setIsExpanded] = useState(true);

  // Compute average delivery time per supplier from 2026 records
  const supplierDeliveryStats = useMemo(() => {
    const map = new Map<string, RawSupplierRecord[]>();

    records.forEach((r) => {
      if (!map.has(r.supplierId)) {
        map.set(r.supplierId, []);
      }
      map.get(r.supplierId)!.push(r);
    });

    const stats: SupplierDeliveryStat[] = [];

    map.forEach((items, supplierId) => {
      const supplierName = items[0].supplier;
      const market = items[0].market;
      const origin = items[0].origin;
      const routeCount = items.length;

      let sumLead = 0;
      let minLead = Infinity;
      let maxLead = -Infinity;
      let deliveryOkCount = 0;
      let sumRel = 0;

      items.forEach((item) => {
        const lead = item.leadDays || 0;
        sumLead += lead;
        if (lead < minLead) minLead = lead;
        if (lead > maxLead) maxLead = lead;
        if (item.deliveryOk === "Yes") deliveryOkCount++;
        sumRel += item.reliabilityPct || 0;
      });

      const avgLeadDays = routeCount > 0 ? Number((sumLead / routeCount).toFixed(1)) : 0;
      const avgReliability = routeCount > 0 ? Number((sumRel / routeCount).toFixed(1)) : 0;
      const deliveryOkRate = routeCount > 0 ? Math.round((deliveryOkCount / routeCount) * 100) : 0;

      stats.push({
        supplierId,
        supplierName,
        market,
        origin,
        avgLeadDays,
        minLeadDays: minLead === Infinity ? 0 : minLead,
        maxLeadDays: maxLead === -Infinity ? 0 : maxLead,
        routeCount,
        deliveryOkRate,
        avgReliability,
        status: items[0].status || "Active",
      });
    });

    return stats;
  }, [records]);

  // Filter & Sort
  const filteredAndSorted = useMemo(() => {
    let list = [...supplierDeliveryStats];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.supplierName.toLowerCase().includes(q) ||
          s.supplierId.toLowerCase().includes(q) ||
          s.market.toLowerCase().includes(q) ||
          s.origin.toLowerCase().includes(q)
      );
    }

    if (sortOrder === "fastest") {
      list.sort((a, b) => a.avgLeadDays - b.avgLeadDays);
    } else if (sortOrder === "slowest") {
      list.sort((a, b) => b.avgLeadDays - a.avgLeadDays);
    } else {
      list.sort((a, b) => a.supplierName.localeCompare(b.supplierName));
    }

    return list;
  }, [supplierDeliveryStats, searchTerm, sortOrder]);

  // Summary Metrics
  const totalSuppliers = supplierDeliveryStats.length;
  const overallAvgLead =
    totalSuppliers > 0
      ? (
          supplierDeliveryStats.reduce((sum, s) => sum + s.avgLeadDays, 0) / totalSuppliers
        ).toFixed(1)
      : "0";
  const fastest = [...supplierDeliveryStats].sort((a, b) => a.avgLeadDays - b.avgLeadDays)[0];
  const withinSlaCount = supplierDeliveryStats.filter((s) => s.avgLeadDays <= 7).length;
  const withinSlaPct = totalSuppliers > 0 ? Math.round((withinSlaCount / totalSuppliers) * 100) : 0;

  const targetSlaDays = 7.0; // HoneyWell target transit SLA

  return (
    <div
      id="panel-avg-delivery-time"
      className="rounded-xl border border-[#2A2740] bg-[#1B1926] p-4 shadow-sm transition-all"
    >
      {/* Header with Panel Icon */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2A2740]/60 pb-3">
        <div className="flex items-center gap-3">
          {/* Glowing Panel Icon */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600/30 to-purple-600/30 border border-emerald-500/40 text-emerald-300 shadow-md">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#F5F3FA]">
                Average Delivery Time by Each Supplier
              </h3>
              <span className="rounded-full border border-emerald-500/40 bg-emerald-950/70 px-2 py-0.5 text-[10px] font-bold text-emerald-300 uppercase">
                {selectedMonth || "2026 TILL DATE"}
              </span>
            </div>
            <p className="text-xs text-[#9B95B0]">
              Transit lead time benchmarking for {selectedMonth || "2026"} across {records.length} commodity supply routes
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#9B95B0]" />
            <input
              type="text"
              placeholder="Search supplier or hub..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 w-44 sm:w-52 rounded-lg border border-[#2A2740] bg-[#14121F] pl-8 pr-2.5 text-xs text-[#F5F3FA] placeholder-[#9B95B0] focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Sort Switcher */}
          <div className="flex items-center rounded-lg border border-[#2A2740] bg-[#14121F] p-0.5 text-[11px]">
            <button
              onClick={() => setSortOrder("fastest")}
              className={`rounded-md px-2.5 py-1 font-semibold transition-all ${
                sortOrder === "fastest"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-[#9B95B0] hover:text-[#F5F3FA]"
              }`}
            >
              Fastest
            </button>
            <button
              onClick={() => setSortOrder("slowest")}
              className={`rounded-md px-2.5 py-1 font-semibold transition-all ${
                sortOrder === "slowest"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-[#9B95B0] hover:text-[#F5F3FA]"
              }`}
            >
              Slowest
            </button>
            <button
              onClick={() => setSortOrder("name")}
              className={`rounded-md px-2.5 py-1 font-semibold transition-all ${
                sortOrder === "name"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-[#9B95B0] hover:text-[#F5F3FA]"
              }`}
            >
              A-Z
            </button>
          </div>

          {isCollapsible && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="rounded-lg border border-[#2A2740] bg-[#14121F] px-2.5 py-1.5 text-xs text-[#9B95B0] hover:text-[#F5F3FA]"
            >
              {isExpanded ? "Collapse" : "Expand"}
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Quick Metrics Bar */}
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div className="rounded-lg border border-[#2A2740] bg-[#14121F] p-2.5">
              <span className="text-[10px] uppercase font-semibold text-[#9B95B0] flex items-center gap-1">
                <Clock className="h-3 w-3 text-blue-400" />
                Fleet Avg Transit
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-lg font-black text-[#F5F3FA]">{overallAvgLead}</span>
                <span className="text-[11px] text-[#9B95B0]">days</span>
              </div>
            </div>

            <div className="rounded-lg border border-[#2A2740] bg-[#14121F] p-2.5">
              <span className="text-[10px] uppercase font-semibold text-[#9B95B0] flex items-center gap-1">
                <TrendingDown className="h-3 w-3 text-emerald-400" />
                Fastest Supplier
              </span>
              <div className="mt-1 flex items-baseline justify-between truncate">
                <span className="text-lg font-black text-emerald-400">
                  {fastest ? fastest.avgLeadDays : 0}d
                </span>
                <span className="text-[10px] text-[#9B95B0] truncate ml-1">
                  {fastest ? fastest.supplierName.replace("Ltd", "") : "N/A"}
                </span>
              </div>
            </div>

            <div className="rounded-lg border border-[#2A2740] bg-[#14121F] p-2.5">
              <span className="text-[10px] uppercase font-semibold text-[#9B95B0] flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-purple-400" />
                SLA Adherence (≤7d)
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-lg font-black text-purple-300">{withinSlaPct}%</span>
                <span className="text-[11px] text-[#9B95B0]">
                  ({withinSlaCount}/{totalSuppliers})
                </span>
              </div>
            </div>

            <div className="rounded-lg border border-[#2A2740] bg-[#14121F] p-2.5">
              <span className="text-[10px] uppercase font-semibold text-[#9B95B0] flex items-center gap-1">
                <Calendar className="h-3 w-3 text-cyan-400" />
                Tracking Window
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-sm font-bold text-cyan-300">Jan 2026 – To Date</span>
              </div>
            </div>
          </div>

          {/* Supplier Transit Rankings List */}
          <div className="mt-3 max-h-[380px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {filteredAndSorted.map((s, idx) => {
              const isOptimal = s.avgLeadDays <= 5;
              const isStandard = s.avgLeadDays > 5 && s.avgLeadDays <= 9;
              const isDelayed = s.avgLeadDays >= 10;

              const badgeColor = isOptimal
                ? "bg-emerald-950/70 border-emerald-500/40 text-emerald-300"
                : isStandard
                ? "bg-cyan-950/70 border-cyan-500/40 text-cyan-300"
                : "bg-rose-950/70 border-rose-500/40 text-rose-300";

              const barColor = isOptimal
                ? "bg-emerald-500"
                : isStandard
                ? "bg-cyan-400"
                : "bg-rose-500";

              // Max lead day scale (20 days max)
              const barWidthPct = Math.min(100, Math.max(8, (s.avgLeadDays / 20) * 100));

              return (
                <div
                  key={s.supplierId}
                  onClick={() => onSelectSupplier && onSelectSupplier(s.supplierId)}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-lg border border-[#2A2740] bg-[#14121F] p-2.5 hover:border-emerald-500/50 hover:bg-[#1c192c] transition-all cursor-pointer shadow-xs"
                >
                  {/* Left: Rank, Supplier Info & Hub */}
                  <div className="flex items-center gap-3 min-w-[240px]">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#252236] text-[11px] font-bold text-[#9B95B0] group-hover:bg-emerald-950 group-hover:text-emerald-300 transition-colors">
                      {idx + 1}
                    </span>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#F5F3FA] group-hover:text-emerald-300 transition-colors truncate">
                          {s.supplierName}
                        </span>
                        <span className="text-[10px] font-mono text-purple-400">
                          {s.supplierId}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-[#9B95B0]">
                        <span className="flex items-center gap-0.5">
                          <MapPin className="h-2.5 w-2.5 text-purple-400" />
                          {s.market} State Hub
                        </span>
                        <span>•</span>
                        <span>{s.routeCount} listing routes</span>
                        <span>•</span>
                        <span>Rel: {s.avgReliability}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Visual Transit Bar & Days */}
                  <div className="flex-1 max-w-[280px] w-full px-2">
                    <div className="flex items-center justify-between text-[10px] text-[#9B95B0] mb-1">
                      <span>Transit Lead Time</span>
                      <span className="font-bold text-[#F5F3FA]">{s.avgLeadDays} days</span>
                    </div>
                    <div className="relative h-2 w-full rounded-full bg-[#252236] overflow-hidden">
                      {/* SLA 7d line marker */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-purple-400/80 z-10"
                        style={{ left: `${(targetSlaDays / 20) * 100}%` }}
                        title="Target SLA: 7 Days"
                      />
                      <div
                        className={`h-full rounded-full transition-all ${barColor}`}
                        style={{ width: `${barWidthPct}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-[#9B95B0] mt-0.5">
                      <span>Min: {s.minLeadDays}d</span>
                      <span className="text-purple-400 font-medium">SLA: 7d</span>
                      <span>Max: {s.maxLeadDays}d</span>
                    </div>
                  </div>

                  {/* Right: Status Pill & Delivery OK badge */}
                  <div className="flex items-center justify-end gap-2 shrink-0">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${badgeColor}`}
                    >
                      {isOptimal ? (
                        <>
                          <CheckCircle2 className="h-3 w-3" />
                          Fast Delivery
                        </>
                      ) : isStandard ? (
                        <>
                          <Clock className="h-3 w-3" />
                          Standard Route
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-3 w-3" />
                          High Lead Time
                        </>
                      )}
                    </span>

                    <span className="rounded-md bg-[#252236] px-2 py-1 text-[10px] font-semibold text-purple-300">
                      {s.deliveryOkRate}% OK
                    </span>

                    <ChevronRight className="h-4 w-4 text-[#9B95B0] group-hover:text-emerald-300 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })}

            {filteredAndSorted.length === 0 && (
              <div className="rounded-lg border border-dashed border-[#2A2740] p-6 text-center text-xs text-[#9B95B0]">
                No suppliers match your search query.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
