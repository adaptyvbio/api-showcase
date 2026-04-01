"use client";

import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
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

const STATUS_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
  draft: { bg: "bg-muted", text: "text-muted-foreground", ring: "ring-border" },
  waiting_for_confirmation: { bg: "bg-amber-500/10", text: "text-amber-500", ring: "ring-amber-500/30" },
  waiting_for_materials: { bg: "bg-orange-500/10", text: "text-orange-500", ring: "ring-orange-500/30" },
  in_production: { bg: "bg-blue-500/10", text: "text-blue-500", ring: "ring-blue-500/30" },
  data_analysis: { bg: "bg-purple-500/10", text: "text-purple-500", ring: "ring-purple-500/30" },
  in_review: { bg: "bg-cyan-500/10", text: "text-cyan-500", ring: "ring-cyan-500/30" },
  done: { bg: "bg-success/10", text: "text-success", ring: "ring-success/30" },
};

const TYPE_ICONS: Record<string, typeof FileText> = {
  status_change: Activity,
  quote: Clock,
  lab_update: Beaker,
  results: CheckCircle2,
};

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
    " " + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
}

export function LifecycleViewer() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isManual, setIsManual] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Auto-start when section scrolls into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isManual) {
          setIsPlaying(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isManual]);

  // Auto-advance timer — loops back to start when done
  useEffect(() => {
    if (!isPlaying || isManual) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setVisibleCount((prev) => {
        if (prev >= DEMO_UPDATES.length) {
          // Loop: restart from 0 after a pause at the end
          return 0;
        }
        return prev + 1;
      });
    }, 2000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, isManual]);

  // No auto-scroll — timeline is visible in full

  // Click on an update → switch to manual mode, jump to that step
  const handleClickUpdate = (idx: number) => {
    setIsManual(true);
    setIsPlaying(false);
    setVisibleCount(idx + 1);
  };

  const visibleUpdates = DEMO_UPDATES.slice(0, visibleCount);

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
    <div ref={sectionRef}>
    <ExampleBlock
      id="track-progress"
      number={4}
      title="Track Progress"
      description="Subscribe to experiment updates via API or webhooks. Watch a complete experiment lifecycle unfold in real time."
      isLive={false}
      left={
        <div className="space-y-4">
          {/* Timeline */}
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[13px] top-4 bottom-4 w-px bg-border" />

                <div className="space-y-0">
                  {DEMO_UPDATES.map((update, i) => {
                    const isVisible = i < visibleCount;
                    const isLatest = i === visibleCount - 1;
                    const isPast = i < visibleCount - 1;
                    const isFuture = !isVisible;

                    const colors = STATUS_COLORS[update.status] ?? STATUS_COLORS.draft;
                    const StatusIcon = STATUS_ICONS[update.status] ?? FileText;
                    const TypeIcon = TYPE_ICONS[update.type] ?? FileText;

                    return (
                      <div
                        key={update.id}
                        onClick={() => handleClickUpdate(i)}
                        className={cn(
                          "relative flex gap-3 py-3 transition-all duration-500 cursor-pointer rounded-lg -mx-1 px-1",
                          isFuture && "opacity-[0.08]",
                          isPast && "opacity-40 hover:opacity-70",
                          isLatest && "opacity-100",
                        )}
                      >
                        {/* Timeline dot */}
                        <div
                          className={cn(
                            "relative z-10 w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ring-2",
                            isLatest
                              ? cn(colors.bg, colors.text, colors.ring)
                              : isPast
                                ? "bg-success/10 text-success ring-success/20"
                                : "bg-muted text-muted-foreground/30 ring-border/30"
                          )}
                        >
                          {isPast ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <StatusIcon className="w-3.5 h-3.5" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-medium text-foreground transition-colors duration-500">
                              {update.title}
                            </span>
                            {isLatest && (
                              <Badge
                                variant="outline"
                                className={cn("text-[9px] font-mono", colors.text)}
                              >
                                {update.status.replace(/_/g, " ")}
                              </Badge>
                            )}
                          </div>
                          {(isLatest || isPast) && (
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {update.content}
                            </p>
                          )}
                          {isVisible && (
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-mono text-muted-foreground/50">
                                {formatTimestamp(update.timestamp)}
                              </span>
                              <Badge variant="outline" className="text-[9px] font-mono px-1 py-0 gap-0.5">
                                <TypeIcon className="w-2 h-2" />
                                {update.type.replace(/_/g, " ")}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
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
    </div>
  );
}
