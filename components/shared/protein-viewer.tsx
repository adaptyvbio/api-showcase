"use client";

import { useEffect, useRef, useState } from "react";

interface ProteinViewerProps {
  uniprotId: string;
  size?: "sm" | "lg";
  className?: string;
}

type ViewerStatus = "idle" | "loading" | "ready" | "error";

interface StructurePayload {
  data: string;
  format: "pdb";
  label: string;
}

const structurePromiseCache = new Map<string, Promise<StructurePayload | null>>();

// Strip isoform suffix for structure lookups (P04626-1 → P04626)
function cleanUniprotId(id: string): string {
  return id.split("-")[0];
}

async function fetchStructurePayload(uniprotId: string) {
  const cleanId = cleanUniprotId(uniprotId);
  const cached = structurePromiseCache.get(cleanId);
  if (cached) {
    return cached;
  }

  const loadPromise = (async () => {
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
        const res = await fetch(url, { cache: "force-cache" });
        if (!res.ok) {
          continue;
        }

        const data = await res.text();
        if (!data || data.length < 100) {
          continue;
        }

        return { data, format, label };
      } catch {
        continue;
      }
    }

    return null;
  })();

  structurePromiseCache.set(cleanId, loadPromise);
  return loadPromise;
}

export function ProteinViewer({
  uniprotId,
  size = "sm",
  className = "",
}: ProteinViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<import("3dmol").GLViewer | null>(null);
  const [status, setStatus] = useState<ViewerStatus>(
    size === "lg" ? "loading" : "idle"
  );
  const [structureSource, setStructureSource] = useState<string>("");
  const [isVisible, setIsVisible] = useState(size === "lg");

  const height = size === "sm" ? 140 : 360;

  useEffect(() => {
    if (size === "lg") {
      setIsVisible(true);
      return;
    }

    const container = containerRef.current;
    if (!container || isVisible) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px" }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [isVisible, size]);

  useEffect(() => {
    if (!containerRef.current || !isVisible) {
      return;
    }

    let cancelled = false;

    async function loadStructure() {
      setStatus("loading");

      const structurePayload = await fetchStructurePayload(uniprotId);
      if (!structurePayload || cancelled || !containerRef.current) {
        if (!cancelled) {
          setStatus("error");
        }
        return;
      }

      const $3Dmol = await import("3dmol");
      if (cancelled || !containerRef.current) {
        return;
      }

      containerRef.current.innerHTML = "";

      const viewer = $3Dmol.createViewer(containerRef.current, {
        backgroundColor: "#ffffff",
        antialias: true,
      });

      viewer.addModel(structurePayload.data, structurePayload.format);

      // Cartoon in Adaptyv blue tones
      viewer.setStyle(
        {},
        {
          cartoon: {
            colorfunc: (atom: { resi: number }) => {
              // Blue gradient based on residue position
              const t = (atom.resi % 120) / 120;
              const r = Math.round(20 + t * 40);
              const g = Math.round(80 + t * 100);
              const b = Math.round(180 + t * 75);
              return `rgb(${r},${g},${b})`;
            },
            opacity: 1.0,
          },
        }
      );

      // Semi-transparent molecular surface
      viewer.addSurface(
        "VDW",
        {
          opacity: 0.12,
          color: "#3b82f6",
        },
        {},
        {}
      );

      viewer.zoomTo();
      viewer.render();

      if (size === "sm") {
        viewer.spin("y", 0.5);
      }

      viewerRef.current = viewer;
      setStructureSource(structurePayload.label);
      setStatus("ready");
    }

    loadStructure();

    return () => {
      cancelled = true;
      if (viewerRef.current) {
        viewerRef.current.stopAnimate();
        viewerRef.current = null;
      }
    };
  }, [isVisible, size, uniprotId]);

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
      {/* White background */}
      <div className="absolute inset-0 bg-white" />

      {/* 3Dmol container */}
      <div
        ref={containerRef}
        className="absolute inset-0 z-10"
        style={{
          cursor: size === "lg" ? "grab" : "default",
          pointerEvents: size === "sm" ? "none" : "auto",
        }}
      />

      {/* Loading state */}
      {status === "loading" && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-[#E4E4E7] border-t-accent-blue rounded-full animate-spin" />
        </div>
      )}

      {/* Error state */}
      {status === "error" && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-[10px] font-mono text-muted-foreground">
            No structure
          </div>
        </div>
      )}

      {/* Source label */}
      {status === "ready" && structureSource && (
        <div className="absolute bottom-1.5 right-1.5 z-20 px-1.5 py-0.5 rounded bg-black/5 text-[10px] font-mono text-muted-foreground">
          {structureSource}
        </div>
      )}
    </div>
  );
}
