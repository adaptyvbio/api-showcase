"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, MapPin, DollarSign, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatCents } from "@/lib/utils";
import type { Target, TargetDetail, TargetsResponse } from "@/lib/api-types";
import { ExampleBlock } from "@/components/shared/example-block";
import { ApiPanel } from "@/components/shared/api-panel";
import { ProteinViewer } from "@/components/shared/protein-viewer";

export function TargetExplorer() {
  const [search, setSearch] = useState("");
  const [targets, setTargets] = useState<Target[]>([]);
  const [selectedTarget, setSelectedTarget] = useState<TargetDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiMethod, setApiMethod] = useState<"GET" | "POST">("GET");
  const [apiEndpoint, setApiEndpoint] = useState("/targets?search=&selfservice_only=true");
  const [apiResponse, setApiResponse] = useState<unknown>(null);
  const [apiStatus, setApiStatus] = useState<number | null>(null);
  const [apiTab, setApiTab] = useState<"request" | "response">("request");

  const fetchTargets = useCallback(async (query: string) => {
    setIsLoading(true);
    setApiMethod("GET");
    setApiEndpoint(`/targets?search=${encodeURIComponent(query)}&selfservice_only=true`);
    setApiTab("request");

    try {
      const res = await fetch(`/api/targets?search=${encodeURIComponent(query)}`);
      const data: TargetsResponse = await res.json();
      setTargets(data.items ?? []);
      setApiResponse(data);
      setApiStatus(res.status);
      setApiTab("response");
    } catch {
      setApiStatus(500);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchTargets(search), 300);
    return () => clearTimeout(timer);
  }, [search, fetchTargets]);

  const handleSelectTarget = async (target: Target) => {
    setIsLoading(true);
    setApiMethod("GET");
    setApiEndpoint(`/targets/${target.id}`);
    setApiTab("request");

    try {
      const res = await fetch(`/api/targets/${target.id}`);
      const data: TargetDetail = await res.json();
      setSelectedTarget(data);
      setApiResponse(data);
      setApiStatus(res.status);
      setApiTab("response");
    } catch {
      setApiStatus(500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ExampleBlock
      id="browse-targets"
      number={1}
      title="Browse Target Proteins"
      description="Help your users find the right protein target to test against."
      isLive
      left={
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search targets (e.g. HER2, TNF, PD-L1)..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedTarget(null);
              }}
              className="pl-9 h-10"
            />
          </div>

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
                  onClick={() => handleSelectTarget(t)}
                />
              ))}
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
          method={apiMethod}
          endpoint={apiEndpoint}
          response={apiResponse}
          responseStatus={apiStatus}
          isLoading={isLoading}
          activeTab={apiTab}
          onTabChange={setApiTab}
        />
      }
    />
  );
}

function TargetCard({ target, onClick }: { target: Target; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-left rounded-lg border border-border hover:border-accent-blue/30 hover:bg-accent-blue/[0.02] transition-all group overflow-hidden"
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
