import React, { useState, useMemo } from "react";
import { RawSupplierRecord, FilterState } from "../types";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Filter,
  Download,
  Building2,
  Lock,
  Layers,
  RotateCcw,
  Sparkles,
  Info,
  Check,
  X,
  SlidersHorizontal,
} from "lucide-react";

interface ComplianceRiskTableProps {
  records: RawSupplierRecord[];
  onSelectSupplier: (supplierId: string) => void;
  onFilterChange?: (filters: FilterState) => void;
  globalFilters?: FilterState;
}

export const ComplianceRiskTable: React.FC<ComplianceRiskTableProps> = ({
  records,
  onSelectSupplier,
  onFilterChange,
  globalFilters,
}) => {
  // Interactive Filter States
  const [activeTileFilter, setActiveTileFilter] = useState<
    "all" | "full_compliance" | "compliant_capacity" | "cert_deficiencies" | "delivery_risk"
  >("all");

  const [specFilter, setSpecFilter] = useState<"all" | "fully" | "partial">("all");
  const [certFilter, setCertFilter] = useState<string>("all");
  const [deliveryFilter, setDeliveryFilter] = useState<"all" | "ok" | "fail">("all");
  const [qualificationFilter, setQualificationFilter] = useState<
    "all" | "Qualified" | "Review" | "Disqualified"
  >("all");
  const [activeSearch, setActiveSearch] = useState("");

  // Handler to toggle summary tiles
  const handleTileClick = (
    tile: "full_compliance" | "compliant_capacity" | "cert_deficiencies" | "delivery_risk"
  ) => {
    if (activeTileFilter === tile) {
      setActiveTileFilter("all");
    } else {
      setActiveTileFilter(tile);
    }
  };

  // Reset all active compliance & spec filters
  const handleResetFilters = () => {
    setActiveTileFilter("all");
    setSpecFilter("all");
    setCertFilter("all");
    setDeliveryFilter("all");
    setQualificationFilter("all");
    setActiveSearch("");
  };

  // Filter records based on active interactive selections
  const filtered = useMemo(() => {
    let result = [...records];

    // 1. Tile Filter
    if (activeTileFilter === "full_compliance") {
      result = result.filter(
        (r) =>
          r.specMatch.toLowerCase().includes("fully") &&
          r.certOk === "Yes" &&
          r.deliveryOk === "Yes"
      );
    } else if (activeTileFilter === "compliant_capacity") {
      result = result
        .filter(
          (r) =>
            r.specMatch.toLowerCase().includes("fully") &&
            r.certOk === "Yes" &&
            r.deliveryOk === "Yes"
        )
        .sort((a, b) => (b.capacityTonsMonth || 0) - (a.capacityTonsMonth || 0));
    } else if (activeTileFilter === "cert_deficiencies") {
      result = result.filter((r) => r.certOk === "No");
    } else if (activeTileFilter === "delivery_risk") {
      result = result.filter((r) => r.deliveryOk === "No");
    }

    // 2. Spec Match Filter
    if (specFilter === "fully") {
      result = result.filter((r) => r.specMatch.toLowerCase().includes("fully"));
    } else if (specFilter === "partial") {
      result = result.filter((r) => r.specMatch.toLowerCase().includes("partial"));
    }

    // 3. Certification Filter
    if (certFilter === "cert_ok") {
      result = result.filter((r) => r.certOk === "Yes");
    } else if (certFilter === "cert_no") {
      result = result.filter((r) => r.certOk === "No");
    } else if (certFilter !== "all") {
      result = result.filter((r) =>
        (r.certification || "").toLowerCase().includes(certFilter.toLowerCase())
      );
    }

    // 4. Delivery OK Filter
    if (deliveryFilter === "ok") {
      result = result.filter((r) => r.deliveryOk === "Yes");
    } else if (deliveryFilter === "fail") {
      result = result.filter((r) => r.deliveryOk === "No");
    }

    // 5. Qualification Filter
    if (qualificationFilter !== "all") {
      result = result.filter((r) => r.qualification === qualificationFilter);
    }

    // 6. Local Search
    if (activeSearch.trim()) {
      const q = activeSearch.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.supplier.toLowerCase().includes(q) ||
          r.supplierId.toLowerCase().includes(q) ||
          r.product.toLowerCase().includes(q) ||
          r.specMatch.toLowerCase().includes(q) ||
          (r.certification || "").toLowerCase().includes(q)
      );
    }

    return result;
  }, [
    records,
    activeTileFilter,
    specFilter,
    certFilter,
    deliveryFilter,
    qualificationFilter,
    activeSearch,
  ]);

  // Total and Compliance statistics for the entire dataset
  const totalCount = records.length;
  const fullyCompliantCount = records.filter(
    (r) =>
      r.specMatch.toLowerCase().includes("fully") &&
      r.certOk === "Yes" &&
      r.deliveryOk === "Yes"
  ).length;

  const certIssuesCount = records.filter((r) => r.certOk === "No").length;
  const deliveryIssuesCount = records.filter((r) => r.deliveryOk === "No").length;
  const compliantCapacity = records
    .filter(
      (r) =>
        r.specMatch.toLowerCase().includes("fully") &&
        r.certOk === "Yes" &&
        r.deliveryOk === "Yes"
    )
    .reduce((sum, r) => sum + (r.capacityTonsMonth || 0), 0);

  // Check if any interactive filter is active
  const hasActiveFilters =
    activeTileFilter !== "all" ||
    specFilter !== "all" ||
    certFilter !== "all" ||
    deliveryFilter !== "all" ||
    qualificationFilter !== "all" ||
    activeSearch.trim() !== "";

  // Common statutory certifications
  const certOptions = ["NAFDAC", "SON", "ISO 9001", "ISO 22000", "HACCP"];

  return (
    <div id="compliance-risk-view" className="space-y-4">
      {/* 1. Header & Interactive Metric Cards */}
      <div className="rounded-xl border border-[#2A2740] bg-[#1B1926] p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2A2740]/60 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#F5F3FA] flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Compliance, Specification & Delivery Audit
              </h2>
              <span className="rounded-full bg-purple-950 border border-purple-800/60 px-2 py-0.5 text-[10px] font-semibold text-purple-300">
                Interactive Dataset Drilldown
              </span>
            </div>
            <p className="text-xs text-[#9B95B0] mt-0.5">
              Click any card, spec pill, or certification tag to filter the active dataset in real-time
            </p>
          </div>

          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 rounded-lg border border-[#2A2740] bg-[#14121F] px-3 py-1.5 text-xs text-[#9B95B0] hover:text-[#F5F3FA] hover:border-purple-500 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5 text-purple-400" />
                <span>Reset Filters</span>
              </button>
            )}

            {/* Quick Toggle: Fully Compliant Only */}
            <button
              id="fully-compliant-toggle"
              onClick={() => handleTileClick("full_compliance")}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all shadow-sm ${
                activeTileFilter === "full_compliance"
                  ? "bg-emerald-600 text-white ring-2 ring-emerald-400 shadow-emerald-950/50"
                  : "bg-[#14121F] text-[#9B95B0] border border-[#2A2740] hover:text-[#F5F3FA] hover:border-emerald-500"
              }`}
            >
              <CheckCircle2
                className={`h-4 w-4 ${
                  activeTileFilter === "full_compliance" ? "text-white" : "text-emerald-400"
                }`}
              />
              <span>Fully Compliant Only</span>
              <span className="rounded-full bg-emerald-950 px-2 py-0.5 text-[10px] text-emerald-300">
                {fullyCompliantCount} listings
              </span>
            </button>
          </div>
        </div>

        {/* 4 Interactive Compliance Summary Tiles (Clickable to Filter) */}
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Tile 1: Full Sourcing Compliance */}
          <button
            type="button"
            onClick={() => handleTileClick("full_compliance")}
            className={`text-left rounded-lg border p-3 text-xs transition-all cursor-pointer relative group ${
              activeTileFilter === "full_compliance"
                ? "border-emerald-500 bg-emerald-950/30 ring-2 ring-emerald-400/60 shadow-md"
                : "border-[#2A2740] bg-[#14121F] hover:border-emerald-500/60 hover:bg-[#1a1727]"
            }`}
          >
            <div className="flex items-center justify-between text-[10px] uppercase font-semibold text-[#9B95B0]">
              <span>Full Sourcing Compliance</span>
              <span className="text-emerald-400 opacity-80 group-hover:opacity-100 text-[10px]">
                {activeTileFilter === "full_compliance" ? "● Active Filter" : "Click to Filter"}
              </span>
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-xl font-black text-emerald-400">
                {totalCount ? Math.round((fullyCompliantCount / totalCount) * 100) : 0}%
              </span>
              <span className="text-[#9B95B0] text-[11px] font-medium">
                {fullyCompliantCount} of {totalCount} listings
              </span>
            </div>
            <p className="mt-1 text-[10px] text-[#9B95B0]">
              Matches Spec + Cert OK + Delivery OK
            </p>
          </button>

          {/* Tile 2: Compliant Supply Capacity */}
          <button
            type="button"
            onClick={() => handleTileClick("compliant_capacity")}
            className={`text-left rounded-lg border p-3 text-xs transition-all cursor-pointer relative group ${
              activeTileFilter === "compliant_capacity"
                ? "border-purple-500 bg-purple-950/30 ring-2 ring-purple-400/60 shadow-md"
                : "border-[#2A2740] bg-[#14121F] hover:border-purple-500/60 hover:bg-[#1a1727]"
            }`}
          >
            <div className="flex items-center justify-between text-[10px] uppercase font-semibold text-[#9B95B0]">
              <span>Compliant Supply Capacity</span>
              <span className="text-purple-300 opacity-80 group-hover:opacity-100 text-[10px]">
                {activeTileFilter === "compliant_capacity" ? "● Active Filter" : "Click to Filter"}
              </span>
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-xl font-black text-purple-300">
                {compliantCapacity.toLocaleString()} t
              </span>
              <span className="text-[#9B95B0] text-[11px]">per month</span>
            </div>
            <p className="mt-1 text-[10px] text-[#9B95B0]">
              Total monthly tonnage from zero-defect suppliers
            </p>
          </button>

          {/* Tile 3: Certification Deficiencies */}
          <button
            type="button"
            onClick={() => handleTileClick("cert_deficiencies")}
            className={`text-left rounded-lg border p-3 text-xs transition-all cursor-pointer relative group ${
              activeTileFilter === "cert_deficiencies"
                ? "border-rose-500 bg-rose-950/30 ring-2 ring-rose-400/60 shadow-md"
                : "border-[#2A2740] bg-[#14121F] hover:border-rose-500/60 hover:bg-[#1a1727]"
            }`}
          >
            <div className="flex items-center justify-between text-[10px] uppercase font-semibold text-[#9B95B0]">
              <span>Certification Deficiencies</span>
              <span className="text-rose-400 opacity-80 group-hover:opacity-100 text-[10px]">
                {activeTileFilter === "cert_deficiencies" ? "● Active Filter" : "Click to Filter"}
              </span>
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-xl font-black text-rose-400">{certIssuesCount}</span>
              <span className="text-[10px] text-rose-300/80">Action Required</span>
            </div>
            <p className="mt-1 text-[10px] text-[#9B95B0]">
              Missing or unverified NAFDAC / SON / ISO documentation
            </p>
          </button>

          {/* Tile 4: Delivery Logistics Risk */}
          <button
            type="button"
            onClick={() => handleTileClick("delivery_risk")}
            className={`text-left rounded-lg border p-3 text-xs transition-all cursor-pointer relative group ${
              activeTileFilter === "delivery_risk"
                ? "border-amber-500 bg-amber-950/30 ring-2 ring-amber-400/60 shadow-md"
                : "border-[#2A2740] bg-[#14121F] hover:border-amber-500/60 hover:bg-[#1a1727]"
            }`}
          >
            <div className="flex items-center justify-between text-[10px] uppercase font-semibold text-[#9B95B0]">
              <span>Delivery Logistics Risk</span>
              <span className="text-amber-400 opacity-80 group-hover:opacity-100 text-[10px]">
                {activeTileFilter === "delivery_risk" ? "● Active Filter" : "Click to Filter"}
              </span>
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-xl font-black text-amber-400">{deliveryIssuesCount}</span>
              <span className="text-[10px] text-amber-300/80">Transit Red Flags</span>
            </div>
            <p className="mt-1 text-[10px] text-[#9B95B0]">
              Suppliers with recurring lead time breaches or delivery failures
            </p>
          </button>
        </div>

        {/* 2. Interactive Quick Spec & Certification Filter Rail */}
        <div className="mt-4 pt-3 border-t border-[#2A2740]/60 space-y-2.5">
          {/* Active Filter Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#9B95B0] flex items-center gap-1">
                <SlidersHorizontal className="h-3 w-3 text-purple-400" />
                Active Filters:
              </span>

              {specFilter !== "all" && (
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-950/70 border border-emerald-500/50 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
                  Spec: {specFilter === "fully" ? "Fully Match" : "Partial Match"}
                  <button
                    onClick={() => setSpecFilter("all")}
                    className="ml-1 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              )}

              {certFilter !== "all" && (
                <span className="inline-flex items-center gap-1 rounded-md bg-purple-950/70 border border-purple-500/50 px-2 py-0.5 text-[11px] font-semibold text-purple-300">
                  Cert: {certFilter === "cert_ok" ? "Valid (OK)" : certFilter === "cert_no" ? "Deficient" : certFilter}
                  <button
                    onClick={() => setCertFilter("all")}
                    className="ml-1 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              )}

              {deliveryFilter !== "all" && (
                <span className="inline-flex items-center gap-1 rounded-md bg-blue-950/70 border border-blue-500/50 px-2 py-0.5 text-[11px] font-semibold text-blue-300">
                  Delivery: {deliveryFilter === "ok" ? "Met Standards" : "Issues Reported"}
                  <button
                    onClick={() => setDeliveryFilter("all")}
                    className="ml-1 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              )}

              {qualificationFilter !== "all" && (
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-950/70 border border-amber-500/50 px-2 py-0.5 text-[11px] font-semibold text-amber-300">
                  Qualification: {qualificationFilter}
                  <button
                    onClick={() => setQualificationFilter("all")}
                    className="ml-1 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              )}

              {!hasActiveFilters && (
                <span className="text-[11px] text-[#9B95B0]">
                  Showing all {records.length} records. Click any badge or button below to filter.
                </span>
              )}
            </div>

            <span className="text-xs font-bold text-emerald-400">
              Showing {filtered.length} of {records.length} listings
            </span>
          </div>

          {/* Filter Pills Bar */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Specification Buttons */}
            <div className="flex items-center gap-1 bg-[#14121F] rounded-lg border border-[#2A2740] p-1">
              <span className="text-[10px] uppercase font-bold text-[#9B95B0] px-1.5">Spec:</span>
              <button
                onClick={() => setSpecFilter("all")}
                className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${
                  specFilter === "all"
                    ? "bg-[#252236] text-[#F5F3FA] font-bold"
                    : "text-[#9B95B0] hover:text-[#F5F3FA]"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSpecFilter("fully")}
                className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${
                  specFilter === "fully"
                    ? "bg-emerald-600 text-white font-bold"
                    : "text-emerald-400 hover:bg-emerald-950/40"
                }`}
              >
                ✓ Fully Match
              </button>
              <button
                onClick={() => setSpecFilter("partial")}
                className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${
                  specFilter === "partial"
                    ? "bg-amber-600 text-white font-bold"
                    : "text-amber-400 hover:bg-amber-950/40"
                }`}
              >
                ⚠️ Partial Match
              </button>
            </div>

            {/* Certifications Buttons */}
            <div className="flex items-center gap-1 bg-[#14121F] rounded-lg border border-[#2A2740] p-1 overflow-x-auto max-w-full">
              <span className="text-[10px] uppercase font-bold text-[#9B95B0] px-1.5">Cert:</span>
              <button
                onClick={() => setCertFilter("all")}
                className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${
                  certFilter === "all"
                    ? "bg-[#252236] text-[#F5F3FA] font-bold"
                    : "text-[#9B95B0] hover:text-[#F5F3FA]"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setCertFilter("cert_ok")}
                className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${
                  certFilter === "cert_ok"
                    ? "bg-emerald-600 text-white font-bold"
                    : "text-emerald-400 hover:bg-emerald-950/40"
                }`}
              >
                ✓ Cert OK
              </button>
              <button
                onClick={() => setCertFilter("cert_no")}
                className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${
                  certFilter === "cert_no"
                    ? "bg-rose-600 text-white font-bold"
                    : "text-rose-400 hover:bg-rose-950/40"
                }`}
              >
                ✕ Deficient
              </button>
              {certOptions.map((c) => (
                <button
                  key={c}
                  onClick={() => setCertFilter(certFilter === c ? "all" : c)}
                  className={`rounded px-2 py-0.5 text-[10px] font-medium transition-colors ${
                    certFilter === c
                      ? "bg-purple-600 text-white font-bold"
                      : "text-purple-300 hover:bg-purple-950/40"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Delivery Buttons */}
            <div className="flex items-center gap-1 bg-[#14121F] rounded-lg border border-[#2A2740] p-1">
              <span className="text-[10px] uppercase font-bold text-[#9B95B0] px-1.5">Delivery:</span>
              <button
                onClick={() => setDeliveryFilter("all")}
                className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${
                  deliveryFilter === "all"
                    ? "bg-[#252236] text-[#F5F3FA] font-bold"
                    : "text-[#9B95B0] hover:text-[#F5F3FA]"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setDeliveryFilter("ok")}
                className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${
                  deliveryFilter === "ok"
                    ? "bg-emerald-600 text-white font-bold"
                    : "text-emerald-400 hover:bg-emerald-950/40"
                }`}
              >
                ✓ OK
              </button>
              <button
                onClick={() => setDeliveryFilter("fail")}
                className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${
                  deliveryFilter === "fail"
                    ? "bg-amber-600 text-white font-bold"
                    : "text-amber-400 hover:bg-amber-950/40"
                }`}
              >
                ✕ Issues
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Interactive Compliance Audit Table */}
      <div className="rounded-xl border border-[#2A2740] bg-[#1B1926] shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#14121F] border-b border-[#2A2740] text-[11px] uppercase tracking-wider text-[#9B95B0]">
              <tr>
                <th className="py-3 px-3">Supplier ID</th>
                <th className="py-3 px-3">Supplier Name</th>
                <th className="py-3 px-3">Product</th>
                <th className="py-3 px-3">Specification Match (Click)</th>
                <th className="py-3 px-3">Certification(s)</th>
                <th className="py-3 px-3 text-center">Cert OK</th>
                <th className="py-3 px-3 text-center">Delivery OK</th>
                <th className="py-3 px-3 text-right">Capacity (t/mo)</th>
                <th className="py-3 px-3 text-right">Lead (days)</th>
                <th className="py-3 px-3 text-right">Reliability %</th>
                <th className="py-3 px-3 text-center">Qualification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#232036]">
              {filtered.map((r, idx) => {
                const isFullyMatch = r.specMatch.toLowerCase().includes("fully");
                const isCertOk = r.certOk === "Yes";
                const isDeliveryOk = r.deliveryOk === "Yes";
                const isCompliant = isFullyMatch && isCertOk && isDeliveryOk;

                return (
                  <tr
                    key={`${r.supplierId}-${idx}`}
                    className={`hover:bg-[#201D2F] transition-colors ${
                      !isCompliant ? "bg-rose-950/5" : ""
                    }`}
                  >
                    {/* Supplier ID */}
                    <td className="py-3 px-3 font-mono font-bold text-purple-400">
                      {r.supplierId}
                    </td>

                    {/* Supplier Name (Clickable to inspect in Scorecard) */}
                    <td className="py-3 px-3">
                      <button
                        onClick={() => onSelectSupplier(r.supplierId)}
                        title="Click to view supplier scorecard"
                        className="font-semibold text-[#F5F3FA] hover:text-emerald-300 text-left transition-colors"
                      >
                        {r.supplier}
                      </button>
                    </td>

                    {/* Product */}
                    <td className="py-3 px-3 text-[#F5F3FA]">{r.product}</td>

                    {/* Specification Match (Interactive Click to Filter) */}
                    <td className="py-3 px-3">
                      <button
                        type="button"
                        onClick={() => setSpecFilter(isFullyMatch ? "fully" : "partial")}
                        title={`Click to filter dataset by ${r.specMatch}`}
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold transition-all hover:scale-105 active:scale-95 ${
                          isFullyMatch
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-800 hover:border-emerald-400"
                            : "bg-amber-950 text-amber-300 border border-amber-800 hover:border-amber-400"
                        }`}
                      >
                        {isFullyMatch ? (
                          <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <AlertTriangle className="h-3 w-3 text-amber-400" />
                        )}
                        {r.specMatch}
                      </button>
                    </td>

                    {/* Certification Names (Clickable individual tags) */}
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {r.certification ? (
                          r.certification.split(";").map((c, cIdx) => {
                            const trimmed = c.trim();
                            return (
                              <button
                                key={cIdx}
                                type="button"
                                onClick={() => setCertFilter(trimmed)}
                                title={`Click to filter dataset by ${trimmed}`}
                                className="rounded bg-[#252236] px-1.5 py-0.5 text-[10px] text-[#9B95B0] hover:text-purple-300 hover:bg-purple-950 transition-colors"
                              >
                                {trimmed}
                              </button>
                            );
                          })
                        ) : (
                          <span className="text-[#9B95B0] text-[10px]">None</span>
                        )}
                      </div>
                    </td>

                    {/* Cert OK (Interactive Click) */}
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => setCertFilter(isCertOk ? "cert_ok" : "cert_no")}
                        title={`Click to filter by Cert OK = ${r.certOk}`}
                        className={`inline-flex items-center justify-center rounded-full h-6 w-6 transition-transform hover:scale-110 active:scale-95 ${
                          isCertOk
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800 hover:border-emerald-400"
                            : "bg-rose-950 text-rose-400 border border-rose-800 hover:border-rose-400"
                        }`}
                      >
                        {isCertOk ? "✓" : "✕"}
                      </button>
                    </td>

                    {/* Delivery OK (Interactive Click) */}
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => setDeliveryFilter(isDeliveryOk ? "ok" : "fail")}
                        title={`Click to filter by Delivery OK = ${r.deliveryOk}`}
                        className={`inline-flex items-center justify-center rounded-full h-6 w-6 transition-transform hover:scale-110 active:scale-95 ${
                          isDeliveryOk
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800 hover:border-emerald-400"
                            : "bg-rose-950 text-rose-400 border border-rose-800 hover:border-rose-400"
                        }`}
                      >
                        {isDeliveryOk ? "✓" : "✕"}
                      </button>
                    </td>

                    {/* Capacity */}
                    <td className="py-3 px-3 text-right font-medium text-[#F5F3FA]">
                      {r.capacityTonsMonth?.toLocaleString()} t
                    </td>

                    {/* Lead Days */}
                    <td className="py-3 px-3 text-right text-[#9B95B0]">
                      {r.leadDays} d
                    </td>

                    {/* Reliability % */}
                    <td className="py-3 px-3 text-right font-bold text-cyan-400">
                      {r.reliabilityPct?.toFixed(1)}%
                    </td>

                    {/* Qualification (Interactive Click) */}
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          setQualificationFilter(
                            r.qualification as "Qualified" | "Review" | "Disqualified"
                          )
                        }
                        title={`Click to filter by Qualification: ${r.qualification}`}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold bg-[#14121F] border border-[#2A2740] hover:scale-105 transition-all ${
                          r.qualification === "Qualified"
                            ? "text-emerald-300 hover:border-emerald-500"
                            : r.qualification === "Review"
                            ? "text-amber-300 hover:border-amber-500"
                            : "text-rose-400 hover:border-rose-500"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            r.qualification === "Qualified"
                              ? "bg-emerald-400"
                              : r.qualification === "Review"
                              ? "bg-amber-400"
                              : "bg-rose-500"
                          }`}
                        />
                        {r.qualification}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="border-t border-[#2A2740] bg-[#14121F] px-4 py-2.5 flex items-center justify-between text-xs text-[#9B95B0]">
          <span>
            Displaying {filtered.length} of {records.length} evaluated listings
          </span>
          <div className="flex items-center gap-3">
            <span className="text-emerald-400 font-medium">
              {fullyCompliantCount} zero-defect listings
            </span>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-purple-400 hover:text-purple-300 underline font-medium"
              >
                Clear All Active Filters
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
