import { NextRequest, NextResponse } from "next/server";
import { filterFallbackTargets } from "@/lib/fallback-targets";
import {
  fetchFoundryJson,
  foundryErrorResponse,
  isRecoverableFoundryError,
  targetsResponseSchema,
} from "@/lib/foundry-api";

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get("search") ?? "";

  try {
    const { data, status } = await fetchFoundryJson({
      path: "/targets",
      schema: targetsResponseSchema,
      searchParams: {
        search,
        selfservice_only: "true",
        limit: "6",
      },
    });

    return NextResponse.json(data, { status });
  } catch (error) {
    if (isRecoverableFoundryError(error)) {
      const filtered = filterFallbackTargets(search);
      return NextResponse.json({
        items: filtered,
        total: filtered.length,
        count: filtered.length,
        offset: 0,
        meta: {
          source: "fallback",
        },
      });
    }

    return foundryErrorResponse(error);
  }
}
