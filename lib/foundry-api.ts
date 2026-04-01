import { NextResponse } from "next/server";
import { z } from "zod";

const DEFAULT_TIMEOUT_MS = 8000;

const foundryEnvSchema = z.object({
  ADAPTYV_API_URL: z.string().url(),
  ADAPTYV_API_TOKEN: z.string().min(1),
});

export const targetSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  vendor_name: z.string().min(1),
  catalog_number: z.string().min(1),
  url: z.string().min(1),
  pricing: z.object({
    type: z.string().min(1),
    price_per_sequence_cents: z.number().int().nonnegative(),
  }),
  uniprot_id: z.string().min(1),
});

export const targetDetailSchema = targetSchema.extend({
  details: z.object({
    gene_names: z.array(z.string()),
    organism: z.string().min(1),
    expression_system: z.string().min(1),
    sequence: z.string().min(1),
    sequence_length: z.number().int().nonnegative(),
    family: z.string().min(1),
    subcellular_locations: z.array(z.string()),
    tags: z.array(z.string()),
    molecular_weight: z.string().min(1),
    description: z.string().min(1),
  }),
});

export const targetsResponseSchema = z.object({
  items: z.array(targetSchema),
  total: z.number().int().nonnegative(),
  count: z.number().int().nonnegative(),
  offset: z.number().int().nonnegative(),
});

const experimentSpecSchema = z.object({
  experiment_type: z.string().min(1),
  method: z.string().min(1).optional(),
  target_id: z.string().min(1).nullable().optional(),
  sequences: z
    .record(z.string(), z.string().min(1))
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one sequence is required",
    }),
  n_replicates: z.number().int().positive().optional(),
  antigen_concentrations: z.array(z.number()).optional(),
  parameters: z.record(z.string(), z.unknown()).optional(),
});

export const costEstimateRequestSchema = z.object({
  experiment_spec: experimentSpecSchema,
});

export const costEstimateResponseSchema = z.object({
  breakdown: z.object({
    pricing_version: z.string().min(1),
    assay: z.object({
      experiment_type: z.string().min(1),
      sequence_count: z.number().int().nonnegative(),
      n_replicates: z.number().int().positive(),
      unit_price_cents: z.number().int().nonnegative(),
      replicate_price_cents: z.number().int().nonnegative(),
      subtotal_cents: z.number().int().nonnegative(),
    }),
    materials: z.object({
      type: z.string().min(1),
      target_id: z.string().min(1),
      target_name: z.string().min(1),
      sequence_count: z.number().int().nonnegative(),
      price_per_sequence_cents: z.number().int().nonnegative(),
      subtotal_cents: z.number().int().nonnegative(),
    }),
    total_cents: z.number().int().nonnegative(),
  }),
});

type FoundryProxyErrorCode =
  | "invalid_env"
  | "invalid_request"
  | "timeout"
  | "network"
  | "upstream_error"
  | "invalid_response";

interface FoundryProxyErrorOptions {
  code: FoundryProxyErrorCode;
  status: number;
  message: string;
  details?: unknown;
  upstreamStatus?: number;
}

export class FoundryProxyError extends Error {
  readonly code: FoundryProxyErrorCode;
  readonly status: number;
  readonly details?: unknown;
  readonly upstreamStatus?: number;

  constructor({ code, status, message, details, upstreamStatus }: FoundryProxyErrorOptions) {
    super(message);
    this.name = "FoundryProxyError";
    this.code = code;
    this.status = status;
    this.details = details;
    this.upstreamStatus = upstreamStatus;
  }
}

function getFoundryConfig() {
  const parsed = foundryEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    throw new FoundryProxyError({
      code: "invalid_env",
      status: 503,
      message: "Foundry API configuration is missing or invalid",
      details: parsed.error.issues.map(({ message, path }) => ({
        message,
        path: path.join("."),
      })),
    });
  }

  return parsed.data;
}

function buildFoundryUrl(
  path: string,
  searchParams?: Record<string, string | undefined>
) {
  const { ADAPTYV_API_URL } = getFoundryConfig();
  const baseUrl = ADAPTYV_API_URL.endsWith("/")
    ? ADAPTYV_API_URL
    : `${ADAPTYV_API_URL}/`;
  const relativePath = path.startsWith("/") ? path.slice(1) : path;
  const url = new URL(relativePath, baseUrl);

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined) {
        url.searchParams.set(key, value);
      }
    }
  }

  return url;
}

function isAbortError(error: unknown) {
  return (
    error instanceof Error &&
    (error.name === "AbortError" || error.name === "TimeoutError")
  );
}

function summarizeTextBody(text: string) {
  const trimmed = text.trim();
  if (trimmed.length <= 200) {
    return trimmed;
  }

  return `${trimmed.slice(0, 197)}...`;
}

function mapUpstreamStatus(status: number) {
  if (status === 400 || status === 404) {
    return status;
  }

  if (status === 408 || status === 504) {
    return 504;
  }

  return 502;
}

function serializeZodIssues(issues: z.ZodIssue[]) {
  return issues.map(({ code, message, path }) => ({
    code,
    message,
    path: path.join("."),
  }));
}

interface FetchFoundryJsonOptions<TSchema extends z.ZodType> {
  path: string;
  schema: TSchema;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  searchParams?: Record<string, string | undefined>;
  timeoutMs?: number;
}

export async function parseRequestJson<TSchema extends z.ZodType>(
  request: Request,
  schema: TSchema
): Promise<z.infer<TSchema>> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    throw new FoundryProxyError({
      code: "invalid_request",
      status: 400,
      message: "Request body must be valid JSON",
    });
  }

  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    throw new FoundryProxyError({
      code: "invalid_request",
      status: 400,
      message: "Request body failed validation",
      details: serializeZodIssues(parsed.error.issues),
    });
  }

  return parsed.data;
}

export async function fetchFoundryJson<TSchema extends z.ZodType>({
  path,
  schema,
  method = "GET",
  body,
  searchParams,
  timeoutMs = DEFAULT_TIMEOUT_MS,
}: FetchFoundryJsonOptions<TSchema>): Promise<{
  data: z.infer<TSchema>;
  status: number;
}> {
  const { ADAPTYV_API_TOKEN } = getFoundryConfig();
  const url = buildFoundryUrl(path, searchParams);

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${ADAPTYV_API_TOKEN}`,
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    if (isAbortError(error)) {
      throw new FoundryProxyError({
        code: "timeout",
        status: 504,
        message: "Foundry API request timed out",
      });
    }

    throw new FoundryProxyError({
      code: "network",
      status: 502,
      message: "Unable to reach the Foundry API",
      details: error instanceof Error ? error.message : undefined,
    });
  }

  const contentType = response.headers.get("content-type") ?? "";
  const rawBody = await response.text();

  if (!contentType.toLowerCase().includes("application/json")) {
    throw new FoundryProxyError({
      code: response.ok ? "invalid_response" : "upstream_error",
      status: response.ok ? 502 : mapUpstreamStatus(response.status),
      message: response.ok
        ? "Foundry API returned a non-JSON response"
        : `Foundry API request failed with status ${response.status}`,
      details: {
        content_type: contentType || "unknown",
        body: summarizeTextBody(rawBody),
      },
      upstreamStatus: response.status,
    });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    throw new FoundryProxyError({
      code: "invalid_response",
      status: 502,
      message: "Foundry API returned invalid JSON",
      details: {
        body: summarizeTextBody(rawBody),
      },
      upstreamStatus: response.status,
    });
  }

  if (!response.ok) {
    throw new FoundryProxyError({
      code: "upstream_error",
      status: mapUpstreamStatus(response.status),
      message: `Foundry API request failed with status ${response.status}`,
      upstreamStatus: response.status,
    });
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    throw new FoundryProxyError({
      code: "invalid_response",
      status: 502,
      message: "Foundry API response failed validation",
      details: serializeZodIssues(parsed.error.issues),
      upstreamStatus: response.status,
    });
  }

  return {
    data: parsed.data,
    status: response.status,
  };
}

export function isRecoverableFoundryError(error: unknown) {
  return (
    error instanceof FoundryProxyError &&
    (error.code === "invalid_env" ||
      error.code === "timeout" ||
      error.code === "network" ||
      error.code === "upstream_error" ||
      error.code === "invalid_response")
  );
}

export function foundryErrorResponse(error: unknown) {
  if (error instanceof FoundryProxyError) {
    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
          ...(error.upstreamStatus
            ? { upstream_status: error.upstreamStatus }
            : {}),
          ...(error.details !== undefined ? { details: error.details } : {}),
        },
      },
      { status: error.status }
    );
  }

  return NextResponse.json(
    {
      error: {
        code: "internal_error",
        message: "Unexpected proxy error",
      },
    },
    { status: 500 }
  );
}
