import type { ExperimentInfo, AffinityResult } from "./api-types";

export const MOCK_EXPERIMENT_RESPONSE = {
  experiment_id: "019d4a2b-3c5e-7890-abcd-1234567890ab",
  error: null,
};

export const PRESET_TARGETS = [
  {
    id: "019a03da-b87f-7e62-9ba1-7b776b7c8eb3",
    name: "Canine HER2 / ErbB2 Protein (His Tag)",
    gene: "ERBB2",
  },
  {
    id: "019a03da-b87f-7546-9184-8b5637390104",
    name: "Canine BLyS / TNFSF13B / BAFF Protein (Fc Tag)",
    gene: "TNFSF13B",
  },
  {
    id: "019a03da-b87f-7b5c-a2ed-eeeef034252d",
    name: "Canine PD-L1 / B7-H1 / CD274 Protein (ECD, Fc Tag)",
    gene: "CD274",
  },
  {
    id: "019a03da-b87f-7dd7-843f-566bbe08b5c7",
    name: "Cynomolgus IL-6 Protein, His Tag",
    gene: "IL6",
  },
  {
    id: "019a03da-b87f-7cb5-8896-3c6887a2b39f",
    name: "Cynomolgus VEGFR2 / Flk-1 / CD309 Protein (His Tag)",
    gene: "VEGFR2",
  },
];

const BASE_DATE = new Date("2026-03-01T10:00:00Z");

function addDays(date: Date, days: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export const LIFECYCLE_STAGES: ExperimentInfo[] = [
  {
    id: "019d4a2b-3c5e-7890-abcd-1234567890ab",
    name: "Anti-HER2 Affinity Screen",
    code: "ABS-001-042",
    status: "draft",
    experiment_spec: {
      experiment_type: "affinity",
      target_id: "her2-uuid",
      sequences: { "VHH-A1": "EVQLVESGGGLVQPGG..." },
      n_replicates: 2,
    },
    created_at: addDays(BASE_DATE, 0),
    results_status: "none",
    experiment_url: "https://foundry.adaptyvbio.com/organization/abs/experiment/019d4a2b",
    costs: {
      type: "estimate",
      breakdown: {
        pricing_version: "v1_2026-01-20",
        assay: { experiment_type: "affinity", subtotal_cents: 39800 },
        total_cents: 43298,
      },
    },
  },
  {
    id: "019d4a2b-3c5e-7890-abcd-1234567890ab",
    name: "Anti-HER2 Affinity Screen",
    code: "ABS-001-042",
    status: "waiting_for_confirmation",
    experiment_spec: {
      experiment_type: "affinity",
      target_id: "her2-uuid",
      sequences: { "VHH-A1": "EVQLVESGGGLVQPGG..." },
      n_replicates: 2,
    },
    created_at: addDays(BASE_DATE, 0),
    results_status: "none",
    experiment_url: "https://foundry.adaptyvbio.com/organization/abs/experiment/019d4a2b",
    costs: {
      type: "estimate",
      breakdown: {
        pricing_version: "v1_2026-01-20",
        assay: { experiment_type: "affinity", subtotal_cents: 39800 },
        total_cents: 43298,
      },
    },
  },
  {
    id: "019d4a2b-3c5e-7890-abcd-1234567890ab",
    name: "Anti-HER2 Affinity Screen",
    code: "ABS-001-042",
    status: "waiting_for_materials",
    experiment_spec: {
      experiment_type: "affinity",
      target_id: "her2-uuid",
      sequences: { "VHH-A1": "EVQLVESGGGLVQPGG..." },
      n_replicates: 2,
    },
    created_at: addDays(BASE_DATE, 0),
    results_status: "none",
    experiment_url: "https://foundry.adaptyvbio.com/organization/abs/experiment/019d4a2b",
    costs: {
      type: "confirmed",
      breakdown: {
        pricing_version: "v1_2026-01-20",
        assay: { experiment_type: "affinity", subtotal_cents: 39800 },
        total_cents: 43298,
      },
    },
  },
  {
    id: "019d4a2b-3c5e-7890-abcd-1234567890ab",
    name: "Anti-HER2 Affinity Screen",
    code: "ABS-001-042",
    status: "in_production",
    experiment_spec: {
      experiment_type: "affinity",
      target_id: "her2-uuid",
      sequences: { "VHH-A1": "EVQLVESGGGLVQPGG..." },
      n_replicates: 2,
    },
    created_at: addDays(BASE_DATE, 0),
    results_status: "none",
    experiment_url: "https://foundry.adaptyvbio.com/organization/abs/experiment/019d4a2b",
    costs: {
      type: "confirmed",
      breakdown: {
        pricing_version: "v1_2026-01-20",
        assay: { experiment_type: "affinity", subtotal_cents: 39800 },
        total_cents: 43298,
      },
    },
  },
  {
    id: "019d4a2b-3c5e-7890-abcd-1234567890ab",
    name: "Anti-HER2 Affinity Screen",
    code: "ABS-001-042",
    status: "data_analysis",
    experiment_spec: {
      experiment_type: "affinity",
      target_id: "her2-uuid",
      sequences: { "VHH-A1": "EVQLVESGGGLVQPGG..." },
      n_replicates: 2,
    },
    created_at: addDays(BASE_DATE, 0),
    results_status: "processing",
    experiment_url: "https://foundry.adaptyvbio.com/organization/abs/experiment/019d4a2b",
    costs: {
      type: "confirmed",
      breakdown: {
        pricing_version: "v1_2026-01-20",
        assay: { experiment_type: "affinity", subtotal_cents: 39800 },
        total_cents: 43298,
      },
    },
  },
  {
    id: "019d4a2b-3c5e-7890-abcd-1234567890ab",
    name: "Anti-HER2 Affinity Screen",
    code: "ABS-001-042",
    status: "in_review",
    experiment_spec: {
      experiment_type: "affinity",
      target_id: "her2-uuid",
      sequences: { "VHH-A1": "EVQLVESGGGLVQPGG..." },
      n_replicates: 2,
    },
    created_at: addDays(BASE_DATE, 0),
    results_status: "available",
    experiment_url: "https://foundry.adaptyvbio.com/organization/abs/experiment/019d4a2b",
    costs: {
      type: "confirmed",
      breakdown: {
        pricing_version: "v1_2026-01-20",
        assay: { experiment_type: "affinity", subtotal_cents: 39800 },
        total_cents: 43298,
      },
    },
  },
  {
    id: "019d4a2b-3c5e-7890-abcd-1234567890ab",
    name: "Anti-HER2 Affinity Screen",
    code: "ABS-001-042",
    status: "done",
    experiment_spec: {
      experiment_type: "affinity",
      target_id: "her2-uuid",
      sequences: { "VHH-A1": "EVQLVESGGGLVQPGG..." },
      n_replicates: 2,
    },
    created_at: addDays(BASE_DATE, 0),
    results_status: "available",
    experiment_url: "https://foundry.adaptyvbio.com/organization/abs/experiment/019d4a2b",
    costs: {
      type: "final",
      breakdown: {
        pricing_version: "v1_2026-01-20",
        assay: { experiment_type: "affinity", subtotal_cents: 39800 },
        total_cents: 43298,
      },
    },
  },
];

export const MOCK_RESULTS: AffinityResult[] = [
  { sequence_id: "seq-1", sequence_name: "VHH-A1", kd: 2.3e-10, kon: 1.8e6, koff: 4.1e-4, binding_strength: "strong", r_squared: 0.998 },
  { sequence_id: "seq-2", sequence_name: "VHH-B2", kd: 8.1e-9, kon: 5.2e5, koff: 4.2e-3, binding_strength: "medium", r_squared: 0.995 },
  { sequence_id: "seq-3", sequence_name: "VHH-C3", kd: 1.5e-7, kon: 2.1e4, koff: 3.2e-3, binding_strength: "weak", r_squared: 0.982 },
  { sequence_id: "seq-4", sequence_name: "VHH-D4", kd: 4.7e-10, kon: 1.2e6, koff: 5.6e-4, binding_strength: "strong", r_squared: 0.997 },
  { sequence_id: "seq-5", sequence_name: "VHH-E5", kd: 3.2e-8, kon: 8.4e4, koff: 2.7e-3, binding_strength: "medium", r_squared: 0.991 },
  { sequence_id: "seq-6", sequence_name: "VHH-F6", kd: 9.8e-6, kon: 1.1e3, koff: 1.1e-2, binding_strength: "non_binder", r_squared: 0.943 },
  { sequence_id: "seq-7", sequence_name: "VHH-G7", kd: 6.4e-11, kon: 3.5e6, koff: 2.2e-4, binding_strength: "strong", r_squared: 0.999 },
  { sequence_id: "seq-8", sequence_name: "VHH-H8", kd: 2.1e-7, kon: 1.9e4, koff: 4.0e-3, binding_strength: "weak", r_squared: 0.978 },
];
