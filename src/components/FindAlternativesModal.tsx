import React from "react";
import {
  X,
  Sparkles,
  Award,
  ArrowRight,
  ShieldCheck,
  Building2,
  Clock,
  TrendingUp,
  Bookmark,
} from "lucide-react";
import { RawSupplierRecord } from "../types";
import { findAlternativeSuppliers } from "../lib/aggregations";

interface FindAlternativesModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetSupplierName?: string;
  targetSupplierId?: string;
  targetProduct?: string;
  targetCategory?: string;
  allRecords: RawSupplierRecord[];
  shortlist: string[];
  onToggleShortlist: (supplierId: string) => void;
}

export const FindAlternativesModal: React.FC<FindAlternativesModalProps> = ({
  isOpen,
  onClose,
  targetSupplierName,
  targetSupplierId = "",
  targetProduct,
  targetCategory,
  allRecords,
  shortlist,
  onToggleShortlist,
}) => {
  if (!isOpen) return null;

  // Algorithm: Find alternative suppliers offering targetProduct or targetCategory with Qualification = "Qualified" & Status = "Active", sorted by score
  const alternatives = findAlternativeSuppliers(
    allRecords,
    targetSupplierId,
    targetProduct,
    targetCategory
  );

  return (
    <div
      id="find-alternatives-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-2xl border border-[#2A2740] bg-[#171524] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#2A2740] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#F5F3FA]">
                Alternative Qualified Suppliers Tool
              </h2>
              <p className="text-xs text-[#9B95B0]">
                Identifying pre-vetted, active alternatives for{" "}
                <span className="text-purple-300 font-semibold">
                  {targetProduct || targetCategory || "Raw Materials"}
                </span>{" "}
                (replacing {targetSupplierName || targetSupplierId})
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

        {/* Alternatives Result List */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-3 text-xs text-[#9B95B0]">
            <span>
              Found <strong className="text-emerald-400">{alternatives.length}</strong> qualified
              & active replacement options:
            </span>
            <span className="text-[11px] text-purple-300">
              Sorted by Supplier Score (Highest first)
            </span>
          </div>

          {alternatives.length === 0 ? (
            <div className="rounded-xl border border-[#2A2740] bg-[#1B1926] p-8 text-center">
              <ShieldCheck className="mx-auto h-8 w-8 text-amber-400 mb-2" />
              <p className="text-sm font-semibold text-[#F5F3FA]">
                No direct qualified alternatives found in active records.
              </p>
              <p className="text-xs text-[#9B95B0] mt-1 max-w-md mx-auto">
                Consider expanding sourcing criteria, looking at suppliers currently marked
                &apos;Under Review&apos; for technical QA acceleration, or consulting the Market Analysis tab.
              </p>
            </div>
          ) : (
            <div className="max-h-[380px] overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
              {alternatives.map((alt, idx) => {
                const isShortlisted = shortlist.includes(alt.supplierId);
                return (
                  <div
                    key={`${alt.supplierId}-${idx}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[#2A2740] bg-[#1B1926] p-3.5 hover:border-purple-500/50 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#F5F3FA]">{alt.supplier}</h4>
                        <span className="rounded bg-purple-950/80 px-1.5 py-0.5 font-mono text-[10px] text-purple-300 border border-purple-800/40">
                          {alt.supplierId}
                        </span>
                        <span className="rounded-full bg-emerald-950/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-800/40">
                          Qualified
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#9B95B0]">
                        <span>Product: <strong className="text-[#F5F3FA]">{alt.product}</strong></span>
                        <span>Market: <strong className="text-[#F5F3FA]">{alt.market}</strong></span>
                        <span>Capacity: <strong className="text-[#F5F3FA]">{alt.capacityTonsMonth} t/mo</strong></span>
                        <span>Lead: <strong className="text-[#F5F3FA]">{alt.leadDays} days</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-center">
                      <div className="text-right">
                        <div className="text-xs text-[#9B95B0]">Price/kg</div>
                        <div className="text-sm font-bold text-[#F5F3FA]">
                          ₦{alt.pricePerKg?.toLocaleString()}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs text-[#9B95B0]">Score</div>
                        <div className="text-sm font-black text-purple-300">
                          {alt.supplierScore?.toFixed(1)}
                        </div>
                      </div>

                      <button
                        onClick={() => onToggleShortlist(alt.supplierId)}
                        className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold border transition-all ${
                          isShortlisted
                            ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
                            : "bg-[#252236] border-[#2A2740] text-[#F5F3FA] hover:bg-purple-950 hover:text-purple-300"
                        }`}
                        title="Add to procurement shortlist"
                      >
                        <Bookmark className={`h-3.5 w-3.5 ${isShortlisted ? "fill-amber-400 text-amber-400" : ""}`} />
                        <span>{isShortlisted ? "Shortlisted" : "Shortlist"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 border-t border-[#2A2740] pt-4 flex items-center justify-between text-xs text-[#9B95B0]">
          <span>Meets HoneyWell Procurement Policy: Active + Fully Qualified</span>
          <button
            onClick={onClose}
            className="rounded-xl bg-[#2A2740] px-4 py-1.5 font-medium text-[#F5F3FA] hover:bg-[#353150] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
