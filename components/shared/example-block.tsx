"use client";

import { useState } from "react";
import { Code2, ChevronDown } from "lucide-react";

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
  const [codeOpen, setCodeOpen] = useState(false);

  return (
    <section id={id} className="scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-6">
          <span className="inline-flex items-center px-2 py-1 rounded-md bg-accent-blue-muted text-accent-blue font-mono text-xs font-semibold tracking-[0.08em]">
            {String(number).padStart(2, "0")}
          </span>
          <div className="flex items-center gap-3 mt-3">
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-foreground leading-tight">
              {title}
            </h2>
            {isLive ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold font-mono uppercase tracking-[0.04em] bg-[rgba(34,197,94,0.10)] text-[#22C55E] border border-[rgba(34,197,94,0.20)]">
                <span className="w-1 h-1 rounded-full bg-[#22C55E] pulse-dot" />
                Live
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold font-mono uppercase tracking-[0.04em] bg-[rgba(245,158,11,0.10)] text-[#F59E0B] border border-[rgba(245,158,11,0.20)]">
                Mock
              </span>
            )}
          </div>
          <p className="mt-2 text-[15px] text-foreground/60 max-w-[540px] leading-relaxed tracking-[-0.005em]">
            {description}
          </p>
        </div>

        {/* 50/50 split container */}
        <div className="rounded-xl border border-border overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="bg-white p-6 lg:p-8 lg:border-r border-border">
              {left}
            </div>

            {/* Desktop: always show code panel */}
            <div className="hidden lg:block bg-[#13161B] border-t-[1px] border-white/[0.06]">
              {right}
            </div>
          </div>

          {/* Mobile: collapsible code panel */}
          <div className="lg:hidden border-t border-border">
            <button
              onClick={() => setCodeOpen(!codeOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#1C2027] text-[#E4E4E7] text-sm font-medium"
            >
              <span className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#9CA3B0]" />
                View API Request / Response
              </span>
              <ChevronDown
                className={`w-4 h-4 text-[#9CA3B0] transition-transform duration-200 ${codeOpen ? "rotate-180" : ""}`}
              />
            </button>
            {codeOpen && (
              <div className="bg-[#13161B] max-h-[400px] overflow-auto">
                {right}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
