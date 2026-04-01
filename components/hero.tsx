/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useMemo } from "react";

// Codon table: each amino acid maps to its most common codon
const AA_TO_CODON: Record<string, string> = {
  A: "GCG", C: "TGC", D: "GAC", E: "GAG", F: "TTC",
  G: "GGC", H: "CAC", I: "ATC", K: "AAG", L: "CTG",
  M: "ATG", N: "AAC", P: "CCG", Q: "CAG", R: "CGC",
  S: "AGC", T: "ACC", V: "GTG", W: "TGG", Y: "TAC",
};

const SEQUENCE = "EVQLVESGGGLVQPGGSLRL";

function SequenceChip() {
  const [hovered, setHovered] = useState(false);

  const dnaSequence = useMemo(
    () => SEQUENCE.split("").map((aa) => AA_TO_CODON[aa] ?? "NNN").join(""),
    []
  );

  const displayText = hovered ? dnaSequence : SEQUENCE;
  const label = hovered ? "DNA" : "Amino acids";

  return (
    <div
      className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full border border-border/60 bg-card/80 mb-8 cursor-default select-none group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold font-mono uppercase tracking-[0.04em] bg-[rgba(34,197,94,0.10)] text-[#22C55E] border border-[rgba(34,197,94,0.20)]">
        <span className="w-1 h-1 rounded-full bg-[#22C55E] pulse-dot" />
        Live
      </span>
      <span className="font-mono text-[10px] text-muted-foreground tracking-wide overflow-hidden transition-all duration-500 ease-in-out">
        <span className="hidden sm:inline">
          {displayText.slice(0, 36)}
          <span className="text-[#0070F3]">{displayText.slice(36, 42)}</span>
          {displayText.length > 42 && displayText.slice(42, 48)}
          {displayText.length > 48 && "..."}
        </span>
        <span className="sm:hidden">{displayText.slice(0, 20)}</span>
      </span>
      <span className="text-[9px] font-mono text-muted-foreground/50 uppercase tracking-wider hidden sm:inline transition-all duration-300">
        {label}
      </span>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative py-20 md:py-28 lg:py-36">
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Easter egg: amino acid → DNA on hover */}
        <SequenceChip />

        <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3.25rem] lg:text-[3.75rem] font-bold tracking-[-0.045em] text-foreground leading-[1.05]">
          Let your users test
          <br className="hidden sm:block" /> protein designs{" "}
          <span className="text-[#0070F3]">in a real lab</span>
        </h1>

        <p className="mt-5 text-[15px] sm:text-lg md:text-[1.2rem] text-foreground/60 max-w-[500px] mx-auto leading-relaxed tracking-[-0.005em]">
          The Adaptyv API connects your computational design platform to our wet
          lab. Your users design proteins — we test them. Binding data in weeks,
          not months.
        </p>

        {/* Customer logos */}
        <div className="mt-12">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-[0.08em] mb-5">
            Try out via
          </p>
          <div className="flex items-center justify-center gap-10">
            <a href="https://tamarindbio.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 opacity-40 hover:opacity-70 transition-opacity duration-200">
              <img src="/logos/tamarind.svg" alt="Tamarind Bio" className="h-5" />
              <span className="text-sm font-medium text-foreground tracking-tight">Tamarind Bio</span>
            </a>
            <a href="https://phylo.bio" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 opacity-40 hover:opacity-70 transition-opacity duration-200">
              <img src="/logos/phylo.svg" alt="Phylo Bio" className="h-4" />
              <span className="text-sm font-medium text-foreground tracking-tight">Phylo</span>
            </a>
            <span className="text-sm text-muted-foreground/50 italic">
              more launching soon
            </span>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-3">
          <a
            href="#browse-targets"
            className="h-11 px-6 inline-flex items-center rounded-lg bg-[#0070F3] text-white text-sm font-semibold hover:bg-[#005CC8] transition-colors duration-150 tracking-[-0.005em]"
          >
            Explore Examples
          </a>
          <a
            href="https://docs.adaptyvbio.com"
            target="_blank"
            rel="noopener noreferrer"
            className="h-11 px-6 inline-flex items-center rounded-lg border border-border text-foreground/60 text-sm font-medium hover:bg-muted hover:border-border transition-colors duration-150 tracking-[-0.005em]"
          >
            API Docs
          </a>
        </div>
      </div>
    </section>
  );
}
