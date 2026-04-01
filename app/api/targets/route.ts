import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.ADAPTYV_API_URL!;
const API_TOKEN = process.env.ADAPTYV_API_TOKEN!;

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get("search") ?? "";
  const url = `${API_URL}/targets?search=${encodeURIComponent(search)}&selfservice_only=true&limit=6`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${API_TOKEN}` },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
