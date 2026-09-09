import React from "react";
import { ShieldCheck, HelpCircle } from "lucide-react";

interface SupplierGaugeProps {
  score: number; // 0 to 100
  title?: string;
  subtitle?: string;
  target?: number;
  qualifiedRate: number;
}

export const SupplierGauge: React.FC<SupplierGaugeProps> = ({
  score,
  title = "Supplier Health Index",
  subtitle = "Composite score across QA, Reliability, & Compliance",
  target = 85,
  qualifiedRate,
}) => {
  // Clamp score between 0 and 100
  const clampedScore = Math.min(100, Math.max(0, score));

  // Gauge geometry: Semi-circle 180 degrees
  const size = 200;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = Math.PI * radius; // Half-circle circumference
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  // Determine status color and text
  let statusText = "Good Standing";
  let statusColor = "text-purple-400";
  let strokeColor = "#8B5CF6"; // vibrant purple

  if (clampedScore >= 85) {
    statusText = "Excellent Quality";
    statusColor = "text-emerald-400";
    strokeColor = "#10B981";
  } else if (clampedScore < 70) {
    statusText = "Needs Remediation";
    statusColor = "text-rose-400";
    strokeColor = "#F43F5E";
  } else {
    statusText = "Acceptable Standard";
    statusColor = "text-purple-400";
    strokeColor = "#8B5CF6";
  }

  return (
    <div
      id="supplier-gauge-card"
      className="flex flex-col justify-between rounded-xl border border-[#2A2740] bg-[#1B1926] p-4 shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-[#2A2740]/60 pb-2.5">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F3FA]">
            {title}
          </h3>
          <p className="text-[11px] text-[#9B95B0]">{subtitle}</p>
        </div>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-950/60 text-purple-400">
          <ShieldCheck className="h-4 w-4" />
        </div>
      </div>

      {/* SVG Semi-Circle Gauge */}
      <div className="relative my-2 flex flex-col items-center justify-center">
        <svg width={size} height={size / 2 + 25} className="overflow-visible">
          {/* Background Track */}
          <path
            d={`M ${strokeWidth / 2} ${size / 2 + 10} A ${radius} ${radius} 0 0 1 ${
              size - strokeWidth / 2
            } ${size / 2 + 10}`}
            fill="none"
            stroke="#262338"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Progress Arc */}
          <path
            d={`M ${strokeWidth / 2} ${size / 2 + 10} A ${radius} ${radius} 0 0 1 ${
              size - strokeWidth / 2
            } ${size / 2 + 10}`}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />

          {/* Target tick mark */}
          {target && (
            <circle
              cx={
                size / 2 +
                radius * Math.cos(Math.PI - (target / 100) * Math.PI)
              }
              cy={
                size / 2 +
                10 -
                radius * Math.sin(Math.PI - (target / 100) * Math.PI)
              }
              r="4"
              fill="#F5F3FA"
              stroke="#0F0E17"
              strokeWidth="2"
            />
          )}
        </svg>

        {/* Center Readout */}
        <div className="absolute top-10 flex flex-col items-center justify-center text-center">
          <div className="flex items-baseline">
            <span className="text-3xl font-black tracking-tight text-[#F5F3FA]">
              {clampedScore.toFixed(1)}
            </span>
            <span className="text-sm font-semibold text-[#9B95B0]">/100</span>
          </div>
          <span className={`mt-0.5 text-xs font-semibold ${statusColor}`}>
            {statusText}
          </span>
        </div>

        {/* Scale Min / Max markers */}
        <div className="mt-1 flex w-full max-w-[190px] justify-between text-[10px] font-medium text-[#9B95B0]">
          <span>0 (Critical)</span>
          <span className="text-purple-300">Target: {target}</span>
          <span>100 (Optimal)</span>
        </div>
      </div>

      {/* Bottom Metrics Details */}
      <div className="grid grid-cols-2 gap-2 border-t border-[#2A2740]/60 pt-2.5 text-center text-xs">
        <div className="rounded-lg bg-[#14121F] p-1.5">
          <span className="text-[10px] text-[#9B95B0]">Qualified Suppliers</span>
          <p className="font-bold text-[#F5F3FA]">{qualifiedRate.toFixed(1)}%</p>
        </div>
        <div className="rounded-lg bg-[#14121F] p-1.5">
          <span className="text-[10px] text-[#9B95B0]">QA Target Gap</span>
          <p
            className={`font-bold ${
              clampedScore >= target ? "text-emerald-400" : "text-amber-400"
            }`}
          >
            {clampedScore >= target
              ? `+${(clampedScore - target).toFixed(1)} pts`
              : `${(clampedScore - target).toFixed(1)} pts`}
          </p>
        </div>
      </div>
    </div>
  );
};
