import { NextRequest } from "next/server";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

import { POST as postCostEstimate } from "@/app/api/cost-estimate/route";
import { GET as getTarget } from "@/app/api/targets/[id]/route";
import { GET as getTargets } from "@/app/api/targets/route";
import { FALLBACK_TARGETS } from "@/lib/fallback-targets";

const originalEnv = { ...process.env };

describe("API routes", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("returns fallback targets when Foundry config is unavailable", async () => {
    delete process.env.ADAPTYV_API_URL;
    delete process.env.ADAPTYV_API_TOKEN;

    const response = await getTargets(
      new NextRequest("http://localhost/api/targets?search=HER2")
    );
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.meta).toEqual({ source: "fallback" });
    expect(json.items).toHaveLength(1);
    expect(json.items[0].name).toContain("HER2");
  });

  it("proxies valid target search responses through the shared helper", async () => {
    process.env.ADAPTYV_API_URL = "https://example.com/v1";
    process.env.ADAPTYV_API_TOKEN = "demo-token";

    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          items: [FALLBACK_TARGETS[0]],
          total: 1,
          count: 1,
          offset: 0,
        }),
        {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        }
      )
    );

    vi.stubGlobal("fetch", fetchMock);

    const response = await getTargets(
      new NextRequest("http://localhost/api/targets?search=HER2")
    );
    const json = await response.json();
    const [requestedUrl, requestInit] = fetchMock.mock.calls[0] ?? [];

    expect(response.status).toBe(200);
    expect(json.items).toHaveLength(1);
    expect(String(requestedUrl)).toContain("/targets?");
    expect(String(requestedUrl)).toContain("search=HER2");
    expect(String(requestedUrl)).toContain("selfservice_only=true");
    expect(String(requestedUrl)).toContain("limit=6");
    expect(requestInit).toMatchObject({
      method: "GET",
      headers: {
        Authorization: "Bearer demo-token",
      },
    });
  });

  it("returns fallback target details when the catalog proxy is unavailable", async () => {
    delete process.env.ADAPTYV_API_URL;
    delete process.env.ADAPTYV_API_TOKEN;

    const response = await getTarget(
      new NextRequest(
        `http://localhost/api/targets/${FALLBACK_TARGETS[0].id}`
      ),
      {
        params: Promise.resolve({ id: FALLBACK_TARGETS[0].id }),
      }
    );
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.id).toBe(FALLBACK_TARGETS[0].id);
    expect(json.meta).toEqual({ source: "fallback" });
    expect(json.details.gene_names).toContain("ERBB2");
  });

  it("rejects invalid cost-estimate payloads before proxying", async () => {
    const response = await postCostEstimate(
      new NextRequest("http://localhost/api/cost-estimate", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          experiment_spec: {
            experiment_type: "screening",
            sequences: {},
          },
        }),
      })
    );
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error.code).toBe("invalid_request");
  });
});
