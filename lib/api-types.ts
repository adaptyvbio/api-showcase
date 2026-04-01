export interface Target {
  id: string;
  name: string;
  vendor_name: string;
  catalog_number: string;
  url: string;
  pricing: {
    type: string;
    price_per_sequence_cents: number;
  };
  uniprot_id: string;
}

export interface TargetDetail extends Target {
  details: {
    gene_names: string[];
    organism: string;
    expression_system: string;
    sequence: string;
    sequence_length: number;
    family: string;
    subcellular_locations: string[];
    tags: string[];
    molecular_weight: string;
    description: string;
  };
}

export interface TargetsResponse {
  items: Target[];
  total: number;
  count: number;
  offset: number;
}

export interface ExperimentSpec {
  experiment_type: string;
  target_id?: string | null;
  sequences: Record<string, string>;
  method?: string;
  n_replicates?: number;
  antigen_concentrations?: number[];
  parameters?: Record<string, unknown>;
}

export interface CostEstimateRequest {
  experiment_spec: ExperimentSpec;
}

export interface CostEstimateResponse {
  breakdown: {
    pricing_version: string;
    assay: {
      experiment_type: string;
      sequence_count: number;
      n_replicates: number;
      unit_price_cents: number;
      replicate_price_cents: number;
      subtotal_cents: number;
    };
    materials: {
      type: string;
      target_id: string;
      target_name: string;
      sequence_count: number;
      price_per_sequence_cents: number;
      subtotal_cents: number;
    };
    total_cents: number;
  };
}

export interface ExperimentInfo {
  id: string;
  name: string;
  code: string;
  status: string;
  experiment_spec: ExperimentSpec;
  created_at: string;
  results_status?: string;
  experiment_url: string;
  costs?: {
    type: string;
    breakdown: {
      pricing_version: string;
      assay: Record<string, unknown>;
      total_cents: number;
    };
  };
}

export type BindingStrength =
  | "strong"
  | "medium"
  | "weak"
  | "non_binder"
  | "no_expression";

export interface AffinityResult {
  sequence_id: string;
  sequence_name: string;
  kd: number | null;
  kon: number | null;
  koff: number | null;
  binding_strength: BindingStrength;
  r_squared: number | null;
}

export interface ResultItem extends AffinityResult {
  id: string;
  target_id: string;
  target_name: string;
  experiment_id: string;
  experiment_code: string;
  kd_units: "M";
  n_replicates: number;
  is_control: boolean;
}

export interface ResultsResponse {
  items: ResultItem[];
  total: number;
  count: number;
  offset: number;
  data_package_url: string;
}

export interface UpdateItem {
  id: string;
  experiment_id: string;
  experiment_code: string;
  type: string;
  title: string;
  content: string;
  status: string;
  timestamp: string;
}
