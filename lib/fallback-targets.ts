import type { Target, TargetDetail } from "./api-types";

// ─── Protein-centric fallback data ──────────────────────────────────────────
// 6 human target proteins commonly used in antibody discovery.
// Each protein is the biological entity (identified by UniProt);
// products (commercial reagents) are a sub-detail.

export const FALLBACK_TARGETS: Target[] = [
  {
    id: "comp-egfr-human",
    name: "EGFR",
    gene_names: ["EGFR", "ERBB1", "HER1"],
    organism: "Human",
    uniprot_id: "P00533",
    family: "ErbB receptor tyrosine kinase",
    url: "https://targets.adaptyvbio.com/protein/0a7ed4af-6f71-5093-9644-643d16c3430f",
  },
  {
    id: "comp-her2-human",
    name: "HER2 / ERBB2",
    gene_names: ["ERBB2", "HER2", "NEU"],
    organism: "Human",
    uniprot_id: "P04626",
    family: "ErbB receptor tyrosine kinase",
    url: "https://targets.adaptyvbio.com/protein/e9cb07ba-f475-5b68-ac6b-651ea42e4f46",
  },
  {
    id: "comp-il7r-human",
    name: "IL-7Rα / CD127",
    gene_names: ["IL7R", "IL7RA", "CD127"],
    organism: "Human",
    uniprot_id: "P16871",
    family: "Type I cytokine receptor",
    url: "https://targets.adaptyvbio.com/protein/79fbe63f-41b5-5107-a66a-a95e155ef242",
  },
  {
    id: "comp-pdl1-human",
    name: "PD-L1 / CD274",
    gene_names: ["CD274", "PD-L1", "B7-H1"],
    organism: "Human",
    uniprot_id: "Q9NZQ7",
    family: "B7 / CD28 superfamily",
    url: "https://targets.adaptyvbio.com/protein/0aa3b309-3257-53d9-81f1-13140579db5b",
  },
  {
    id: "comp-tnf-human",
    name: "TNF-α",
    gene_names: ["TNF", "TNFA"],
    organism: "Human",
    uniprot_id: "P01375",
    family: "TNF superfamily",
    url: "https://targets.adaptyvbio.com/protein/6b3c7f73-87b9-5009-a1f0-933d83bda58d",
  },
  {
    id: "comp-vegfa-human",
    name: "VEGF-A",
    gene_names: ["VEGFA", "VEGF", "VPF"],
    organism: "Human",
    uniprot_id: "P15692",
    family: "PDGF/VEGF growth factor",
    url: "https://targets.adaptyvbio.com/protein/c8dd6dbd-e1c0-50b3-b22e-e0c8d146d51b",
  },
];

function productUrl(vendor: string, catalog: string): string {
  const slug = vendor.toLowerCase().startsWith("acro") ? "Acro"
    : vendor.toLowerCase().startsWith("sino") ? "Sino"
    : vendor.toLowerCase().startsWith("biotechne") ? "Biotechne"
    : vendor;
  return `https://targets.adaptyvbio.com/product/${slug}/${catalog}`;
}

interface FallbackProduct {
  vendor: string;
  catalog_number: string;
  tags: string[];
  expression_system: string;
  url: string;
}

interface FallbackDetailData {
  sequence_length: number;
  molecular_weight: string;
  subcellular_locations: string[];
  description: string;
  products: FallbackProduct[];
}

const DETAILS_BY_ID: Record<string, FallbackDetailData> = {
  "comp-egfr-human": {
    sequence_length: 1210,
    molecular_weight: "134 kDa",
    subcellular_locations: ["Cell membrane"],
    description: "Receptor tyrosine kinase that binds EGF family ligands. Key oncology target overexpressed in many solid tumors. Binding domain (extracellular domain III) is the primary epitope for therapeutic antibodies like cetuximab.",
    products: [
      { vendor: "Acro Biosystems", catalog_number: "EGR-H5222", tags: ["His Tag", "ECD"], expression_system: "HEK293", url: productUrl("Acro Biosystems", "EGR-H5222") },
      { vendor: "Sino Biological", catalog_number: "10001-H08H", tags: ["His Tag", "ECD"], expression_system: "HEK293", url: productUrl("Sino Biological", "10001-H08H") },
    ],
  },
  "comp-her2-human": {
    sequence_length: 1255,
    molecular_weight: "138 kDa",
    subcellular_locations: ["Cell membrane"],
    description: "Receptor tyrosine kinase with no known ligand that heterodimerizes with other ErbB family members. Overexpressed in ~20% of breast cancers. Target of trastuzumab (Herceptin) and pertuzumab.",
    products: [
      { vendor: "Acro Biosystems", catalog_number: "HE2-H5225", tags: ["His Tag", "ECD"], expression_system: "HEK293", url: productUrl("Acro Biosystems", "HE2-H5225") },
      { vendor: "Sino Biological", catalog_number: "10004-H08H", tags: ["His Tag", "ECD"], expression_system: "HEK293", url: productUrl("Sino Biological", "10004-H08H") },
    ],
  },
  "comp-il7r-human": {
    sequence_length: 459,
    molecular_weight: "50.5 kDa",
    subcellular_locations: ["Cell membrane"],
    description: "Alpha chain of the interleukin-7 receptor. Critical for T-cell and B-cell development. Gain-of-function mutations implicated in T-cell acute lymphoblastic leukemia (T-ALL).",
    products: [
      { vendor: "Acro Biosystems", catalog_number: "IL7-H5229", tags: ["His Tag", "ECD"], expression_system: "HEK293", url: productUrl("Acro Biosystems", "IL7-H5229") },
    ],
  },
  "comp-pdl1-human": {
    sequence_length: 290,
    molecular_weight: "33.3 kDa",
    subcellular_locations: ["Cell membrane"],
    description: "Immune checkpoint ligand that binds PD-1 receptor on T cells to suppress anti-tumor immunity. Target of atezolizumab, durvalumab, and avelumab. One of the most important immuno-oncology targets.",
    products: [
      { vendor: "Acro Biosystems", catalog_number: "PD1-H5229", tags: ["His Tag", "ECD"], expression_system: "HEK293", url: productUrl("Acro Biosystems", "PD1-H5229") },
      { vendor: "Biotechne", catalog_number: "9049-B7", tags: ["Fc Tag", "ECD"], expression_system: "CHO", url: productUrl("Biotechne", "9049-B7") },
    ],
  },
  "comp-tnf-human": {
    sequence_length: 233,
    molecular_weight: "17.4 kDa",
    subcellular_locations: ["Secreted", "Cell membrane"],
    description: "Pro-inflammatory cytokine that mediates systemic inflammation. Exists as a homotrimer. Target of adalimumab (Humira), infliximab (Remicade), and etanercept. One of the best-selling drug target classes globally.",
    products: [
      { vendor: "Acro Biosystems", catalog_number: "TNA-H5228", tags: ["His Tag"], expression_system: "E. coli", url: productUrl("Acro Biosystems", "TNA-H5228") },
      { vendor: "Sino Biological", catalog_number: "10602-HNAE", tags: ["His Tag"], expression_system: "E. coli", url: productUrl("Sino Biological", "10602-HNAE") },
    ],
  },
  "comp-vegfa-human": {
    sequence_length: 412,
    molecular_weight: "46.5 kDa (homodimer)",
    subcellular_locations: ["Secreted"],
    description: "Vascular endothelial growth factor that drives angiogenesis. Key target in oncology (bevacizumab/Avastin) and ophthalmology (ranibizumab, aflibercept). Functions as disulfide-linked homodimer.",
    products: [
      { vendor: "Acro Biosystems", catalog_number: "VE5-H4210", tags: ["His Tag"], expression_system: "HEK293", url: productUrl("Acro Biosystems", "VE5-H4210") },
      { vendor: "Biotechne", catalog_number: "293-VE", tags: ["Carrier-free"], expression_system: "CHO", url: productUrl("Biotechne", "293-VE") },
    ],
  },
};

const FALLBACK_TARGET_DETAILS: Record<string, TargetDetail> = Object.fromEntries(
  FALLBACK_TARGETS.map((t) => {
    const detail = DETAILS_BY_ID[t.id];
    return [
      t.id,
      {
        ...t,
        details: {
          sequence_length: detail.sequence_length,
          molecular_weight: detail.molecular_weight,
          subcellular_locations: detail.subcellular_locations,
          description: detail.description,
          products: detail.products,
        },
      },
    ];
  })
);

export function filterFallbackTargets(search: string) {
  if (!search) {
    return FALLBACK_TARGETS;
  }

  const query = search.toLowerCase();
  return FALLBACK_TARGETS.filter(
    (target) =>
      target.name.toLowerCase().includes(query) ||
      target.gene_names.some((g) => g.toLowerCase().includes(query)) ||
      target.organism.toLowerCase().includes(query) ||
      target.family.toLowerCase().includes(query)
  );
}

export function getFallbackTargetDetail(id: string) {
  return FALLBACK_TARGET_DETAILS[id] ?? null;
}
