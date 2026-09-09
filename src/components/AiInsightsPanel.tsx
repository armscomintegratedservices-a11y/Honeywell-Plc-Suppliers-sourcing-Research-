import React, { useState, useEffect } from "react";
import {
  Sparkles,
  RotateCcw,
  Send,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Brain,
  MessageSquare,
  ShieldAlert,
  Loader2,
  HelpCircle,
} from "lucide-react";
import { AiInsightsResult, NineSpendKpis, SpendSettings, RawSupplierRecord } from "../types";
import { fetchAiInsights, askAiNaturalLanguage } from "../lib/geminiClient";
import { buildCompactSummaryForAi } from "../lib/aggregations";

interface AiInsightsPanelProps {
  filteredRecords: RawSupplierRecord[];
  kpis: NineSpendKpis;
  spendSettings: SpendSettings;
}

const EXAMPLE_QUERIES = [
  "Which market has the best soya beans suppliers right now?",
  "What are our biggest supplier concentration risks in flours?",
  "Which suppliers should we shortlist as backups for Kano maize?",
  "Compare lead times and reliability across northern vs southern states.",
];

export const AiInsightsPanel: React.FC<AiInsightsPanelProps> = ({
  filteredRecords,
  kpis,
  spendSettings,
}) => {
  const [insights, setInsights] = useState<AiInsightsResult | null>(null);
  const [loadingInsights, setLoadingInsights] = useState<boolean>(false);
  const [userQuery, setUserQuery] = useState("");
  const [askingAi, setAskingAi] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ role: "user" | "ai"; text: string }>>([]);

  const summaryPayload = buildCompactSummaryForAi(filteredRecords, kpis, spendSettings);

  const loadInsights = async () => {
    setLoadingInsights(true);
    try {
      const res = await fetchAiInsights(summaryPayload);
      setInsights(res);
    } catch (e) {
      console.warn("Insights refresh notice:", e);
    } finally {
      setLoadingInsights(false);
    }
  };

  useEffect(() => {
    // Load initial insights on mount if not already loaded
    if (!insights) {
      loadInsights();
    }
  }, []);

  const handleAsk = async (promptToUse?: string) => {
    const q = promptToUse || userQuery;
    if (!q.trim() || askingAi) return;

    const newHistory = [...chatHistory, { role: "user" as const, text: q }];
    setChatHistory(newHistory);
    setUserQuery("");
    setAskingAi(true);

    try {
      const aiReply = await askAiNaturalLanguage(q, summaryPayload);
      setChatHistory([...newHistory, { role: "ai" as const, text: aiReply }]);
    } catch (err: any) {
      setChatHistory([
        ...newHistory,
        {
          role: "ai" as const,
          text: "An error occurred while communicating with the Gemini AI service. Please try again.",
        },
      ]);
    } finally {
      setAskingAi(false);
    }
  };

  return (
    <div id="ai-insights-view" className="space-y-4">
      {/* Header Banner */}
      <div className="rounded-xl border border-purple-800/40 bg-gradient-to-r from-purple-950/40 via-[#1B1926] to-[#1B1926] p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2A2740]/60 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/30 text-purple-300 border border-purple-500/50 shadow-inner">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#F5F3FA]">
                  Executive Gemini AI Strategic Briefing
                </h2>
                <span className="rounded bg-purple-900/70 px-2 py-0.5 text-[10px] font-bold text-purple-200 border border-purple-700/60">
                  {insights?.source || "Gemini Flash AI"}
                </span>
              </div>
              <p className="text-xs text-[#9B95B0]">
                Automated monthly procurement synthesis for Procurement & Warehouse leadership
              </p>
            </div>
          </div>

          <button
            onClick={loadInsights}
            disabled={loadingInsights}
            className="flex items-center gap-1.5 rounded-xl border border-purple-700/60 bg-purple-950/50 px-3.5 py-1.5 text-xs font-semibold text-purple-300 hover:bg-purple-900/60 disabled:opacity-50 transition-all"
          >
            {loadingInsights ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RotateCcw className="h-3.5 w-3.5" />
            )}
            <span>{loadingInsights ? "Analyzing Dataset..." : "Regenerate Briefing"}</span>
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-[#9B95B0]">
          <span>
            Grounding Scope: <strong>{filteredRecords.length} filtered listings</strong> across{" "}
            <strong>{summaryPayload.totalMarkets} Nigerian states</strong>
          </span>
          <span className="text-purple-300 font-mono text-[11px]">
            Total Spend Potential: ₦{(kpis.totalCostOfProduction / 1e6).toFixed(1)}M
          </span>
        </div>
      </div>

      {/* 3 Grouped Cards: Key Insights, Strategic Recommendations, Risk Flags */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* 1. Key Insights Card */}
        <div className="rounded-xl border border-[#2A2740] bg-[#1B1926] p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#2A2740]/60 pb-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F3FA] flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-400" />
                Key Sourcing Insights
              </h3>
              <span className="rounded-full bg-purple-950 px-2 py-0.5 text-[10px] font-semibold text-purple-300">
                Synthesis
              </span>
            </div>

            <div className="mt-3 space-y-2.5 text-xs text-[#F5F3FA]">
              {loadingInsights ? (
                <div className="py-8 text-center text-[#9B95B0] space-y-2">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-purple-400" />
                  <p>Synthesizing pricing, capacity, and market metrics...</p>
                </div>
              ) : (
                (insights?.keyInsights || []).map((point, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-lg bg-[#14121F] p-2.5">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-purple-900/60 text-[10px] font-bold text-purple-300">
                      {i + 1}
                    </span>
                    <p className="text-xs leading-relaxed text-[#D2CCE6]">{point}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <p className="mt-3 text-[10px] text-[#9B95B0] border-t border-[#2A2740]/60 pt-2">
            Derived from live HoneyWell multi-tier supplier evaluation
          </p>
        </div>

        {/* 2. Strategic Recommendations Card */}
        <div className="rounded-xl border border-[#2A2740] bg-[#1B1926] p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#2A2740]/60 pb-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F3FA] flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                Strategic Action Items
              </h3>
              <span className="rounded-full bg-emerald-950 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                Actionable
              </span>
            </div>

            <div className="mt-3 space-y-2.5 text-xs text-[#F5F3FA]">
              {loadingInsights ? (
                <div className="py-8 text-center text-[#9B95B0] space-y-2">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-emerald-400" />
                  <p>Generating contract and allocation recommendations...</p>
                </div>
              ) : (
                (insights?.recommendations || []).map((rec, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-lg bg-[#14121F] p-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    <p className="text-xs leading-relaxed text-[#D2CCE6]">{rec}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <p className="mt-3 text-[10px] text-[#9B95B0] border-t border-[#2A2740]/60 pt-2">
            Prioritized for upcoming Procurement Committee session
          </p>
        </div>

        {/* 3. Risk Flags Card */}
        <div className="rounded-xl border border-[#2A2740] bg-[#1B1926] p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#2A2740]/60 pb-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F3FA] flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-rose-400" />
                Procurement Risk Flags
              </h3>
              <span className="rounded-full bg-rose-950 px-2 py-0.5 text-[10px] font-semibold text-rose-300">
                Critical Alert
              </span>
            </div>

            <div className="mt-3 space-y-2.5 text-xs text-[#F5F3FA]">
              {loadingInsights ? (
                <div className="py-8 text-center text-[#9B95B0] space-y-2">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-rose-400" />
                  <p>Screening concentration, lead time, and certification flags...</p>
                </div>
              ) : (
                (insights?.riskFlags || []).map((risk, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-lg bg-[#14121F] p-2.5 border border-rose-950/50">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                    <p className="text-xs leading-relaxed text-rose-200/90">{risk}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <p className="mt-3 text-[10px] text-[#9B95B0] border-t border-[#2A2740]/60 pt-2">
            Requires mitigation prior to warehouse allocation
          </p>
        </div>
      </div>

      {/* Natural Language Query Section: "Ask AI about this data" */}
      <div className="rounded-xl border border-[#2A2740] bg-[#1B1926] p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#2A2740]/60 pb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-purple-400" />
            <h3 className="text-sm font-bold text-[#F5F3FA]">
              Ask AI About Sourcing & Warehouse Data
            </h3>
          </div>
          <span className="text-xs text-[#9B95B0]">
            Responses dynamically computed using currently active filters
          </span>
        </div>

        {/* Suggested Example Prompts */}
        <div className="mt-3">
          <span className="text-[11px] font-semibold text-[#9B95B0] uppercase tracking-wider">
            Quick Questions:
          </span>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {EXAMPLE_QUERIES.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleAsk(q)}
                className="rounded-lg border border-[#2A2740] bg-[#14121F] px-2.5 py-1 text-xs text-[#D2CCE6] hover:border-purple-500 hover:text-[#F5F3FA] transition-colors text-left"
              >
                &ldquo;{q}&rdquo;
              </button>
            ))}
          </div>
        </div>

        {/* Chat / Query Results History */}
        {chatHistory.length > 0 && (
          <div className="mt-4 max-h-72 overflow-y-auto space-y-3 rounded-xl border border-[#2A2740] bg-[#14121F] p-4 custom-scrollbar">
            {chatHistory.map((item, idx) => (
              <div
                key={idx}
                className={`flex gap-3 text-xs leading-relaxed ${
                  item.role === "user" ? "text-[#F5F3FA]" : "text-purple-200"
                }`}
              >
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-bold text-[10px] ${
                    item.role === "user"
                      ? "bg-[#252236] text-[#9B95B0]"
                      : "bg-purple-600 text-white"
                  }`}
                >
                  {item.role === "user" ? "YOU" : "AI"}
                </div>
                <div className="flex-1 whitespace-pre-wrap">{item.text}</div>
              </div>
            ))}
          </div>
        )}

        {/* Query Input Box */}
        <div className="mt-4 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type any question regarding prices, lead days, certifications, or supplier comparisons..."
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAsk();
            }}
            disabled={askingAi}
            className="flex-1 rounded-xl border border-[#2A2740] bg-[#14121F] px-4 py-2.5 text-xs text-[#F5F3FA] placeholder-[#9B95B0] focus:border-purple-500 focus:outline-none disabled:opacity-50"
          />
          <button
            onClick={() => handleAsk()}
            disabled={askingAi || !userQuery.trim()}
            className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-purple-500 disabled:opacity-50 active:scale-95 transition-all shadow-md"
          >
            {askingAi ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span>{askingAi ? "Querying..." : "Ask Gemini"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
