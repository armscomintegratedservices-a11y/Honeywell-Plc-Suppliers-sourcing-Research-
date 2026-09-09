import React from "react";
import { X, Bookmark, Download, Trash2, Building2, CheckCircle2 } from "lucide-react";
import { RawSupplierRecord } from "../types";

interface ShortlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  shortlistIds: string[];
  allRecords: RawSupplierRecord[];
  onRemoveFromShortlist: (id: string) => void;
  onClearShortlist: () => void;
}

export const ShortlistDrawer: React.FC<ShortlistDrawerProps> = ({
  isOpen,
  onClose,
  shortlistIds,
  allRecords,
  onRemoveFromShortlist,
  onClearShortlist,
}) => {
  if (!isOpen) return null;

  // Find all distinct suppliers in the shortlist
  const shortlistedRecords = allRecords.filter((r) => shortlistIds.includes(r.supplierId));
  const uniqueSuppliers = Array.from(new Set(shortlistedRecords.map((r) => r.supplierId))).map(
    (id) => {
      const items = shortlistedRecords.filter((r) => r.supplierId === id);
      return {
        id,
        supplier: items[0].supplier,
        market: items[0].market,
        score: items[0].supplierScore,
        products: items.map((i) => i.product),
        qualification: items[0].qualification,
      };
    }
  );

  const handleExport = () => {
    const headers = ["Supplier ID", "Supplier Name", "Market", "Score", "Qualification", "Products"];
    const rows = uniqueSuppliers.map((s) => [
      s.id,
      `"${s.supplier.replace(/"/g, '""')}"`,
      s.market,
      s.score,
      s.qualification,
      `"${s.products.join(", ").replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `HoneyWell_Shortlisted_Suppliers_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#171524] border-l border-[#2A2740] flex flex-col h-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2A2740] px-5 py-4">
          <div className="flex items-center gap-2">
            <Bookmark className="h-4 w-4 text-amber-400 fill-amber-400" />
            <h3 className="text-sm font-bold text-[#F5F3FA]">
              Procurement Shortlist ({uniqueSuppliers.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-[#9B95B0] hover:bg-[#252236] hover:text-[#F5F3FA] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Shortlist Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {uniqueSuppliers.length === 0 ? (
            <div className="py-16 text-center text-xs text-[#9B95B0]">
              <Bookmark className="mx-auto h-8 w-8 text-[#423E5E] mb-2" />
              <p className="font-semibold text-[#F5F3FA]">No suppliers shortlisted yet</p>
              <p className="mt-1">
                Click the bookmark star icon on any supplier row in the Directory or Scorecard to save them here for monthly review.
              </p>
            </div>
          ) : (
            uniqueSuppliers.map((s) => (
              <div
                key={s.id}
                className="rounded-xl border border-[#2A2740] bg-[#1B1926] p-3 text-xs space-y-1.5 hover:border-purple-500/40 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-[#F5F3FA]">{s.supplier}</h4>
                    <span className="font-mono text-[10px] text-purple-400 font-semibold">
                      {s.id} • {s.market}
                    </span>
                  </div>
                  <button
                    onClick={() => onRemoveFromShortlist(s.id)}
                    className="text-[#9B95B0] hover:text-rose-400 transition-colors"
                    title="Remove from shortlist"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#232036]">
                  <span className="text-[#9B95B0] truncate max-w-[200px]">
                    Products: {s.products.join(", ")}
                  </span>
                  <span className="font-bold text-purple-300">
                    Score: {s.score?.toFixed(1)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer Actions */}
        {uniqueSuppliers.length > 0 && (
          <div className="border-t border-[#2A2740] p-4 bg-[#14121F] flex items-center gap-2">
            <button
              onClick={handleExport}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-purple-600 py-2 text-xs font-semibold text-white shadow hover:bg-purple-500 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Shortlist CSV</span>
            </button>
            <button
              onClick={onClearShortlist}
              className="rounded-xl border border-rose-800/60 bg-rose-950/30 px-3 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-900/50 transition-colors"
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
