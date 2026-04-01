"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  FileText,
  Clock,
  Package,
  FlaskConical,
  BarChart3,
  Eye,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { LIFECYCLE_STAGES } from "@/lib/mock-data";
import { ExampleBlock } from "@/components/shared/example-block";
import { ApiPanel } from "@/components/shared/api-panel";

const STAGE_META = [
  { label: "Draft", icon: FileText },
  { label: "Confirmation", icon: Clock },
  { label: "Materials", icon: Package },
  { label: "Production", icon: FlaskConical },
  { label: "Analysis", icon: BarChart3 },
  { label: "Review", icon: Eye },
  { label: "Done", icon: CheckCircle2 },
];

export function LifecycleViewer() {
  const [stageIdx, setStageIdx] = useState(0);
  const current = LIFECYCLE_STAGES[stageIdx];

  return (
    <ExampleBlock
      id="track-progress"
      number={4}
      title="Track Progress"
      description="Keep your users in the loop as their experiment moves through the lab."
      isLive={false}
      left={
        <div className="space-y-6">
          {/* Timeline */}
          <div className="space-y-1">
            {STAGE_META.map((stage, i) => {
              const Icon = stage.icon;
              const isActive = i === stageIdx;
              const isPast = i < stageIdx;
              return (
                <button
                  key={i}
                  onClick={() => setStageIdx(i)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all",
                    isActive
                      ? "bg-accent-blue-muted border border-accent-blue/20"
                      : "hover:bg-muted/50"
                  )}
                >
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors",
                      isActive
                        ? "bg-accent-blue text-white"
                        : isPast
                          ? "bg-success/10 text-success"
                          : "bg-muted text-muted-foreground"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={cn(
                        "text-sm font-medium",
                        isActive
                          ? "text-accent-blue"
                          : isPast
                            ? "text-foreground"
                            : "text-muted-foreground"
                      )}
                    >
                      {stage.label}
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground">
                      {LIFECYCLE_STAGES[i].status}
                    </div>
                  </div>
                  {isPast && (
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          <Button
            onClick={() =>
              setStageIdx((i) => Math.min(i + 1, LIFECYCLE_STAGES.length - 1))
            }
            disabled={stageIdx >= LIFECYCLE_STAGES.length - 1}
            className="bg-accent-blue hover:bg-accent-blue-hover text-white"
          >
            Next Stage
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      }
      right={
        <ApiPanel
          method="GET"
          endpoint={`/experiments/${current.id.slice(0, 8)}...`}
          response={current}
          responseStatus={200}
          activeTab="response"
        />
      }
    />
  );
}
