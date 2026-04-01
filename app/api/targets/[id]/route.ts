import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.ADAPTYV_API_URL!;
const API_TOKEN = process.env.ADAPTYV_API_TOKEN!;

// Fallback target details when the testing API is unavailable
const FALLBACK_DETAILS: Record<string, unknown> = {
  "019a03da-b87f-7e62-9ba1-7b776b7c8eb3": {
    id: "019a03da-b87f-7e62-9ba1-7b776b7c8eb3",
    name: "Canine HER2 / ErbB2 Protein (His Tag)",
    vendor_name: "Acro Biosystems",
    catalog_number: "HE2-C52H3",
    url: "https://targets.adaptyvbio.com/product/acro/HE2-C52H3",
    pricing: { type: "per_sequence", price_per_sequence_cents: 1749 },
    uniprot_id: "P04626",
    details: {
      gene_names: ["ERBB2", "HER2", "NEU"],
      organism: "Canis lupus familiaris",
      expression_system: "HEK293",
      sequence: "TQVCTGTDMKLRLPASPETHLDMLRHLYQGCQVVQGNL...",
      sequence_length: 630,
      family: "ErbB receptor tyrosine kinase",
      subcellular_locations: ["Cell membrane"],
      tags: ["His Tag", "Recombinant"],
      molecular_weight: "70.2 kDa",
      description: "Recombinant Canine HER2/ErbB2 protein with C-terminal His tag, expressed in HEK293 cells. Suitable for BLI and SPR binding assays.",
    },
  },
};

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
    if (data && data.id) {
      return NextResponse.json(data, { status: res.status });
    }
    throw new Error("Empty response");
  } catch {
    // Return fallback if available
    const fallback = FALLBACK_DETAILS[id];
    if (fallback) {
      return NextResponse.json(fallback, { status: 200 });
    }
    return NextResponse.json(
      { error: "Target not found" },
      { status: 404 }
    );
  }
}
