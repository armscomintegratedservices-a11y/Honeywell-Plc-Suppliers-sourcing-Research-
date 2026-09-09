import React, { useState } from "react";
import {
  Filter,
  X,
  ChevronDown,
  ChevronRight,
  RotateCcw,
  CheckSquare,
  Square,
  ChevronLeft,
  SlidersHorizontal,
} from "lucide-react";
import { FilterState } from "../types";

interface FilterRailProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  availableMarkets: string[];
  availableCategories: string[];
  availableProducts: string[];
  availableSuppliers: string[];
  availableCertifications: string[];
  totalFilteredRecords: number;
  totalRecords: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const FilterRail: React.FC<FilterRailProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  availableMarkets,
  availableCategories,
  availableProducts,
  availableSuppliers,
  availableCertifications,
  totalFilteredRecords,
  totalRecords,
  isCollapsed,
  onToggleCollapse,
}) => {
  // Accordion open/close states
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    market: true,
    category: true,
    qualification: true,
    status: true,
    certification: false,
    product: false,
    supplier: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCheckboxToggle = (
    field: keyof Omit<FilterState, "search">,
    value: string
  ) => {
    const currentList = filters[field] as string[];
    const exists = currentList.includes(value);
    const updated = exists
      ? currentList.filter((item) => item !== value)
      : [...currentList, value];

    onFilterChange({
      ...filters,
      [field]: updated,
    });
  };

  const activeFiltersCount =
    filters.market.length +
    filters.category.length +
    filters.product.length +
    filters.supplier.length +
    filters.qualification.length +
    filters.certification.length +
    filters.status.length +
    (filters.search ? 1 : 0);

  if (isCollapsed) {
    return (
      <aside
        id="filter-rail-collapsed"
        className="flex w-14 flex-col items-center border-r border-[#2A2740] bg-[#12101B] py-4 select-none shrink-0"
      >
        <button
          onClick={onToggleCollapse}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#2A2740] bg-[#1B1926] text-purple-400 hover:bg-[#252236] hover:text-white transition-colors"
          title="Expand Filter Rail"
        >
          <SlidersHorizontal className="h-5 w-5" />
        </button>
        {activeFiltersCount > 0 && (
          <span className="mt-3 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-[10px] font-bold text-white shadow-sm">
            {activeFiltersCount}
          </span>
        )}
      </aside>
    );
  }

  return (
    <aside
      id="filter-rail"
      aria-label="Filter Rail"
      className="flex w-72 flex-col border-r border-[#2A2740] bg-[#12101B] select-none shrink-0 overflow-hidden"
    >
      {/* Filter Rail Header */}
      <div className="flex items-center justify-between border-b border-[#2A2740] px-4 py-3 bg-[#171524]">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-purple-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#F5F3FA]">
            Filters
          </span>
          {activeFiltersCount > 0 && (
            <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-purple-600 px-1 text-[10px] font-bold text-white">
              {activeFiltersCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {activeFiltersCount > 0 && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-[#9B95B0] hover:bg-[#252236] hover:text-[#F5F3FA] transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
          <button
            onClick={onToggleCollapse}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[#9B95B0] hover:bg-[#252236] hover:text-white transition-colors"
            title="Collapse Filter Rail"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filter Count Summary Badge */}
      <div className="border-b border-[#2A2740] bg-[#151320] px-4 py-2 text-[11px] text-[#9B95B0] flex items-center justify-between">
        <span>Showing results:</span>
        <span className="font-semibold text-purple-300">
          {totalFilteredRecords} of {totalRecords} records
        </span>
      </div>

      {/* Scrollable Filter List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 custom-scrollbar text-xs">
        {/* 1. Market (State) Filter */}
        <div className="rounded-xl border border-[#232036] bg-[#171524]/60 p-2.5">
          <button
            onClick={() => toggleSection("market")}
            className="flex w-full items-center justify-between font-semibold text-[#F5F3FA] text-xs py-0.5 hover:text-purple-300"
          >
            <span className="flex items-center gap-1.5">
              Market (State)
              {filters.market.length > 0 && (
                <span className="text-[10px] text-purple-400">({filters.market.length})</span>
              )}
            </span>
            {openSections.market ? (
              <ChevronDown className="h-3.5 w-3.5 text-[#9B95B0]" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-[#9B95B0]" />
            )}
          </button>

          {openSections.market && (
            <div className="mt-2.5 max-h-44 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
              {availableMarkets.map((m) => {
                const checked = filters.market.includes(m);
                return (
                  <label
                    key={m}
                    className="flex items-center gap-2 cursor-pointer text-[#9B95B0] hover:text-[#F5F3FA] py-0.5 select-none"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleCheckboxToggle("market", m)}
                      className="hidden"
                    />
                    {checked ? (
                      <CheckSquare className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                    ) : (
                      <Square className="h-3.5 w-3.5 text-[#423E5E] shrink-0" />
                    )}
                    <span className={`truncate text-xs ${checked ? "text-[#F5F3FA] font-medium" : ""}`}>
                      {m}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. Category Filter */}
        <div className="rounded-xl border border-[#232036] bg-[#171524]/60 p-2.5">
          <button
            onClick={() => toggleSection("category")}
            className="flex w-full items-center justify-between font-semibold text-[#F5F3FA] text-xs py-0.5 hover:text-purple-300"
          >
            <span className="flex items-center gap-1.5">
              Category
              {filters.category.length > 0 && (
                <span className="text-[10px] text-purple-400">({filters.category.length})</span>
              )}
            </span>
            {openSections.category ? (
              <ChevronDown className="h-3.5 w-3.5 text-[#9B95B0]" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-[#9B95B0]" />
            )}
          </button>

          {openSections.category && (
            <div className="mt-2.5 max-h-48 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
              {availableCategories.map((c) => {
                const checked = filters.category.includes(c);
                return (
                  <label
                    key={c}
                    className="flex items-center gap-2 cursor-pointer text-[#9B95B0] hover:text-[#F5F3FA] py-0.5 select-none"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleCheckboxToggle("category", c)}
                      className="hidden"
                    />
                    {checked ? (
                      <CheckSquare className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                    ) : (
                      <Square className="h-3.5 w-3.5 text-[#423E5E] shrink-0" />
                    )}
                    <span className={`truncate text-xs ${checked ? "text-[#F5F3FA] font-medium" : ""}`}>
                      {c}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. Qualification Filter */}
        <div className="rounded-xl border border-[#232036] bg-[#171524]/60 p-2.5">
          <button
            onClick={() => toggleSection("qualification")}
            className="flex w-full items-center justify-between font-semibold text-[#F5F3FA] text-xs py-0.5 hover:text-purple-300"
          >
            <span className="flex items-center gap-1.5">
              Qualification
              {filters.qualification.length > 0 && (
                <span className="text-[10px] text-purple-400">({filters.qualification.length})</span>
              )}
            </span>
            {openSections.qualification ? (
              <ChevronDown className="h-3.5 w-3.5 text-[#9B95B0]" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-[#9B95B0]" />
            )}
          </button>

          {openSections.qualification && (
            <div className="mt-2.5 space-y-2">
              {[
                { val: "Qualified", label: "Qualified", color: "bg-emerald-400" },
                { val: "Review", label: "Review", color: "bg-amber-400" },
                { val: "Disqualified", label: "Disqualified", color: "bg-rose-500" },
              ].map((item) => {
                const checked = filters.qualification.includes(item.val as any);
                return (
                  <label
                    key={item.val}
                    className="flex items-center justify-between cursor-pointer text-[#9B95B0] hover:text-[#F5F3FA] py-0.5 select-none"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleCheckboxToggle("qualification", item.val)}
                        className="hidden"
                      />
                      {checked ? (
                        <CheckSquare className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                      ) : (
                        <Square className="h-3.5 w-3.5 text-[#423E5E] shrink-0" />
                      )}
                      <span className="flex items-center gap-1.5 text-xs">
                        <span className={`h-2 w-2 rounded-full ${item.color}`} />
                        {item.label}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. Status Filter */}
        <div className="rounded-xl border border-[#232036] bg-[#171524]/60 p-2.5">
          <button
            onClick={() => toggleSection("status")}
            className="flex w-full items-center justify-between font-semibold text-[#F5F3FA] text-xs py-0.5 hover:text-purple-300"
          >
            <span className="flex items-center gap-1.5">
              Operational Status
              {filters.status.length > 0 && (
                <span className="text-[10px] text-purple-400">({filters.status.length})</span>
              )}
            </span>
            {openSections.status ? (
              <ChevronDown className="h-3.5 w-3.5 text-[#9B95B0]" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-[#9B95B0]" />
            )}
          </button>

          {openSections.status && (
            <div className="mt-2.5 space-y-2">
              {[
                { val: "Active", label: "Active", color: "bg-cyan-400" },
                { val: "Inactive", label: "Inactive", color: "bg-gray-500" },
              ].map((item) => {
                const checked = filters.status.includes(item.val as any);
                return (
                  <label
                    key={item.val}
                    className="flex items-center gap-2 cursor-pointer text-[#9B95B0] hover:text-[#F5F3FA] py-0.5 select-none"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleCheckboxToggle("status", item.val)}
                      className="hidden"
                    />
                    {checked ? (
                      <CheckSquare className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                    ) : (
                      <Square className="h-3.5 w-3.5 text-[#423E5E] shrink-0" />
                    )}
                    <span className="flex items-center gap-1.5 text-xs">
                      <span className={`h-2 w-2 rounded-full ${item.color}`} />
                      {item.label}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* 5. Certification Filter */}
        <div className="rounded-xl border border-[#232036] bg-[#171524]/60 p-2.5">
          <button
            onClick={() => toggleSection("certification")}
            className="flex w-full items-center justify-between font-semibold text-[#F5F3FA] text-xs py-0.5 hover:text-purple-300"
          >
            <span className="flex items-center gap-1.5">
              Certifications
              {filters.certification.length > 0 && (
                <span className="text-[10px] text-purple-400">({filters.certification.length})</span>
              )}
            </span>
            {openSections.certification ? (
              <ChevronDown className="h-3.5 w-3.5 text-[#9B95B0]" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-[#9B95B0]" />
            )}
          </button>

          {openSections.certification && (
            <div className="mt-2.5 max-h-36 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
              {availableCertifications.map((cert) => {
                const checked = filters.certification.includes(cert);
                return (
                  <label
                    key={cert}
                    className="flex items-center gap-2 cursor-pointer text-[#9B95B0] hover:text-[#F5F3FA] py-0.5 select-none"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleCheckboxToggle("certification", cert)}
                      className="hidden"
                    />
                    {checked ? (
                      <CheckSquare className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                    ) : (
                      <Square className="h-3.5 w-3.5 text-[#423E5E] shrink-0" />
                    )}
                    <span className={`truncate text-xs ${checked ? "text-[#F5F3FA] font-medium" : ""}`}>
                      {cert}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* 6. Product Filter */}
        <div className="rounded-xl border border-[#232036] bg-[#171524]/60 p-2.5">
          <button
            onClick={() => toggleSection("product")}
            className="flex w-full items-center justify-between font-semibold text-[#F5F3FA] text-xs py-0.5 hover:text-purple-300"
          >
            <span className="flex items-center gap-1.5">
              Raw Material Product
              {filters.product.length > 0 && (
                <span className="text-[10px] text-purple-400">({filters.product.length})</span>
              )}
            </span>
            {openSections.product ? (
              <ChevronDown className="h-3.5 w-3.5 text-[#9B95B0]" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-[#9B95B0]" />
            )}
          </button>

          {openSections.product && (
            <div className="mt-2.5 max-h-48 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
              {availableProducts.map((p) => {
                const checked = filters.product.includes(p);
                return (
                  <label
                    key={p}
                    className="flex items-center gap-2 cursor-pointer text-[#9B95B0] hover:text-[#F5F3FA] py-0.5 select-none"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleCheckboxToggle("product", p)}
                      className="hidden"
                    />
                    {checked ? (
                      <CheckSquare className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                    ) : (
                      <Square className="h-3.5 w-3.5 text-[#423E5E] shrink-0" />
                    )}
                    <span className={`truncate text-xs ${checked ? "text-[#F5F3FA] font-medium" : ""}`}>
                      {p}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* 7. Supplier Filter */}
        <div className="rounded-xl border border-[#232036] bg-[#171524]/60 p-2.5">
          <button
            onClick={() => toggleSection("supplier")}
            className="flex w-full items-center justify-between font-semibold text-[#F5F3FA] text-xs py-0.5 hover:text-purple-300"
          >
            <span className="flex items-center gap-1.5">
              Specific Supplier
              {filters.supplier.length > 0 && (
                <span className="text-[10px] text-purple-400">({filters.supplier.length})</span>
              )}
            </span>
            {openSections.supplier ? (
              <ChevronDown className="h-3.5 w-3.5 text-[#9B95B0]" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-[#9B95B0]" />
            )}
          </button>

          {openSections.supplier && (
            <div className="mt-2.5 max-h-48 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
              {availableSuppliers.map((s) => {
                const checked = filters.supplier.includes(s);
                return (
                  <label
                    key={s}
                    className="flex items-center gap-2 cursor-pointer text-[#9B95B0] hover:text-[#F5F3FA] py-0.5 select-none"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleCheckboxToggle("supplier", s)}
                      className="hidden"
                    />
                    {checked ? (
                      <CheckSquare className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                    ) : (
                      <Square className="h-3.5 w-3.5 text-[#423E5E] shrink-0" />
                    )}
                    <span className={`truncate text-xs ${checked ? "text-[#F5F3FA] font-medium" : ""}`}>
                      {s}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
