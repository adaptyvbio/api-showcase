"use client";

import { useState, useCallback } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calculator, DollarSign, FlaskConical, Package } from "lucide-react";
import { formatCents } from "@/lib/utils";
import { PRESET_TARGETS } from "@/lib/mock-data";
import { ExampleBlock } from "@/components/shared/example-block";
import { ApiPanel } from "@/components/shared/api-panel";
import type { CostEstimateResponse } from "@/lib/api-types";

export function CostEstimator() {
  const [experimentType, setExperimentType] = useState("affinity");
  const [method, setMethod] = useState("bli");
  const [targetIdx, setTargetIdx] = useState(0);
  const [seqCount, setSeqCount] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CostEstimateResponse | null>(null);
  const [apiTab, setApiTab] = useState<"request" | "response">("request");
  const [apiStatus, setApiStatus] = useState<number | null>(null);

  const PLACEHOLDER_SEQ = "EVQLVESGGGLVQPGGSLRLSCAASGFTFSSYAMSWVRQAPGKGLEWVSAISGSGGSTYYADSVKGRFTISRDNSKNTLYLQMNSLRAEDTAVYYCAK";
  const sequences: Record<string, string> = {};
  for (let i = 0; i < seqCount; i++) {
    sequences[`seq_${i + 1}`] = PLACEHOLDER_SEQ;
  }

  const requestPayload = {
    experiment_spec: {
      experiment_type: experimentType,
      ...(experimentType === "affinity" ? { method } : {}),
      target_id: PRESET_TARGETS[targetIdx].id,
      sequences,
    },
  };

  const estimate = useCallback(async () => {
    setIsLoading(true);
    setApiTab("request");

    try {
      const res = await fetch("/api/cost-estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
      });
      const data = await res.json();
      setResult(data);
      setApiStatus(res.status);
      setApiTab("response");
    } catch {
      setApiStatus(500);
    } finally {
      setIsLoading(false);
    }
  }, [experimentType, method, targetIdx, seqCount]);

  return (
    <ExampleBlock
      id="get-a-quote"
      number={3}
      title="Get a Quote"
      description="Show your users transparent pricing before they commit."
      isLive
      left={
        <div className="space-y-5">
          <div>
            <label className="text-xs font-medium text-foreground mb-2 block">
              Experiment Type
            </label>
            <RadioGroup
              value={experimentType}
              onValueChange={setExperimentType}
              className="flex gap-3"
            >
              {["affinity", "screening", "thermostability"].map((t) => (
                <label
                  key={t}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <RadioGroupItem value={t} />
                  <span className="capitalize">{t}</span>
                </label>
              ))}
            </RadioGroup>
          </div>

          {experimentType === "affinity" && (
            <div>
              <label className="text-xs font-medium text-foreground mb-2 block">
                Method
              </label>
              <RadioGroup
                value={method}
                onValueChange={setMethod}
                className="flex gap-3"
              >
                {["bli", "spr"].map((m) => (
                  <label
                    key={m}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <RadioGroupItem value={m} />
                    <span className="uppercase">{m}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-foreground mb-2 block">
              Target
            </label>
            <select
              value={targetIdx}
              onChange={(e) => setTargetIdx(Number(e.target.value))}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              {PRESET_TARGETS.map((t, i) => (
                <option key={t.id} value={i}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-foreground mb-2 block">
              Sequences: {seqCount}
            </label>
            <Slider
              value={[seqCount]}
              onValueChange={(v) => setSeqCount(Array.isArray(v) ? v[0] : v)}
              min={1}
              max={20}
              step={1}
              className="w-full"
            />
          </div>

          <Button
            onClick={estimate}
            disabled={isLoading}
            className="bg-accent-blue hover:bg-accent-blue-hover text-white"
          >
            Estimate Cost
          </Button>

          {result?.breakdown && (
            <div className="rounded-lg bg-[#F4F4F5] p-5 space-y-3">
              <div className="text-sm font-medium text-foreground">
                Cost Breakdown
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Assay</span>
                  <span className="font-mono text-foreground">
                    {formatCents(result.breakdown.assay.subtotal_cents)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Materials</span>
                  <span className="font-mono text-foreground">
                    {formatCents(result.breakdown.materials.subtotal_cents)}
                  </span>
                </div>
                <div className="border-t border-[#E4E4E7] pt-2 flex justify-between items-center">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-mono font-bold text-lg text-foreground">
                    {formatCents(result.breakdown.total_cents)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      }
      right={
        <ApiPanel
          method="POST"
          endpoint="/experiments/cost-estimate"
          requestBody={requestPayload}
          response={result}
          responseStatus={apiStatus}
          isLoading={isLoading}
          activeTab={apiTab}
          onTabChange={setApiTab}
        />
      }
    />
  );
}
