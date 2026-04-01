// Parse sequences from various formats: FASTA, CSV, plain text

export interface ParsedSequence {
  name: string;
  sequence: string;
}

const AA_CHARS = /^[ACDEFGHIKLMNPQRSTVWY]+$/i;

function isAminoAcidSequence(s: string): boolean {
  const cleaned = s.trim().replace(/\s/g, "");
  return cleaned.length >= 10 && AA_CHARS.test(cleaned);
}

function parseDelimitedTable(text: string, delimiter: "," | "\t") {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  const pushField = () => {
    row.push(field.trim());
    field = "";
  };

  const pushRow = () => {
    pushField();
    if (row.some((value) => value.trim().length > 0)) {
      rows.push(row);
    }
    row = [];
  };

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (!inQuotes && char === delimiter) {
      pushField();
      continue;
    }

    if (!inQuotes && (char === "\n" || char === "\r")) {
      if (char === "\r" && text[i + 1] === "\n") {
        i += 1;
      }
      pushRow();
      continue;
    }

    field += char;
  }

  if (field.length > 0 || row.length > 0) {
    pushRow();
  }

  return rows;
}

export function parseFasta(text: string): ParsedSequence[] {
  const results: ParsedSequence[] = [];
  let currentName = "";
  let currentSeq = "";

  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith(">")) {
      if (currentName && currentSeq) {
        results.push({ name: currentName, sequence: currentSeq.toUpperCase() });
      }
      currentName = trimmed.slice(1).trim().split(/\s+/)[0] || `seq_${results.length + 1}`;
      currentSeq = "";
    } else if (trimmed && !trimmed.startsWith("#")) {
      currentSeq += trimmed.replace(/\s/g, "");
    }
  }
  if (currentName && currentSeq) {
    results.push({ name: currentName, sequence: currentSeq.toUpperCase() });
  }
  return results;
}

export function parseCsv(text: string): ParsedSequence[] {
  const firstLine = text.split(/\r?\n/, 1)[0] ?? "";
  const delimiter = firstLine.includes("\t") ? "\t" : ",";
  const rows = parseDelimitedTable(text, delimiter);
  if (rows.length < 2) return [];

  const headers = rows[0].map((header) =>
    header.trim().toLowerCase().replace(/['"]/g, "")
  );

  // Find sequence column
  const seqIdx = headers.findIndex((h) =>
    ["sequence", "seq", "aa", "amino_acid", "aa_sequence", "protein_sequence", "aa_string"].includes(h)
  );

  // Find name column
  const nameIdx = headers.findIndex((h) =>
    ["name", "id", "identifier", "sequence_name", "seq_name", "label"].includes(h)
  );

  if (seqIdx === -1) {
    // Try to auto-detect: find the column with AA-like data
    const dataLine = rows[1] ?? [];
    const autoSeqIdx = dataLine.findIndex((value) => isAminoAcidSequence(value));
    if (autoSeqIdx === -1) return [];

    return rows
      .slice(1)
      .map((cols, i) => {
        const seqValue = (cols[autoSeqIdx] ?? "").replace(/\s/g, "");
        const nameValue =
          nameIdx >= 0
            ? cols[nameIdx]
            : cols[0] !== seqValue
              ? cols[0]
              : "";
        return {
          name: nameValue || `seq_${i + 1}`,
          sequence: seqValue.toUpperCase(),
        };
      })
      .filter((sequence) => sequence.sequence.length > 0);
  }

  return rows
    .slice(1)
    .map((cols, i) => ({
      name: (nameIdx >= 0 ? cols[nameIdx] : "") || `seq_${i + 1}`,
      sequence: (cols[seqIdx] ?? "").replace(/\s/g, "").toUpperCase(),
    }))
    .filter((sequence) => sequence.sequence.length > 0);
}

export function parsePlainText(text: string): ParsedSequence[] {
  // One sequence per line, no headers
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#") && !l.startsWith(">"))
    .filter((l) => isAminoAcidSequence(l))
    .map((seq, i) => ({
      name: `seq_${i + 1}`,
      sequence: seq.toUpperCase(),
    }));
}

export function parseSequences(text: string): ParsedSequence[] {
  const trimmed = text.trim();

  // FASTA format
  if (trimmed.startsWith(">")) {
    return parseFasta(trimmed);
  }

  // CSV/TSV (has header row with known column names)
  const firstLine = trimmed.split("\n")[0].toLowerCase();
  if (
    firstLine.includes("sequence") ||
    firstLine.includes("name") ||
    firstLine.includes(",") ||
    firstLine.includes("\t")
  ) {
    const csvResult = parseCsv(trimmed);
    if (csvResult.length > 0) return csvResult;
  }

  // Plain text (one per line)
  return parsePlainText(trimmed);
}
