import React from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Sliders,
  Sparkles,
  Info,
  TrendingDown,
  TrendingUp,
  Clock,
  DollarSign,
  Truck,
  CheckCircle2,
} from "lucide-react";
import {
  MONTH_OPTIONS,
  MONTH_PROFILES,
  MonthCustomInputs,
  getMonthProfile,
} from "../lib/monthDynamics";

interface MonthIntelligenceBarProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  onOpenMonthModal: () => void;
  customInputs?: MonthCustomInputs;
  totalMonthlySpend: number;
  avgPricePerKg: number;
  avgLeadDays: number;
}

export const MonthIntelligenceBar: React.FC<MonthIntelligenceBarProps> = ({
  selectedMonth,
  onMonthChange,
  onOpenMonthModal,
  customInputs,
  totalMonthlySpend,
  avgPricePerKg,
  avgLeadDays,
}) => {
  const profile = getMonthProfile(selectedMonth);
  const currentIndex = MONTH_OPTIONS.indexOf(selectedMonth);

  const handlePrev = () => {
    if (currentIndex > 0) {
      onMonthChange(MONTH_OPTIONS[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < MONTH_OPTIONS.length - 1) {
      onMonthChange(MONTH_OPTIONS[currentIndex + 1]);
    }
  };

  const hasCustomOverrides =
    customInputs &&
    (customInputs.customPriceDeltaPct !== 0 ||
      customInputs.customLeadDaysDelta !== 0 ||
      customInputs.customCapacityMultiplier !== 1.0);

  return (
    <div
      id="month-intelligence-bar"
      className="rounded-xl border border-[#2A2740] bg-[#1B1926] p-3 shadow-sm transition-all"
    >
      {/* 1. Top Ribbon: 9 Interactive Months Jan - Sept 2026 */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[#2A2740]/60 pb-3">
        {/* Left: Month Navigator Title & Controls */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600/30 to-emerald-600/30 border border-purple-500/40 text-purple-300">
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#F5F3FA]">
                2026 Procurement Cycle
              </span>
              <span className="rounded-full bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.2 text-[10px] font-bold text-emerald-300">
                JAN – SEPT 2026 ACTIVE
              </span>
            </div>
            <p className="text-[10px] text-[#9B95B0]">
              Click any month to switch live procurement data & seasonal parameters
            </p>
          </div>

          {/* Quick Prev / Next Arrows */}
          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`rounded-lg border border-[#2A2740] p-1 text-xs transition-colors ${
                currentIndex === 0
                  ? "opacity-30 cursor-not-allowed text-[#9B95B0]"
                  : "bg-[#14121F] text-[#F5F3FA] hover:border-purple-500 hover:text-white"
              }`}
              title="Previous Month"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === MONTH_OPTIONS.length - 1}
              className={`rounded-lg border border-[#2A2740] p-1 text-xs transition-colors ${
                currentIndex === MONTH_OPTIONS.length - 1
                  ? "opacity-30 cursor-not-allowed text-[#9B95B0]"
                  : "bg-[#14121F] text-[#F5F3FA] hover:border-purple-500 hover:text-white"
              }`}
              title="Next Month"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Center/Right: Interactive Months Pill Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 custom-scrollbar max-w-full">
          {MONTH_OPTIONS.map((m) => {
            const p = MONTH_PROFILES[m];
            const isSelected = selectedMonth === m;
            const priceDiffPct = Math.round((p.priceIndex - 1.0) * 100);

            return (
              <button
                key={m}
                onClick={() => onMonthChange(m)}
                className={`group relative flex flex-col items-center justify-center rounded-xl px-2.5 py-1.5 text-xs transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-b from-purple-900/60 to-[#252236] border-2 border-purple-400 text-white shadow-md shadow-purple-950/50 scale-105"
                    : "bg-[#14121F] border border-[#2A2740] text-[#9B95B0] hover:border-purple-500/50 hover:text-[#F5F3FA] hover:bg-[#1a1727]"
                }`}
              >
                {/* Month Name */}
                <div className="flex items-center gap-1">
                  <span className={`font-bold text-[11px] ${isSelected ? "text-white" : ""}`}>
                    {p.shortName}
                  </span>
                  <span className="text-[9px] text-[#9B95B0]">26</span>
                </div>

                {/* Price Index tag */}
                <span
                  className={`text-[9px] font-mono mt-0.5 ${
                    priceDiffPct < 0
                      ? "text-emerald-400 font-semibold"
                      : priceDiffPct > 0
                      ? "text-amber-400 font-semibold"
                      : "text-[#9B95B0]"
                  }`}
                >
                  {priceDiffPct < 0 ? `${priceDiffPct}%` : priceDiffPct > 0 ? `+${priceDiffPct}%` : "Base"}
                </span>

                {/* Active Indicator dot */}
                {isSelected && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-[#1B1926]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Input & Month Simulation Trigger Button */}
        <button
          id="btn-open-month-input-modal"
          onClick={onOpenMonthModal}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all shadow-sm shrink-0 ${
            hasCustomOverrides
              ? "bg-amber-600 text-white ring-2 ring-amber-400 animate-pulse"
              : "border border-purple-800/40 bg-purple-950/40 text-purple-300 hover:bg-purple-900/50 hover:border-purple-500"
          }`}
          title="Click to view full sourcing intelligence and input custom variables for this month"
        >
          <Sliders className="h-3.5 w-3.5 text-purple-300" />
          <span>Input Month Data / Info</span>
          {hasCustomOverrides && (
            <span className="rounded bg-amber-950 px-1.5 py-0.2 text-[9px] text-amber-200">
              Customized
            </span>
          )}
        </button>
      </div>

      {/* 2. Active Month Intelligence Snapshot Bar */}
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Left: Active Season & Climate Notes */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 font-bold text-[#F5F3FA]">
            <span className="text-emerald-400">●</span>
            Active Sourcing Period:{" "}
            <span className="text-purple-300 font-extrabold">{selectedMonth}</span>
          </span>

          <span className="rounded-md bg-[#14121F] border border-[#2A2740] px-2 py-0.5 text-[11px] font-semibold text-[#F5F3FA]">
            {profile.seasonBadge}
          </span>

          <span className="text-[11px] text-[#9B95B0] hidden sm:inline">
            • {profile.weatherDescription}
          </span>
        </div>

        {/* Right: Live Monthly Metrics (Reflecting active month adjustments) */}
        <div className="flex items-center gap-3 text-[11px]">
          {/* Average Price */}
          <div className="flex items-center gap-1 rounded bg-[#14121F] px-2 py-1 border border-[#2A2740]">
            <span className="text-[#9B95B0]">Avg Quoted Price:</span>
            <span className="font-bold text-emerald-400 font-mono">
              ₦{Math.round(avgPricePerKg).toLocaleString()}/kg
            </span>
          </div>

          {/* Fleet Lead Days */}
          <div className="flex items-center gap-1 rounded bg-[#14121F] px-2 py-1 border border-[#2A2740]">
            <Truck className="h-3 w-3 text-blue-400" />
            <span className="text-[#9B95B0]">Fleet Lead:</span>
            <span className="font-bold text-[#F5F3FA]">{avgLeadDays.toFixed(1)}d</span>
          </div>

          {/* Month Spend Potential */}
          <div className="flex items-center gap-1 rounded bg-[#14121F] px-2 py-1 border border-[#2A2740]">
            <DollarSign className="h-3 w-3 text-purple-400" />
            <span className="text-[#9B95B0]">Est. Spend:</span>
            <span className="font-bold text-purple-300 font-mono">
              ₦{(totalMonthlySpend / 1e9).toFixed(3)}B
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
