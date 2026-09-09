import React from "react";
import { SpendSettings } from "../types";
import { Sliders, DollarSign, ShieldAlert, Check, RotateCcw } from "lucide-react";

interface SettingsPanelProps {
  settings: SpendSettings;
  onUpdateSettings: (newSettings: SpendSettings) => void;
  onResetSettings: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onUpdateSettings,
  onResetSettings,
}) => {
  return (
    <div id="settings-view" className="space-y-4 max-w-4xl mx-auto">
      <div className="rounded-xl border border-[#2A2740] bg-[#1B1926] p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#2A2740]/60 pb-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#F5F3FA] flex items-center gap-2">
              <Sliders className="h-4 w-4 text-purple-400" />
              Procurement Financial & Modeling Settings
            </h2>
            <p className="text-xs text-[#9B95B0]">
              Configure spend potential formulas, risk thresholds, and procurement policies
            </p>
          </div>

          <button
            onClick={onResetSettings}
            className="flex items-center gap-1.5 rounded-lg border border-[#2A2740] bg-[#14121F] px-3 py-1.5 text-xs text-[#9B95B0] hover:text-[#F5F3FA] transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset Defaults</span>
          </button>
        </div>

        {/* Setting 1: Spend Basis Formula Selection */}
        <div className="mt-5 space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-[#F5F3FA] flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5 text-purple-400" />
            Spend Potential Calculation Basis
          </label>
          <p className="text-xs text-[#9B95B0]">
            Select how the dashboard estimates procurement spend across filtered supplier listings:
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 pt-1">
            {/* Option A: Full Capacity */}
            <div
              onClick={() => onUpdateSettings({ ...settings, basis: "capacity" })}
              className={`rounded-xl border p-4 cursor-pointer transition-all ${
                settings.basis === "capacity"
                  ? "border-purple-500 bg-purple-950/30 ring-1 ring-purple-500"
                  : "border-[#2A2740] bg-[#14121F] hover:border-purple-500/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#F5F3FA]">Full Monthly Capacity</h4>
                {settings.basis === "capacity" && <Check className="h-4 w-4 text-purple-400" />}
              </div>
              <span className="mt-1 block font-mono text-[10px] text-purple-300">
                Price/kg × (Capacity t × 1,000)
              </span>
              <p className="mt-2 text-[11px] text-[#9B95B0] leading-relaxed">
                Standard baseline modeling the maximum monthly production envelope of each supplier.
              </p>
            </div>

            {/* Option B: MOQ Spend */}
            <div
              onClick={() => onUpdateSettings({ ...settings, basis: "moq" })}
              className={`rounded-xl border p-4 cursor-pointer transition-all ${
                settings.basis === "moq"
                  ? "border-purple-500 bg-purple-950/30 ring-1 ring-purple-500"
                  : "border-[#2A2740] bg-[#14121F] hover:border-purple-500/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#F5F3FA]">Minimum Order (MOQ)</h4>
                {settings.basis === "moq" && <Check className="h-4 w-4 text-purple-400" />}
              </div>
              <span className="mt-1 block font-mono text-[10px] text-purple-300">
                Price/kg × MOQ kg
              </span>
              <p className="mt-2 text-[11px] text-[#9B95B0] leading-relaxed">
                Evaluates the minimum working capital commitment needed to initiate purchasing batches.
              </p>
            </div>

            {/* Option C: Actual / 50% Benchmark */}
            <div
              onClick={() => onUpdateSettings({ ...settings, basis: "actual" })}
              className={`rounded-xl border p-4 cursor-pointer transition-all ${
                settings.basis === "actual"
                  ? "border-purple-500 bg-purple-950/30 ring-1 ring-purple-500"
                  : "border-[#2A2740] bg-[#14121F] hover:border-purple-500/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#F5F3FA]">Custom Recorded Volume</h4>
                {settings.basis === "actual" && <Check className="h-4 w-4 text-purple-400" />}
              </div>
              <span className="mt-1 block font-mono text-[10px] text-purple-300">
                Price/kg × Custom Qty (kg)
              </span>
              <p className="mt-2 text-[11px] text-[#9B95B0] leading-relaxed">
                Uses custom recorded monthly quantities or defaults to 50% capacity utilization.
              </p>
            </div>
          </div>
        </div>

        {/* Setting 2: Concentration Risk Threshold */}
        <div className="mt-8 space-y-3 border-t border-[#2A2740]/60 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#F5F3FA] flex items-center gap-1.5">
                <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
                Supplier Concentration Risk Threshold (%)
              </label>
              <p className="text-xs text-[#9B95B0] mt-0.5">
                Flags risk when top 3 suppliers account for more than this % of total production spend.
              </p>
            </div>
            <span className="rounded-xl border border-rose-800/60 bg-rose-950/40 px-3 py-1 font-mono text-sm font-bold text-rose-300">
              {settings.concentrationThreshold}%
            </span>
          </div>

          <div className="flex items-center gap-4 pt-1">
            <span className="text-xs text-[#9B95B0]">20%</span>
            <input
              type="range"
              min={20}
              max={80}
              step={5}
              value={settings.concentrationThreshold}
              onChange={(e) =>
                onUpdateSettings({
                  ...settings,
                  concentrationThreshold: parseInt(e.target.value, 10),
                })
              }
              className="flex-1 accent-purple-600 cursor-pointer h-1.5 bg-[#14121F] rounded-lg"
            />
            <span className="text-xs text-[#9B95B0]">80%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
