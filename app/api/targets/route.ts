import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.ADAPTYV_API_URL!;
const API_TOKEN = process.env.ADAPTYV_API_TOKEN!;

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get("search") ?? "";
  const url = `${API_URL}/targets?search=${encodeURIComponent(search)}&selfservice_only=true&limit=6`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
      signal: AbortSignal.timeout(8000),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { items: [], total: 0, count: 0, offset: 0, error: "API timeout" },
      { status: 504 }
    );
  }
}
