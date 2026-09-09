import React from "react";
import {
  Building2,
  Calendar,
  Search,
  Upload,
  Bookmark,
  RotateCcw,
  Sparkles,
  Database,
  Sliders,
  SlidersHorizontal,
} from "lucide-react";
import { SpendSettings } from "../types";
import { MONTH_OPTIONS, getMonthProfile } from "../lib/monthDynamics";

export { MONTH_OPTIONS };

interface TopBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedMonth: string;
  onMonthChange: (m: string) => void;
  onOpenMonthModal?: () => void;
  isCustomData: boolean;
  totalRows: number;
  onResetData: () => void;
  onOpenUpload: () => void;
  shortlistCount: number;
  onOpenShortlist: () => void;
  spendSettings: SpendSettings;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedMonth,
  onMonthChange,
  onOpenMonthModal,
  isCustomData,
  totalRows,
  onResetData,
  onOpenUpload,
  shortlistCount,
  onOpenShortlist,
  spendSettings,
  activeTab,
  onTabChange,
}) => {
  const getSpendBasisLabel = () => {
    switch (spendSettings.basis) {
      case "moq":
        return "Basis: MOQ kg";
      case "actual":
        return "Basis: Actual Qty";
      case "capacity":
      default:
        return "Basis: Full Capacity";
    }
  };

  return (
    <header
      id="top-bar"
      className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 border-b border-[#2A2740] bg-[#13111C]/95 px-6 py-3.5 backdrop-blur-md"
    >
      {/* Brand & Organization */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-400 shadow-inner">
          <Building2 className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold tracking-tight text-[#F5F3FA]">
              HoneyWell Plc
            </h1>
            <span className="rounded-md bg-purple-950/80 px-2 py-0.5 text-[11px] font-semibold text-purple-300 border border-purple-800/60">
              Procurement & Sourcing
            </span>
          </div>
          <p className="text-xs text-[#9B95B0]">
            Raw-Material Supplier Analytics • Nigerian Processing Markets
          </p>
        </div>
      </div>

      {/* Center Search & Month Selector */}
      <div className="flex flex-1 max-w-xl items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#9B95B0]" />
          <input
            id="global-search-input"
            type="text"
            placeholder="Search supplier, ID, product, state, or certification..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-[#2A2740] bg-[#1B1926] py-2 pl-9 pr-4 text-xs text-[#F5F3FA] placeholder-[#9B95B0] focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-2.5 text-xs text-[#9B95B0] hover:text-[#F5F3FA]"
            >
              ✕
            </button>
          )}
        </div>

        {/* Month Selector */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-center gap-2 rounded-xl border border-[#2A2740] bg-[#1B1926] px-3 py-1.5 text-xs text-[#F5F3FA]">
            <Calendar className="h-3.5 w-3.5 text-purple-400 shrink-0" />
            <select
              id="month-selector"
              value={selectedMonth}
              onChange={(e) => onMonthChange(e.target.value)}
              className="bg-transparent text-xs text-[#F5F3FA] focus:outline-none cursor-pointer"
            >
              {MONTH_OPTIONS.map((m) => (
                <option key={m} value={m} className="bg-[#1B1926] text-[#F5F3FA]">
                  {m}
                </option>
              ))}
            </select>
          </div>

          {onOpenMonthModal && (
            <button
              id="topbar-month-info-btn"
              onClick={onOpenMonthModal}
              className="flex items-center justify-center rounded-xl border border-purple-800/40 bg-purple-950/40 p-2 text-purple-300 hover:bg-purple-900/60 hover:text-white transition-colors"
              title={`View ${selectedMonth} sourcing conditions & input custom parameters`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Action Controls & Badges */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Data Status Indicator */}
        <div
          onClick={() => onTabChange("data")}
          className="flex items-center gap-1.5 cursor-pointer rounded-lg border border-[#2A2740] bg-[#1B1926] px-2.5 py-1 text-xs text-[#9B95B0] hover:border-purple-500/50 hover:text-[#F5F3FA] transition-colors"
          title="Click to view dataset health summary"
        >
          <span
            className={`h-2 w-2 rounded-full ${
              isCustomData ? "bg-cyan-400 animate-pulse" : "bg-emerald-400"
            }`}
          />
          <span className="font-medium text-[11px]">
            {isCustomData ? "Live Upload" : "Sample Data"} ({totalRows} rows)
          </span>
        </div>

        {/* Spend Basis Badge */}
        <button
          onClick={() => onTabChange("settings")}
          className="flex items-center gap-1 rounded-lg border border-purple-800/40 bg-purple-950/40 px-2.5 py-1 text-[11px] font-medium text-purple-300 hover:bg-purple-900/50 transition-colors"
          title="Click to adjust spend calculation settings"
        >
          <Sliders className="h-3 w-3 text-purple-400" />
          <span>{getSpendBasisLabel()}</span>
        </button>

        {/* Shortlist Drawer Button */}
        <button
          id="shortlist-btn"
          onClick={onOpenShortlist}
          className="flex items-center gap-1.5 rounded-xl border border-[#2A2740] bg-[#1B1926] px-3 py-1.5 text-xs font-medium text-[#F5F3FA] hover:border-purple-500 hover:bg-[#222033] transition-colors"
        >
          <Bookmark className={`h-3.5 w-3.5 ${shortlistCount > 0 ? "text-amber-400 fill-amber-400" : "text-[#9B95B0]"}`} />
          <span>Shortlist</span>
          {shortlistCount > 0 && (
            <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-black">
              {shortlistCount}
            </span>
          )}
        </button>

        {/* Data Upload Button */}
        <button
          id="upload-data-btn"
          onClick={onOpenUpload}
          className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md hover:bg-purple-500 active:scale-95 transition-all"
        >
          <Upload className="h-3.5 w-3.5" />
          <span>Upload Data</span>
        </button>

        {/* Reset Button (only shown if custom data is active) */}
        {isCustomData && (
          <button
            id="reset-sample-btn"
            onClick={onResetData}
            className="flex items-center gap-1 rounded-xl border border-rose-800/40 bg-rose-950/30 px-2.5 py-1.5 text-xs text-rose-300 hover:bg-rose-900/50 transition-colors"
            title="Revert back to HoneyWell initial 111-record seed dataset"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}
      </div>
    </header>
  );
};
