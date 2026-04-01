"use client";

import { useState, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Upload,
  Sparkles,
  X,
  CheckCircle2,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  EXPERIMENT_TYPES,
  PRESET_TARGETS,
  DEMO_SEQUENCES,
  MOCK_CREATE_RESPONSE,
} from "@/lib/mock-data";
import { parseSequences } from "@/lib/sequence-parser";
import { ExampleBlock } from "@/components/shared/example-block";
import { ApiPanel } from "@/components/shared/api-panel";
import type { DemoSequence } from "@/lib/mock-data";

export function ExperimentBuilder() {
  const [experimentType, setExperimentType] = useState("screening");
  const [targetIdx, setTargetIdx] = useState(0);
  const [method, setMethod] = useState("bli");
  const [sequences, setSequences] = useState<DemoSequence[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const typeInfo = EXPERIMENT_TYPES.find((t) => t.type === experimentType);
  const needsTarget = typeInfo?.requiresTarget ?? false;
  const hasMethods = (typeInfo?.methods.length ?? 0) > 0;

  const handleGenerateExamples = () => {
    setSequences([...DEMO_SEQUENCES]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const parsed = parseSequences(text);
      if (parsed.length > 0) {
        setSequences(
          parsed.map((s) => ({
            name: s.name,
            sequence: s.sequence,
            isControl: s.name.toLowerCase().includes("ctrl") || s.name.toLowerCase().includes("control"),
          }))
        );
      }
    };
    reader.readAsText(file);
    // Reset file input so same file can be re-uploaded
    e.target.value = "";
  };

  const handleRemoveSequence = (idx: number) => {
    setSequences((s) => s.filter((_, i) => i !== idx));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const sequencesMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const s of sequences) {
      map[s.name] = s.sequence;
    }
    return map;
  }, [sequences]);

  const requestPayload = {
    experiment_spec: {
      experiment_type: experimentType,
      ...(hasMethods ? { method } : {}),
      ...(needsTarget ? { target_id: PRESET_TARGETS[targetIdx].id } : {}),
      sequences: sequences.length > 0
        ? sequencesMap
        : { "<name>": "<amino_acid_sequence>" },
      n_replicates: 1,
    },
  };

  return (
    <ExampleBlock
      id="create-experiment"
      number={2}
      title="Create an Experiment"
      description="Build an experiment step by step: pick a type, select a target, add sequences, and submit to the lab."
      left={
        <div className="space-y-5">
          {/* Experiment Type */}
          <div>
            <label className="text-xs font-medium text-foreground mb-2 block">
              Experiment Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {EXPERIMENT_TYPES.map((et) => (
                <button
                  key={et.type}
                  onClick={() => setExperimentType(et.type)}
                  className={cn(
                    "text-left px-3 py-2 rounded-sm border text-xs transition-all",
                    experimentType === et.type
                      ? "border-accent-blue bg-accent-blue/[0.04] text-accent-blue font-medium"
                      : "border-border text-muted-foreground hover:border-border hover:bg-muted/30"
                  )}
                >
                  {et.label}
                </button>
              ))}
            </div>
          </div>

          {/* Method (BLI / SPR) */}
          {hasMethods && (
            <div>
              <label className="text-xs font-medium text-foreground mb-2 block">
                Method
              </label>
              <div className="flex gap-2">
                {typeInfo!.methods.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMethod(m)}
                    className={cn(
                      "px-3 py-1.5 rounded-sm border text-xs font-mono uppercase transition-all",
                      method === m
                        ? "border-accent-blue bg-accent-blue/[0.04] text-accent-blue font-medium"
                        : "border-border text-muted-foreground hover:bg-muted/30"
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Target Selection */}
          {needsTarget && (
            <div>
              <label className="text-xs font-medium text-foreground mb-2 flex items-center gap-1.5">
                <Target className="w-3 h-3" />
                Target Protein
              </label>
              <select
                value={targetIdx}
                onChange={(e) => setTargetIdx(Number(e.target.value))}
                className="w-full h-10 rounded-sm border border-input bg-background px-3 text-sm"
              >
                {PRESET_TARGETS.map((t, i) => (
                  <option key={t.id} value={i}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sequences */}
          <div>
            <label className="text-xs font-medium text-foreground mb-2 block">
              Sequences
            </label>

            {sequences.length === 0 ? (
              <div className="border border-dashed border-border rounded-sm p-6 text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  Add protein sequences to test
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Button
                    onClick={handleGenerateExamples}
                    variant="outline"
                    className="text-xs h-8"
                  >
                    <Sparkles className="w-3 h-3 mr-1.5" />
                    Generate 20 Examples
                  </Button>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="text-xs h-8"
                  >
                    <Upload className="w-3 h-3 mr-1.5" />
                    Upload CSV / FASTA
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground/60">
                  Supports .fasta, .fa, .csv, .tsv, .txt
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-muted-foreground">
                    {sequences.length} sequence{sequences.length !== 1 ? "s" : ""} loaded
                  </span>
                  <button
                    onClick={() => setSequences([])}
                    className="text-[11px] text-muted-foreground hover:text-destructive transition-colors"
                  >
                    Clear all
                  </button>
                </div>
                <div className="border border-border rounded-sm overflow-hidden max-h-[280px] overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-secondary/50 border-b border-border">
                        <th className="text-left px-3 py-2 font-semibold text-[10px] tracking-wider uppercase text-muted-foreground w-24">
                          Name
                        </th>
                        <th className="text-left px-3 py-2 font-semibold text-[10px] tracking-wider uppercase text-muted-foreground">
                          Sequence
                        </th>
                        <th className="w-8" />
                      </tr>
                    </thead>
                    <tbody>
                      {sequences.map((seq, i) => (
                        <tr
                          key={i}
                          className="border-b border-border last:border-0 hover:bg-muted/10 transition-none"
                        >
                          <td className="px-3 py-1.5 font-mono text-foreground">
                            <span className="flex items-center gap-1.5">
                              {seq.name}
                              {seq.isControl && (
                                <Badge
                                  variant="outline"
                                  className="text-[9px] py-0 px-1 font-mono"
                                >
                                  ctrl
                                </Badge>
                              )}
                            </span>
                          </td>
                          <td className="px-3 py-1.5 font-mono text-muted-foreground max-w-0">
                            <span
                              className="block overflow-x-auto whitespace-nowrap text-[10px] cursor-text select-all scrollbar-thin"
                              title="Click to select, then copy"
                            >
                              {seq.sequence}
                            </span>
                          </td>
                          <td className="px-1">
                            <button
                              onClick={() => handleRemoveSequence(i)}
                              className="p-1 text-muted-foreground/40 hover:text-destructive transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="text-xs h-7"
                  >
                    <Upload className="w-3 h-3 mr-1" />
                    Add more
                  </Button>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".fasta,.fa,.csv,.tsv,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Submit */}
          {submitted ? (
            <div className="flex items-center gap-2 text-sm text-success">
              <CheckCircle2 className="w-4 h-4" />
              Experiment {MOCK_CREATE_RESPONSE.code} created successfully
            </div>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={sequences.length === 0}
              className="bg-accent-blue hover:bg-accent-blue-hover text-white"
            >
              <Send className="w-3.5 h-3.5 mr-1.5" />
              Submit Experiment
            </Button>
          )}
        </div>
      }
      right={
        <ApiPanel
          method="POST"
          endpoint="/experiments"
          requestBody={requestPayload}
          response={submitted ? MOCK_CREATE_RESPONSE : undefined}
          responseStatus={submitted ? 201 : undefined}
          activeTab={submitted ? "response" : "request"}
        />
      }
    />
  );
}
