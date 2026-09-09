import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { RawSupplierRecord } from "../types";
import { processSupplierIds } from "../lib/aggregations";
import {
  Upload,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  Download,
  Info,
  Layers,
  Database,
  ShieldCheck,
  FileText,
} from "lucide-react";

interface DataManagementViewProps {
  currentRecords: RawSupplierRecord[];
  isCustomData: boolean;
  onUpdateDataset: (newRecords: RawSupplierRecord[]) => void;
  onResetToSample: () => void;
  validationIssues: string[];
}

export const DataManagementView: React.FC<DataManagementViewProps> = ({
  currentRecords,
  isCustomData,
  onUpdateDataset,
  onResetToSample,
  validationIssues,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Data Quality Metrics
  const totalRows = currentRecords.length;
  const distinctSuppliers = new Set(currentRecords.map((r) => r.supplier)).size;
  const distinctSupplierIds = new Set(currentRecords.map((r) => r.supplierId)).size;
  const distinctMarkets = new Set(currentRecords.map((r) => r.market)).size;
  const distinctCategories = new Set(currentRecords.map((r) => r.category)).size;
  const certNoCount = currentRecords.filter((r) => r.certOk === "No").length;
  const deliveryNoCount = currentRecords.filter((r) => r.deliveryOk === "No").length;
  const certNoPct = totalRows > 0 ? ((certNoCount / totalRows) * 100).toFixed(1) : "0";
  const deliveryNoPct = totalRows > 0 ? ((deliveryNoCount / totalRows) * 100).toFixed(1) : "0";

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setUploadError(null);
    setUploadSuccess(null);

    const fileName = file.name.toLowerCase();
    const isCsv = fileName.endsWith(".csv");
    const isXlsx = fileName.endsWith(".xlsx") || fileName.endsWith(".xls");

    if (!isCsv && !isXlsx) {
      setUploadError("Unsupported file type. Please upload a .csv or .xlsx Excel file.");
      return;
    }

    if (isCsv) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          handleParsedRows(results.data);
        },
        error: (err) => {
          setUploadError(`Failed to parse CSV file: ${err.message}`);
        },
      });
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
          handleParsedRows(jsonData);
        } catch (err: any) {
          setUploadError(`Failed to read Excel file: ${err.message}`);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleParsedRows = (rawRows: any[]) => {
    if (!rawRows || rawRows.length === 0) {
      setUploadError("The uploaded file does not contain any data rows.");
      return;
    }

    // Inspect headers
    const firstRow = rawRows[0];
    const keys = Object.keys(firstRow);

    // Look for essential fields with flexible naming
    const findKey = (possibleNames: string[]) => {
      return keys.find((k) =>
        possibleNames.some((p) => k.toLowerCase().replace(/[^a-z0-9]/g, "").includes(p))
      );
    };

    const supplierKey = findKey(["supplier", "suppliername", "vendor"]);
    const marketKey = findKey(["market", "state", "hub", "location"]);
    const productKey = findKey(["product", "rawmaterial", "item", "material"]);
    const categoryKey = findKey(["category", "group"]);
    const priceKey = findKey(["price", "priceperkg", "unitprice", "rate"]);

    if (!supplierKey || !productKey) {
      setUploadError(
        `Missing required column headers. Expected at least 'Supplier' and 'Product'. Found headers: ${keys.join(", ")}`
      );
      return;
    }

    // Map rows to RawSupplierRecord
    const parsedRecords: RawSupplierRecord[] = [];

    rawRows.forEach((r, idx) => {
      const supplierName = String(r[supplierKey] || "").trim();
      if (!supplierName) return; // skip empty rows

      const supplierId = String(r[findKey(["supplierid", "id", "code"]) || ""] || "").trim();
      const product = String(r[productKey] || "").trim();
      const category = String(r[categoryKey || ""] || "General Raw Materials").trim();
      const market = String(r[marketKey || ""] || "Lagos").trim();

      const pricePerKg = parseFloat(String(r[priceKey || ""] || "0").replace(/[^0-9.]/g, "")) || 0;
      const capacityTonsMonth =
        parseFloat(String(r[findKey(["capacity", "tons", "monthlycap"]) || ""] || "0").replace(/[^0-9.]/g, "")) || 0;
      const moqKg =
        parseFloat(String(r[findKey(["moq", "minimumorder"]) || ""] || "0").replace(/[^0-9.]/g, "")) || 500;
      const leadDays =
        parseFloat(String(r[findKey(["lead", "leaddays", "transit"]) || ""] || "0").replace(/[^0-9.]/g, "")) || 7;
      const qualityPct =
        parseFloat(String(r[findKey(["quality", "qualityscore"]) || ""] || "0").replace(/[^0-9.]/g, "")) || 80;
      const reliabilityPct =
        parseFloat(String(r[findKey(["reliability", "relscore"]) || ""] || "0").replace(/[^0-9.]/g, "")) || 80;

      // Status
      const rawStatus = String(r[findKey(["status", "active"]) || ""] || "Active").toLowerCase();
      const status = rawStatus.includes("inact") ? "Inactive" : "Active";

      // Qualification
      const rawQual = String(r[findKey(["qualification", "qual", "approval"]) || ""] || "Qualified").toLowerCase();
      let qualification: "Qualified" | "Review" | "Disqualified" = "Qualified";
      if (rawQual.includes("disqual") || rawQual.includes("fail") || rawQual.includes("reject")) {
        qualification = "Disqualified";
      } else if (rawQual.includes("rev") || rawQual.includes("pend")) {
        qualification = "Review";
      }

      // Cert OK
      const certOkStr = String(r[findKey(["certok", "certvalid"]) || ""] || "Yes").toLowerCase();
      const certOk = certOkStr.includes("no") || certOkStr.includes("false") ? "No" : "Yes";

      // Delivery OK
      const delOkStr = String(r[findKey(["deliveryok", "delok"]) || ""] || "Yes").toLowerCase();
      const deliveryOk = delOkStr.includes("no") || delOkStr.includes("false") ? "No" : "Yes";

      // Score
      const supplierScore =
        parseFloat(String(r[findKey(["score", "supplierscore"]) || ""] || "0").replace(/[^0-9.]/g, "")) ||
        qualityPct * 0.4 + reliabilityPct * 0.4 + 20;

      parsedRecords.push({
        supplierId,
        supplier: supplierName,
        product,
        category,
        market,
        origin: String(r[findKey(["origin"]) || ""] || market),
        pricePerKg,
        moqKg,
        capacityTonsMonth,
        leadDays,
        qualityPct,
        reliabilityPct,
        supplierScore,
        status,
        qualification,
        certification: String(r[findKey(["certification", "certs"]) || ""] || "NAFDAC; SON"),
        certOk,
        spec: String(r[findKey(["spec", "specmatch"]) || ""] || "Fully Match"),
        specMatch: String(r[findKey(["spec", "specmatch"]) || ""] || "Fully Match"),
        deliveryOk,
        demandIndex:
          parseFloat(String(r[findKey(["demand", "demandindex"]) || ""] || "0").replace(/[^0-9.]/g, "")) || 1.2,
        customerQualityPct:
          parseFloat(String(r[findKey(["customerquality", "custqual"]) || ""] || "0").replace(/[^0-9.]/g, "")) || 85,
        complaintsPct:
          parseFloat(String(r[findKey(["complaints", "complaintspct"]) || ""] || "0").replace(/[^0-9.]/g, "")) || 2.5,
      });
    });

    // Run surrogate ID processing & verification
    const { processedRecords, issues } = processSupplierIds(parsedRecords);

    onUpdateDataset(processedRecords);
    setUploadSuccess(
      `Successfully loaded ${processedRecords.length} records! Assigned deterministic Supplier IDs (SUP-001... SUP-${String(
        new Set(processedRecords.map((p) => p.supplier)).size
      ).padStart(3, "0")}).`
    );
  };

  return (
    <div id="data-management-view" className="space-y-4">
      {/* Header */}
      <div className="rounded-xl border border-[#2A2740] bg-[#1B1926] p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2A2740]/60 pb-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#F5F3FA] flex items-center gap-2">
              <Database className="h-4 w-4 text-purple-400" />
              Data Management & Upload Center
            </h2>
            <p className="text-xs text-[#9B95B0]">
              Upload monthly procurement spreadsheets (.xlsx or .csv) or inspect active dataset schema health
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                isCustomData
                  ? "bg-cyan-950 text-cyan-300 border border-cyan-800"
                  : "bg-emerald-950 text-emerald-300 border border-emerald-800"
              }`}
            >
              {isCustomData ? "● Live Custom Dataset" : "● Sample Seed Data (111 rows)"}
            </span>

            {isCustomData && (
              <button
                onClick={onResetToSample}
                className="flex items-center gap-1.5 rounded-xl border border-rose-800/40 bg-rose-950/40 px-3 py-1 text-xs font-semibold text-rose-300 hover:bg-rose-900/60 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset to Sample Data</span>
              </button>
            )}
          </div>
        </div>

        {/* Upload Dropzone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`mt-4 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
            dragActive
              ? "border-purple-400 bg-purple-950/20"
              : "border-[#2A2740] bg-[#14121F] hover:border-purple-500/50 hover:bg-[#181625]"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/40 mb-3">
            <Upload className="h-6 w-6" />
          </div>

          <h3 className="text-sm font-bold text-[#F5F3FA]">
            Drag and drop your Supplier Sourcing spreadsheet here
          </h3>
          <p className="mt-1 text-xs text-[#9B95B0] max-w-md">
            Supports <strong className="text-purple-300">.xlsx</strong> and{" "}
            <strong className="text-purple-300">.csv</strong> formats. Client-side parsed via SheetJS & PapaParse.
          </p>

          <button
            type="button"
            className="mt-4 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-purple-500"
          >
            Browse Local File
          </button>
        </div>

        {/* Feedback Alerts */}
        {uploadError && (
          <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-rose-800/60 bg-rose-950/30 p-3.5 text-xs text-rose-300">
            <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">File Parsing Error:</p>
              <p className="text-[11px] mt-0.5">{uploadError}</p>
            </div>
          </div>
        )}

        {uploadSuccess && (
          <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-emerald-800/60 bg-emerald-950/30 p-3.5 text-xs text-emerald-300">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Success:</p>
              <p className="text-[11px] mt-0.5">{uploadSuccess}</p>
            </div>
          </div>
        )}
      </div>

      {/* Data Quality Summary & Audit Panel */}
      <div className="rounded-xl border border-[#2A2740] bg-[#1B1926] p-4 shadow-sm">
        <div className="border-b border-[#2A2740]/60 pb-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F3FA] flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-purple-400" />
            Dataset Health & Integrity Audit
          </h3>
          <p className="text-[11px] text-[#9B95B0]">
            Automatic validation of supplier entity mappings and statutory compliance flags
          </p>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <div className="rounded-lg border border-[#2A2740] bg-[#14121F] p-3 text-xs">
            <span className="text-[10px] text-[#9B95B0] uppercase font-semibold">Total Records</span>
            <p className="mt-1 text-xl font-black text-[#F5F3FA]">{totalRows}</p>
            <span className="text-[10px] text-purple-300">Listing rows</span>
          </div>

          <div className="rounded-lg border border-[#2A2740] bg-[#14121F] p-3 text-xs">
            <span className="text-[10px] text-[#9B95B0] uppercase font-semibold">Unique Suppliers</span>
            <p className="mt-1 text-xl font-black text-emerald-400">{distinctSuppliers}</p>
            <span className="text-[10px] text-[#9B95B0]">Distinct names</span>
          </div>

          <div className="rounded-lg border border-[#2A2740] bg-[#14121F] p-3 text-xs">
            <span className="text-[10px] text-[#9B95B0] uppercase font-semibold">Assigned IDs</span>
            <p className="mt-1 text-xl font-black text-purple-300">{distinctSupplierIds}</p>
            <span className="text-[10px] text-[#9B95B0]">SUP-001... format</span>
          </div>

          <div className="rounded-lg border border-[#2A2740] bg-[#14121F] p-3 text-xs">
            <span className="text-[10px] text-[#9B95B0] uppercase font-semibold">States Covered</span>
            <p className="mt-1 text-xl font-black text-cyan-400">{distinctMarkets}</p>
            <span className="text-[10px] text-[#9B95B0]">Nigerian markets</span>
          </div>

          <div className="rounded-lg border border-[#2A2740] bg-[#14121F] p-3 text-xs">
            <span className="text-[10px] text-[#9B95B0] uppercase font-semibold">Cert Deficiencies</span>
            <p className="mt-1 text-xl font-black text-rose-400">{certNoPct}%</p>
            <span className="text-[10px] text-rose-300/80">{certNoCount} rows No Cert</span>
          </div>

          <div className="rounded-lg border border-[#2A2740] bg-[#14121F] p-3 text-xs">
            <span className="text-[10px] text-[#9B95B0] uppercase font-semibold">Delivery Red Flags</span>
            <p className="mt-1 text-xl font-black text-amber-400">{deliveryNoPct}%</p>
            <span className="text-[10px] text-amber-300/80">{deliveryNoCount} rows Delivery No</span>
          </div>
        </div>

        {/* Validation Issues Alert (if any detected) */}
        {validationIssues && validationIssues.length > 0 && (
          <div className="mt-4 rounded-xl border border-amber-800/50 bg-amber-950/20 p-3.5 text-xs">
            <div className="flex items-center gap-2 text-amber-300 font-bold mb-1.5">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <span>Supplier ID Mapping Inconsistencies Detected in Source File</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-amber-200/90 text-[11px]">
              {validationIssues.map((issue, idx) => (
                <li key={idx}>{issue}</li>
              ))}
            </ul>
            <p className="mt-2 text-[10px] text-[#9B95B0]">
              * Note: The application has automatically normalized all records to use guaranteed deterministic alphabetical IDs (SUP-001...) to avoid data corruption.
            </p>
          </div>
        )}
      </div>

      {/* Extension Guidance Note for Honeywell ERP Integration */}
      <div className="rounded-xl border border-purple-800/40 bg-[#171524] p-4 text-xs">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <h4 className="font-bold text-[#F5F3FA]">
              Extending the Schema for Production ERP Integration
            </h4>
            <p className="text-[#9B95B0] leading-relaxed text-[11px]">
              This dashboard is currently configured for market research and vendor discovery. To transition to live transactional spend analysis:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <div className="rounded-lg bg-[#14121F] p-2.5 border border-[#2A2740]">
                <strong className="text-purple-300 block mb-0.5">1. Actual PO Volumes</strong>
                <span className="text-[#9B95B0] text-[10px]">
                  Add an <code className="text-[#F5F3FA]">Actual_Quantity_Kg</code> column to replace capacity-based estimates with exact procurement invoice totals.
                </span>
              </div>
              <div className="rounded-lg bg-[#14121F] p-2.5 border border-[#2A2740]">
                <strong className="text-purple-300 block mb-0.5">2. Batch QA Rejection Logs</strong>
                <span className="text-[#9B95B0] text-[10px]">
                  Track warehouse intake moisture, foreign matter %, and laboratory inspection certificates per delivery.
                </span>
              </div>
              <div className="rounded-lg bg-[#14121F] p-2.5 border border-[#2A2740]">
                <strong className="text-purple-300 block mb-0.5">3. Contract Renewal Dates</strong>
                <span className="text-[#9B95B0] text-[10px]">
                  Introduce expiration dates for SLA renegotiation alerts and price indexation pegging.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
