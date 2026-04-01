"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PRESET_TARGETS, MOCK_EXPERIMENT_RESPONSE } from "@/lib/mock-data";
import { ExampleBlock } from "@/components/shared/example-block";
import { ApiPanel } from "@/components/shared/api-panel";
import { Send } from "lucide-react";

export function ExperimentBuilder() {
  const [experimentType, setExperimentType] = useState("affinity");
  const [method, setMethod] = useState("bli");
  const [targetIdx, setTargetIdx] = useState(0);
  const [sequencesText, setSequencesText] = useState("EVQLVESGGGLVQPGGSLRL...");
  const [replicates, setReplicates] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const sequences = useMemo(() => {
    const lines = sequencesText.split("\n").filter((l) => l.trim());
    const result: Record<string, string> = {};
    lines.forEach((line, i) => {
      result[`seq_${i + 1}`] = line.trim();
    });
    return result;
  }, [sequencesText]);

  const requestPayload = useMemo(
    () => ({
      experiment_spec: {
        experiment_type: experimentType,
        ...(experimentType === "affinity" ? { method } : {}),
        target_id: PRESET_TARGETS[targetIdx].id,
        sequences,
        n_replicates: replicates,
      },
    }),
    [experimentType, method, targetIdx, sequences, replicates]
  );

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <ExampleBlock
      id="create-experiment"
      number={2}
      title="Create an Experiment"
      description="Add a 'Send to Lab' button — one API call to submit sequences for testing."
      isLive={false}
      left={
        <div className="space-y-5">
          {/* Experiment Type */}
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

          {/* Method (shown for affinity) */}
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

          {/* Target */}
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
                  {t.name} ({t.gene})
                </option>
              ))}
            </select>
          </div>

          {/* Sequences */}
          <div>
            <label className="text-xs font-medium text-foreground mb-2 block">
              Sequences (one per line)
            </label>
            <Textarea
              value={sequencesText}
              onChange={(e) => setSequencesText(e.target.value)}
              rows={3}
              className="font-mono text-xs"
              placeholder="EVQLVESGGGLVQPGGSLRL..."
            />
            <div className="text-[10px] text-muted-foreground mt-1">
              {Object.keys(sequences).length} sequence(s)
            </div>
          </div>

          {/* Replicates */}
          <div>
            <label className="text-xs font-medium text-foreground mb-2 block">
              Replicates
            </label>
            <Input
              type="number"
              min={1}
              max={5}
              value={replicates}
              onChange={(e) => setReplicates(Number(e.target.value))}
              className="w-24"
            />
          </div>

          <Button
            onClick={handleSubmit}
            className="bg-accent-blue hover:bg-accent-blue-hover text-white"
          >
            <Send className="w-3.5 h-3.5 mr-1.5" />
            Submit Experiment
          </Button>
        </div>
      }
      right={
        <ApiPanel
          method="POST"
          endpoint="/experiments"
          requestBody={requestPayload}
          response={submitted ? MOCK_EXPERIMENT_RESPONSE : undefined}
          responseStatus={submitted ? 200 : undefined}
          isLoading={false}
          activeTab={submitted ? "response" : "request"}
        />
      }
    />
  );
}
