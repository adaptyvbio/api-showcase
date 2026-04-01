"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Play,
  Pause,
  RotateCcw,
  FileText,
  Clock,
  Package,
  FlaskConical,
  BarChart3,
  Eye,
  CheckCircle2,
  Beaker,
  Activity,
} from "lucide-react";
import { DEMO_UPDATES, DEMO_EXPERIMENT_CODE } from "@/lib/mock-data";
import { ExampleBlock } from "@/components/shared/example-block";
import { ApiPanel } from "@/components/shared/api-panel";

const STATUS_ICONS: Record<string, typeof FileText> = {
  draft: FileText,
  waiting_for_confirmation: Clock,
  waiting_for_materials: Package,
  in_production: FlaskConical,
  data_analysis: BarChart3,
  in_review: Eye,
  done: CheckCircle2,
};

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  waiting_for_confirmation: "bg-amber-500/10 text-amber-500",
  waiting_for_materials: "bg-orange-500/10 text-orange-500",
  in_production: "bg-blue-500/10 text-blue-500",
  data_analysis: "bg-purple-500/10 text-purple-500",
  in_review: "bg-cyan-500/10 text-cyan-500",
  done: "bg-success/10 text-success",
};

const TYPE_ICONS: Record<string, typeof FileText> = {
  status_change: Activity,
  quote: Clock,
  lab_update: Beaker,
  results: CheckCircle2,
};

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  }) + " " + d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function LifecycleViewer() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const feedEndRef = useRef<HTMLDivElement>(null);

  const startAnimation = useCallback(() => {
    if (visibleCount >= DEMO_UPDATES.length) {
      setVisibleCount(0);
    }
    setIsPlaying(true);
  }, [visibleCount]);

  const pauseAnimation = () => {
    setIsPlaying(false);
  };

  const resetAnimation = () => {
    setIsPlaying(false);
    setVisibleCount(0);
  };

  // Auto-advance timer
  useEffect(() => {
    if (!isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setVisibleCount((prev) => {
        if (prev >= DEMO_UPDATES.length) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  // Auto-scroll feed to bottom
  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [visibleCount]);

  const visibleUpdates = DEMO_UPDATES.slice(0, visibleCount);
  const latestStatus = visibleUpdates.length > 0
    ? visibleUpdates[visibleUpdates.length - 1].status
    : null;

  // Build the API response that grows as updates come in
  const apiResponse = visibleCount > 0
    ? {
        items: visibleUpdates.map((u) => ({
          id: u.id,
          experiment_id: u.experiment_id,
          experiment_code: u.experiment_code,
          type: u.type,
          title: u.title,
          content: u.content,
          status: u.status,
          timestamp: u.timestamp,
        })),
        total: visibleCount,
        has_more: visibleCount < DEMO_UPDATES.length,
      }
    : undefined;

  return (
    <ExampleBlock
      id="track-progress"
      number={4}
      title="Track Progress"
      description="Subscribe to experiment updates via API or webhooks. Watch a complete experiment lifecycle unfold in real time."
      isLive={false}
      left={
        <div className="space-y-4">
          {/* Controls */}
          <div className="flex items-center gap-2">
            {isPlaying ? (
              <Button
                onClick={pauseAnimation}
                variant="outline"
                className="text-xs h-8"
              >
                <Pause className="w-3 h-3 mr-1.5" />
                Pause
              </Button>
            ) : (
              <Button
                onClick={startAnimation}
                className="bg-accent-blue hover:bg-accent-blue-hover text-white text-xs h-8"
              >
                <Play className="w-3 h-3 mr-1.5" />
                {visibleCount === 0 ? "Start Demo" : visibleCount >= DEMO_UPDATES.length ? "Replay" : "Resume"}
              </Button>
            )}
            {visibleCount > 0 && (
              <Button
                onClick={resetAnimation}
                variant="outline"
                className="text-xs h-8"
              >
                <RotateCcw className="w-3 h-3 mr-1.5" />
                Reset
              </Button>
            )}
            {latestStatus && (
              <Badge
                variant="outline"
                className={cn(
                  "ml-auto text-[10px] font-mono",
                  STATUS_COLORS[latestStatus] ?? ""
                )}
              >
                {latestStatus.replace(/_/g, " ")}
              </Badge>
            )}
          </div>

          {/* Experiment code */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-mono">{DEMO_EXPERIMENT_CODE}</span>
            <span>·</span>
            <span>Anti-HER2 VHH Binding Screen</span>
          </div>

          {/* Update feed */}
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="max-h-[360px] overflow-y-auto">
              {visibleCount === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  Press <strong>Start Demo</strong> to watch experiment updates stream in
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {visibleUpdates.map((update, i) => {
                    const StatusIcon = STATUS_ICONS[update.status] ?? FileText;
                    const TypeIcon = TYPE_ICONS[update.type] ?? FileText;
                    const isLatest = i === visibleUpdates.length - 1;

                    return (
                      <div
                        key={update.id}
                        className={cn(
                          "p-3 transition-all duration-300",
                          isLatest && isPlaying
                            ? "bg-accent-blue/[0.03]"
                            : "bg-transparent"
                        )}
                        style={{
                          animation: "fade-in-up 0.3s ease-out",
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                              STATUS_COLORS[update.status] ?? "bg-muted text-muted-foreground"
                            )}
                          >
                            <StatusIcon className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-sm font-medium text-foreground">
                                {update.title}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {update.content}
                            </p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-[10px] font-mono text-muted-foreground/60">
                                {formatTimestamp(update.timestamp)}
                              </span>
                              <Badge
                                variant="outline"
                                className="text-[9px] font-mono px-1 py-0 gap-0.5"
                              >
                                <TypeIcon className="w-2 h-2" />
                                {update.type.replace(/_/g, " ")}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={feedEndRef} />
                </div>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-blue rounded-full transition-all duration-500"
                style={{
                  width: `${(visibleCount / DEMO_UPDATES.length) * 100}%`,
                }}
              />
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">
              {visibleCount}/{DEMO_UPDATES.length}
            </span>
          </div>
        </div>
      }
      right={
        <ApiPanel
          method="GET"
          endpoint={`/experiments/${DEMO_UPDATES[0].experiment_id.slice(0, 8)}…/updates`}
          response={apiResponse}
          responseStatus={visibleCount > 0 ? 200 : undefined}
          activeTab={visibleCount > 0 ? "response" : "request"}
        />
      }
    />
  );
}
