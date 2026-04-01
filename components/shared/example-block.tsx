"use client";

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
    <section id={id} className="scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-6">
          <span className="inline-flex items-center px-2 py-1 rounded-md bg-[rgba(0,112,243,0.08)] text-[#0070F3] font-mono text-xs font-semibold tracking-[0.08em]">
            {String(number).padStart(2, "0")}
          </span>
          <div className="flex items-center gap-3 mt-3">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">
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
          <p className="mt-2 text-[15px] text-[#3C4257] max-w-[540px] leading-relaxed tracking-[-0.005em]">
            {description}
          </p>
        </div>

        {/* 50/50 split container */}
        <div className="rounded-xl border border-border overflow-hidden grid grid-cols-1 lg:grid-cols-2">
          <div className="bg-white p-6 lg:p-8 border-r border-border/0 lg:border-r-border">
            {left}
          </div>
          <div className="bg-[#1C2027] border-t lg:border-t-0">
            {right}
          </div>
        </div>
      </div>
    </section>
  );
}
