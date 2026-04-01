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

// Eagerly prefetch structure data for a list of UniProt IDs (call once at parent level)
export function prefetchStructures(uniprotIds: string[]) {
  for (const id of uniprotIds) {
    fetchStructurePayload(id);
  }
}

// Preload the 3Dmol module once (starts downloading on first import)
let mol3dPromise: Promise<typeof import("3dmol")> | null = null;
function preload3Dmol() {
  if (!mol3dPromise) {
    mol3dPromise = import("3dmol");
  }
  return mol3dPromise;
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
  const [showSurface, setShowSurface] = useState(true);

  const height = size === "sm" ? 140 : 360;

  // Eagerly prefetch structure data and 3Dmol module
  useEffect(() => {
    fetchStructurePayload(uniprotId);
    preload3Dmol();
  }, [uniprotId]);

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
      { rootMargin: "600px" }
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

      const $3Dmol = await preload3Dmol();
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

  // Toggle molecular surface
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || status !== "ready") return;

    viewer.removeAllSurfaces();
    if (showSurface) {
      viewer.addSurface(
        "VDW",
        { opacity: 0.12, color: "#3b82f6" },
        {},
        {}
      );
    }
    viewer.render();
  }, [showSurface, status]);

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
      className={`relative rounded-sm overflow-hidden ${className}`}
      style={{ height, minHeight: height }}
    >
      {/* White background */}
      <div className="absolute inset-0 bg-white" />

      {/* 3Dmol container — pointer-events disabled, interaction zone re-enables center */}
      <div
        ref={containerRef}
        className="absolute inset-0 z-10"
        style={{ pointerEvents: "none" }}
      />

      {/* Interaction zone: centered 50%×50% area that passes events to the canvas */}
      {size === "lg" && status === "ready" && (
        <div
          className="absolute z-15 rounded"
          style={{
            top: "25%",
            left: "25%",
            width: "50%",
            height: "50%",
            cursor: "grab",
          }}
          onMouseDown={(e) => {
            // Forward mouse events to the 3Dmol canvas
            const canvas = containerRef.current?.querySelector("canvas");
            if (!canvas) return;
            const synth = new MouseEvent(e.type, {
              clientX: e.clientX,
              clientY: e.clientY,
              button: e.button,
              bubbles: true,
            });
            canvas.dispatchEvent(synth);

            // Track mouse moves and forward them too
            const onMove = (me: MouseEvent) => {
              canvas.dispatchEvent(new MouseEvent("mousemove", {
                clientX: me.clientX,
                clientY: me.clientY,
                button: me.button,
                bubbles: true,
              }));
            };
            const onUp = (me: MouseEvent) => {
              canvas.dispatchEvent(new MouseEvent("mouseup", {
                clientX: me.clientX,
                clientY: me.clientY,
                button: me.button,
                bubbles: true,
              }));
              document.removeEventListener("mousemove", onMove);
              document.removeEventListener("mouseup", onUp);
            };
            document.addEventListener("mousemove", onMove);
            document.addEventListener("mouseup", onUp);
          }}
          onWheel={(e) => {
            const canvas = containerRef.current?.querySelector("canvas");
            if (!canvas) return;
            canvas.dispatchEvent(new WheelEvent("wheel", {
              deltaY: e.deltaY,
              deltaX: e.deltaX,
              clientX: e.clientX,
              clientY: e.clientY,
              bubbles: true,
            }));
            e.preventDefault();
          }}
        />
      )}

      {/* Loading state */}
      {status === "loading" && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-[#E4E4E7] border-t-accent-blue rounded-sm animate-spin" />
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

      {/* Controls (large viewer only) */}
      {size === "lg" && status === "ready" && (
        <div className="absolute top-2 right-2 z-20 flex items-center gap-2">
          <button
            onClick={() => setShowSurface((s) => !s)}
            className={`px-2 py-1 rounded text-[10px] font-mono transition-colors ${
              showSurface
                ? "bg-accent-blue/15 text-accent-blue"
                : "bg-black/5 text-muted-foreground"
            }`}
          >
            Surface
          </button>
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
