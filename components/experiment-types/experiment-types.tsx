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

const ICON_COLOR = "bg-accent-blue/10 text-accent-blue border-accent-blue/20";

export function ExperimentTypesSection() {
  const [selectedType, setSelectedType] = useState(EXPERIMENT_TYPES[1]); // Default to screening

  return (
    <ExampleBlock
      id="experiment-types"
      number={1}
      title="Experiment Types"
      description="Choose from 5 assay types covering expression, binding, kinetics, and biophysical characterization."
      left={
        <div className="space-y-3">
          {EXPERIMENT_TYPES.map((et) => {
            const Icon = TYPE_ICONS[et.type] ?? FlaskConical;
            const isSelected = selectedType.type === et.type;

            return (
              <button
                key={et.type}
                onClick={() => setSelectedType(et)}
                className={cn(
                  "w-full text-left rounded-sm border p-4 transition-all duration-150",
                  isSelected
                    ? "border-accent-blue/30 bg-accent-blue/[0.03] shadow-none"
                    : "border-border hover:border-border hover:bg-muted/30"
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-sm flex items-center justify-center shrink-0 border",
                      ICON_COLOR
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
          method="GET"
          endpoint="/experiment-types"
          response={{
            items: EXPERIMENT_TYPES.map((et) => ({
              type: et.type,
              label: et.label,
              description: et.description,
              requires_target: et.requiresTarget,
              data_returned: et.dataReturned,
            })),
          }}
          responseStatus={200}
          activeTab="response"
        />
      }
    />
  );
}
