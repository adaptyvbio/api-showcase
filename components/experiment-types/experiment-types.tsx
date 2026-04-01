"use client";

import { useState } from "react";
import {
  FlaskConical,
  Search,
  Activity,
  Thermometer,
  Sparkles,
  Target,
  Beaker,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { EXPERIMENT_TYPES } from "@/lib/mock-data";
import { ExampleBlock } from "@/components/shared/example-block";
import { ApiPanel } from "@/components/shared/api-panel";

const TYPE_ICONS: Record<string, typeof FlaskConical> = {
  expression: Beaker,
  screening: Search,
  affinity: Activity,
  thermostability: Thermometer,
  fluorescence: Sparkles,
};

const TYPE_COLORS: Record<string, string> = {
  expression: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  screening: "bg-accent-blue/10 text-accent-blue border-accent-blue/20",
  affinity: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  thermostability: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  fluorescence: "bg-pink-500/10 text-pink-500 border-pink-500/20",
};

export function ExperimentTypesSection() {
  const [selectedType, setSelectedType] = useState(EXPERIMENT_TYPES[1]); // Default to screening

  return (
    <ExampleBlock
      id="experiment-types"
      number={1}
      title="Experiment Types"
      description="Choose from 5 assay types covering expression, binding, kinetics, and biophysical characterization."
      isLive={false}
      left={
        <div className="space-y-3">
          {EXPERIMENT_TYPES.map((et) => {
            const Icon = TYPE_ICONS[et.type] ?? FlaskConical;
            const isSelected = selectedType.type === et.type;
            const colorClasses = TYPE_COLORS[et.type] ?? "";

            return (
              <button
                key={et.type}
                onClick={() => setSelectedType(et)}
                className={cn(
                  "w-full text-left rounded-lg border p-4 transition-all duration-150",
                  isSelected
                    ? "border-accent-blue/30 bg-accent-blue/[0.03] shadow-sm"
                    : "border-border hover:border-border hover:bg-muted/30"
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border",
                      colorClasses
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground">
                        {et.label}
                      </span>
                      {et.requiresTarget && (
                        <Badge
                          variant="outline"
                          className="text-[10px] font-mono gap-0.5"
                        >
                          <Target className="w-2.5 h-2.5" />
                          Target
                        </Badge>
                      )}
                      {et.methods.length > 0 && (
                        <Badge
                          variant="outline"
                          className="text-[10px] font-mono uppercase"
                        >
                          {et.methods.join(" / ")}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {et.description}
                    </p>
                    {isSelected && (
                      <div className="mt-2 pt-2 border-t border-border/50">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          Returns
                        </span>
                        <p className="text-xs text-foreground/80 mt-0.5">
                          {et.dataReturned}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      }
      right={
        <ApiPanel
          method="POST"
          endpoint="/experiments"
          requestBody={{
            experiment_spec: {
              experiment_type: selectedType.type,
              ...(selectedType.methods.length > 0
                ? { method: selectedType.methods[0] }
                : {}),
              ...(selectedType.requiresTarget
                ? { target_id: "<target_uuid>" }
                : {}),
              sequences: {
                "seq_1": "EVQLVESGGGLVQPGG...",
                "seq_2": "DIQMTQSPSSLSASVG...",
              },
              n_replicates: 1,
            },
          }}
          activeTab="request"
        />
      }
    />
  );
}
