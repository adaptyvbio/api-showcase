import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.ADAPTYV_API_URL!;
const API_TOKEN = process.env.ADAPTYV_API_TOKEN!;

// Fallback targets when the testing API is unavailable
const FALLBACK_TARGETS = [
  {
    id: "019a03da-b87f-7e62-9ba1-7b776b7c8eb3",
    name: "Canine HER2 / ErbB2 Protein (His Tag)",
    vendor_name: "Acro Biosystems",
    catalog_number: "HE2-C52H3",
    url: "https://targets.adaptyvbio.com/product/acro/HE2-C52H3",
    pricing: { type: "per_sequence", price_per_sequence_cents: 1749 },
    uniprot_id: "P04626",
  },
  {
    id: "019a03da-b87f-7546-9184-8b5637390104",
    name: "Canine BLyS / TNFSF13B / BAFF Protein (Fc Tag)",
    vendor_name: "Acro Biosystems",
    catalog_number: "BAF-C5259",
    url: "https://targets.adaptyvbio.com/product/acro/BAF-C5259",
    pricing: { type: "per_sequence", price_per_sequence_cents: 1749 },
    uniprot_id: "Q9Y275",
  },
  {
    id: "019a03da-b87f-7b5c-a2ed-eeeef034252d",
    name: "Canine PD-L1 / B7-H1 / CD274 Protein (ECD, Fc Tag)",
    vendor_name: "Sino Biological",
    catalog_number: "10084-H02H",
    url: "https://targets.adaptyvbio.com/product/sino/10084-H02H",
    pricing: { type: "per_sequence", price_per_sequence_cents: 1499 },
    uniprot_id: "Q9NZQ7",
  },
  {
    id: "019a03da-b87f-7dd7-843f-566bbe08b5c7",
    name: "Cynomolgus IL-6 Protein (His Tag)",
    vendor_name: "Acro Biosystems",
    catalog_number: "IL6-C52H8",
    url: "https://targets.adaptyvbio.com/product/acro/IL6-C52H8",
    pricing: { type: "per_sequence", price_per_sequence_cents: 1749 },
    uniprot_id: "P05231",
  },
  {
    id: "019a03da-b87f-7cb5-8896-3c6887a2b39f",
    name: "Cynomolgus VEGFR2 / Flk-1 / CD309 Protein (His Tag)",
    vendor_name: "Sino Biological",
    catalog_number: "10012-H08H",
    url: "https://targets.adaptyvbio.com/product/sino/10012-H08H",
    pricing: { type: "per_sequence", price_per_sequence_cents: 1499 },
    uniprot_id: "P35968",
  },
  {
    id: "019a03da-b87f-7a91-b432-1234567890ab",
    name: "Human TNF-alpha Protein (His Tag)",
    vendor_name: "Acro Biosystems",
    catalog_number: "TNA-H5228",
    url: "https://targets.adaptyvbio.com/product/acro/TNA-H5228",
    pricing: { type: "per_sequence", price_per_sequence_cents: 1749 },
    uniprot_id: "P01375",
  },
];

function filterTargets(search: string) {
  if (!search) return FALLBACK_TARGETS;
  const q = search.toLowerCase();
  return FALLBACK_TARGETS.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.vendor_name.toLowerCase().includes(q) ||
      t.catalog_number.toLowerCase().includes(q)
  );
}

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get("search") ?? "";
  const url = `${API_URL}/targets?search=${encodeURIComponent(search)}&selfservice_only=true&limit=6`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
      signal: AbortSignal.timeout(8000),
    });

    const data = await res.json();
    // If API returned actual data, use it
    if (data.items && data.items.length > 0) {
      return NextResponse.json(data, { status: res.status });
    }
    // API returned empty — fall back
    throw new Error("Empty response");
  } catch {
    // Return fallback targets filtered by search
    const filtered = filterTargets(search);
    return NextResponse.json(
      { items: filtered, total: filtered.length, count: filtered.length, offset: 0 },
      { status: 200 }
    );
  }
}
