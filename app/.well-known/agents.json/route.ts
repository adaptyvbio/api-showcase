export function GET() {
  const payload = {
    schema_version: "1.0",
    name: "Adaptyv Bio",
    description:
      "Automated protein engineering services via API. Submit sequences, run binding assays (BLI, SPR), expression, thermostability, and affinity experiments, and retrieve quantitative results programmatically.",
    url: "https://agents.adaptyvbio.com",
    documentation_url: "https://docs.adaptyvbio.com",
    api_reference_url:
      "https://docs.adaptyvbio.com/api-reference/api-introduction",
    llms_txt: "https://agents.adaptyvbio.com/llms.txt",
    llms_full_txt: "https://agents.adaptyvbio.com/llms-full.txt",
    capabilities: [
      "protein-expression-testing",
      "binding-screening-bli-spr",
      "affinity-characterization",
      "thermostability-measurement",
      "target-catalog-search",
    ],
    contact: {
      url: "https://start.adaptyvbio.com",
      website: "https://adaptyvbio.com",
    },
  };

  return Response.json(payload, {
    headers: {
      "Cache-Control": "public, max-age=86400",
    },
  });
}
