import { describe, expect, it } from "vitest";

import {
  parseCsv,
  parseFasta,
  parseSequences,
} from "@/lib/sequence-parser";

const SEQUENCE =
  "EVQLVESGGGLVQPGGSLRLSCAASGFTFSNYAMSWVRQAPGKGLEWVSAISGSGGSTYRFTISRDNSKNTLYLQMNSLRAEDTAVYYCAKDLRGPTYDSSWYRWGQGTLVTVSS";

describe("sequence-parser", () => {
  it("parses FASTA entries with multiline sequences", () => {
    const fasta = `>lead candidate
EVQLVESGGGLVQPGGSLRLSCAAS
GFTFSNYAMSWVRQAPGKGLEWVS
>backup
${SEQUENCE}`;

    expect(parseFasta(fasta)).toEqual([
      {
        name: "lead",
        sequence:
          "EVQLVESGGGLVQPGGSLRLSCAASGFTFSNYAMSWVRQAPGKGLEWVS",
      },
      {
        name: "backup",
        sequence: SEQUENCE,
      },
    ]);
  });

  it("parses CSV rows with quoted commas without splitting fields", () => {
    const csv = `name,sequence
"binder, lead",${SEQUENCE}`;

    expect(parseCsv(csv)).toEqual([
      {
        name: "binder, lead",
        sequence: SEQUENCE,
      },
    ]);
  });

  it("auto-detects sequence columns in quoted spreadsheet exports", () => {
    const csv = `label,notes,payload
"ctrl, 1","contains, commas",${SEQUENCE}`;

    expect(parseSequences(csv)).toEqual([
      {
        name: "ctrl, 1",
        sequence: SEQUENCE,
      },
    ]);
  });
});
