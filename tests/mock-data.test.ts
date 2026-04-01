import { describe, expect, it } from "vitest";

import {
  buildSequencesMap,
  DEMO_RESULTS,
  DEMO_SEQUENCES,
  DEMO_SEQUENCES_MAP,
  MOCK_CREATE_RESPONSE,
  MOCK_RESULTS_RESPONSE,
} from "@/lib/mock-data";

describe("mock-data", () => {
  it("derives the exported sequence map from the canonical sequence list", () => {
    expect(DEMO_SEQUENCES_MAP).toEqual(buildSequencesMap(DEMO_SEQUENCES));
    expect(Object.keys(DEMO_SEQUENCES_MAP)).toHaveLength(DEMO_SEQUENCES.length);
  });

  it("keeps result payloads aligned with the canonical experiment fixture", () => {
    const sequenceNames = new Set(DEMO_SEQUENCES.map((sequence) => sequence.name));
    const resultNames = DEMO_RESULTS.map((result) => result.sequence_name);
    const resultIds = DEMO_RESULTS.map((result) => result.sequence_id);

    expect(new Set(resultNames).size).toBe(DEMO_RESULTS.length);
    expect(new Set(resultIds).size).toBe(DEMO_RESULTS.length);

    for (const result of DEMO_RESULTS) {
      expect(sequenceNames.has(result.sequence_name)).toBe(true);
    }

    expect(MOCK_CREATE_RESPONSE.experiment_spec.sequences).toEqual(
      DEMO_SEQUENCES_MAP
    );
    expect(MOCK_RESULTS_RESPONSE.total).toBe(DEMO_RESULTS.length);
    expect(MOCK_RESULTS_RESPONSE.count).toBe(DEMO_RESULTS.length);
    expect(MOCK_RESULTS_RESPONSE.items.map((item) => item.sequence_id)).toEqual(
      resultIds
    );
  });
});
