import { NextRequest, NextResponse } from "next/server";
import {
  costEstimateRequestSchema,
  costEstimateResponseSchema,
  fetchFoundryJson,
  foundryErrorResponse,
  parseRequestJson,
} from "@/lib/foundry-api";

export async function POST(request: NextRequest) {
  try {
    const body = await parseRequestJson(request, costEstimateRequestSchema);
    const { data, status } = await fetchFoundryJson({
      path: "/experiments/cost-estimate",
      method: "POST",
      body,
      schema: costEstimateResponseSchema,
    });

    return NextResponse.json(data, { status });
  } catch (error) {
    return foundryErrorResponse(error);
  }
}
