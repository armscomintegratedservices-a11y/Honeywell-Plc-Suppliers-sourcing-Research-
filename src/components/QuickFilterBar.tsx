import React, { useState, useRef, useEffect } from "react";
import {
  MapPin,
  Layers,
  CheckCircle2,
  Activity,
  ShieldCheck,
  Package,
  Building2,
  X,
  RotateCcw,
  ChevronDown,
  Filter,
  Check,
} from "lucide-react";
import { FilterState } from "../types";

interface QuickFilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  availableMarkets: string[];
  availableCategories: string[];
  availableProducts: string[];
  availableSuppliers: string[];
  availableCertifications: string[];
  totalFiltered: number;
  totalRecords: number;
}

export const QuickFilterBar: React.FC<QuickFilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  availableMarkets,
  availableCategories,
  availableProducts,
  availableSuppliers,
  availableCertifications,
  totalFiltered,
  totalRecords,
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (name: string) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  const toggleArrayFilter = (
    field: keyof Omit<FilterState, "search" | "selectedMonth">,
    value: string
  ) => {
    const current = (filters[field] as string[]) || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFilterChange({
      ...filters,
      [field]: updated,
    });
  };

  const removeSingleFilter = (
    field: keyof Omit<FilterState, "search" | "selectedMonth">,
    value: string
  ) => {
    const current = (filters[field] as string[]) || [];
    onFilterChange({
      ...filters,
      [field]: current.filter((v) => v !== value),
    });
  };

  const qualifications = ["Qualified", "Review", "Disqualified"];
  const statuses = ["Active", "Inactive"];

  const activeCount =
    filters.market.length +
    filters.category.length +
    filters.product.length +
    filters.supplier.length +
    filters.qualification.length +
    filters.certification.length +
    filters.status.length +
    (filters.search ? 1 : 0);

  return (
    <div
      ref={dropdownRef}
      id="quick-filter-bar"
      className="rounded-xl border border-[#2A2740] bg-[#14121F] p-3 shadow-sm transition-all"
    >
      {/* Top Filter Buttons Row */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-950/60 text-purple-400 border border-purple-800/40">
            <Filter className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#F5F3FA]">
            Interactive Sourcing Filters
          </span>
          <span className="text-[11px] text-[#9B95B0]">
            ({totalFiltered} of {totalRecords} listings active)
          </span>
        </div>

        {activeCount > 0 && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1.5 rounded-lg border border-purple-800/40 bg-purple-950/40 px-2.5 py-1 text-[11px] font-semibold text-purple-300 hover:bg-purple-900/60 hover:text-white transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset All ({activeCount})</span>
          </button>
        )}
      </div>

      {/* Main Interactive Controls Grid */}
      <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
        {/* 1. Market (State) */}
        <div className="relative">
          <button
            id="filter-btn-market"
            onClick={() => toggleDropdown("market")}
            className={`flex w-full items-center justify-between rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${
              filters.market.length > 0
                ? "border-purple-500 bg-purple-950/40 text-purple-200"
                : "border-[#2A2740] bg-[#1B1926] text-[#F5F3FA] hover:border-purple-500/50"
            }`}
          >
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="h-3.5 w-3.5 text-purple-400 shrink-0" />
              <span className="truncate">
                {filters.market.length === 0
                  ? "Market (State)"
                  : `${filters.market.length} State${filters.market.length > 1 ? "s" : ""}`}
              </span>
            </div>
            <ChevronDown className="h-3 w-3 text-[#9B95B0] shrink-0" />
          </button>

          {activeDropdown === "market" && (
            <div className="absolute left-0 top-full z-40 mt-1 max-h-60 w-52 overflow-y-auto rounded-xl border border-[#2A2740] bg-[#1B1926] p-2 shadow-2xl">
              <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#9B95B0]">
                Nigerian Sourcing States
              </p>
              <div className="space-y-0.5 mt-1">
                {availableMarkets.map((m) => {
                  const isChecked = filters.market.includes(m);
                  return (
                    <button
                      key={m}
                      onClick={() => toggleArrayFilter("market", m)}
                      className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-xs transition-colors ${
                        isChecked
                          ? "bg-purple-600/30 text-purple-200 font-bold"
                          : "text-[#9B95B0] hover:bg-[#252236] hover:text-[#F5F3FA]"
                      }`}
                    >
                      <span>{m}</span>
                      {isChecked && <Check className="h-3 w-3 text-purple-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 2. Category */}
        <div className="relative">
          <button
            id="filter-btn-category"
            onClick={() => toggleDropdown("category")}
            className={`flex w-full items-center justify-between rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${
              filters.category.length > 0
                ? "border-purple-500 bg-purple-950/40 text-purple-200"
                : "border-[#2A2740] bg-[#1B1926] text-[#F5F3FA] hover:border-purple-500/50"
            }`}
          >
            <div className="flex items-center gap-1.5 truncate">
              <Layers className="h-3.5 w-3.5 text-blue-400 shrink-0" />
              <span className="truncate">
                {filters.category.length === 0
                  ? "Category"
                  : `${filters.category.length} Cat${filters.category.length > 1 ? "s" : ""}`}
              </span>
            </div>
            <ChevronDown className="h-3 w-3 text-[#9B95B0] shrink-0" />
          </button>

          {activeDropdown === "category" && (
            <div className="absolute left-0 top-full z-40 mt-1 max-h-60 w-56 overflow-y-auto rounded-xl border border-[#2A2740] bg-[#1B1926] p-2 shadow-2xl">
              <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#9B95B0]">
                Material Categories
              </p>
              <div className="space-y-0.5 mt-1">
                {availableCategories.map((c) => {
                  const isChecked = filters.category.includes(c);
                  return (
                    <button
                      key={c}
                      onClick={() => toggleArrayFilter("category", c)}
                      className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-xs transition-colors ${
                        isChecked
                          ? "bg-purple-600/30 text-purple-200 font-bold"
                          : "text-[#9B95B0] hover:bg-[#252236] hover:text-[#F5F3FA]"
                      }`}
                    >
                      <span className="truncate">{c}</span>
                      {isChecked && <Check className="h-3 w-3 text-purple-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 3. Qualification */}
        <div className="relative">
          <button
            id="filter-btn-qualification"
            onClick={() => toggleDropdown("qualification")}
            className={`flex w-full items-center justify-between rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${
              filters.qualification.length > 0
                ? "border-emerald-500 bg-emerald-950/40 text-emerald-200"
                : "border-[#2A2740] bg-[#1B1926] text-[#F5F3FA] hover:border-purple-500/50"
            }`}
          >
            <div className="flex items-center gap-1.5 truncate">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">
                {filters.qualification.length === 0
                  ? "Qualification"
                  : filters.qualification.join(", ")}
              </span>
            </div>
            <ChevronDown className="h-3 w-3 text-[#9B95B0] shrink-0" />
          </button>

          {activeDropdown === "qualification" && (
            <div className="absolute left-0 top-full z-40 mt-1 w-48 rounded-xl border border-[#2A2740] bg-[#1B1926] p-2 shadow-2xl">
              <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#9B95B0]">
                QA Qualification Status
              </p>
              <div className="space-y-0.5 mt-1">
                {qualifications.map((q) => {
                  const isChecked = filters.qualification.includes(q);
                  const dotColor =
                    q === "Qualified"
                      ? "bg-emerald-400"
                      : q === "Review"
                      ? "bg-amber-400"
                      : "bg-rose-500";
                  return (
                    <button
                      key={q}
                      onClick={() => toggleArrayFilter("qualification", q)}
                      className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-xs transition-colors ${
                        isChecked
                          ? "bg-purple-600/30 text-white font-bold"
                          : "text-[#9B95B0] hover:bg-[#252236] hover:text-[#F5F3FA]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${dotColor}`} />
                        <span>{q}</span>
                      </div>
                      {isChecked && <Check className="h-3 w-3 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 4. Operational Status */}
        <div className="relative">
          <button
            id="filter-btn-status"
            onClick={() => toggleDropdown("status")}
            className={`flex w-full items-center justify-between rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${
              filters.status.length > 0
                ? "border-cyan-500 bg-cyan-950/40 text-cyan-200"
                : "border-[#2A2740] bg-[#1B1926] text-[#F5F3FA] hover:border-purple-500/50"
            }`}
          >
            <div className="flex items-center gap-1.5 truncate">
              <Activity className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">
                {filters.status.length === 0
                  ? "Operational Status"
                  : filters.status.join(", ")}
              </span>
            </div>
            <ChevronDown className="h-3 w-3 text-[#9B95B0] shrink-0" />
          </button>

          {activeDropdown === "status" && (
            <div className="absolute left-0 top-full z-40 mt-1 w-44 rounded-xl border border-[#2A2740] bg-[#1B1926] p-2 shadow-2xl">
              <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#9B95B0]">
                Vendor Operation State
              </p>
              <div className="space-y-0.5 mt-1">
                {statuses.map((s) => {
                  const isChecked = filters.status.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => toggleArrayFilter("status", s)}
                      className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-xs transition-colors ${
                        isChecked
                          ? "bg-cyan-600/30 text-cyan-200 font-bold"
                          : "text-[#9B95B0] hover:bg-[#252236] hover:text-[#F5F3FA]"
                      }`}
                    >
                      <span>{s}</span>
                      {isChecked && <Check className="h-3 w-3 text-cyan-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 5. Certification */}
        <div className="relative">
          <button
            id="filter-btn-certification"
            onClick={() => toggleDropdown("certification")}
            className={`flex w-full items-center justify-between rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${
              filters.certification.length > 0
                ? "border-amber-500 bg-amber-950/40 text-amber-200"
                : "border-[#2A2740] bg-[#1B1926] text-[#F5F3FA] hover:border-purple-500/50"
            }`}
          >
            <div className="flex items-center gap-1.5 truncate">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span className="truncate">
                {filters.certification.length === 0
                  ? "Certification"
                  : `${filters.certification.length} Cert${filters.certification.length > 1 ? "s" : ""}`}
              </span>
            </div>
            <ChevronDown className="h-3 w-3 text-[#9B95B0] shrink-0" />
          </button>

          {activeDropdown === "certification" && (
            <div className="absolute left-0 top-full z-40 mt-1 max-h-60 w-52 overflow-y-auto rounded-xl border border-[#2A2740] bg-[#1B1926] p-2 shadow-2xl">
              <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#9B95B0]">
                Food Standards & Compliance
              </p>
              <div className="space-y-0.5 mt-1">
                {availableCertifications.map((c) => {
                  const isChecked = filters.certification.includes(c);
                  return (
                    <button
                      key={c}
                      onClick={() => toggleArrayFilter("certification", c)}
                      className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-xs transition-colors ${
                        isChecked
                          ? "bg-amber-600/30 text-amber-200 font-bold"
                          : "text-[#9B95B0] hover:bg-[#252236] hover:text-[#F5F3FA]"
                      }`}
                    >
                      <span className="truncate">{c}</span>
                      {isChecked && <Check className="h-3 w-3 text-amber-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 6. Raw-Materials Product */}
        <div className="relative">
          <button
            id="filter-btn-product"
            onClick={() => toggleDropdown("product")}
            className={`flex w-full items-center justify-between rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${
              filters.product.length > 0
                ? "border-emerald-500 bg-emerald-950/40 text-emerald-200"
                : "border-[#2A2740] bg-[#1B1926] text-[#F5F3FA] hover:border-purple-500/50"
            }`}
          >
            <div className="flex items-center gap-1.5 truncate">
              <Package className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">
                {filters.product.length === 0
                  ? "Raw Material"
                  : `${filters.product.length} Product${filters.product.length > 1 ? "s" : ""}`}
              </span>
            </div>
            <ChevronDown className="h-3 w-3 text-[#9B95B0] shrink-0" />
          </button>

          {activeDropdown === "product" && (
            <div className="absolute right-0 top-full z-40 mt-1 max-h-64 w-60 overflow-y-auto rounded-xl border border-[#2A2740] bg-[#1B1926] p-2 shadow-2xl">
              <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#9B95B0]">
                Raw Materials & Commodities
              </p>
              <div className="space-y-0.5 mt-1">
                {availableProducts.map((p) => {
                  const isChecked = filters.product.includes(p);
                  return (
                    <button
                      key={p}
                      onClick={() => toggleArrayFilter("product", p)}
                      className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-xs transition-colors ${
                        isChecked
                          ? "bg-emerald-600/30 text-emerald-200 font-bold"
                          : "text-[#9B95B0] hover:bg-[#252236] hover:text-[#F5F3FA]"
                      }`}
                    >
                      <span className="truncate">{p}</span>
                      {isChecked && <Check className="h-3 w-3 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 7. Specific Supplier */}
        <div className="relative">
          <button
            id="filter-btn-supplier"
            onClick={() => toggleDropdown("supplier")}
            className={`flex w-full items-center justify-between rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${
              filters.supplier.length > 0
                ? "border-purple-500 bg-purple-950/40 text-purple-200"
                : "border-[#2A2740] bg-[#1B1926] text-[#F5F3FA] hover:border-purple-500/50"
            }`}
          >
            <div className="flex items-center gap-1.5 truncate">
              <Building2 className="h-3.5 w-3.5 text-purple-400 shrink-0" />
              <span className="truncate">
                {filters.supplier.length === 0
                  ? "Specific Supplier"
                  : `${filters.supplier.length} Vendor${filters.supplier.length > 1 ? "s" : ""}`}
              </span>
            </div>
            <ChevronDown className="h-3 w-3 text-[#9B95B0] shrink-0" />
          </button>

          {activeDropdown === "supplier" && (
            <div className="absolute right-0 top-full z-40 mt-1 max-h-64 w-64 overflow-y-auto rounded-xl border border-[#2A2740] bg-[#1B1926] p-2 shadow-2xl">
              <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#9B95B0]">
                Select Specific Suppliers
              </p>
              <div className="space-y-0.5 mt-1">
                {availableSuppliers.map((s) => {
                  const isChecked = filters.supplier.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => toggleArrayFilter("supplier", s)}
                      className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-xs transition-colors ${
                        isChecked
                          ? "bg-purple-600/30 text-purple-200 font-bold"
                          : "text-[#9B95B0] hover:bg-[#252236] hover:text-[#F5F3FA]"
                      }`}
                    >
                      <span className="truncate">{s}</span>
                      {isChecked && <Check className="h-3 w-3 text-purple-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Filter Chips with Quick Remove */}
      {activeCount > 0 && (
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 border-t border-[#2A2740]/60 pt-2 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9B95B0]">
            Active:
          </span>

          {filters.market.map((m) => (
            <span
              key={`m-${m}`}
              className="inline-flex items-center gap-1 rounded-md bg-purple-950/80 px-2 py-0.5 text-[11px] font-medium text-purple-200 border border-purple-800/60"
            >
              <MapPin className="h-2.5 w-2.5" />
              <span>{m}</span>
              <button
                onClick={() => removeSingleFilter("market", m)}
                className="hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

          {filters.category.map((c) => (
            <span
              key={`c-${c}`}
              className="inline-flex items-center gap-1 rounded-md bg-blue-950/80 px-2 py-0.5 text-[11px] font-medium text-blue-200 border border-blue-800/60"
            >
              <Layers className="h-2.5 w-2.5" />
              <span>{c}</span>
              <button
                onClick={() => removeSingleFilter("category", c)}
                className="hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

          {filters.qualification.map((q) => (
            <span
              key={`q-${q}`}
              className="inline-flex items-center gap-1 rounded-md bg-emerald-950/80 px-2 py-0.5 text-[11px] font-medium text-emerald-200 border border-emerald-800/60"
            >
              <CheckCircle2 className="h-2.5 w-2.5" />
              <span>{q}</span>
              <button
                onClick={() => removeSingleFilter("qualification", q)}
                className="hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

          {filters.status.map((s) => (
            <span
              key={`s-${s}`}
              className="inline-flex items-center gap-1 rounded-md bg-cyan-950/80 px-2 py-0.5 text-[11px] font-medium text-cyan-200 border border-cyan-800/60"
            >
              <Activity className="h-2.5 w-2.5" />
              <span>{s}</span>
              <button
                onClick={() => removeSingleFilter("status", s)}
                className="hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

          {filters.certification.map((cert) => (
            <span
              key={`cert-${cert}`}
              className="inline-flex items-center gap-1 rounded-md bg-amber-950/80 px-2 py-0.5 text-[11px] font-medium text-amber-200 border border-amber-800/60"
            >
              <ShieldCheck className="h-2.5 w-2.5" />
              <span>{cert}</span>
              <button
                onClick={() => removeSingleFilter("certification", cert)}
                className="hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

          {filters.product.map((p) => (
            <span
              key={`p-${p}`}
              className="inline-flex items-center gap-1 rounded-md bg-emerald-950/80 px-2 py-0.5 text-[11px] font-medium text-emerald-200 border border-emerald-800/60"
            >
              <Package className="h-2.5 w-2.5" />
              <span>{p}</span>
              <button
                onClick={() => removeSingleFilter("product", p)}
                className="hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

          {filters.supplier.map((sup) => (
            <span
              key={`sup-${sup}`}
              className="inline-flex items-center gap-1 rounded-md bg-purple-950/80 px-2 py-0.5 text-[11px] font-medium text-purple-200 border border-purple-800/60"
            >
              <Building2 className="h-2.5 w-2.5" />
              <span>{sup}</span>
              <button
                onClick={() => removeSingleFilter("supplier", sup)}
                className="hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
