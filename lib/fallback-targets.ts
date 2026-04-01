import type { Target, TargetDetail } from "./api-types";

export const FALLBACK_TARGETS: Target[] = [
  {
    id: "019a03da-b87f-7e62-9ba1-7b776b7c8eb3",
    name: "Canine HER2 / ErbB2 Protein (His Tag)",
    vendor_name: "Acro Biosystems",
    catalog_number: "HE2-C52H3",
    url: "https://targets.adaptyvbio.com/product/acro/HE2-C52H3",
    pricing: { type: "per_sequence", price_per_sequence_cents: 1749 },
    uniprot_id: "P04626",
  },
  {
    id: "019a03da-b87f-7546-9184-8b5637390104",
    name: "Canine BLyS / TNFSF13B / BAFF Protein (Fc Tag)",
    vendor_name: "Acro Biosystems",
    catalog_number: "BAF-C5259",
    url: "https://targets.adaptyvbio.com/product/acro/BAF-C5259",
    pricing: { type: "per_sequence", price_per_sequence_cents: 1749 },
    uniprot_id: "Q9Y275",
  },
  {
    id: "019a03da-b87f-7b5c-a2ed-eeeef034252d",
    name: "Canine PD-L1 / B7-H1 / CD274 Protein (ECD, Fc Tag)",
    vendor_name: "Sino Biological",
    catalog_number: "10084-H02H",
    url: "https://targets.adaptyvbio.com/product/sino/10084-H02H",
    pricing: { type: "per_sequence", price_per_sequence_cents: 1499 },
    uniprot_id: "Q9NZQ7",
  },
  {
    id: "019a03da-b87f-7dd7-843f-566bbe08b5c7",
    name: "Cynomolgus IL-6 Protein (His Tag)",
    vendor_name: "Acro Biosystems",
    catalog_number: "IL6-C52H8",
    url: "https://targets.adaptyvbio.com/product/acro/IL6-C52H8",
    pricing: { type: "per_sequence", price_per_sequence_cents: 1749 },
    uniprot_id: "P05231",
  },
  {
    id: "019a03da-b87f-7cb5-8896-3c6887a2b39f",
    name: "Cynomolgus VEGFR2 / Flk-1 / CD309 Protein (His Tag)",
    vendor_name: "Sino Biological",
    catalog_number: "10012-H08H",
    url: "https://targets.adaptyvbio.com/product/sino/10012-H08H",
    pricing: { type: "per_sequence", price_per_sequence_cents: 1499 },
    uniprot_id: "P35968",
  },
  {
    id: "019a03da-b87f-7a91-b432-1234567890ab",
    name: "Human TNF-alpha Protein (His Tag)",
    vendor_name: "Acro Biosystems",
    catalog_number: "TNA-H5228",
    url: "https://targets.adaptyvbio.com/product/acro/TNA-H5228",
    pricing: { type: "per_sequence", price_per_sequence_cents: 1749 },
    uniprot_id: "P01375",
  },
];

const DETAILS_BY_INDEX: Array<{
  gene_names: string[];
  organism: string;
  expression_system: string;
  sequence_length: number;
  family: string;
  tags: string[];
  molecular_weight: string;
  description: string;
}> = [
  {
    gene_names: ["ERBB2", "HER2", "NEU"],
    organism: "Canis lupus familiaris",
    expression_system: "HEK293",
    sequence_length: 630,
    family: "ErbB receptor tyrosine kinase",
    tags: ["His Tag", "Recombinant"],
    molecular_weight: "70.2 kDa",
    description: "Recombinant Canine HER2/ErbB2 protein with C-terminal His tag, expressed in HEK293 cells. Suitable for BLI and SPR binding assays.",
  },
  {
    gene_names: ["TNFSF13B", "BAFF", "BLyS"],
    organism: "Canis lupus familiaris",
    expression_system: "HEK293",
    sequence_length: 285,
    family: "TNF superfamily",
    tags: ["Fc Tag", "Recombinant"],
    molecular_weight: "52.3 kDa",
    description: "Recombinant Canine BLyS/BAFF protein with C-terminal human Fc tag. B-cell activating factor involved in B-cell maturation and survival.",
  },
  {
    gene_names: ["CD274", "PD-L1", "B7-H1"],
    organism: "Canis lupus familiaris",
    expression_system: "HEK293",
    sequence_length: 238,
    family: "B7 / CD28 superfamily",
    tags: ["Fc Tag", "ECD", "Recombinant"],
    molecular_weight: "50.1 kDa",
    description: "Recombinant Canine PD-L1 extracellular domain with C-terminal Fc tag. Key immune checkpoint ligand for PD-1 receptor.",
  },
  {
    gene_names: ["IL6"],
    organism: "Macaca fascicularis",
    expression_system: "HEK293",
    sequence_length: 187,
    family: "Interleukin-6 family",
    tags: ["His Tag", "Recombinant"],
    molecular_weight: "21.0 kDa",
    description: "Recombinant Cynomolgus IL-6 with C-terminal His tag. Pro-inflammatory cytokine involved in immune regulation and acute-phase response.",
  },
  {
    gene_names: ["KDR", "VEGFR2", "FLK1"],
    organism: "Macaca fascicularis",
    expression_system: "HEK293",
    sequence_length: 764,
    family: "VEGF receptor tyrosine kinase",
    tags: ["His Tag", "Recombinant"],
    molecular_weight: "85.4 kDa",
    description: "Recombinant Cynomolgus VEGFR2 extracellular domain with C-terminal His tag. Primary receptor for VEGF-mediated angiogenesis signaling.",
  },
  {
    gene_names: ["TNF", "TNFA"],
    organism: "Homo sapiens",
    expression_system: "E. coli",
    sequence_length: 157,
    family: "TNF superfamily",
    tags: ["His Tag", "Recombinant"],
    molecular_weight: "17.4 kDa",
    description: "Recombinant Human TNF-alpha with C-terminal His tag. Key pro-inflammatory cytokine involved in systemic inflammation.",
  },
];

const FALLBACK_TARGET_DETAILS: Record<string, TargetDetail> = Object.fromEntries(
  FALLBACK_TARGETS.map((t, i) => [
    t.id,
    {
      ...t,
      details: {
        ...DETAILS_BY_INDEX[i],
        sequence: "...",
        subcellular_locations: ["Cell membrane"],
      },
    },
  ])
);

export function filterFallbackTargets(search: string) {
  if (!search) {
    return FALLBACK_TARGETS;
  }

  const query = search.toLowerCase();
  return FALLBACK_TARGETS.filter(
    (target) =>
      target.name.toLowerCase().includes(query) ||
      target.vendor_name.toLowerCase().includes(query) ||
      target.catalog_number.toLowerCase().includes(query)
  );
}

export function getFallbackTargetDetail(id: string) {
  return FALLBACK_TARGET_DETAILS[id] ?? null;
}
