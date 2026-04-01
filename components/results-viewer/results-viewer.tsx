"use client";

import { useState, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Download,
  ChevronDown,
  ChevronUp,
  FileDown,
  Table2,
} from "lucide-react";
import { formatKd, formatScientific } from "@/lib/utils";
import {
  DEMO_RESULTS,
  MOCK_RESULTS_RESPONSE,
  MOCK_EXPERIMENT_FULL,
  DEMO_SEQUENCES,
  DEMO_EXPERIMENT_CODE,
} from "@/lib/mock-data";
import { ExampleBlock } from "@/components/shared/example-block";
import { ApiPanel } from "@/components/shared/api-panel";

const BINDING_TEXT_COLORS: Record<string, string> = {
  strong: "text-binding-strong",
  medium: "text-binding-medium",
  weak: "text-binding-weak",
  non_binder: "text-binding-non",
  no_expression: "text-muted-foreground",
};

// Y-axis ticks: KD orders of magnitude (10^-6 to 10^-10)
const Y_AXIS_TICKS = [
  { label: "10⁻¹⁰", logKd: 10 },
  { label: "10⁻⁹", logKd: 9 },
  { label: "10⁻⁸", logKd: 8 },
  { label: "10⁻⁷", logKd: 7 },
  { label: "10⁻⁶", logKd: 6 },
];

const LOG_KD_MIN = 5.5; // bottom of chart
const LOG_KD_MAX = 10.5; // top of chart

function getBarPercent(kd: number | null): number {
  if (kd === null || kd === 0) return 0;
  const logKd = -Math.log10(kd);
  return Math.max(0, Math.min(100, ((logKd - LOG_KD_MIN) / (LOG_KD_MAX - LOG_KD_MIN)) * 100));
}

type SortKey = "name" | "kd" | "binding_strength";
type SortDir = "asc" | "desc";

function getAriaSort(
  activeSortKey: SortKey,
  activeSortDir: SortDir,
  column: SortKey
): "ascending" | "descending" | "none" {
  if (activeSortKey !== column) {
    return "none";
  }

  return activeSortDir === "asc" ? "ascending" : "descending";
}

function renderSortIcon(
  activeSortKey: SortKey,
  activeSortDir: SortDir,
  col: SortKey
) {
  if (activeSortKey !== col) return null;
  return activeSortDir === "asc" ? (
    <ChevronUp className="w-3 h-3 inline ml-0.5" />
  ) : (
    <ChevronDown className="w-3 h-3 inline ml-0.5" />
  );
}

function generateCsv(): string {
  const headers = [
    "Sequence Name",
    "Sequence",
    "KD (M)",
    "KD (nM)",
    "kon (M-1s-1)",
    "koff (s-1)",
    "Binding Strength",
    "R²",
    "Control",
  ];

  const rows = DEMO_RESULTS.map((r) => {
    const seq = DEMO_SEQUENCES.find((s) => s.name === r.sequence_name);
    return [
      r.sequence_name,
      seq?.sequence ?? "",
      r.kd != null ? r.kd.toExponential(2) : "",
      r.kd != null ? (r.kd * 1e9).toFixed(2) : "",
      r.kon != null ? r.kon.toExponential(2) : "",
      r.koff != null ? r.koff.toExponential(2) : "",
      r.binding_strength,
      r.r_squared != null ? r.r_squared.toFixed(3) : "",
      seq?.isControl ? "yes" : "no",
    ].join(",");
  });

  return [headers.join(","), ...rows].join("\n");
}

function downloadCsv() {
  const csv = generateCsv();
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${DEMO_EXPERIMENT_CODE}-results.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function ResultsViewer() {
  const [view, setView] = useState<"chart" | "table">("chart");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("kd");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const chartRef = useRef<HTMLDivElement>(null);

  // All results sorted by KD (best first), null KDs at the end
  const chartSorted = useMemo(() => {
    const arr = [...DEMO_RESULTS];
    arr.sort((a, b) => {
      if (a.kd === null && b.kd === null) return 0;
      if (a.kd === null) return 1;
      if (b.kd === null) return -1;
      return a.kd - b.kd;
    });
    return arr;
  }, []);

  const tableSorted = useMemo(() => {
    const arr = [...DEMO_RESULTS];
    arr.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") {
        cmp = a.sequence_name.localeCompare(b.sequence_name);
      } else if (sortKey === "kd") {
        const aKd = a.kd ?? Infinity;
        const bKd = b.kd ?? Infinity;
        cmp = aKd - bKd;
      } else {
        const order = ["strong", "medium", "weak", "non_binder", "no_expression"];
        cmp = order.indexOf(a.binding_strength) - order.indexOf(b.binding_strength);
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <ExampleBlock
      id="view-results"
      number={4}
      title="View Results"
      endpoint="GET /experiments/{id}/results"
      description="Retrieve binding data programmatically. 20 VHH sequences screened against HER2 with full kinetic data."
      left={
        <div className="space-y-4">
          {/* View toggle + Download */}
          <div className="flex items-center gap-2">
            <div className="flex rounded-sm border border-border overflow-hidden">
              <button
                onClick={() => setView("chart")}
                aria-pressed={view === "chart"}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium transition-colors",
                  view === "chart"
                    ? "bg-accent-blue text-white"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <BarChart3 className="w-3 h-3 inline mr-1" />
                Chart
              </button>
              <button
                onClick={() => setView("table")}
                aria-pressed={view === "table"}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium transition-colors border-l border-border",
                  view === "table"
                    ? "bg-accent-blue text-white"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <Table2 className="w-3 h-3 inline mr-1" />
                Table
              </button>
            </div>
            <Button
              onClick={downloadCsv}
              variant="outline"
              className="text-xs h-8 ml-auto"
            >
              <Download className="w-3 h-3 mr-1.5" />
              Download CSV
            </Button>
          </div>

          {view === "chart" ? (
            /* Vertical bar chart with Y-axis */
            <div className="space-y-1">
              <div className="flex" ref={chartRef}>
                {/* Y-axis labels — positioned absolutely within chart height */}
                <div className="relative h-[220px] w-10 shrink-0">
                  {Y_AXIS_TICKS.map((tick) => {
                    const pct = ((tick.logKd - LOG_KD_MIN) / (LOG_KD_MAX - LOG_KD_MIN)) * 100;
                    return (
                      <div
                        key={tick.label}
                        className="absolute right-1 text-[9px] font-mono text-muted-foreground/60 leading-none -translate-y-1/2"
                        style={{ bottom: `${pct}%` }}
                      >
                        {tick.label}
                      </div>
                    );
                  })}
                </div>

                {/* Chart area */}
                <div className="flex-1 relative overflow-hidden">
                  {/* Horizontal grid lines */}
                  <div className="absolute inset-0 pointer-events-none">
                    {Y_AXIS_TICKS.map((tick) => {
                      const pct = ((tick.logKd - LOG_KD_MIN) / (LOG_KD_MAX - LOG_KD_MIN)) * 100;
                      return (
                        <div
                          key={tick.label}
                          className="absolute w-full border-t border-border/30"
                          style={{ bottom: `${pct}%` }}
                        />
                      );
                    })}
                  </div>

                  {/* Bars */}
                  <div className="flex items-end gap-[2px] h-[220px] relative z-10">
                    {chartSorted.map((r, i) => {
                      const isControl = r.sequence_name === "Ctrl-Tras";
                      const height = getBarPercent(r.kd);
                      const isNonBinder = r.kd === null;
                      const barCount = chartSorted.length;
                      const isLeftHalf = i < barCount / 2;

                      return (
                        <div
                          key={r.sequence_id}
                          className="flex-1 flex flex-col items-center justify-end h-full relative"
                          onMouseEnter={() => setHoveredIdx(i)}
                          onMouseLeave={() => setHoveredIdx(null)}
                        >
                          <div
                            className={cn(
                              "w-[55%] rounded-t-sm transition-all duration-700 ease-out",
                              isNonBinder
                                ? "bg-transparent"
                                : isControl
                                  ? "bg-muted-foreground/30"
                                  : "bg-accent-blue"
                            )}
                            style={{
                              height: isNonBinder ? "0px" : `${height}%`,
                              transitionDelay: `${i * 30}ms`,
                              minHeight: isNonBinder ? "0px" : "2px",
                            }}
                          />

                          {/* Tooltip on hover */}
                          {hoveredIdx === i && (
                            <div
                              className={cn(
                                "absolute z-20 bg-card border border-border rounded-sm p-2.5 text-xs whitespace-nowrap",
                                isNonBinder ? "bottom-2" : "bottom-full mb-2",
                              )}
                              style={{
                                [isLeftHalf ? "left" : "right"]: "0",
                              }}
                            >
                              <div className="flex items-center gap-1.5 mb-1">
                                <span className="font-medium text-foreground">
                                  {r.sequence_name}
                                </span>
                                {isControl && (
                                  <Badge variant="outline" className="text-[9px] py-0 font-mono">
                                    ctrl
                                  </Badge>
                                )}
                              </div>
                              {r.kd != null ? (
                                <div className="space-y-0.5 text-muted-foreground">
                                  <div className="flex justify-between gap-3">
                                    <span>KD</span>
                                    <span className="font-mono">{formatKd(r.kd)}</span>
                                  </div>
                                  <div className="flex justify-between gap-3">
                                    <span>k<sub>on</sub></span>
                                    <span className="font-mono">{formatScientific(r.kon!)}</span>
                                  </div>
                                  <div className="flex justify-between gap-3">
                                    <span>k<sub>off</sub></span>
                                    <span className="font-mono">{formatScientific(r.koff!)}</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-muted-foreground/60 italic">
                                  {r.binding_strength === "no_expression" ? "No expression" : "No binding detected"}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* X-axis labels */}
              <div className="flex" style={{ paddingLeft: "40px" }}>
                <div className="flex-1 flex gap-[2px]">
                  {chartSorted.map((r) => {
                    const isControl = r.sequence_name === "Ctrl-Tras";
                    return (
                      <div key={r.sequence_id} className="flex-1 overflow-hidden">
                        <div
                          className={cn(
                            "text-[8px] font-mono truncate text-center",
                            isControl ? "text-foreground font-medium" : "text-muted-foreground/50"
                          )}
                          title={r.sequence_name}
                        >
                          {r.sequence_name.replace("VHH-", "").replace("Ctrl-Tras", "Ctrl")}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Annotation */}
              <div className="text-[10px] text-muted-foreground/50 font-mono pt-1">
                KD (M) — lower = stronger binding
              </div>
            </div>
          ) : (
            /* Table view */
            <div className="border border-border rounded-sm overflow-hidden">
              <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                <table className="w-full text-xs">
                  <caption className="sr-only">
                    Binding kinetics and classification for the demo experiment sequences.
                  </caption>
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-secondary/50 border-b border-border">
                      <th
                        scope="col"
                        aria-sort={getAriaSort(sortKey, sortDir, "name")}
                        className="text-left px-3 py-2 font-semibold text-[10px] tracking-wider uppercase text-muted-foreground"
                      >
                        <button
                          type="button"
                          onClick={() => handleSort("name")}
                          className="inline-flex items-center gap-1 hover:text-foreground transition-none"
                        >
                          Name {renderSortIcon(sortKey, sortDir, "name")}
                        </button>
                      </th>
                      <th
                        scope="col"
                        aria-sort={getAriaSort(sortKey, sortDir, "kd")}
                        className="text-right px-3 py-2 font-semibold text-[10px] tracking-wider uppercase text-muted-foreground"
                      >
                        <button
                          type="button"
                          onClick={() => handleSort("kd")}
                          className="inline-flex items-center gap-1 hover:text-foreground transition-none"
                        >
                          KD {renderSortIcon(sortKey, sortDir, "kd")}
                        </button>
                      </th>
                      <th scope="col" className="text-right px-3 py-2 font-semibold text-[10px] tracking-wider uppercase text-muted-foreground">
                        k_on
                      </th>
                      <th scope="col" className="text-right px-3 py-2 font-semibold text-[10px] tracking-wider uppercase text-muted-foreground">
                        k_off
                      </th>
                      <th scope="col" className="text-right px-3 py-2 font-semibold text-[10px] tracking-wider uppercase text-muted-foreground">
                        R²
                      </th>
                      <th
                        scope="col"
                        aria-sort={getAriaSort(sortKey, sortDir, "binding_strength")}
                        className="text-left px-3 py-2 font-semibold text-[10px] tracking-wider uppercase text-muted-foreground"
                      >
                        <button
                          type="button"
                          onClick={() => handleSort("binding_strength")}
                          className="inline-flex items-center gap-1 hover:text-foreground transition-none"
                        >
                          Binding {renderSortIcon(sortKey, sortDir, "binding_strength")}
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableSorted.map((r) => {
                      const isControl = r.sequence_name === "Ctrl-Tras";
                      return (
                        <tr
                          key={r.sequence_id}
                          className={cn(
                            "border-b border-border last:border-0",
                            isControl ? "bg-muted/20" : "hover:bg-muted/10 transition-none"
                          )}
                        >
                          <td className="px-3 py-2 font-mono text-foreground">
                            <span className="flex items-center gap-1.5">
                              {r.sequence_name}
                              {isControl && (
                                <Badge variant="outline" className="text-[9px] py-0 px-1 font-mono">
                                  ctrl
                                </Badge>
                              )}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-right font-mono">
                            {r.kd != null ? (
                              <span className={BINDING_TEXT_COLORS[r.binding_strength]}>
                                {formatKd(r.kd)}
                              </span>
                            ) : (
                              <span className="text-muted-foreground/40">—</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-right font-mono text-muted-foreground">
                            {r.kon != null ? formatScientific(r.kon) : "—"}
                          </td>
                          <td className="px-3 py-2 text-right font-mono text-muted-foreground">
                            {r.koff != null ? formatScientific(r.koff) : "—"}
                          </td>
                          <td className="px-3 py-2 text-right font-mono text-muted-foreground">
                            {r.r_squared != null ? r.r_squared.toFixed(3) : "—"}
                          </td>
                          <td className="px-3 py-2">
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px] font-mono",
                                BINDING_TEXT_COLORS[r.binding_strength]
                              )}
                            >
                              {r.binding_strength.replace("_", " ")}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Download data package */}
          <div className="flex items-center gap-3 p-3 rounded-sm bg-muted/30 border border-border/50">
            <FileDown className="w-5 h-5 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground">Data Package</p>
              <p className="text-[10px] text-muted-foreground font-mono truncate">
                {MOCK_EXPERIMENT_FULL.data_package_url}
              </p>
            </div>
            <Button onClick={downloadCsv} variant="outline" className="text-xs h-7 shrink-0">
              <Download className="w-3 h-3 mr-1" />
              Download
            </Button>
          </div>
        </div>
      }
      right={
        <ApiPanel
          method="GET"
          endpoint={`/experiments/${MOCK_EXPERIMENT_FULL.id.slice(0, 8)}…/results`}
          response={MOCK_RESULTS_RESPONSE}
          responseStatus={200}
          activeTab="response"
        />
      }
    />
  );
}
