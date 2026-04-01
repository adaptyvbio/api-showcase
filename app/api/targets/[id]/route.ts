import { NextRequest, NextResponse } from "next/server";
import { getFallbackTargetDetail } from "@/lib/fallback-targets";
import {
  fetchFoundryJson,
  foundryErrorResponse,
  isRecoverableFoundryError,
  targetDetailSchema,
} from "@/lib/foundry-api";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const { data, status } = await fetchFoundryJson({
      path: `/targets/${encodeURIComponent(id)}`,
      schema: targetDetailSchema,
    });

    return NextResponse.json(data, { status });
  } catch (error) {
    if (isRecoverableFoundryError(error)) {
      const fallback = getFallbackTargetDetail(id);
      if (fallback) {
        return NextResponse.json({
          ...fallback,
          meta: {
            source: "fallback",
          },
        });
      }

      return NextResponse.json(
        {
          error: {
            code: "target_unavailable",
            message: "Target details are unavailable while the catalog fallback is active",
          },
        },
        { status: 503 }
      );
    }

    return foundryErrorResponse(error);
  }
}
