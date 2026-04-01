"use client";

import { useEffect, useRef, useState } from "react";

interface ProteinViewerProps {
  uniprotId: string;
  size?: "sm" | "lg";
  className?: string;
}

// Strip isoform suffix for structure lookups (P04626-1 → P04626)
function cleanUniprotId(id: string): string {
  return id.split("-")[0];
}

export function ProteinViewer({
  uniprotId,
  size = "sm",
  className = "",
}: ProteinViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<import("3dmol").GLViewer | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [structureSource, setStructureSource] = useState<string>("");

  const height = size === "sm" ? 140 : 360;

  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;

    async function loadStructure() {
      const cleanId = cleanUniprotId(uniprotId);

      // Try SMR (Swiss-Model Repository) first, then AlphaFold
      const urls = [
        {
          url: `https://swissmodel.expasy.org/repository/uniprot/${cleanId}.pdb`,
          format: "pdb" as const,
          label: "Swiss-Model",
        },
        {
          url: `https://alphafold.ebi.ac.uk/files/AF-${cleanId}-F1-model_v4.pdb`,
          format: "pdb" as const,
          label: "AlphaFold",
        },
      ];

      for (const { url, format, label } of urls) {
        try {
          const res = await fetch(url);
          if (!res.ok) continue;
          const data = await res.text();
          if (cancelled || !data || data.length < 100) continue;

          // Dynamically import 3Dmol
          const $3Dmol = await import("3dmol");

          if (cancelled || !containerRef.current) return;

          // Clear any previous viewer
          containerRef.current.innerHTML = "";

          const viewer = $3Dmol.createViewer(containerRef.current, {
            backgroundColor: "transparent",
            antialias: true,
          });

          viewer.addModel(data, format);

          // Cartoon style with a nice color scheme
          viewer.setStyle(
            {},
            {
              cartoon: {
                color: "spectrum",
                opacity: 0.95,
              },
            }
          );

          viewer.zoomTo();
          viewer.render();

          // Gentle spin for small thumbnails
          if (size === "sm") {
            viewer.spin("y", 0.5);
          }

          viewerRef.current = viewer;
          setStructureSource(label);
          setStatus("ready");
          return;
        } catch {
          continue;
        }
      }

      if (!cancelled) setStatus("error");
    }

    loadStructure();

    return () => {
      cancelled = true;
      if (viewerRef.current) {
        viewerRef.current.stopAnimate();
      }
    };
  }, [uniprotId, size]);

  // Handle mouse interaction for large viewers
  useEffect(() => {
    if (size !== "lg" || !viewerRef.current) return;

    const viewer = viewerRef.current;
    const container = containerRef.current;
    if (!container) return;

    const handleEnter = () => viewer.spin(false);
    const handleLeave = () => {};

    container.addEventListener("mouseenter", handleEnter);
    container.addEventListener("mouseleave", handleLeave);

    return () => {
      container.removeEventListener("mouseenter", handleEnter);
      container.removeEventListener("mouseleave", handleLeave);
    };
  }, [size, status]);

  return (
    <div
      className={`relative rounded-lg overflow-hidden ${className}`}
      style={{ height, minHeight: height }}
    >
      {/* Dark gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, #1a1f2e 0%, #0e1116 100%)",
        }}
      />

      {/* 3Dmol container */}
      <div
        ref={containerRef}
        className="absolute inset-0 z-10"
        style={{ cursor: size === "lg" ? "grab" : "default" }}
      />

      {/* Loading state */}
      {status === "loading" && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1 h-1 rounded-full bg-white/30 animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Error state */}
      {status === "error" && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-[10px] font-mono text-white/30">
            No structure
          </div>
        </div>
      )}

      {/* Source label */}
      {status === "ready" && structureSource && (
        <div className="absolute bottom-1.5 right-1.5 z-20 px-1.5 py-0.5 rounded bg-black/40 text-[9px] font-mono text-white/50">
          {structureSource}
        </div>
      )}

      {/* Subtle inner border */}
      <div className="absolute inset-0 z-20 rounded-lg border border-white/[0.06] pointer-events-none" />
    </div>
  );
}
