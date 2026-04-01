import type {
  AffinityResult,
  BindingStrength,
  ExperimentInfo,
  ResultsResponse,
} from "./api-types";

// ─── Consistent Demo Data Model ───────────────────────────────────────────
// All sections reference the same experiment for coherence:
//   Experiment: "Anti-HER2 VHH Binding Screen"
//   Code: ABS-001-042
//   Type: screening (BLI)
//   Target: Canine HER2 / ErbB2 (His Tag)
//   20 VHH sequences → binding data with KD values

export const DEMO_EXPERIMENT_ID = "019d4a2b-3c5e-7890-abcd-1234567890ab";
export const DEMO_EXPERIMENT_CODE = "ABS-001-042";
export const DEMO_TARGET_ID = "019a03da-b87f-7e62-9ba1-7b776b7c8eb3";
export const DEMO_TARGET_NAME = "Canine HER2 / ErbB2 Protein (His Tag)";

// ─── Experiment Types ─────────────────────────────────────────────────────

export interface ExperimentType {
  type: string;
  label: string;
  description: string;
  requiresTarget: boolean;
  methods: string[];
  dataReturned: string;
}

export const EXPERIMENT_TYPES: ExperimentType[] = [
  {
    type: "expression",
    label: "Expression",
    description: "Test whether your protein sequences can be expressed. Get yield and purity data for each construct.",
    requiresTarget: false,
    methods: [],
    dataReturned: "Expression yield, purity (CE-SDS / HPLC-SEC)",
  },
  {
    type: "screening",
    label: "Binding Screening",
    description: "Screen your sequences against a target protein via BLI or SPR. Identify which candidates bind, rank them by strength, and get KD values from two-concentration binding.",
    requiresTarget: true,
    methods: [],
    dataReturned: "Binding yes/no, qualitative strength, KD values",
  },
  {
    type: "affinity",
    label: "Affinity Characterization",
    description: "Measure precise binding kinetics via BLI or SPR for your best candidates. Get full kinetic curves with KD, kon, and koff values.",
    requiresTarget: true,
    methods: [],
    dataReturned: "KD, kon, koff, sensorgrams, curve fits",
  },
  {
    type: "thermostability",
    label: "Thermostability",
    description: "Assess thermal stability of your proteins using nanoDSF. Get melting temperature and aggregation onset data.",
    requiresTarget: false,
    methods: [],
    dataReturned: "Tm, Tagg, Tonset, quality score",
  },
  {
    type: "fluorescence",
    label: "Fluorescence",
    description: "Measure intrinsic or engineered fluorescence properties. Characterize fluorescent fusion proteins.",
    requiresTarget: false,
    methods: [],
    dataReturned: "Fluorescence intensity, emission spectra",
  },
];

// ─── Preset Targets (for dropdowns) ──────────────────────────────────────

export const PRESET_TARGETS = [
  {
    id: "019a03da-b87f-7e62-9ba1-7b776b7c8eb3",
    name: "Canine HER2 / ErbB2 Protein (His Tag)",
    gene: "ERBB2",
    vendor: "Acro Biosystems",
    price_cents: 1749,
  },
  {
    id: "019a03da-b87f-7546-9184-8b5637390104",
    name: "Canine BLyS / TNFSF13B / BAFF Protein (Fc Tag)",
    gene: "TNFSF13B",
    vendor: "Acro Biosystems",
    price_cents: 1749,
  },
  {
    id: "019a03da-b87f-7b5c-a2ed-eeeef034252d",
    name: "Canine PD-L1 / B7-H1 / CD274 Protein (ECD, Fc Tag)",
    gene: "CD274",
    vendor: "Sino Biological",
    price_cents: 1499,
  },
  {
    id: "019a03da-b87f-7dd7-843f-566bbe08b5c7",
    name: "Cynomolgus IL-6 Protein (His Tag)",
    gene: "IL6",
    vendor: "Acro Biosystems",
    price_cents: 1749,
  },
  {
    id: "019a03da-b87f-7cb5-8896-3c6887a2b39f",
    name: "Cynomolgus VEGFR2 / Flk-1 / CD309 Protein (His Tag)",
    gene: "VEGFR2",
    vendor: "Sino Biological",
    price_cents: 1499,
  },
];

// ─── 20 VHH Sequences ────────────────────────────────────────────────────
// Realistic nanobody sequences (~120 aa) with varied CDR3 loops.
// 19 test + 1 control (Trastuzumab-derived scFv fragment)

const VHH_FRAMEWORK_PRE = "EVQLVESGGGLVQPGGSLRLSCAAS";
const VHH_FRAMEWORK_MID = "WVRQAPGKGLEWVS";
const VHH_FRAMEWORK_POST = "RFTISRDNSKNTLYLQMNSLRAEDTAVYYCAK";
const VHH_FRAMEWORK_END = "WGQGTLVTVSS";

function makeVHH(cdr1: string, cdr2: string, cdr3: string): string {
  return VHH_FRAMEWORK_PRE + cdr1 + VHH_FRAMEWORK_MID + cdr2 + VHH_FRAMEWORK_POST + cdr3 + VHH_FRAMEWORK_END;
}

export interface DemoSequence {
  name: string;
  sequence: string;
  isControl: boolean;
}

export const DEMO_SEQUENCES: DemoSequence[] = [
  { name: "VHH-01", sequence: makeVHH("GFTFSNYAMS", "AISGSGGSTY", "DLRGPTYDSSWYR"), isControl: false },
  { name: "VHH-02", sequence: makeVHH("GRTFSSYPMH", "YISPSGGFTY", "AGSYWPLERDY"), isControl: false },
  { name: "VHH-03", sequence: makeVHH("GFTFDDYAIS", "GISWNSGSIG", "RGVRAEDGGYLDY"), isControl: false },
  { name: "VHH-04", sequence: makeVHH("GFTFSRYWIG", "EINQSGSTNF", "RPLYSNWMEDY"), isControl: false },
  { name: "VHH-05", sequence: makeVHH("GSIFSINAMI", "HISPDGSETY", "NARSYTTSYPDY"), isControl: false },
  { name: "VHH-06", sequence: makeVHH("GRTFSLYAMG", "AISGSGGRTF", "DLWYDSSGYRP"), isControl: false },
  { name: "VHH-07", sequence: makeVHH("GFTFSSYWMS", "RIKSKTDGGT", "TVTTASAYFDY"), isControl: false },
  { name: "VHH-08", sequence: makeVHH("GFTFSDHAMS", "TISMSGGFSY", "DLPTYWGQSYYR"), isControl: false },
  { name: "VHH-09", sequence: makeVHH("GFTFRNYAMS", "AISSSGRSTY", "NWQSGFDY"), isControl: false },
  { name: "VHH-10", sequence: makeVHH("GLTFSNYAMN", "SISVGGSTYY", "RGFPYDSSWYR"), isControl: false },
  { name: "VHH-11", sequence: makeVHH("GFTFSKYAMS", "GISASGGSTF", "ARWGDDYFDY"), isControl: false },
  { name: "VHH-12", sequence: makeVHH("GYTFTRYWMH", "NIKPSDSETY", "DPMGYYYGMDV"), isControl: false },
  { name: "VHH-13", sequence: makeVHH("GFTFSRHWMS", "YINPSGGSTN", "SRGWSSAYFDY"), isControl: false },
  { name: "VHH-14", sequence: makeVHH("GFTFADYAMS", "GISWSSGSIG", "DGYYESYGMDV"), isControl: false },
  { name: "VHH-15", sequence: makeVHH("GRTISSYPMH", "YISPAGGFTY", "VRSYWDPLERDY"), isControl: false },
  { name: "VHH-16", sequence: makeVHH("GFTFSEYAMS", "AISGTGGSTY", "ELPGRYDR"), isControl: false },
  { name: "VHH-17", sequence: makeVHH("GFTFSPYAMG", "RISRSGGSTF", "GYDWPTYRDY"), isControl: false },
  { name: "VHH-18", sequence: makeVHH("GFTFSHYWMS", "RIKSSTDGGT", "SSGSYYGMDV"), isControl: false },
  { name: "VHH-19", sequence: makeVHH("GFTFSSYAMS", "YISPSGGSTY", "DRWGDDYFDY"), isControl: false },
  {
    name: "Ctrl-Tras",
    sequence: "DIQMTQSPSSLSASVGDRVTITCRASQDVNTAVAWYQQKPGKAPKLLIYSASFLYSGVPSRFSGSRSGTDFTLTISSLQPEDFATYYCQQHYTTPPTFGQGTKVEIK",
    isControl: true,
  },
];

// Build a sequences map for API requests
export function buildSequencesMap(
  sequences: DemoSequence[] = DEMO_SEQUENCES
): Record<string, string> {
  return Object.fromEntries(
    sequences.map(({ name, sequence }) => [name, sequence])
  );
}

export const DEMO_SEQUENCES_MAP = buildSequencesMap();

// ─── Binding Results (20 sequences) ──────────────────────────────────────
// KD values range from ~0.8 nM (strong) to non-binder
// Control (Ctrl-Tras) at 156 nM
// Inverted log scale: higher -log10(KD) = better binder

interface DemoResultFixture extends AffinityResult {
  sequence_name: DemoSequence["name"];
  binding_strength: BindingStrength;
}

export const DEMO_RESULTS = [
  // Strong binders (KD < 5 nM) — varied gaps
  { sequence_id: "seq-01", sequence_name: "VHH-01", kd: 8.1e-10, kon: 2.4e6, koff: 1.9e-3, binding_strength: "strong", r_squared: 0.999 },
  { sequence_id: "seq-02", sequence_name: "VHH-02", kd: 9.4e-10, kon: 2.1e6, koff: 2.0e-3, binding_strength: "strong", r_squared: 0.998 },
  { sequence_id: "seq-03", sequence_name: "VHH-03", kd: 2.5e-9, kon: 1.4e6, koff: 3.5e-3, binding_strength: "strong", r_squared: 0.997 },
  { sequence_id: "seq-04", sequence_name: "VHH-04", kd: 4.7e-9, kon: 9.8e5, koff: 4.6e-3, binding_strength: "strong", r_squared: 0.996 },
  // Medium binders (5-50 nM) — bigger jumps
  { sequence_id: "seq-05", sequence_name: "VHH-05", kd: 6.1e-9, kon: 7.4e5, koff: 4.5e-3, binding_strength: "medium", r_squared: 0.994 },
  { sequence_id: "seq-06", sequence_name: "VHH-06", kd: 1.4e-8, kon: 4.5e5, koff: 6.3e-3, binding_strength: "medium", r_squared: 0.993 },
  { sequence_id: "seq-07", sequence_name: "VHH-07", kd: 1.5e-8, kon: 3.8e5, koff: 5.7e-3, binding_strength: "medium", r_squared: 0.991 },
  { sequence_id: "seq-08", sequence_name: "VHH-08", kd: 4.2e-8, kon: 2.1e5, koff: 8.8e-3, binding_strength: "medium", r_squared: 0.988 },
  // Weak binders (50-500 nM)
  { sequence_id: "seq-09", sequence_name: "VHH-09", kd: 7.8e-8, kon: 1.5e5, koff: 1.2e-2, binding_strength: "weak", r_squared: 0.982 },
  { sequence_id: "seq-10", sequence_name: "VHH-10", kd: 9.3e-8, kon: 1.1e5, koff: 1.0e-2, binding_strength: "weak", r_squared: 0.978 },
  // Control (156 nM)
  { sequence_id: "seq-ctrl", sequence_name: "Ctrl-Tras", kd: 1.56e-7, kon: 7.1e4, koff: 1.1e-2, binding_strength: "weak", r_squared: 0.975 },
  { sequence_id: "seq-11", sequence_name: "VHH-11", kd: 3.1e-7, kon: 3.6e4, koff: 1.1e-2, binding_strength: "weak", r_squared: 0.971 },
  { sequence_id: "seq-12", sequence_name: "VHH-12", kd: 5.8e-7, kon: 2.2e4, koff: 1.3e-2, binding_strength: "weak", r_squared: 0.963 },
  // Very weak / non-binders
  { sequence_id: "seq-13", sequence_name: "VHH-13", kd: 1.1e-6, kon: 1.0e4, koff: 1.1e-2, binding_strength: "non_binder", r_squared: 0.951 },
  { sequence_id: "seq-14", sequence_name: "VHH-14", kd: 2.7e-6, kon: 5.3e3, koff: 1.4e-2, binding_strength: "non_binder", r_squared: 0.942 },
  { sequence_id: "seq-15", sequence_name: "VHH-15", kd: 4.1e-6, kon: 3.8e3, koff: 1.6e-2, binding_strength: "non_binder", r_squared: 0.928 },
  // No measurable binding
  { sequence_id: "seq-16", sequence_name: "VHH-16", kd: null, kon: null, koff: null, binding_strength: "non_binder", r_squared: null },
  { sequence_id: "seq-17", sequence_name: "VHH-17", kd: null, kon: null, koff: null, binding_strength: "non_binder", r_squared: null },
  { sequence_id: "seq-18", sequence_name: "VHH-18", kd: null, kon: null, koff: null, binding_strength: "non_binder", r_squared: null },
  // No expression
  { sequence_id: "seq-19", sequence_name: "VHH-19", kd: null, kon: null, koff: null, binding_strength: "no_expression", r_squared: null },
] satisfies DemoResultFixture[];

function countBindingStrength(bindingStrength: BindingStrength) {
  return DEMO_RESULTS.filter((result) => result.binding_strength === bindingStrength).length;
}

const DEMO_RESULT_COUNTS = {
  strong: countBindingStrength("strong"),
  medium: countBindingStrength("medium"),
  weak: countBindingStrength("weak"),
  non_binder: countBindingStrength("non_binder"),
  no_expression: countBindingStrength("no_expression"),
};

// ─── Experiment Updates (auto-animated timeline) ─────────────────────────

export interface DemoUpdate {
  id: string;
  experiment_id: string;
  experiment_code: string;
  type: string;
  title: string;
  content: string;
  status: string;
  timestamp: string;
}

// Offsets in hours from "now" for the demo timeline
const DEMO_UPDATE_OFFSETS_HOURS = [0, 1, 3, 72, 168, 336, 360, 384, 408];

export interface DemoUpdateTemplate {
  id: string;
  experiment_id: string;
  experiment_code: string;
  type: string;
  title: string;
  content: string;
  status: string;
  offsetHours: number;
}

const DEMO_UPDATE_TEMPLATES: DemoUpdateTemplate[] = [
  {
    id: "upd-01",
    experiment_id: DEMO_EXPERIMENT_ID,
    experiment_code: DEMO_EXPERIMENT_CODE,
    type: "status_change",
    title: "Experiment created",
    content: "Your experiment ABS-001-042 has been created with 20 sequences targeting HER2.",
    status: "draft",
    offsetHours: DEMO_UPDATE_OFFSETS_HOURS[0],
  },
  {
    id: "upd-02",
    experiment_id: DEMO_EXPERIMENT_ID,
    experiment_code: DEMO_EXPERIMENT_CODE,
    type: "quote",
    title: "Quote sent — $2,849.00",
    content: "A quote for 20 sequences × $99/seq + $869 materials has been sent for your approval.",
    status: "waiting_for_confirmation",
    offsetHours: DEMO_UPDATE_OFFSETS_HOURS[1],
  },
  {
    id: "upd-03",
    experiment_id: DEMO_EXPERIMENT_ID,
    experiment_code: DEMO_EXPERIMENT_CODE,
    type: "status_change",
    title: "Quote accepted",
    content: "You've confirmed the experiment. We're ordering target materials now.",
    status: "waiting_for_materials",
    offsetHours: DEMO_UPDATE_OFFSETS_HOURS[2],
  },
  {
    id: "upd-04",
    experiment_id: DEMO_EXPERIMENT_ID,
    experiment_code: DEMO_EXPERIMENT_CODE,
    type: "status_change",
    title: "Materials received",
    content: "HER2 target protein received. Starting gene synthesis for your 20 VHH sequences.",
    status: "in_production",
    offsetHours: DEMO_UPDATE_OFFSETS_HOURS[3],
  },
  {
    id: "upd-05",
    experiment_id: DEMO_EXPERIMENT_ID,
    experiment_code: DEMO_EXPERIMENT_CODE,
    type: "lab_update",
    title: "Gene synthesis complete",
    content: "All 20 DNA constructs synthesized successfully. Moving to expression.",
    status: "in_production",
    offsetHours: DEMO_UPDATE_OFFSETS_HOURS[4],
  },
  {
    id: "upd-06",
    experiment_id: DEMO_EXPERIMENT_ID,
    experiment_code: DEMO_EXPERIMENT_CODE,
    type: "lab_update",
    title: "Expression & purification complete",
    content: `${DEMO_SEQUENCES.length - DEMO_RESULT_COUNTS.no_expression} of ${DEMO_SEQUENCES.length} sequences expressed. VHH-19 showed no detectable expression. Proceeding with 19 candidates + 1 control.`,
    status: "in_production",
    offsetHours: DEMO_UPDATE_OFFSETS_HOURS[5],
  },
  {
    id: "upd-07",
    experiment_id: DEMO_EXPERIMENT_ID,
    experiment_code: DEMO_EXPERIMENT_CODE,
    type: "status_change",
    title: "BLI measurement in progress",
    content: "Running binding kinetics on the Gator BLI instrument. Estimated completion: 4 hours.",
    status: "data_analysis",
    offsetHours: DEMO_UPDATE_OFFSETS_HOURS[6],
  },
  {
    id: "upd-08",
    experiment_id: DEMO_EXPERIMENT_ID,
    experiment_code: DEMO_EXPERIMENT_CODE,
    type: "status_change",
    title: "Data analysis complete",
    content: `Kinetic fits processed. ${DEMO_RESULT_COUNTS.strong} strong binders identified (KD < 5 nM). Results under review.`,
    status: "in_review",
    offsetHours: DEMO_UPDATE_OFFSETS_HOURS[7],
  },
  {
    id: "upd-09",
    experiment_id: DEMO_EXPERIMENT_ID,
    experiment_code: DEMO_EXPERIMENT_CODE,
    type: "results",
    title: "Results published",
    content: `Your binding data is ready. ${DEMO_RESULT_COUNTS.strong} strong binders, ${DEMO_RESULT_COUNTS.medium} medium, ${DEMO_RESULT_COUNTS.weak} weak, ${DEMO_RESULT_COUNTS.non_binder} non-binders, ${DEMO_RESULT_COUNTS.no_expression} no expression. Data package available for download.`,
    status: "done",
    offsetHours: DEMO_UPDATE_OFFSETS_HOURS[8],
  },
];

/** Build demo updates with timestamps relative to the given base time */
export function buildDemoUpdates(baseTime: Date): DemoUpdate[] {
  return DEMO_UPDATE_TEMPLATES.map((t) => ({
    id: t.id,
    experiment_id: t.experiment_id,
    experiment_code: t.experiment_code,
    type: t.type,
    title: t.title,
    content: t.content,
    status: t.status,
    timestamp: new Date(baseTime.getTime() + t.offsetHours * 3600000).toISOString(),
  }));
}

// Legacy export for static contexts — uses a fixed base
export const DEMO_UPDATES: DemoUpdate[] = buildDemoUpdates(new Date("2026-03-01T10:00:00Z"));

// ─── Lifecycle Stages (for the create experiment response) ───────────────

const DEMO_EXPERIMENT_NAME = "Anti-HER2 VHH Binding Screen";
const DEMO_CREATED_AT = addHours(BASE_DATE, 0);
const DEMO_EXPERIMENT_URL = `https://foundry.adaptyvbio.com/organization/demo/experiment/${DEMO_EXPERIMENT_ID}`;
const DEMO_DATA_PACKAGE_URL = `https://s3.amazonaws.com/adaptyv-foundry-results/${DEMO_EXPERIMENT_CODE}/data-package.zip`;
const DEMO_SEQUENCE_COUNT = DEMO_SEQUENCES.length;
const DEMO_PRICE_PER_SEQUENCE_CENTS = 9900;
const DEMO_MATERIAL_PRICE_PER_SEQUENCE_CENTS = 1749;

const DEMO_EXPERIMENT_SPEC: ExperimentInfo["experiment_spec"] = {
  experiment_type: "screening",
  method: "bli",
  target_id: DEMO_TARGET_ID,
  sequences: DEMO_SEQUENCES_MAP,
  n_replicates: 1,
};

const DEMO_EXPERIMENT_BASE: Omit<ExperimentInfo, "status"> = {
  id: DEMO_EXPERIMENT_ID,
  code: DEMO_EXPERIMENT_CODE,
  name: DEMO_EXPERIMENT_NAME,
  experiment_spec: DEMO_EXPERIMENT_SPEC,
  created_at: DEMO_CREATED_AT,
  experiment_url: DEMO_EXPERIMENT_URL,
};

const DEMO_COST_BREAKDOWN = {
  pricing_version: "v1_2026-01-20",
  assay: {
    experiment_type: DEMO_EXPERIMENT_SPEC.experiment_type,
    sequence_count: DEMO_SEQUENCE_COUNT,
    n_replicates: DEMO_EXPERIMENT_SPEC.n_replicates ?? 1,
    unit_price_cents: DEMO_PRICE_PER_SEQUENCE_CENTS,
    subtotal_cents: DEMO_SEQUENCE_COUNT * DEMO_PRICE_PER_SEQUENCE_CENTS,
  },
  materials: {
    target_id: DEMO_TARGET_ID,
    target_name: DEMO_TARGET_NAME,
    sequence_count: DEMO_SEQUENCE_COUNT,
    price_per_sequence_cents: DEMO_MATERIAL_PRICE_PER_SEQUENCE_CENTS,
    subtotal_cents: DEMO_SEQUENCE_COUNT * DEMO_MATERIAL_PRICE_PER_SEQUENCE_CENTS,
  },
  total_cents:
    DEMO_SEQUENCE_COUNT * DEMO_PRICE_PER_SEQUENCE_CENTS +
    DEMO_SEQUENCE_COUNT * DEMO_MATERIAL_PRICE_PER_SEQUENCE_CENTS,
};

export const MOCK_CREATE_RESPONSE: ExperimentInfo = {
  ...DEMO_EXPERIMENT_BASE,
  status: "draft",
  costs: {
    type: "estimate",
    breakdown: DEMO_COST_BREAKDOWN,
  },
};

// Full experiment response (for results section)
export const MOCK_EXPERIMENT_FULL: ExperimentInfo & {
  data_package_url: string;
} = {
  ...DEMO_EXPERIMENT_BASE,
  status: "done",
  results_status: "available",
  data_package_url: DEMO_DATA_PACKAGE_URL,
};

// Mock results API response
export const MOCK_RESULTS_RESPONSE: ResultsResponse = {
  items: DEMO_RESULTS.map((r) => ({
    id: r.sequence_id,
    sequence_id: r.sequence_id,
    sequence_name: r.sequence_name,
    target_id: DEMO_TARGET_ID,
    target_name: DEMO_TARGET_NAME,
    experiment_id: DEMO_EXPERIMENT_ID,
    experiment_code: DEMO_EXPERIMENT_CODE,
    kd: r.kd,
    kd_units: "M",
    kon: r.kon,
    koff: r.koff,
    binding_strength: r.binding_strength,
    r_squared: r.r_squared,
    n_replicates: 1,
    is_control: r.sequence_name === "Ctrl-Tras",
  })),
  total: DEMO_RESULTS.length,
  count: DEMO_RESULTS.length,
  offset: 0,
  data_package_url: DEMO_DATA_PACKAGE_URL,
};
