"use client";

import { useState, useMemo } from "react";
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
import type { AffinityResult } from "@/lib/api-types";

const BINDING_COLORS: Record<string, string> = {
  strong: "bg-binding-strong",
  medium: "bg-binding-medium",
  weak: "bg-binding-weak",
  non_binder: "bg-binding-non",
  no_expression: "bg-muted-foreground/30",
};

const BINDING_TEXT_COLORS: Record<string, string> = {
  strong: "text-binding-strong",
  medium: "text-binding-medium",
  weak: "text-binding-weak",
  non_binder: "text-binding-non",
  no_expression: "text-muted-foreground",
};

function getBarWidth(kd: number | null): number {
  if (kd === null || kd === 0) return 0;
  // -log10(KD): higher = better binder
  // Range: ~5 (µM, weak) to ~10 (sub-nM, strong)
  const logKd = -Math.log10(kd);
  return Math.max(3, Math.min(100, ((logKd - 4) / 6.5) * 100));
}

type SortKey = "name" | "kd" | "binding_strength";
type SortDir = "asc" | "desc";

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
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState<"chart" | "table">("chart");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("kd");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const sorted = useMemo(() => {
    const arr = [...DEMO_RESULTS];
    arr.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") {
        cmp = a.sequence_name.localeCompare(b.sequence_name);
      } else if (sortKey === "kd") {
        // nulls go to bottom
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

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return null;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3 inline ml-0.5" />
    ) : (
      <ChevronDown className="w-3 h-3 inline ml-0.5" />
    );
  };

  // Stats summary
  const stats = useMemo(() => {
    const withKd = DEMO_RESULTS.filter((r) => r.kd != null);
    return {
      total: DEMO_RESULTS.length,
      strong: DEMO_RESULTS.filter((r) => r.binding_strength === "strong").length,
      medium: DEMO_RESULTS.filter((r) => r.binding_strength === "medium").length,
      weak: DEMO_RESULTS.filter((r) => r.binding_strength === "weak").length,
      nonBinder: DEMO_RESULTS.filter((r) => r.binding_strength === "non_binder").length,
      noExpression: DEMO_RESULTS.filter((r) => r.binding_strength === "no_expression").length,
      bestKd: withKd.length > 0 ? Math.min(...withKd.map((r) => r.kd!)) : null,
    };
  }, []);

  return (
    <ExampleBlock
      id="view-results"
      number={5}
      title="View Results"
      description="Retrieve binding data programmatically. 20 VHH sequences screened against HER2 with full kinetic data."
      isLive={false}
      left={
        <div className="space-y-4">
          {!loaded ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <BarChart3 className="w-10 h-10 text-muted-foreground/20" />
              <p className="text-sm text-muted-foreground">
                Load binding data for {DEMO_EXPERIMENT_CODE}
              </p>
              <Button
                onClick={() => setLoaded(true)}
                className="bg-accent-blue hover:bg-accent-blue-hover text-white"
              >
                <BarChart3 className="w-3.5 h-3.5 mr-1.5" />
                Load Results
              </Button>
            </div>
          ) : (
            <>
              {/* Stats summary */}
              <div className="grid grid-cols-5 gap-2">
                {[
                  { label: "Strong", count: stats.strong, color: "text-binding-strong" },
                  { label: "Medium", count: stats.medium, color: "text-binding-medium" },
                  { label: "Weak", count: stats.weak, color: "text-binding-weak" },
                  { label: "Non-binder", count: stats.nonBinder, color: "text-binding-non" },
                  { label: "No expr.", count: stats.noExpression, color: "text-muted-foreground" },
                ].map(({ label, count, color }) => (
                  <div key={label} className="text-center p-2 rounded-lg bg-muted/30">
                    <div className={cn("text-lg font-semibold font-mono", color)}>
                      {count}
                    </div>
                    <div className="text-[10px] text-muted-foreground">{label}</div>
                  </div>
                ))}
              </div>

              {/* View toggle + Download */}
              <div className="flex items-center gap-2">
                <div className="flex rounded-md border border-border overflow-hidden">
                  <button
                    onClick={() => setView("chart")}
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
                /* Bar chart view */
                <div className="space-y-1.5">
                  {sorted.map((r, i) => {
                    const isControl = r.sequence_name === "Ctrl-Tras";
                    return (
                      <div
                        key={r.sequence_id}
                        className="group relative"
                        onMouseEnter={() => setHoveredIdx(i)}
                        onMouseLeave={() => setHoveredIdx(null)}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "w-16 text-[11px] font-mono shrink-0 text-right",
                              isControl
                                ? "text-foreground font-medium"
                                : "text-muted-foreground"
                            )}
                          >
                            {r.sequence_name}
                          </span>
                          <div className="flex-1 h-6 bg-muted/30 rounded relative overflow-hidden">
                            {r.kd != null ? (
                              <div
                                className={cn(
                                  "h-full rounded transition-all duration-700 ease-out",
                                  isControl
                                    ? "bg-foreground/20"
                                    : BINDING_COLORS[r.binding_strength]
                                )}
                                style={{
                                  width: `${getBarWidth(r.kd)}%`,
                                  transitionDelay: `${i * 40}ms`,
                                }}
                              />
                            ) : (
                              <div className="h-full flex items-center px-2">
                                <span className="text-[10px] text-muted-foreground/50 italic">
                                  {r.binding_strength === "no_expression"
                                    ? "no expression"
                                    : "no binding"}
                                </span>
                              </div>
                            )}
                          </div>
                          <span
                            className={cn(
                              "w-16 text-right text-[11px] font-mono",
                              isControl
                                ? "text-foreground/60"
                                : r.kd != null
                                  ? BINDING_TEXT_COLORS[r.binding_strength]
                                  : "text-muted-foreground/40"
                            )}
                          >
                            {r.kd != null ? formatKd(r.kd) : "—"}
                          </span>
                        </div>

                        {/* Tooltip */}
                        {hoveredIdx === i && r.kd != null && (
                          <div className="absolute left-20 -top-1 z-20 bg-card border border-border shadow-lg rounded-lg p-3 text-xs space-y-1 min-w-[200px]">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-foreground">
                                {r.sequence_name}
                              </span>
                              {isControl && (
                                <Badge
                                  variant="outline"
                                  className="text-[9px] py-0 font-mono"
                                >
                                  control
                                </Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-muted-foreground">
                              <span>KD</span>
                              <span className="font-mono">
                                {formatScientific(r.kd!)} M
                              </span>
                              <span>k_on</span>
                              <span className="font-mono">
                                {formatScientific(r.kon!)} M⁻¹s⁻¹
                              </span>
                              <span>k_off</span>
                              <span className="font-mono">
                                {formatScientific(r.koff!)} s⁻¹
                              </span>
                              <span>R²</span>
                              <span className="font-mono">{r.r_squared}</span>
                            </div>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px]",
                                BINDING_TEXT_COLORS[r.binding_strength]
                              )}
                            >
                              {r.binding_strength.replace("_", " ")}
                            </Badge>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Table view */
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                    <table className="w-full text-xs">
                      <thead className="sticky top-0 z-10">
                        <tr className="bg-muted/50 border-b border-border">
                          <th
                            onClick={() => handleSort("name")}
                            className="text-left px-3 py-2 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                          >
                            Name <SortIcon col="name" />
                          </th>
                          <th
                            onClick={() => handleSort("kd")}
                            className="text-right px-3 py-2 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                          >
                            KD <SortIcon col="kd" />
                          </th>
                          <th className="text-right px-3 py-2 font-medium text-muted-foreground">
                            k_on
                          </th>
                          <th className="text-right px-3 py-2 font-medium text-muted-foreground">
                            k_off
                          </th>
                          <th className="text-right px-3 py-2 font-medium text-muted-foreground">
                            R²
                          </th>
                          <th
                            onClick={() => handleSort("binding_strength")}
                            className="text-left px-3 py-2 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                          >
                            Binding <SortIcon col="binding_strength" />
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {sorted.map((r) => {
                          const isControl = r.sequence_name === "Ctrl-Tras";
                          return (
                            <tr
                              key={r.sequence_id}
                              className={cn(
                                "border-b border-border/50 last:border-0",
                                isControl
                                  ? "bg-muted/20"
                                  : "hover:bg-muted/10"
                              )}
                            >
                              <td className="px-3 py-2 font-mono text-foreground">
                                <span className="flex items-center gap-1.5">
                                  {r.sequence_name}
                                  {isControl && (
                                    <Badge
                                      variant="outline"
                                      className="text-[9px] py-0 px-1 font-mono"
                                    >
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
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                <FileDown className="w-5 h-5 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground">
                    Data Package
                  </p>
                  <p className="text-[10px] text-muted-foreground font-mono truncate">
                    {MOCK_EXPERIMENT_FULL.data_package_url}
                  </p>
                </div>
                <Button
                  onClick={downloadCsv}
                  variant="outline"
                  className="text-xs h-7 shrink-0"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Download
                </Button>
              </div>
            </>
          )}
        </div>
      }
      right={
        <ApiPanel
          method="GET"
          endpoint={`/experiments/${MOCK_EXPERIMENT_FULL.id.slice(0, 8)}…/results`}
          response={loaded ? MOCK_RESULTS_RESPONSE : undefined}
          responseStatus={loaded ? 200 : undefined}
          activeTab={loaded ? "response" : "request"}
        />
      }
    />
  );
}
