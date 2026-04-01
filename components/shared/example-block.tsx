"use client";

import { cn } from "@/lib/utils";

interface ExampleBlockProps {
  id: string;
  number: number;
  title: string;
  description: string;
  isLive: boolean;
  left: React.ReactNode;
  right: React.ReactNode;
}

export function ExampleBlock({
  id,
  number,
  title,
  description,
  isLive,
  left,
  right,
}: ExampleBlockProps) {
  return (
    <section id={id} className="scroll-mt-20 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-mono text-xs font-medium text-muted-foreground tracking-wider">
            {String(number).padStart(2, "0")}
          </span>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium font-mono uppercase tracking-wider",
              isLive
                ? "bg-success-muted text-success"
                : "bg-warning-muted text-warning"
            )}
          >
            {isLive && <span className="w-1.5 h-1.5 rounded-full bg-success pulse-dot" />}
            {isLive ? "Live" : "Mock"}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
          {description}
        </p>
        <div className="rounded-xl border border-border overflow-hidden grid grid-cols-1 lg:grid-cols-2">
          <div className="bg-card p-6 lg:p-8 min-h-[400px]">{left}</div>
          <div className="bg-code-bg min-h-[400px] border-t lg:border-t-0 lg:border-l border-border/30">
            {right}
          </div>
        </div>
      </div>
    </section>
  );
}
