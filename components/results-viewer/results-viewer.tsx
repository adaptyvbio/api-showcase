"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";
import { formatKd, formatScientific } from "@/lib/utils";
import { MOCK_RESULTS } from "@/lib/mock-data";
import { ExampleBlock } from "@/components/shared/example-block";
import { ApiPanel } from "@/components/shared/api-panel";
import type { AffinityResult } from "@/lib/api-types";

const BINDING_COLORS: Record<string, string> = {
  strong: "bg-binding-strong",
  medium: "bg-binding-medium",
  weak: "bg-binding-weak",
  non_binder: "bg-binding-non",
};

const BINDING_TEXT_COLORS: Record<string, string> = {
  strong: "text-binding-strong",
  medium: "text-binding-medium",
  weak: "text-binding-weak",
  non_binder: "text-binding-non",
};

function getBarWidth(kd: number): number {
  // Log scale: higher affinity (lower KD) = wider bar
  const logKd = -Math.log10(kd);
  // Range: ~5 (weak) to ~11 (strong)
  return Math.max(5, Math.min(100, ((logKd - 4) / 7) * 100));
}

export function ResultsViewer() {
  const [loaded, setLoaded] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const sorted = [...MOCK_RESULTS].sort((a, b) => a.kd - b.kd);

  return (
    <ExampleBlock
      id="view-results"
      number={5}
      title="View Results"
      description="Deliver actionable binding data directly in your product."
      isLive={false}
      left={
        <div className="space-y-4">
          {!loaded ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <BarChart3 className="w-10 h-10 text-muted-foreground/30" />
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
              {/* Legend */}
              <div className="flex items-center gap-4 text-[11px]">
                {[
                  { label: "Strong", color: "bg-binding-strong" },
                  { label: "Medium", color: "bg-binding-medium" },
                  { label: "Weak", color: "bg-binding-weak" },
                  { label: "Non-binder", color: "bg-binding-non" },
                ].map(({ label, color }) => (
                  <span key={label} className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-sm ${color}`} />
                    <span className="text-muted-foreground">{label}</span>
                  </span>
                ))}
              </div>

              {/* Bar chart */}
              <div className="space-y-2">
                {sorted.map((r, i) => (
                  <div
                    key={r.sequence_id}
                    className="group relative"
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-16 text-xs font-mono text-muted-foreground shrink-0">
                        {r.sequence_name}
                      </span>
                      <div className="flex-1 h-7 bg-muted/50 rounded relative overflow-hidden">
                        <div
                          className={`h-full rounded ${BINDING_COLORS[r.binding_strength]} transition-all duration-700 ease-out`}
                          style={{
                            width: `${getBarWidth(r.kd)}%`,
                            transitionDelay: `${i * 80}ms`,
                          }}
                        />
                      </div>
                      <span
                        className={`w-20 text-right text-xs font-mono ${BINDING_TEXT_COLORS[r.binding_strength]}`}
                      >
                        {formatKd(r.kd)}
                      </span>
                    </div>

                    {/* Tooltip */}
                    {hoveredIdx === i && (
                      <div className="absolute left-20 -top-2 z-10 bg-card border border-border shadow-lg rounded-lg p-3 text-xs space-y-1 min-w-[200px]">
                        <div className="font-medium text-foreground">
                          {r.sequence_name}
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-muted-foreground">
                          <span>KD</span>
                          <span className="font-mono">
                            {formatScientific(r.kd)} M
                          </span>
                          <span>k_on</span>
                          <span className="font-mono">
                            {formatScientific(r.kon)} M⁻¹s⁻¹
                          </span>
                          <span>k_off</span>
                          <span className="font-mono">
                            {formatScientific(r.koff)} s⁻¹
                          </span>
                          <span>R²</span>
                          <span className="font-mono">{r.r_squared}</span>
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${BINDING_TEXT_COLORS[r.binding_strength]}`}
                        >
                          {r.binding_strength.replace("_", " ")}
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      }
      right={
        <ApiPanel
          method="GET"
          endpoint="/experiments/019d4a2b.../results"
          response={loaded ? { items: MOCK_RESULTS } : undefined}
          responseStatus={loaded ? 200 : undefined}
          activeTab={loaded ? "response" : "request"}
        />
      }
    />
  );
}
