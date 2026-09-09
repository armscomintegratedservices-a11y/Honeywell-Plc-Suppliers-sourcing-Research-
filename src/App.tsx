/**
 * HoneyWell Plc - Supplier Sourcing & Research Dashboard
 *
 * Single-page analytics dashboard for monthly procurement and warehouse operations
 * evaluating raw-material suppliers across Nigerian food-processing markets.
 */

import React, { useState, useMemo } from "react";
import { parseSeedCsv } from "./data/seedData";
import {
  RawSupplierRecord,
  FilterState,
  SpendSettings,
} from "./types";
import {
  applyFilters,
  computeSupplierDimension,
  computeNineSpendKpis,
  processSupplierIds,
} from "./lib/aggregations";
import { TopBar } from "./components/TopBar";
import { NavigationTabs, NavTabId } from "./components/NavigationTabs";
import { FilterRail } from "./components/FilterRail";
import { OverviewView } from "./components/OverviewView";
import { SupplierDirectory } from "./components/SupplierDirectory";
import { SupplierScorecardTable } from "./components/SupplierScorecardTable";
import { SpendCostAnalysisView } from "./components/SpendCostAnalysisView";
import { ComplianceRiskTable } from "./components/ComplianceRiskTable";
import { MarketCompetitivenessPanel } from "./components/MarketCompetitivenessPanel";
import { AiInsightsPanel } from "./components/AiInsightsPanel";
import { DataManagementView } from "./components/DataManagementView";
import { SettingsPanel } from "./components/SettingsPanel";
import { FindAlternativesModal } from "./components/FindAlternativesModal";
import { ShortlistDrawer } from "./components/ShortlistDrawer";
import { MonthInputModal } from "./components/MonthInputModal";
import { ExecutiveSummaryPanel } from "./components/ExecutiveSummaryPanel";
import { applyMonthDynamics, MonthCustomInputs } from "./lib/monthDynamics";

const INITIAL_FILTERS: FilterState = {
  market: [],
  category: [],
  product: [],
  supplier: [],
  qualification: [],
  certification: [],
  status: [],
  search: "",
};

const INITIAL_SPEND_SETTINGS: SpendSettings = {
  basis: "capacity",
  concentrationThreshold: 50,
  actualQuantities: {},
};

export default function App() {
  // Initialize with the standard 111-record seed dataset
  const initialData = useMemo(() => {
    const raw = parseSeedCsv();
    const { processedRecords } = processSupplierIds(raw);
    return processedRecords;
  }, []);

  const [dataset, setDataset] = useState<RawSupplierRecord[]>(initialData);
  const [isCustomData, setIsCustomData] = useState(false);
  const [validationIssues, setValidationIssues] = useState<string[]>([]);

  // Navigation & View state
  const [activeTab, setActiveTab] = useState<NavTabId>("overview");
  const [selectedMonth, setSelectedMonth] = useState("September 2026");

  // Month-specific custom user inputs state (e.g. priceShift, leadShift, capMultiplier, targetBudget)
  const [monthCustomInputs, setMonthCustomInputs] = useState<Record<string, MonthCustomInputs>>({});
  const [isMonthModalOpen, setIsMonthModalOpen] = useState(false);

  // Month-adjusted dataset: applies seasonal commodity dynamics, logistics transit times, and user inputs for the selected month
  const activeMonthDataset = useMemo(() => {
    return applyMonthDynamics(dataset, selectedMonth, monthCustomInputs[selectedMonth]);
  }, [dataset, selectedMonth, monthCustomInputs]);

  // Global Filters & Spend Settings
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [spendSettings, setSpendSettings] = useState<SpendSettings>(INITIAL_SPEND_SETTINGS);

  // Layout UI states
  const [isFilterRailCollapsed, setIsFilterRailCollapsed] = useState(false);
  const [isShortlistOpen, setIsShortlistOpen] = useState(false);
  const [shortlist, setShortlist] = useState<string[]>([]);

  // Find Alternatives Modal State
  const [alternativesTarget, setAlternativesTarget] = useState<RawSupplierRecord | null>(null);

  // Available Filter Options (derived from active month dataset)
  const availableMarkets = useMemo(
    () => Array.from(new Set(activeMonthDataset.map((r) => r.market))).sort(),
    [activeMonthDataset]
  );
  const availableCategories = useMemo(
    () => Array.from(new Set(activeMonthDataset.map((r) => r.category))).sort(),
    [activeMonthDataset]
  );
  const availableProducts = useMemo(
    () => Array.from(new Set(activeMonthDataset.map((r) => r.product))).sort(),
    [activeMonthDataset]
  );
  const availableSuppliers = useMemo(
    () => Array.from(new Set(activeMonthDataset.map((r) => r.supplier))).sort(),
    [activeMonthDataset]
  );
  const availableCertifications = useMemo(() => {
    const certs = new Set<string>();
    activeMonthDataset.forEach((r) => {
      (r.certification || "")
        .split(";")
        .map((c) => c.trim())
        .filter(Boolean)
        .forEach((c) => certs.add(c));
    });
    return Array.from(certs).sort();
  }, [activeMonthDataset]);

  // Filtered dataset derived from the active monthly dataset
  const filteredRecords = useMemo(
    () => applyFilters(activeMonthDataset, filters),
    [activeMonthDataset, filters]
  );

  // Supplier Dimension (1 row per distinct Supplier ID)
  const supplierDimension = useMemo(
    () => computeSupplierDimension(filteredRecords, spendSettings),
    [filteredRecords, spendSettings]
  );

  // 9 Live Spend & Cost KPIs
  const kpis = useMemo(
    () => computeNineSpendKpis(filteredRecords, spendSettings),
    [filteredRecords, spendSettings]
  );

  // Shortlist Handlers
  const handleToggleShortlist = (supplierId: string) => {
    setShortlist((prev) =>
      prev.includes(supplierId)
        ? prev.filter((id) => id !== supplierId)
        : [...prev, supplierId]
    );
  };

  const handleClearShortlist = () => setShortlist([]);

  // Reset to seed dataset
  const handleResetToSample = () => {
    const raw = parseSeedCsv();
    const { processedRecords } = processSupplierIds(raw);
    setDataset(processedRecords);
    setIsCustomData(false);
    setValidationIssues([]);
    setFilters(INITIAL_FILTERS);
  };

  // Update with newly uploaded dataset
  const handleUpdateDataset = (newRecords: RawSupplierRecord[]) => {
    setDataset(newRecords);
    setIsCustomData(true);
    setFilters(INITIAL_FILTERS);
  };

  // Inspect specific supplier
  const handleSelectSupplier = (supplierId: string) => {
    setActiveTab("scorecard");
  };

  // Open alternatives modal for record
  const handleOpenAlternatives = (record: RawSupplierRecord) => {
    setAlternativesTarget(record);
  };

  const disqualifiedCount = useMemo(
    () => filteredRecords.filter((r) => r.qualification === "Disqualified").length,
    [filteredRecords]
  );

  return (
    <div
      id="app-root"
      className="flex min-h-screen flex-col bg-[#0F0E17] text-[#F5F3FA] font-sans antialiased"
    >
      {/* 1. Global TopBar */}
      <TopBar
        searchQuery={filters.search}
        onSearchChange={(q) => setFilters((prev) => ({ ...prev, search: q }))}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        onOpenMonthModal={() => setIsMonthModalOpen(true)}
        isCustomData={isCustomData}
        totalRows={dataset.length}
        onResetData={handleResetToSample}
        onOpenUpload={() => setActiveTab("data")}
        shortlistCount={shortlist.length}
        onOpenShortlist={() => setIsShortlistOpen(true)}
        spendSettings={spendSettings}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as NavTabId)}
      />

      {/* 2. Main Navigation Tabs */}
      <NavigationTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        disqualifiedCount={disqualifiedCount}
        concentrationRiskHigh={kpis.isConcentrationAboveThreshold}
      />

      {/* 3. Main Dashboard Workspace: Left Filter Rail + Active Tab View */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Filter Rail */}
        <FilterRail
          filters={filters}
          onFilterChange={setFilters}
          onResetFilters={() => setFilters(INITIAL_FILTERS)}
          availableMarkets={availableMarkets}
          availableCategories={availableCategories}
          availableProducts={availableProducts}
          availableSuppliers={availableSuppliers}
          availableCertifications={availableCertifications}
          totalFilteredRecords={filteredRecords.length}
          totalRecords={dataset.length}
          isCollapsed={isFilterRailCollapsed}
          onToggleCollapse={() => setIsFilterRailCollapsed(!isFilterRailCollapsed)}
        />

        {/* Center Content View Area */}
        <main
          id="main-view-container"
          className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar bg-[#0F0E17]"
        >
          {activeTab === "overview" && (
            <OverviewView
              kpis={kpis}
              spendSettings={spendSettings}
              supplierDimension={supplierDimension}
              filteredRecords={filteredRecords}
              onNavigateToTab={setActiveTab}
              onSelectSupplier={handleSelectSupplier}
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
              onOpenMonthModal={() => setIsMonthModalOpen(true)}
              customInputs={monthCustomInputs[selectedMonth]}
              filters={filters}
              onFilterChange={setFilters}
              onResetFilters={() => setFilters(INITIAL_FILTERS)}
              availableMarkets={availableMarkets}
              availableCategories={availableCategories}
              availableProducts={availableProducts}
              availableSuppliers={availableSuppliers}
              availableCertifications={availableCertifications}
              totalRecords={dataset.length}
            />
          )}

          {activeTab === "executive" && (
            <div className="space-y-4">
              <ExecutiveSummaryPanel
                kpis={kpis}
                spendSettings={spendSettings}
                filteredRecords={filteredRecords}
                supplierDimension={supplierDimension}
                selectedMonth={selectedMonth}
                onFilterChange={setFilters}
                onNavigateToTab={setActiveTab}
                onSelectSupplier={handleSelectSupplier}
              />
            </div>
          )}

          {activeTab === "directory" && (
            <SupplierDirectory
              records={filteredRecords}
              shortlist={shortlist}
              onToggleShortlist={handleToggleShortlist}
              onSelectSupplier={handleSelectSupplier}
              onOpenAlternatives={handleOpenAlternatives}
            />
          )}

          {activeTab === "scorecard" && (
            <SupplierScorecardTable
              suppliers={supplierDimension}
              allRecords={activeMonthDataset}
              shortlist={shortlist}
              onToggleShortlist={handleToggleShortlist}
              onOpenAlternatives={handleOpenAlternatives}
            />
          )}

          {activeTab === "spend" && (
            <SpendCostAnalysisView
              kpis={kpis}
              spendSettings={spendSettings}
              filteredRecords={filteredRecords}
              supplierDimension={supplierDimension}
              onOpenSettings={() => setActiveTab("settings")}
            />
          )}

          {activeTab === "compliance" && (
            <ComplianceRiskTable
              records={filteredRecords}
              onSelectSupplier={handleSelectSupplier}
            />
          )}

          {activeTab === "competitiveness" && (
            <MarketCompetitivenessPanel
              allRecords={activeMonthDataset}
              onSelectMarket={(m) => setFilters((prev) => ({ ...prev, market: [m] }))}
            />
          )}

          {activeTab === "ai" && (
            <AiInsightsPanel
              filteredRecords={filteredRecords}
              kpis={kpis}
              spendSettings={spendSettings}
            />
          )}

          {activeTab === "data" && (
            <DataManagementView
              currentRecords={dataset}
              isCustomData={isCustomData}
              onUpdateDataset={handleUpdateDataset}
              onResetToSample={handleResetToSample}
              validationIssues={validationIssues}
            />
          )}

          {activeTab === "settings" && (
            <SettingsPanel
              settings={spendSettings}
              onUpdateSettings={setSpendSettings}
              onResetSettings={() => setSpendSettings(INITIAL_SPEND_SETTINGS)}
            />
          )}
        </main>
      </div>

      {/* 4. Find Alternatives Modal Tool */}
      <FindAlternativesModal
        isOpen={alternativesTarget !== null}
        onClose={() => setAlternativesTarget(null)}
        targetSupplierName={alternativesTarget?.supplier}
        targetSupplierId={alternativesTarget?.supplierId}
        targetProduct={alternativesTarget?.product}
        targetCategory={alternativesTarget?.category}
        allRecords={activeMonthDataset}
        shortlist={shortlist}
        onToggleShortlist={handleToggleShortlist}
      />

      {/* 5. Procurement Shortlist Drawer */}
      <ShortlistDrawer
        isOpen={isShortlistOpen}
        onClose={() => setIsShortlistOpen(false)}
        shortlistIds={shortlist}
        allRecords={activeMonthDataset}
        onRemoveFromShortlist={handleToggleShortlist}
        onClearShortlist={handleClearShortlist}
      />

      {/* 6. Month Procurement Dynamics & Custom Input Simulation Modal */}
      <MonthInputModal
        isOpen={isMonthModalOpen}
        onClose={() => setIsMonthModalOpen(false)}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        customInputs={monthCustomInputs[selectedMonth]}
        onApplyCustomInputs={(inputs) => {
          setMonthCustomInputs((prev) => ({
            ...prev,
            [selectedMonth]: inputs,
          }));
        }}
        onResetCustomInputs={() => {
          setMonthCustomInputs((prev) => {
            const copy = { ...prev };
            delete copy[selectedMonth];
            return copy;
          });
        }}
        currentEstimatedSpend={kpis.totalCostOfProduction}
      />
    </div>
  );
}
