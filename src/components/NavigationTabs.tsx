import React from "react";
import {
  LayoutDashboard,
  FileText,
  Users,
  Award,
  TrendingUp,
  ShieldCheck,
  Globe2,
  Sparkles,
  Database,
  Sliders,
} from "lucide-react";

export type NavTabId =
  | "overview"
  | "executive"
  | "directory"
  | "scorecard"
  | "spend"
  | "compliance"
  | "competitiveness"
  | "ai"
  | "data"
  | "settings";

interface NavigationTabsProps {
  activeTab: NavTabId;
  onTabChange: (tab: NavTabId) => void;
  disqualifiedCount?: number;
  concentrationRiskHigh?: boolean;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onTabChange,
  disqualifiedCount = 0,
  concentrationRiskHigh = false,
}) => {
  const tabs: { id: NavTabId; label: string; icon: React.ReactNode; badge?: string; badgeColor?: string }[] = [
    {
      id: "overview",
      label: "Overview",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      id: "executive",
      label: "Executive Summary",
      icon: <FileText className="h-4 w-4 text-emerald-400" />,
      badge: "Decisions",
      badgeColor: "bg-emerald-600 text-white",
    },
    {
      id: "directory",
      label: "Supplier Directory",
      icon: <Users className="h-4 w-4" />,
    },
    {
      id: "scorecard",
      label: "Scorecard",
      icon: <Award className="h-4 w-4" />,
    },
    {
      id: "spend",
      label: "Spend & Cost",
      icon: <TrendingUp className="h-4 w-4" />,
      badge: concentrationRiskHigh ? "Risk" : undefined,
      badgeColor: "bg-rose-500 text-white",
    },
    {
      id: "compliance",
      label: "Compliance & Specs",
      icon: <ShieldCheck className="h-4 w-4" />,
      badge: disqualifiedCount > 0 ? `${disqualifiedCount}` : undefined,
      badgeColor: "bg-amber-500/90 text-black",
    },
    {
      id: "competitiveness",
      label: "Market Analysis",
      icon: <Globe2 className="h-4 w-4" />,
    },
    {
      id: "ai",
      label: "AI Insights",
      icon: <Sparkles className="h-4 w-4 text-purple-400" />,
      badge: "Gemini",
      badgeColor: "bg-purple-600 text-white",
    },
    {
      id: "data",
      label: "Data Management",
      icon: <Database className="h-4 w-4" />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Sliders className="h-4 w-4" />,
    },
  ];

  return (
    <nav
      id="main-navigation-tabs"
      aria-label="Main Navigation"
      className="flex items-center gap-1.5 overflow-x-auto border-b border-[#2A2740] bg-[#171524] px-6 py-2 no-scrollbar"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            id={`nav-tab-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            className={`group relative flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-medium transition-all ${
              isActive
                ? "bg-purple-600 text-white shadow-md shadow-purple-900/30"
                : "text-[#9B95B0] hover:bg-[#201D2F] hover:text-[#F5F3FA]"
            }`}
          >
            <span className={isActive ? "text-white" : "text-[#9B95B0] group-hover:text-[#F5F3FA]"}>
              {tab.icon}
            </span>
            <span>{tab.label}</span>
            {tab.badge && (
              <span
                className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  tab.badgeColor || "bg-purple-950 text-purple-300"
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
