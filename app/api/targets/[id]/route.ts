import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.ADAPTYV_API_URL!;
const API_TOKEN = process.env.ADAPTYV_API_TOKEN!;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const url = `${API_URL}/targets/${id}`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
      signal: AbortSignal.timeout(8000),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "API timeout" },
      { status: 504 }
    );
  }
}
