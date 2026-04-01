export function GET() {
  const content = `# Adaptyv Bio

> Adaptyv Bio provides automated protein engineering services via API. Submit antibody or protein sequences, run binding assays (BLI, SPR), expression, thermostability, and affinity maturation experiments, and retrieve results programmatically.

## API Reference

- [API Introduction](https://docs.adaptyvbio.com/api-reference/api-introduction)
- [Authentication](https://docs.adaptyvbio.com/api-reference/authentication)
- [Create Experiment](https://docs.adaptyvbio.com/api-reference/experiments/create-experiment)
- [List Experiments](https://docs.adaptyvbio.com/api-reference/experiments/list-experiments)
- [Get Experiment Results](https://docs.adaptyvbio.com/api-reference/experiments/get-experiment-results)

## Documentation

- [Full Docs](https://docs.adaptyvbio.com)
- [Getting Started](https://docs.adaptyvbio.com/getting-started)
- [Experiment Types](https://docs.adaptyvbio.com/experiment-types)

## Target Catalog

- [Browse Targets](https://targets.adaptyvbio.com)
- [Target Catalog API](https://docs.adaptyvbio.com/api-reference/targets)

## Links

- [Website](https://adaptyvbio.com)
- [API Showcase (this site)](https://agents.adaptyvbio.com)
- [Extended LLM context](/llms-full.txt)
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
