import React, { useState, useEffect } from "react";
import {
  Calendar,
  X,
  Sliders,
  DollarSign,
  Truck,
  Package,
  TrendingUp,
  TrendingDown,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { MonthProfile, MonthCustomInputs, getMonthProfile } from "../lib/monthDynamics";

interface MonthInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMonth: string;
  onMonthChange: (m: string) => void;
  customInputs?: MonthCustomInputs;
  onApplyCustomInputs: (inputs: MonthCustomInputs) => void;
  onResetCustomInputs: () => void;
  currentEstimatedSpend: number;
}

export const MonthInputModal: React.FC<MonthInputModalProps> = ({
  isOpen,
  onClose,
  selectedMonth,
  onMonthChange,
  customInputs,
  onApplyCustomInputs,
  onResetCustomInputs,
  currentEstimatedSpend,
}) => {
  const profile = getMonthProfile(selectedMonth);

  // Local state for interactive user inputs
  const [priceShift, setPriceShift] = useState<number>(customInputs?.customPriceDeltaPct || 0);
  const [leadShift, setLeadShift] = useState<number>(customInputs?.customLeadDaysDelta || 0);
  const [capMultiplier, setCapMultiplier] = useState<number>(
    customInputs?.customCapacityMultiplier || 1.0
  );
  const [targetBudget, setTargetBudget] = useState<number>(
    customInputs?.customTargetBudgetNgn || profile.baselineProcurementTargetNgn
  );

  // Synchronize when month or customInputs prop changes
  useEffect(() => {
    setPriceShift(customInputs?.customPriceDeltaPct || 0);
    setLeadShift(customInputs?.customLeadDaysDelta || 0);
    setCapMultiplier(customInputs?.customCapacityMultiplier || 1.0);
    setTargetBudget(customInputs?.customTargetBudgetNgn || profile.baselineProcurementTargetNgn);
  }, [selectedMonth, customInputs]);

  if (!isOpen) return null;

  // Calculated live preview metrics
  const effectivePriceMultiplier = profile.priceIndex * (1 + priceShift / 100);
  const effectiveLeadDays = Math.max(2, 6.8 + profile.leadDaysDelta + leadShift);
  const simulatedSpend = currentEstimatedSpend * (1 + priceShift / 100) * capMultiplier;
  const budgetVariance = targetBudget - simulatedSpend;
  const isOverBudget = budgetVariance < 0;

  const handleApply = () => {
    onApplyCustomInputs({
      customPriceDeltaPct: Number(priceShift),
      customLeadDaysDelta: Number(leadShift),
      customCapacityMultiplier: Number(capMultiplier),
      customTargetBudgetNgn: Number(targetBudget),
    });
    onClose();
  };

  const handleReset = () => {
    setPriceShift(0);
    setLeadShift(0);
    setCapMultiplier(1.0);
    setTargetBudget(profile.baselineProcurementTargetNgn);
    onResetCustomInputs();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-fadeIn">
      <div
        id="month-input-modal"
        className="w-full max-w-2xl rounded-2xl border border-[#2A2740] bg-[#1B1926] shadow-2xl overflow-hidden transition-all max-h-[90vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#2A2740] px-5 py-4 bg-[#14121F]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-400">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#F5F3FA]">
                  Sourcing Dynamics & Data Inputs
                </h3>
                <span className="rounded-full bg-purple-950 border border-purple-800/60 px-2 py-0.5 text-[11px] font-bold text-purple-300">
                  {selectedMonth}
                </span>
              </div>
              <p className="text-xs text-[#9B95B0]">
                {profile.seasonTitle} • {profile.quarter} Cycle
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#9B95B0] hover:bg-[#252236] hover:text-[#F5F3FA] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
          {/* 1. Agro-Logistics Situational Intelligence */}
          <div className="rounded-xl border border-[#2A2740] bg-[#14121F] p-3.5 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-[#9B95B0] flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5 text-cyan-400" />
                Nigerian Sourcing Conditions ({profile.quarter} 2026)
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase border ${
                  profile.weatherTransitRisk === "Optimal"
                    ? "bg-emerald-950/70 border-emerald-500/40 text-emerald-300"
                    : profile.weatherTransitRisk === "Good"
                    ? "bg-cyan-950/70 border-cyan-500/40 text-cyan-300"
                    : profile.weatherTransitRisk === "Moderate"
                    ? "bg-purple-950/70 border-purple-500/40 text-purple-300"
                    : profile.weatherTransitRisk === "Challenging"
                    ? "bg-amber-950/70 border-amber-500/40 text-amber-300"
                    : "bg-rose-950/70 border-rose-500/40 text-rose-300"
                }`}
              >
                Logistics: {profile.weatherTransitRisk}
              </span>
            </div>

            <p className="text-xs text-[#F5F3FA] leading-relaxed">
              {profile.keyCommodityNotes}
            </p>

            <div className="rounded-lg bg-[#1c192c] p-2.5 text-[11px] text-[#9B95B0] border border-[#2A2740]/80">
              <span className="font-semibold text-purple-300">Recommended Honeywell Strategy: </span>
              {profile.recommendedStrategy}
            </div>
          </div>

          {/* 2. Interactive Input Controls & Simulation Sliders */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5 text-purple-400" />
              Adjust Month Variables & Procurement Simulation
            </h4>

            {/* Input 1: Commodity Price Variance */}
            <div className="rounded-xl border border-[#2A2740] bg-[#14121F] p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-[#F5F3FA] flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                  Commodity Price Variance (vs. {selectedMonth} baseline)
                </label>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono font-bold text-xs ${
                      priceShift > 0
                        ? "text-rose-400"
                        : priceShift < 0
                        ? "text-emerald-400"
                        : "text-[#F5F3FA]"
                    }`}
                  >
                    {priceShift > 0 ? `+${priceShift}%` : `${priceShift}%`}
                  </span>
                  <span className="text-[10px] text-[#9B95B0]">
                    (Index: {effectivePriceMultiplier.toFixed(2)}x)
                  </span>
                </div>
              </div>

              <input
                type="range"
                min={-20}
                max={25}
                step={1}
                value={priceShift}
                onChange={(e) => setPriceShift(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />

              <div className="flex items-center justify-between text-[10px] text-[#9B95B0]">
                <span>-20% (Heavy Harvest Drop)</span>
                <span>0% (Month Baseline)</span>
                <span>+25% (Extreme Inflation)</span>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setPriceShift(-8)}
                  className="rounded bg-[#252236] px-2 py-0.5 text-[10px] text-emerald-300 hover:bg-emerald-950 transition-colors"
                >
                  🌾 -8% Harvest Glut
                </button>
                <button
                  type="button"
                  onClick={() => setPriceShift(0)}
                  className="rounded bg-[#252236] px-2 py-0.5 text-[10px] text-[#F5F3FA] hover:bg-[#322e47] transition-colors"
                >
                  Default Baseline
                </button>
                <button
                  type="button"
                  onClick={() => setPriceShift(6)}
                  className="rounded bg-[#252236] px-2 py-0.5 text-[10px] text-amber-300 hover:bg-amber-950 transition-colors"
                >
                  ⛽ +6% Fuel/FX Surcharge
                </button>
              </div>
            </div>

            {/* Input 2: Fleet Transit Lead Time Variance */}
            <div className="rounded-xl border border-[#2A2740] bg-[#14121F] p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-[#F5F3FA] flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5 text-blue-400" />
                  Transit Lead Time Adjustment
                </label>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-[#F5F3FA]">
                    {leadShift > 0 ? `+${leadShift}d` : `${leadShift}d`}
                  </span>
                  <span className="text-[10px] text-[#9B95B0]">
                    (Fleet Avg: {effectiveLeadDays.toFixed(1)} days)
                  </span>
                </div>
              </div>

              <input
                type="range"
                min={-3}
                max={5}
                step={0.5}
                value={leadShift}
                onChange={(e) => setLeadShift(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />

              <div className="flex items-center justify-between text-[10px] text-[#9B95B0]">
                <span>-3 days (Express Transit)</span>
                <span>0 days (Standard)</span>
                <span>+5 days (Severe Flooding)</span>
              </div>
            </div>

            {/* Input 3: Target Monthly Procurement Budget */}
            <div className="rounded-xl border border-[#2A2740] bg-[#14121F] p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-[#F5F3FA] flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5 text-purple-400" />
                  Target Procurement Budget for {selectedMonth} (₦)
                </label>
                <span className="text-[10px] text-[#9B95B0]">
                  Default: ₦{(profile.baselineProcurementTargetNgn / 1e9).toFixed(2)}B
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-purple-400">₦</span>
                <input
                  type="number"
                  step={10000000}
                  value={targetBudget}
                  onChange={(e) => setTargetBudget(Number(e.target.value))}
                  className="flex-1 rounded-lg border border-[#2A2740] bg-[#1c192c] px-3 py-1.5 text-xs text-[#F5F3FA] focus:border-purple-500 focus:outline-none"
                />
              </div>

              {/* Budget Variance Analysis Bar */}
              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-[#9B95B0]">
                  Projected Spend:{" "}
                  <strong className="text-[#F5F3FA]">
                    ₦{(simulatedSpend / 1e9).toFixed(3)}B
                  </strong>
                </span>
                <span
                  className={`font-semibold flex items-center gap-1 ${
                    isOverBudget ? "text-rose-400" : "text-emerald-400"
                  }`}
                >
                  {isOverBudget ? (
                    <>
                      <AlertTriangle className="h-3 w-3" />
                      Over Budget by ₦{(Math.abs(budgetVariance) / 1e6).toFixed(1)}M
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3 w-3" />
                      Within Budget (₦{(budgetVariance / 1e6).toFixed(1)}M headroom)
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#2A2740] px-5 py-3.5 bg-[#14121F]">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-lg border border-[#2A2740] bg-[#1c192c] px-3 py-1.5 text-xs text-[#9B95B0] hover:text-[#F5F3FA] hover:border-purple-500 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5 text-purple-400" />
            <span>Reset {selectedMonth} Defaults</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#2A2740] px-3.5 py-1.5 text-xs text-[#9B95B0] hover:text-[#F5F3FA] transition-colors"
            >
              Cancel
            </button>
            <button
              id="btn-apply-month-inputs"
              type="button"
              onClick={handleApply}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500 active:scale-95 transition-all"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Apply to Dashboard Interface</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
