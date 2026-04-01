"use client";

import { useEffect, useState } from "react";

const SEQUENCE_CHARS = "ACDEFGHIKLMNPQRSTVWY";
const SEQUENCE_LENGTH = 42;

function generateSequence() {
  return Array.from(
    { length: SEQUENCE_LENGTH },
    () => SEQUENCE_CHARS[Math.floor(Math.random() * SEQUENCE_CHARS.length)]
  ).join("");
}

export function Hero() {
  const [sequence, setSequence] = useState(generateSequence());

  useEffect(() => {
    const interval = setInterval(() => {
      setSequence((prev) => {
        const chars = prev.split("");
        // Mutate 2-3 random positions
        const mutations = 2 + Math.floor(Math.random() * 2);
        for (let i = 0; i < mutations; i++) {
          const pos = Math.floor(Math.random() * chars.length);
          chars[pos] =
            SEQUENCE_CHARS[Math.floor(Math.random() * SEQUENCE_CHARS.length)];
        }
        return chars.join("");
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-20 md:py-28 lg:py-36 overflow-hidden">
      {/* Atmospheric background */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        {/* Radial glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full opacity-60"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0, 112, 243, 0.06) 0%, rgba(0, 112, 243, 0.02) 40%, transparent 70%)",
          }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Animated sequence chip */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/60 bg-white/80 mb-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] pulse-dot" />
          <span className="font-mono text-[10px] text-muted-foreground tracking-wide overflow-hidden">
            <span className="hidden sm:inline">
              {sequence.slice(0, 28)}
              <span className="text-[#0070F3]">{sequence.slice(28, 32)}</span>
              {sequence.slice(32)}
            </span>
            <span className="sm:hidden">{sequence.slice(0, 20)}</span>
          </span>
        </div>

        <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3.25rem] lg:text-[3.75rem] font-bold tracking-[-0.045em] text-foreground leading-[1.05] animate-in fade-in slide-in-from-bottom-3 duration-700 delay-100">
          Let your users test
          <br className="hidden sm:block" /> protein designs{" "}
          <span className="text-[#0070F3]">in a real lab</span>
        </h1>

        <p className="mt-5 text-base sm:text-lg md:text-[1.2rem] text-foreground/55 max-w-[500px] mx-auto leading-relaxed tracking-[-0.01em] animate-in fade-in slide-in-from-bottom-3 duration-700 delay-200">
          The Adaptyv API connects your computational design platform to our wet
          lab. Your users design proteins — we test them. Binding data in weeks,
          not months.
        </p>

        {/* Customer logos */}
        <div className="mt-10 flex items-center justify-center gap-8 animate-in fade-in duration-700 delay-300">
          <span className="text-sm text-foreground/25 font-medium tracking-tight">
            Tamarind Bio
          </span>
          <span className="text-sm text-foreground/25 font-medium tracking-tight">
            Phylo
          </span>
          <span className="text-sm text-foreground/20 italic">and others</span>
        </div>

        {/* CTAs */}
        <div className="mt-8 flex items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-400">
          <a
            href="#browse-targets"
            className="h-11 px-6 inline-flex items-center rounded-lg bg-[#0070F3] text-white text-sm font-semibold hover:bg-[#005CC8] transition-all duration-150 tracking-[-0.01em] shadow-[0_1px_2px_rgba(0,112,243,0.3),0_4px_12px_rgba(0,112,243,0.15)]"
          >
            Explore Examples
          </a>
          <a
            href="https://docs.adaptyvbio.com"
            target="_blank"
            rel="noopener noreferrer"
            className="h-11 px-6 inline-flex items-center rounded-lg border border-border text-foreground/70 text-sm font-medium hover:bg-muted hover:border-border/80 transition-all duration-150 tracking-[-0.01em]"
          >
            API Docs
          </a>
        </div>
      </div>
    </section>
  );
}
