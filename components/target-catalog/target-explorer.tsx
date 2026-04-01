"use client";

import { useEffect, useRef, useState } from "react";
import {
  Search,
  MapPin,
  DollarSign,
  ExternalLink,
  Loader2,
  TriangleAlert,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatCents } from "@/lib/utils";
import type { Target, TargetDetail, TargetsResponse } from "@/lib/api-types";
import { ExampleBlock } from "@/components/shared/example-block";
import { ApiPanel } from "@/components/shared/api-panel";
import { ProteinViewer } from "@/components/shared/protein-viewer";

interface ApiPanelState {
  method: "GET" | "POST";
  endpoint: string;
  response: unknown;
  status: number | null;
  activeTab: "request" | "response";
}

function isAbortError(error: unknown) {
  return error instanceof Error && error.name === "AbortError";
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

async function readJsonResponse<T>(response: Response): Promise<T> {
  let payload: unknown = null;

  try {
    payload = await response.json();
  } catch {
    throw new Error(`Request failed with status ${response.status}`);
  }

  if (!response.ok) {
    const message =
      typeof payload === "object" &&
      payload !== null &&
      "error" in payload &&
      typeof payload.error === "object" &&
      payload.error !== null &&
      "message" in payload.error &&
      typeof payload.error.message === "string"
        ? payload.error.message
        : `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return payload as T;
}

export function TargetExplorer() {
  const [search, setSearch] = useState("");
  const [targets, setTargets] = useState<Target[]>([]);
  const [selectedTarget, setSelectedTarget] = useState<TargetDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingTargetId, setPendingTargetId] = useState<string | null>(null);
  const [uiError, setUiError] = useState<string | null>(null);
  const [apiPanelState, setApiPanelState] = useState<ApiPanelState>({
    method: "GET",
    endpoint: "/targets?search=&selfservice_only=true",
    response: null,
    status: null,
    activeTab: "request",
  });
  const detailAbortRef = useRef<AbortController | null>(null);
  const searchRequestIdRef = useRef(0);
  const detailRequestIdRef = useRef(0);

  useEffect(() => {
    const controller = new AbortController();
    const requestId = ++searchRequestIdRef.current;
    const endpoint = `/targets?search=${encodeURIComponent(search)}&selfservice_only=true`;

    const timer = setTimeout(async () => {
      setIsLoading(true);
      setUiError(null);
      setApiPanelState((state) => ({
        ...state,
        method: "GET",
        endpoint,
        activeTab: "request",
      }));

      try {
        const response = await fetch(`/api/targets?search=${encodeURIComponent(search)}`, {
          signal: controller.signal,
        });
        const data = await readJsonResponse<TargetsResponse>(response);

        if (controller.signal.aborted || requestId !== searchRequestIdRef.current) {
          return;
        }

        setTargets(data.items ?? []);
        setApiPanelState((state) => ({
          ...state,
          response: data,
          status: response.status,
          activeTab: "response",
        }));
      } catch (error) {
        if (isAbortError(error) || requestId !== searchRequestIdRef.current) {
          return;
        }

        setUiError(getErrorMessage(error, "Unable to load target search results."));
        setApiPanelState((state) => ({
          ...state,
          response: {
            error: {
              message: getErrorMessage(error, "Unable to load target search results."),
            },
          },
          status: 500,
          activeTab: "response",
        }));
      } finally {
        if (!controller.signal.aborted && requestId === searchRequestIdRef.current) {
          setIsLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search]);

  useEffect(() => {
    return () => {
      detailAbortRef.current?.abort();
    };
  }, []);

  const handleSelectTarget = async (target: Target) => {
    detailAbortRef.current?.abort();

    const controller = new AbortController();
    detailAbortRef.current = controller;
    const requestId = ++detailRequestIdRef.current;
    const endpoint = `/targets/${target.id}`;

    setIsLoading(true);
    setPendingTargetId(target.id);
    setUiError(null);
    setApiPanelState((state) => ({
      ...state,
      method: "GET",
      endpoint,
      activeTab: "request",
    }));

    try {
      const response = await fetch(`/api/targets/${target.id}`, {
        signal: controller.signal,
      });
      const data = await readJsonResponse<TargetDetail>(response);

      if (controller.signal.aborted || requestId !== detailRequestIdRef.current) {
        return;
      }

      setSelectedTarget(data);
      setApiPanelState((state) => ({
        ...state,
        response: data,
        status: response.status,
        activeTab: "response",
      }));
    } catch (error) {
      if (isAbortError(error) || requestId !== detailRequestIdRef.current) {
        return;
      }

      setUiError(getErrorMessage(error, "Unable to load target details."));
      setApiPanelState((state) => ({
        ...state,
        response: {
          error: {
            message: getErrorMessage(error, "Unable to load target details."),
          },
        },
        status: 500,
        activeTab: "response",
      }));
    } finally {
      if (!controller.signal.aborted && requestId === detailRequestIdRef.current) {
        setIsLoading(false);
        setPendingTargetId(null);
      }
    }
  };

  return (
    <ExampleBlock
      id="browse-targets"
      number={3}
      title="Browse Target Proteins"
      description="Help your users find the right protein target to test against."
      left={
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search targets (e.g. HER2, TNF, PD-L1)..."
              value={search}
              onChange={(e) => {
                detailAbortRef.current?.abort();
                setSearch(e.target.value);
                setSelectedTarget(null);
                setPendingTargetId(null);
                setUiError(null);
              }}
              className="pl-9 h-10"
            />
          </div>

          {uiError && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-sm border border-destructive/20 bg-destructive/[0.05] px-3 py-2 text-sm text-destructive"
            >
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{uiError}</span>
            </div>
          )}

          {selectedTarget ? (
            <TargetDetailView
              target={selectedTarget}
              onBack={() => setSelectedTarget(null)}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {targets.map((t) => (
                <TargetCard
                  key={t.id}
                  target={t}
                  isPending={pendingTargetId === t.id}
                  onClick={() => handleSelectTarget(t)}
                />
              ))}
              {targets.length === 0 && isLoading && (
                <div className="col-span-2 flex items-center justify-center gap-2 rounded-sm border border-dashed border-border py-8 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Searching targets...
                </div>
              )}
              {targets.length === 0 && !isLoading && (
                <div className="col-span-2 text-center py-8 text-muted-foreground text-sm">
                  No targets found
                </div>
              )}
            </div>
          )}
        </div>
      }
      right={
        <ApiPanel
          method={apiPanelState.method}
          endpoint={apiPanelState.endpoint}
          response={apiPanelState.response}
          responseStatus={apiPanelState.status}
          isLoading={isLoading}
          activeTab={apiPanelState.activeTab}
          onTabChange={(activeTab) =>
            setApiPanelState((state) => ({ ...state, activeTab }))
          }
        />
      }
    />
  );
}

function TargetCard({
  target,
  isPending,
  onClick,
}: {
  target: Target;
  isPending: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={isPending}
      className="text-left rounded-sm border border-border hover:border-primary hover:bg-primary/5 transition-none group overflow-hidden disabled:cursor-wait disabled:opacity-70"
    >
      {/* 3D structure thumbnail */}
      {target.uniprot_id && (
        <ProteinViewer
          uniprotId={target.uniprot_id}
          size="sm"
          className="w-full"
        />
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-medium text-foreground leading-tight line-clamp-2 group-hover:text-accent-blue transition-colors">
            {target.name}
          </h3>
          {isPending && (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-accent-blue" />
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="text-[10px] font-mono">
            {target.vendor_name}
          </Badge>
          {target.uniprot_id && (
            <Badge variant="outline" className="text-[10px] font-mono">
              <MapPin className="w-2.5 h-2.5 mr-0.5" />
              {target.uniprot_id.split("-")[0]}
            </Badge>
          )}
          <span className="ml-auto text-xs font-mono text-muted-foreground flex items-center gap-0.5">
            <DollarSign className="w-3 h-3" />
            {formatCents(target.pricing.price_per_sequence_cents)}
            <span className="text-[10px]">/seq</span>
          </span>
        </div>
      </div>
    </button>
  );
}

function TargetDetailView({
  target,
  onBack,
}: {
  target: TargetDetail;
  onBack: () => void;
}) {
  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="text-xs text-accent-blue hover:underline"
      >
        &larr; Back to results
      </button>

      {/* Large 3D structure viewer */}
      {target.uniprot_id && (
        <ProteinViewer
          uniprotId={target.uniprot_id}
          size="lg"
          className="w-full"
        />
      )}

      <div>
        <h3 className="text-base font-semibold text-foreground mb-1">
          {target.name}
        </h3>
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary" className="text-[10px] font-mono">
            {target.vendor_name}
          </Badge>
          <Badge variant="outline" className="text-[10px] font-mono">
            {target.catalog_number}
          </Badge>
        </div>
      </div>

      {target.details && (
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-2">
            {target.details.gene_names?.length > 0 && (
              <Detail label="Gene" value={target.details.gene_names.join(", ")} />
            )}
            <Detail label="Organism" value={target.details.organism} />
            <Detail label="MW" value={target.details.molecular_weight} />
            <Detail label="Length" value={`${target.details.sequence_length} aa`} />
            {target.details.expression_system && (
              <Detail label="Expression" value={target.details.expression_system} />
            )}
            {target.details.family && (
              <Detail label="Family" value={target.details.family} />
            )}
          </div>
          {target.details.tags?.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {target.details.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-[10px]">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          {target.details.description && (
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
              {target.details.description}
            </p>
          )}
          <div className="pt-2">
            <a
              href={target.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-accent-blue hover:underline"
            >
              View on Target Catalog
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="text-xs text-foreground font-medium">{value}</div>
    </div>
  );
}
